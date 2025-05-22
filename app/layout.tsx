import type { Metadata } from 'next'
import './global.css'
import { Inter } from 'next/font/google'

import AuthProvider from './auth/Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fort Lock'
}

const Layout = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          <div className='flex flex-col h-screen'>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

export default Layout
