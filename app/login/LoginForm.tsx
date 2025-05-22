'use client'
import Button from '@/components/Button'
import { deriveMasterKeyWeb, stretchMasterKeyWeb } from '@/lib/crypto'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import MfaForm from './mfaForm'
import cognitoHelpers from '@/lib/cognitoHelpers'
import Form from '@/components/Form'
import InputField from '@/components/InputField'
import * as Yup from 'yup'
import { setSessionStorage } from '@/lib/store'

interface LoginFormValues {
  email: string
  password: string
}

const initialValues: LoginFormValues = {
  email: '',
  password: ''
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label('Email'),
  password: Yup.string().required().label('Password')
})

export const LoginForm = (): React.ReactNode => {
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  })
  const [showMfa, setShowMfa] = useState(false)
  const [error, setError] = useState('')

  const { data } = useSession()

  const router = useRouter()

  const onSubmit = async (
    values: { [key: string]: any }
  ): Promise<void> => {
    try {
      setFormValues({ email: values.email, password: values.password })
      const masterKey = await deriveMasterKeyWeb(
        values.password,
        values.email
      )
      setSessionStorage('masterKey', masterKey.toString())
      setSessionStorage('email', values.email)

      const stretchedMasterKey = await stretchMasterKeyWeb(masterKey)
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        masterPassword: stretchedMasterKey.toString()
      })
      const cognitoSession = await cognitoHelpers.getCognitoSession()
      if (res?.error) {
        setError('Invalid email or password')
        return
      }
      if (cognitoSession !== undefined) {
        setShowMfa(true)
      } else {
        router.push('/vault')
      }
    } catch (error: any) {
      setError(error)
    }
  }

  return (
    <>
      {!showMfa &&
        <div>
          <h1>Log in</h1>
          <p className=' pb-6'>Please sign in to continue</p>
          <Form
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {error && (
              <p className='text-center bg-red-300 py-4 mb-6 rounded'>{error}</p>
            )}
            <div className='mb-6'>
              <InputField label='Email Address' name='email' type='email' placeholder='Your Email' />
            </div>
            <div className='mb-3'>
              <InputField label='Password' name='password' type='password' placeholder='Your Password' />
            </div>
            <div className='text-right mb-3'>
              <Link className='inline-block text-black-600 hover:text-blue-800 hover:underline pl-1 text-sm' href='/forgot-password'>Forgot your password?</Link>
            </div>

            <Button type='submit' variant='btn-primary text-white w-full'>Login</Button>
            <div className='mt-4 mx-9'>
              New to Fort Lock?
              <Link
                href='/register'
                className='text-blue-600 hover:text-blue-800 hover:underline pl-1'
              >
                Create a new account
              </Link>
            </div>
          </Form>
        </div>}
      {showMfa && data?.user?.cognitoSession &&
        <MfaForm email={formValues.email} password={formValues.password} session={data.user.cognitoSession} />}
    </>
  )
}
