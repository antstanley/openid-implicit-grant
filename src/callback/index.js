function parseJWT (token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}

function parseResponse (hashArray) {
  const response = {}
  for (let i = 0; i < hashArray.length; i++) {
    const item = hashArray[i]
    const itemArray = item.split('=')
    const key = itemArray[0]
    response[key] = itemArray[1]
  }
  return response
}

const callback = (hashString, { state, nonce }) => {
  let hashResponse = false
  const hashArray = hashString.split('&')
  const authResponse = parseResponse(hashArray)

  if (state === authResponse.state) {
    const decodedIdToken = parseJWT(authResponse.id_token)

    if (nonce === decodedIdToken.nonce) {
      const idToken = authResponse.id_token
        ? {
            token: authResponse.id_token,
            claims: decodedIdToken
          }
        : false

      const accessToken = authResponse.access_token
        ? {
            token: authResponse.access_token,
            claims: parseJWT(authResponse.access_token)
          }
        : false
      hashResponse = { idToken, accessToken }
    }
  }
  return hashResponse
}

export default callback
