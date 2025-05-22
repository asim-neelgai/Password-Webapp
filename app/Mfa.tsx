'use client'
import Button from '@/components/Button'
import Form from '@/components/Form'
import InputField from '@/components/InputField'
import Modal from '@/components/Modal'
import cognitoHelpers from '@/lib/cognitoHelpers'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'

interface FormValues {
  userCode: string
}
const validationSchema = Yup.object().shape({
  userCode: Yup.string().required('Verification code is required')
})

const initialValues: FormValues = {
  userCode: ''
}

const Mfa = (): React.ReactNode => {
  const [image, setImage] = useState('')
  const [isChecked, setIsChecked] = useState(false)

  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [isDisableMfaModalOpen, setIsDisableMfaModalOpen] = useState(false)

  const openModal = (): void => {
    setIsQrModalOpen(true)
  }
  const closeQrModal = (): void => {
    setIsQrModalOpen(false)
  }

  const openDisableMfaModal = (): void => {
    setIsDisableMfaModalOpen(true)
  }
  const closeDisableMfaModal = (): void => {
    setIsDisableMfaModalOpen(false)
  }

  useEffect(() => {
    const fetchMFAStatus = async (): Promise<void> => {
      try {
        const token = await cognitoHelpers.getToken()

        const response = await axios.post('/api/mfaenable', { accessToken: token })
        setIsChecked(response.data.mfaEnabled)
      } catch (error: any) {
        alert(error?.response?.data?.message)
      }
    }

    void fetchMFAStatus()
  }, [isChecked])

  const handleCheckboxChange = async (): Promise<void> => {
    if (!isChecked) {
      await getQRCode()
      openModal()
      setIsChecked(isChecked => isChecked)
    } else {
      openDisableMfaModal()
      setIsChecked(isChecked => !isChecked)
    }
  }

  const handleEnableMfa = async (values: { [key: string]: any }, isEnabled: boolean): Promise<void> => {
    const token = await cognitoHelpers.getToken()
    try {
      const response = await axios.post('/api/validatemfa', { accessToken: token, userCode: values.userCode })
      if (response.status === 200) {
        setIsChecked(isEnabled)
        const settings = {
          PreferredMfa: isEnabled,
          Enabled: isEnabled
        }
        const mfaPreferenceResponse = await axios.post('/api/setmfapreference', { softwareTokenMfaSettings: settings, accessToken: token })
        if (mfaPreferenceResponse.status === 200) {
          if (isEnabled) {
            closeQrModal()
          } else {
            closeDisableMfaModal()
          }
        }
      }
    } catch (error: any) {
      alert(error?.response?.data?.message)
    }
  }

  const getQRCode = async (): Promise<void> => {
    const token = await cognitoHelpers.getToken()
    const response = await axios.post('/api/qrcode', { accessToken: token })
    setImage(response.data?.qrcode)
  }

  return (
    <>
      <div className='flex flex-col min-h-screen py-10 mx-10'>
        <div className='flex justify-between'>
          <label>
            {isChecked ? 'Disable' : 'Enable'} two-factor authentication
          </label>
          <input type='checkbox' checked={isChecked} onChange={handleCheckboxChange} className='toggle toggle-primary' />
        </div>
      </div>

      <Modal isOpen={isQrModalOpen}>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={closeQrModal}>✕</button>
        </form>
        <h3 className='mb-2'>Two Factor Authentication</h3>
        <p className='mb-5'>Kindly install the authenticator app, scan the QR code provided below, and enter the generated code from the app.</p>
        <div className='flex justify-center mb-5'>
          {image !== '' &&
            <Image src={image} alt='mfaqrcode' width={200} height={200} />}
        </div>
        <Form
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values: { [key: string]: any }) => await handleEnableMfa(values, true)}
        >
          <InputField label='Verification Code' name='userCode' />
          <Button type='submit' variant='btn-primary mt-3 text-white' block='w-full'>Confirm Code</Button>
        </Form>
      </Modal>

      <Modal isOpen={isDisableMfaModalOpen}>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={closeDisableMfaModal}>✕</button>
        </form>
        <h3 className='mb-2'>Disable Two Factor Authentication </h3>
        <p className='mb-4'>Enter the generated code from the authenticator app.</p>
        <Form
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values: { [key: string]: any }) => await handleEnableMfa(values, false)}
        >
          <InputField label='Verification Code' name='userCode' />
          <Button type='submit' variant='btn-primary mt-3 text-white' block='w-full'>Confirm</Button>
        </Form>
      </Modal>
    </>
  )
}

export default Mfa
