import React from 'react'

const FormContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return (
    <section className='flex-grow bg-gray-2'>
      <div className='container mx-auto px-4 sm:px-6 py-12 h-full flex justify-center items-center'>
        <div className=' bg-white px-4 sm:px-16 py-16 rounded-lg mt-6'>
          {children}
        </div>
      </div>
    </section>
  )
}

export default FormContainer
