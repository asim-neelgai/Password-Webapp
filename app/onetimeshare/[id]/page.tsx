'use client'
import Navigation from '@/app/navigation'
import { fetchOnetimeShareById } from '@/app/services/oneTimeShareService'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import Form from '@/components/Form'
import Icon from '@/components/Icon'
import InputField from '@/components/InputField'
import TextareaField from '@/components/TextareaField'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  message: Yup.string().label('Message'),
  key: Yup.string().required().label('Decryption Key')
})

const OneTimeShare = (): React.ReactNode => {
  const [alertMessage, setAlertMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [salt, setSalt] = useState('')

  const params = useParams()

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    setSalt(hash)
  }, [])

  const handleViewMessage = async (values: { [key: string]: any }): Promise<void> => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const res = await fetchOnetimeShareById(id, values.key)
    if (res?.status === 200) {
      setAlertMessage(false)
      setMessage(res.data.content)
    } else {
      setAlertMessage(true)
    }
  }
  return (
    <>
      <Navigation />
      <div className='flex justify-center items-center mt-20'>
        <div className='card w-800 bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h3 className='card-title mb-2 flex flex-row gap-3 text-xl font-medium'><Icon name='sharelink' />Shared Secret Message</h3>
            <p className='py-4'>
              Keep sensitive info out of your email and chat logs.
            </p>
            <div className='mb-4'>
              {alertMessage && (
                <Alert className='alert-warning text-white'>
                  The link has either been viewed, expired or never existed.
                </Alert>
              )}

            </div>
            <Form
              initialValues={{
                message,
                key: salt
              }}
              validationSchema={validationSchema}
              onSubmit={async (values: { [key: string]: any }) => await handleViewMessage(values)}
            >

              {message === ''
                ? (
                  <>
                    <InputField label='Decryption Key' name='key' />
                    <div className='pt-3'>
                      <Button
                        type='submit'
                        variant='btn-primary'
                      >
                        View Message
                      </Button>
                    </div>
                  </>
                  )
                : (
                  <>
                    <label htmlFor='message' className='mb-[-2px] text-sm font-medium '>Message:</label>
                    <div className='message-container bg-secondary px-5 py-5 rounded-lg '>
                      <div style={{ whiteSpace: 'pre-line' }}>{message}</div>
                    </div>

                  </>
                  )}

            </Form>

          </div>
        </div>
      </div>
    </>
  )
}

export default OneTimeShare
