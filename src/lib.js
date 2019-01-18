import crypto from 'crypto'
import 'eztz.js/dist/eztz.min.js'

// some constants
const CONTRACT_ADDRESS = 'KT1KrvJxNkudoCp5f8d5tzNFLcTbppfMs84p'
const HASH_SCRETE = 'TEZOS_BLOCKCHAIN_CAMP_1ST'

// configure eztz
const eztz = window.eztz
eztz.node.setProvider("http://13.125.254.165:8732/")

export function eztzWatch() {
  console.log('Fetching contract stroage from ', CONTRACT_ADDRESS)
  return Promise.resolve()
    .then(() =>new Promise(resolve => eztz.contract.watch(CONTRACT_ADDRESS, 2, resolve)))
    .then(storage => storage.map(({ args }) => ({
      hash: args[0].string,
      name: unicodeToChar(args[1].args[0].string),
      certNum: args[1].args[1].string,
    })));
}

export function validateStorage(email, phone, storage) {
  const hash = crypto
    .createHmac('sha256', HASH_SCRETE)
    .update(`${email}${phone}`)
    .digest('hex')

  console.log({ email, phone, hash });
  return storage.find(cert => cert.hash === hash);
}

export function unicodeToChar(text) {
   return text.replace(/\\u[\dA-F]{4}/gi,
          function (match) {
               return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
          });
}
