'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useRef, useState } from 'react'
import Form from '@/components/Form'
import * as Yup from 'yup'
import {
  deriveMasterKeyWeb,
  stretchMasterKeyWeb
} from '../../lib/crypto'

import Button from '@/components/Button'
import InputField from '@/components/InputField'
import FormField from '@/components/FormField'
import information from 'public/information.svg'
import check from 'public/check.svg'
import Image from 'next/image'
import { setSessionStorage } from '@/lib/store'

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Full Name'),
  email: Yup.string().email().required().label('Email'),
  password: Yup.string().min(8).required().label('Password'),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')], 'Password confirmation must match the password')
    .label('Confirm Password')
})

export const RegisterForm = (): React.ReactNode => {
  const [agreed, setAgreed] = useState(false)
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordHint: ''
  })
  const [error, setError] = useState('')
  const [showDropDown, setShowDropDown] = useState(false)

  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  })

  const route = useRouter()
  const ref = useRef()

  const onSubmit = async (formValues: any): Promise<void> => {
    if (!agreed) {
      setError('Please agree to the Terms and Privacy Policy')
      return
    }
    setFormValues({ name: '', email: '', password: '', confirmPassword: '', passwordHint: '' })

    try {
      const { email, password } = formValues
      const masterKey = await deriveMasterKeyWeb(password, email)
      const stretchedMasterKey = await stretchMasterKeyWeb(masterKey)

      setSessionStorage('masterKey', masterKey.toString())
      setSessionStorage('email', email)

      const updatedFormValues = {
        ...formValues,
        password: stretchedMasterKey.toString()
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(updatedFormValues),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        setError((await res.json()).message)
        return
      }
      route.push('/confirm')
    } catch (error: any) {
      setError(error)
    }
  }
  const handlePasswordChange = (event: { target: any }): any => {
    const { name, value } = event.target
    setFormValues({ ...formValues, [name]: value })

    if (value.trim() !== '') {
      const updatedRequirements = {
        length: value.length >= 8 && value.length <= 12,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[!@#$%^&*]/.test(value)
      }
      setRequirements(updatedRequirements)

      const allRequirementsMet = Object.values(updatedRequirements).every(req => req)

      setShowDropDown(!allRequirementsMet)
    } else {
      setShowDropDown(false)
    }
  }

  const handleAgreementChange = (): void => {
    setAgreed(!agreed)
  }

  return (
    <Form
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      initialValues={{
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        passwordHint: ''

      }}
      innerRef={ref}

    >
      <h1 className='mb-2 text-black font-inter text-2xl font-semibold'>
        Create an account
      </h1>
      <p className='mb-10 text-black text-base'>Let's get started by signing up our app.</p>
      <div className='mb-6'>

        <InputField label='Full Name' type='text' name='name' placeholder='Your Full Name' />

      </div>
      <div className='mb-6'>

        <InputField label='Email Address' type='email' name='email' placeholder='Email address' />

      </div>
      <div className='mb-6'>

        <FormField name='password' label='Master Password' onChange={handlePasswordChange} type='password' placeholder='Master Password' />
      </div>
      {
        showDropDown && (
          <div className='absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg  w-[350px] h-[310px] sm:w-460 sm:h-300'>
            <h1 className='text-lg py-4 pl-6 font-semibold'>Minimum Requirement for password:</h1>

            <div className='pl-7 '>
              <div className='flex items-start mt-0.5'>
                {!requirements.length
                  ? (
                    <Image src={information} alt='fallback' priority className='w-6 h-6' />
                    )
                  : (
                    <Image src={check} alt='fallback' priority className='w-6 h-6' />
                    )}
                <p className='mb-2 ml-1.5 '>Passwords should have a minimum length, often ranging from 8 to 12 characters</p>
              </div>

              <div className='flex items-center'>
                {!requirements.uppercase
                  ? (
                    <Image src={information} alt='fallback' priority className='w-6 h-6' />
                    )
                  : (
                    <Image src={check} alt='fallback' priority className='w-6 h-6' />
                    )}
                <p className='mb-2 ml-1.5'>Include at least one uppercase letter</p>
              </div>

              <div className='flex items-center'>
                {!requirements.lowercase
                  ? (
                    <Image src={information} alt='fallback' priority className=' w-6 h-6' />
                    )
                  : (
                    <Image src={check} alt='fallback' priority className='w-6 h-6' />
                    )}
                <p className='mb-2 ml-1.5'>Include at least one lowercase letter</p>
              </div>

              <div className='flex items-center'>
                {!requirements.number
                  ? (
                    <Image src={information} alt='fallback' priority className=' w-6 h-6' />
                    )
                  : (
                    <Image src={check} alt='fallback' priority className='w-6 h-6' />
                    )}
                <p className='mb-2 ml-1.5'>Include at least one numerical digit</p>
              </div>

              <div className='flex items-start mt-0.5'>
                {!requirements.specialChar
                  ? (
                    <Image src={information} alt='fallback' priority className='w-6 h-6' />
                    )
                  : (
                    <Image src={check} alt='fallback' priority className='w-6 h-6' />
                    )}
                <p className='mb-2 ml-1.5'>Include at least one special character (e.g., !, @, #, $, %, etc.)</p>
              </div>
            </div>
          </div>
        )
      }

      <div className='mb-6'>

        <InputField label='Confirm Master Password' type='password' name='confirmPassword' placeholder='Confirm Master Password' />

      </div>
      <div className='mb-6'>
        <InputField label='Password Hint(Optional)' type='password' name='passwordHint' placeholder='Your Password Hint' />

      </div>

      <div className='mb-5 flex items-top'>

        <div className='form-control'>
          <label className='cursor-pointer label flex items-start'>
            <input
              type='checkbox' className='checkbox checkbox-success mr-2.5 w-5 h-5' checked={agreed}
              onChange={handleAgreementChange}
            />
            <span className='label-text'> By completing this form, I agree to the Terms and Privacy Policy</span>
          </label>
        </div>
      </div>
      {(error !== '' && typeof error === 'string') && (
        <p className='text-center bg-red-300 py-4 mb-4 rounded'>{error}</p>
      )}
      <Button type='submit' variant='btn-primary text-white' block='w-full'>Create</Button>

      <span className='block text-center mt-7 text-base text-black'>
        Already have an account ?
        <Link
          href='/login'
          className='text-blue-600 hover:text-blue-800 hover:underline ml-2'
        >
          Login
        </Link>
      </span>

    </Form>
  )
}
