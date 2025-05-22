'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import Icon from '@/components/Icon'

interface NavigationProps {
  handleScroll?: (sectionId: string) => void
  fromLogin?: boolean
  fromRegister?: boolean
}
const Navigation = ({ handleScroll, fromLogin = false, fromRegister = false }: NavigationProps): React.ReactNode => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const navigationRef = useRef<HTMLDivElement | null>(null)

  const handleClick = (): void => {
    setOpenDrawer((!openDrawer))
  }
  const handleClose = (): void => {
    setOpenDrawer(false)
  }

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollThreshold = 20
      if (window.scrollY > scrollThreshold) {
        setIsFixed(true)
      } else {
        setIsFixed(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): any => {
      if ((navigationRef.current != null) && !navigationRef.current.contains(event.target as Node)) {
        setOpenDrawer(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='w-full pt-6 min-h-[72px]' ref={navigationRef}>
      <nav className={`bg-base-100 p-4 rounded-xl hidden border-[1px] border-bordergray sm:block ${isFixed ? 'fixed top-0 left-0 w-full transition-all ease-in-out delay-150' : ''}`}>
        <div className='container mx-auto flex justify-between items-center'>
          <Link href='/' className='text-blacks font-bold'>
            <Icon name='logo' />
          </Link>
          <div />
          <ul className='sm:flex sm:justify-between sm:space-x-2 lg:space-x-10 text-blacks '>
            <li><Link href='/' className='hover:text-blue-700 font-medium text-sm'>Home</Link></li>
            {(!fromLogin && !fromRegister)
              ? (
                <>
                  <li><button onClick={() => handleScroll?.('section1')} className='hover:text-blue-700 font-medium text-sm'>Why FortLock?</button></li>
                  <li><button onClick={() => handleScroll?.('section2')} className='hover:text-blue-700 font-medium text-sm'>FAQ</button></li>

                </>

                )
              : (
                <>
                  <li><Link href='/' className='text-sm font-medium'>Why FortLock?</Link></li>
                  <li><Link href='/' className='text-sm font-medium'>FAQ’s</Link></li>

                </>
                )}
          </ul>

          <ul className='flex justify-between md:space-x-2 sm:gap-2 md:gap-4 text-blacks h-10'>
            {
                !fromLogin
                  ? (
                    <Link className='bg-white px-2 py-1 rounded-lg w-24 h-10 hover:text-blue-700 text-blacks text-sm font-medium flex flex-row justify-center items-center border-[1px] border-gray-1' href='/login'>Log In
                    </Link>
                    )
                  : (
                    <div className=' w-24 h-10' />
                    )
              }
            {
                !fromRegister
                  ? (
                    <Link className='bg-primary px-2 py-1 rounded-lg w-24 h-10 hover:text-gray-300 text-white text-sm font-medium flex flex-row justify-center items-center' href='/register'>Sign Up
                    </Link>
                    )
                  : (
                    <div className=' w-24 h-10' />
                    )
              }

          </ul>
        </div>
      </nav>
      <nav className='sm:hidden block '>
        <Link href='/' className=' absolute left-8 top-8'>
          <Icon name='logo' />

        </Link>
        <div className='absolute right-5 top-8'>
          <button className='' onClick={handleClick}>

            <Icon name='fi-rr-menu-burger1' />
          </button>

        </div>
      </nav>
      {openDrawer && (
        <div className='drawer drawer-end fixed inset-y-0 right-0 z-50 w-2/3'>
          <div className='bg-white p-8 rounded-lg '>
            <button className='absolute top-8 right-4' onClick={handleClose}>
              <Icon name='close' />
            </button>
            <ul className='flex flex-col space-y-6 mt-2 text-black'>
              <li><Link href='/' className='text-sm font-medium'>Home</Link></li>
              <li><button onClick={() => { handleScroll?.('section1'); setOpenDrawer(false) }} className='hover:text-blue-700 font-medium text-sm'>Why FortLock?</button></li>
              <li><button onClick={() => { handleScroll?.('section2'); setOpenDrawer(false) }} className='hover:text-blue-700 font-medium text-sm'>FAQ</button></li>
            </ul>
            <ul className='flex flex-col mt-10 text-blacks gap-7'>
              {
                !fromLogin && (
                  <Link className='bg-white px-2 py-1 rounded-lg w-24 h-10 hover:text-blue-700 text-blacks text-sm font-medium flex flex-row justify-center items-center border-[1px] border-gray-1' href='/login'>Log In
                  </Link>
                )
              }
              {
                !fromRegister && (
                  <Link className='bg-primary px-2 py-1 rounded-lg w-24 h-10 hover:text-gray-300 text-white text-sm font-medium flex flex-row justify-center items-center' href='/register'>Sign Up
                  </Link>
                )
              }
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navigation
