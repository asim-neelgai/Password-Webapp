import Drawer from '@/components/Drawer'
import Link from 'next/link'
import React, { useState } from 'react'
import Mfa from './Mfa'

const Settings = (): React.ReactNode => {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState('')

  const handleDrawerCloseClicked = (): void => {
    setDrawerOpen(false)
  }

  const handleAddItemClicked = (): void => {
    setDrawerTitle('Two-factor authentication (2FA)')
    setDrawerOpen(true)
  }

  return (
    <div className='mx-5'>
      <ul className='space-y-2'>
        <li className='cursor-pointer p-2 rounded flex items-center'>
          <Link
            href='#'
          >
            My Profile
          </Link>
        </li>
        <li className='cursor-pointer p-2 rounded flex items-center'>
          <Link
            href='#' onClick={() => {
              handleAddItemClicked()
            }}
          >Two Factor Authentication
          </Link>
        </li>
        <li className='cursor-pointer p-2 rounded flex items-center'>
          <Link href='#'>Terms Of Service</Link>
        </li>
        <li className='cursor-pointer p-2 rounded flex items-center'>
          <Link href='#'>Privacy Policy</Link>
        </li>
      </ul>
      <Drawer
        drawerOpen={isDrawerOpen}
        title={drawerTitle}
        showBackArrow
        width='w-full'
        handleClose={handleDrawerCloseClicked}
      >
        <Mfa />
      </Drawer>
    </div>
  )
}

export default Settings
