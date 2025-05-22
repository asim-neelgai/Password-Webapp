import Credentials from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'

import cognitoHelpers from '@/lib/cognitoHelpers'

const handler = NextAuth({
  theme: {
    colorScheme: 'light'
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        masterPassword: { label: 'Master Password', type: 'password' },
        mfacode: { label: 'MFA Code', type: 'text' }
      },
      async authorize (credentials, req) {
        if (credentials?.email == null || credentials?.masterPassword == null) {
          return null
        }

        const loginResponse = await cognitoHelpers.initiateLogin(
          credentials.email,
          credentials.masterPassword,
          credentials.mfacode
        )
        if (!loginResponse.success) {
          return null
        }

        const userInfoResponse = await cognitoHelpers.userDetails(loginResponse.accessToken)
        const userEmail = userInfoResponse.UserAttributes?.find(attr => attr.Name === 'email')?.Value
        const userName = userInfoResponse.UserAttributes?.find(attr => attr.Name === 'name')?.Value

        return {
          id: '',
          accessToken: loginResponse.accessToken,
          refreshToken: loginResponse.refreshToken,
          cognitoSession: loginResponse.cognitoSession,
          userEmail,
          userName
        }
      }
    })
  ],
  callbacks: {
    async jwt ({ token, user, account }) {
      if (account != null && user != null) {
        return {
          ...token,
          // @ts-expect-error
          accessToken: user?.accessToken,
          // @ts-expect-error
          refreshToken: user?.refreshToken,
          // @ts-expect-error
          cognitoSession: user?.cognitoSession ?? 'jwt default',
          // @ts-expect-error
          cognitoUser: user?.userName,
          // @ts-expect-error
          cognitoEmail: user?.userEmail
        }
      }

      return token
    },
    session ({ session, token }) {
      if (token != null) {
        if (token.accessToken != null || token.refreshToken != null) {
          session.user.accessToken = token.accessToken
          session.user.refreshToken = token.refreshToken
          session.user.cognitoUser = token.cognitoUser
          session.user.cognitoEmail = token.cognitoEmail
        } else {
          session.user = token
        }
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }
