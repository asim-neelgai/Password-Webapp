'use client'
import { useState } from 'react'
import Icon from './Icon'
const Faq = (): React.ReactNode => {
  const [showAnswers, setShowAnswers] = useState({
    question1: false,
    question2: false,
    question3: false,
    question4: false
  })

  const toggleAnswer = (question: string): void => {
    setShowAnswers((prevState: any) => ({
      ...prevState,
      [question]: !prevState[question]
    }))
  }
  return (
    <div className='sm:text-center sm:mt-28 mt-16 text-primary mb-16 sm:mb-32'>
      <p className='text-2 text-center font-bold sm:text-4xl'>Frequently asked questions</p>
      <div className=' sm:mx-52 mx-4 mt-10 text-start space-y-6 p-4 '>
        <div className='flex justify-between'>
          <p className='text-blacks text-lg font-semibold'>How does a password manager work?</p>
          <button
            className='text-primary focus:outline-none'
            onClick={() => toggleAnswer('question1')}
          >
            {showAnswers.question1 ? <Icon name='fi-rr-minus' /> : <Icon name='fi-rr-plus' />}
          </button>
        </div>
        {showAnswers.question1 && (
          <p className='text-blacks text-base font-normal'>
            The password manager securely stores your passwords and login information in an encrypted format. It helps you generate strong passwords, autofill login forms, and sync your passwords across devices.
          </p>
        )}
        <div className='flex justify-between'>
          <p className='text-blacks font-semibold'>Is FortLock secure?</p>
          <button
            className='text-primary focus:outline-none'
            onClick={() => toggleAnswer('question2')}
          >
            {showAnswers.question2 ? <Icon name='fi-rr-minus' /> : <Icon name='fi-rr-plus' />}
          </button>
        </div>
        {showAnswers.question2 && (
          <p className='text-blacks'>
            Yes, FortLock employs robust encryption protocols to ensure the security of your data. We prioritize the protection of sensitive information.
          </p>
        )}
        <div className='flex justify-between'>
          <p className='text-blacks font-semibold'>Does FortLock store passwords in the cloud?</p>
          <button
            className='text-primary focus:outline-none'
            onClick={() => toggleAnswer('question3')}
          >
            {showAnswers.question3 ? <Icon name='fi-rr-minus' /> : <Icon name='fi-rr-plus' />}
          </button>
        </div>
        {showAnswers.question3 && (
          <p className='text-blacks'>
            Yes, FortLock employs robust encryption protocols to ensure the security of your data. We prioritize the protection of sensitive information.
          </p>
        )}
        <div className='flex justify-between'>
          <p className='text-blacks font-semibold'>Is FortLock available outside of the US?</p>
          <button
            className='text-primary focus:outline-none'
            onClick={() => toggleAnswer('question4')}
          >
            {showAnswers.question4 ? <Icon name='fi-rr-minus' /> : <Icon name='fi-rr-plus' />}
          </button>
        </div>
        {showAnswers.question4 && (
          <p className='text-blacks'>
            Yes, FortLock employs robust encryption protocols to ensure the security of your data. We prioritize the protection of sensitive information.
          </p>
        )}
      </div>
    </div>

  )
}

export default Faq
