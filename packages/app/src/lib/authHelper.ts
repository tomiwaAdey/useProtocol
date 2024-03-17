// srd/lib/authHelpers.ts
import jwt, { JwtPayload, Secret, JwtHeader, VerifyErrors, VerifyOptions } from 'jsonwebtoken'

export const validateJWT = async (token: string): Promise<JwtPayload | null> => {
  try {
    const decodedToken = await new Promise<JwtPayload | null>((resolve, reject) => {
      const options: VerifyOptions = { algorithms: ['RS256'] }
      jwt.verify(token, getKey, options, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
        console.log('decoded the jwt')
        if (err) {
          reject(err)
        } else {
          // Ensure that the decoded token is of type JwtPayload
          if (decoded && typeof decoded === 'object' && !Array.isArray(decoded)) {
            resolve(decoded as JwtPayload)
          } else {
            reject(new Error('Invalid token'))
          }
        }
      })
    })
    return decodedToken
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}
export const getKey = (header: JwtHeader, callback: (err: Error | null, key?: Secret) => void): void => {
  console.log('calling getKey')

  // Define the options for the fetch request
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_DYNAMIC_BEARER_TOKEN}`,
    },
  }

  // Assume the URL and method to fetch the public key remains the same
  fetch(
    `https://app.dynamicauth.com/api/v0/environments/${process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID}/keys`,
    options
  )
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Failed to fetch public key')
    })
    .then((json) => {
      const publicKey = json.key.publicKey
      // Assuming publicKey is in the correct format required (e.g., PEM format for RSA keys)
      const pemPublicKey = Buffer.from(publicKey, 'base64').toString('ascii')
      callback(null, pemPublicKey) // Pass the public key to the callback
    })
    .catch((err) => {
      console.error('Error fetching public key:', err)
      callback(err) // Pass the error to the callback
    })
}
