import React from 'react'
import Navigation from '../navigation'
import Footer from '../footer'

const TermsAndCondition = (): React.ReactNode => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-2 text-white'>
      <div className='mx-24'>
        <Navigation />
      </div>

      <div className='mt-16 text-start sm:text-center w-full'>
        <p className='text-blacks font-semibold text-3xl mx-5 sm:mx-0'>Terms & Conditions</p>
        <div className='mx-5 sm:mx-24 mt-16 flex flex-col text-start mb-10 sm:mb-0'>
          <p className='text-blacks text-xl font-bold mb-6'>Definition</p>
          <p className='text-blacks w-full text-base font-normal'>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
          <p className='text-blacks text-xl font-bold mb-6 mt-10'>Access to Services</p>
          <p className='text-blacks w-full text-base font-normal'>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
        </div>
      </div>

      <div className='flex flex-grow items-end'>
        <div className='w-full'>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default TermsAndCondition
