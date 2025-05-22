import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

interface SessionAndJwtUserType {
  /** Cognito user's access token */
  accessToken: string
  /** Cognito user's refresh token */
  refreshToken: string
  cognitoSession: string
  cognitoUser: string
  cognitoEmail: string
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: SessionAndJwtUserType
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  type JWT = SessionAndJwtUserType
}
