import React from 'react'
import { ConfirmForm } from './ConfirmForm'
import Navigation from '../navigation'

const Confirm = (): React.ReactNode => {
  return (
    <>
      <Navigation />
      <section className='min-h-screen pt-20 bg-gray-2'>
        <div className='container mx-auto px-6 py-12 h-full flex justify-center items-center'>
          <div className='w-625 px-20 py-20 bg-white rounded-lg'>
            <ConfirmForm />
          </div>
        </div>
      </section>
    </>
  )
}

export default Confirm
