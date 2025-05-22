
'use client'
import Button from '@/components/Button'
import Form from '@/components/Form'
import InputField from '@/components/InputField'
import Link from 'next/link'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { fetchData } from '../services/fetchData'

interface FormValues {
  email: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required()
})

const initialValues: FormValues = {
  email: ''
}

const ForgotPasswordForm = (): React.ReactNode => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (values: { [key: string]: any }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }): Promise<void> => {
    setSubmitting(true)
    try {
      const url = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL as string
      const response = await fetchData(`${url}/cognito/forgotpassword/`, 'POST', values.email)
      if (response != null) {
        setMessage('Please check your email for password reset instructions')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {message !== '' && (
        <div className='mb-3'>
          <p>{message}</p>
          <Link href='/login' className='link link-primary'>Go back to login</Link>
        </div>)}
      <h1 className='mb-1'>Forgot Password</h1>
      <p className='mb-6'>Enter your registered email to receive password hint</p>
      {error !== '' && <p>{error}</p>}
      <Form
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <InputField label='Email Address' name='email' placeholder='Your Email' />
        <div className='flex mt-4'>
          <Button type='submit' size='w-full' variant='btn-primary text-white'>Send Hint</Button>
        </div>

      </Form>
      <p className='mt-8'>If your hint doesn't help you, try using the <Link href='/' className='text-blue-800'>Account Recovery</Link> process.</p>
    </>
  )
}

export default ForgotPasswordForm
