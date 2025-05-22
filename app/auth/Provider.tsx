'use client'
import { SessionProvider } from 'next-auth/react'

interface AuthProviderProps {
  children: React.ReactNode
}
const AuthProvider = ({ children }: AuthProviderProps): React.ReactNode => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default AuthProvider
