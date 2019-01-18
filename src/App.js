import React from 'react'
import { compose, withState, withHandlers, lifecycle } from 'recompose'
import { validateStorage, eztzWatch, unicodeToChar } from './lib'

const defaultState = {
  email: '',
  phone: '',
  storage: [],
  certificate: null
}

export default compose(
  withState('data', 'setData', defaultState),
  withHandlers({
    validate: props => event => {
      const { data, setData } = props
      const { email, phone, storage } = data

      // find if this certificate exists in the storage
      const certificate = validateStorage(email, phone, storage);
      if(certificate) setData({ ...data, certificate });
  }}),
  lifecycle({
    componentDidMount() {
      const { data, setData } = this.props;
      Promise.resolve()
        .then(eztzWatch)
        .then(storage => setData({ ...data, storage }))
    }
  })
)(function TezosCertificate(props) {
  const { data, setData, validate } = props;


  return (
    <div className="app">
      <label>
        Email
        <input
          type="text"
          value={data.email}
          placeholder="email"
          onChange={ev => setData({ ...data, email: ev.target.value.trim() })}
        />
      </label>
      <label>
        Phone Number (last 4-digit)
        <input
          type="text"
          value={data.phone}
          placeholder="phone"
          onChange={ev => setData({ ...data, phone: ev.target.value.trim() })}
        />
      </label>
      <button onClick={validate}>
        Validate
      </button>

      {data.certificate &&
        <div className="your-ceritificate">
          <h4>Name: {data.certificate.name}</h4>
          <h4>Certificate Number: 201900{data.certificate.certNum}</h4>
        </div>
      }
    </div>
  )
})
