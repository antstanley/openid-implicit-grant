function randomString (length) {
  const bytes = new Uint8Array(length)
  const random = window.crypto.getRandomValues(bytes)
  const charset =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~'
  let result = []
  random.forEach(function (c) {
    result.push(charset[c % charset.length])
  })
  return result.join('')
}

const login = ({
  domain,
  client_id,
  redirect_uri,
  scope,
  connection,
  state,
  nonce
}) => {
  const response_type = 'id_token%20token'
  state = state || randomString(64)
  nonce = nonce || randomString(32)
  let resultURL = `https://${domain}/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`

  resultURL += connection ? `&connection=${connection}` : ''
  resultURL += `&nonce=${nonce}&state=${state}`

  return {
    url: resultURL,
    validation: {
      state,
      nonce
    }
  }
}

export default login
