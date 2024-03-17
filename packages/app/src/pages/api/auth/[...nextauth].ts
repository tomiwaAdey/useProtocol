import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from '@auth/core/providers/credentials'
import CredentialsProvider from 'next-auth/providers/credentials'
import { validateJWT } from '../../../lib/authHelper'
import { NextApiRequest } from 'next'

type User = {
  id: string
  name: string
  email: string
  // Add other fields as needed
}

export const config: NextAuthOptions = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials, req) {
        const token = credentials?.token as string // Safely cast to string; ensure to handle undefined case
        if (typeof token !== 'string' || !token) {
          throw new Error('Token is required')
        }
        const jwtPayload = await validateJWT(token)

        if (jwtPayload) {
          // Transform the JWT payload into your user object
          const user: User = {
            id: jwtPayload.sub || '', // Assuming 'sub' is the user ID
            name: jwtPayload.name || '', // Replace with actual field from JWT payload
            email: jwtPayload.email || '', // Replace with actual field from JWT payload
            // Map other fields as needed
          }
          return user
        } else {
          return null
        }
      },
    }),
  ],
}

export default NextAuth(config)
