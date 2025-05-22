import React from 'react'

const Footer = (): React.ReactNode => {
  return (
    <footer className='bg-primary w-full'>
      <div className='sm:flex sm:flex-row text-white sm:justify-between sm:items-center flex flex-col-reverse justify-center items-center gap-6 sm:px-6 py-2'>
        <ul className='flex'>
          <li className='sm:pl-20 pl-10 text-sm font-normal'>&copy; 2024 FortLock Inc. All rights reserved.</li>
        </ul>
        <ul className='flex sm:space-x-6   pl-8 flex-row justify-between mr-16'>
          <li className='whitespace-no-wrap text-sm font-normal mr-6 sm:mr-0'><a href='/terms-and-condition'>Terms & Conditions</a></li>
          <li className='whitespace-no-wrap text-sm font-normal'><a href='/privacy-policy'>Privacy Policy</a></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
