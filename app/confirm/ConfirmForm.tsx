'use client'

import {
  generateProtectedSymmetricKey,
  stretchMasterKeyWeb
} from '@/lib/crypto'
import { convertToUint8Array, getSessionStorage } from '@/lib/store'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { saveUser } from '../services/userService'
import { UserKeys } from '../../apptypes/keys'
import Form from '@/components/Form'
import InputField from '@/components/InputField'
import Button from '@/components/Button'
import * as Yup from 'yup'

interface FormValuesType {
  confirmationCode: string
}

const validationSchema = Yup.object().shape({
  confirmationCode: Yup.string().required().label('Confirmation code')
})

export const ConfirmForm = (): React.ReactNode => {
  const [error, setError] = useState('')
  const router = useRouter()

  let sessionEmail: any = null

  if (typeof window !== 'undefined') {
    sessionEmail = getSessionStorage('email')
  }
  const initialFormValues: FormValuesType = {
    confirmationCode: ''
  }

  const handleFormSubmit = async (formValues: any): Promise<void> => {
    try {
      const res = await fetch('/api/confirm', {
        method: 'POST',
        body: JSON.stringify({
          ...formValues,
          username: sessionEmail
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        setError((await res.json()).message)
        return
      }

      const masterKeyString = getSessionStorage('masterKey')
      const email = getSessionStorage('email')
      if (masterKeyString == null || email == null) {
        return router.push('/register')
      }
      const masterKey = convertToUint8Array(masterKeyString)
      const stretchedMasterKey = await stretchMasterKeyWeb(masterKey)

      const loggedIn = await signIn('credentials', {
        redirect: false,
        email: sessionEmail,
        masterPassword: stretchedMasterKey.toString()
      })
      if (loggedIn == null) {
        router.push('/login')
      }

      const protectedSymmetricKey = await generateProtectedSymmetricKey(
        stretchedMasterKey
      )

      const session = await getSession()
      const userKeys: UserKeys = {
        key: JSON.stringify(protectedSymmetricKey)
      }
      const userDetail = await saveUser(userKeys, session?.user.accessToken)
      if (userDetail) {
        router.push('/vault')
      }
    } catch (error: any) {
      setError(error)
    }
  }

  return (
    <Form onSubmit={handleFormSubmit} initialValues={initialFormValues} validationSchema={validationSchema}>
      {(error !== '' && typeof error === 'string') && (
        <p className='text-center bg-red-300 py-4 mb-6 rounded'>{error}</p>
      )}
      <div className='mb-6'>
        <div className='mb-6'>
          <h1 className='mb-2'>Email Verification</h1>
          <p className='text-base'>Please enter the confirmation code sent to</p>
          <p className='mb-6'>{sessionEmail}.</p>
        </div>

      </div>
      <div className='mb-6'>
        <InputField type='text' name='confirmationCode' placeholder='Confirmation Code' label='Confirmation Code' />
      </div>

      <Button type='submit' variant='btn-primary text-white w-full'>Confirm</Button>
    </Form>
  )
}
