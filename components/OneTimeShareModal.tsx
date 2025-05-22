import React, { useContext, useRef, useState } from 'react'
import Modal from './Modal'
import { ErrorMessage, Field } from 'formik'
import TextareaField from './TextareaField'
import InputField from './InputField'
import Button from './Button'
import { encrypt, generateRandomIV, generateSalt } from '@/lib/crypto'
import * as Yup from 'yup'
import Form from './Form'
import { saveOnetimeShare } from '@/app/services/oneTimeShareService'
import cognitoHelpers from '@/lib/cognitoHelpers'
import { useRouter } from 'next/navigation'
import { components } from '@/apptypes/api-schema'
import OneTimeShareLinkModal from './OneTimeShareLinkModal'
import Icon from './Icon'
import VaultDataContext from '@/app/VaultDataContext'

const validationSchema = Yup.object().shape({
  content: Yup.string().label('Message'),
  salt: Yup.string().label('Encryption Key'),
  expiresAt: Yup.string().required().label('Expires')
})

const expireOptions = [
  { label: '5 minutes', value: 5 * 60 * 1000 },
  { label: '30 minutes', value: 30 * 60 * 1000 },
  { label: '1 hour', value: 60 * 60 * 1000 },
  { label: '4 hours', value: 4 * 60 * 60 * 1000 },
  { label: '12 hours', value: 12 * 60 * 60 * 1000 },
  { label: '1 day', value: 24 * 60 * 60 * 1000 },
  { label: '3 days', value: 3 * 24 * 60 * 60 * 1000 },
  { label: '7 days', value: 7 * 24 * 60 * 60 * 1000 }
]

interface OneTimeShareModalProps {
  showOneTimeShareModal: boolean
  closeOneTimeShareModal: () => void
  selectedData: string
}

const OneTimeShareModal = ({ showOneTimeShareModal, closeOneTimeShareModal, selectedData }: OneTimeShareModalProps): React.ReactElement => {
  const [showOneTimeShareLinkModal, setShowOneTimeShareLinkModal] = useState(false)
  const [secretId, setSecretId] = useState('')
  const oneTimeShareFormRef = useRef<any>()

  const { showModal, setShowModal } = useContext(VaultDataContext)
  const router = useRouter()

  const handleAutoGenerateKey = (): void => {
    oneTimeShareFormRef.current.setFieldValue('salt', generateSalt())
  }

  const closeOneTimeShareLinkModal = (): void => {
    setShowOneTimeShareLinkModal(false)
    setSecretId('')
  }

  const handleOneTimeShareSubmit = async (values: { [key: string]: any }): Promise<void> => {
    const accessToken = await cognitoHelpers.getToken()
    if (accessToken == null) {
      return router.push('/login')
    }
    const selectedOption = expireOptions.find(option => option.label === values.expiresAt)
    if (selectedOption != null) {
      const expiryDate = new Date(Date.now() + selectedOption.value)
      const iv = await generateRandomIV()
      const encryptedContent = await encrypt(values.content, values.salt, iv)
      const oneTimeShareToSave: components['schemas']['OneTimeShareRequestModel'] = {
        content: encryptedContent,
        salt: values.salt,
        expiresAt: expiryDate.toISOString(),
        iv: Buffer.from(iv).toString('base64')
      }
      const res = await saveOnetimeShare(oneTimeShareToSave, accessToken)
      if (res.status === 201) {
        setShowOneTimeShareLinkModal(true)
        setSecretId(res.data.id)
      }
    }
    setShowModal(false)
  }

  return (
    <>
      {
      showModal && (
        <Modal isOpen={showOneTimeShareModal} width='800px'>
          <div className='flex flex-col gap-2'>
            <form method='dialog'>
              <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={closeOneTimeShareModal}>✕</button>
            </form>
            <h3 className='mb-2 flex flex-row gap-3'><Icon name='sharelink' />Share Link</h3>
            <p className='mb-4'>Share your secret message with private link.</p>
            <Form
              initialValues={{
                content: selectedData,
                salt: generateSalt(),
                expiresAt: ''
              }}
              validationSchema={validationSchema}
              onSubmit={async (values: { [key: string]: any }) => await handleOneTimeShareSubmit(values)}
              innerRef={oneTimeShareFormRef}
            >
              <TextareaField label='Message' name='content' value={selectedData} isDisabled />
              <InputField
                label='Encryption Key'
                name='salt'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = event.target
                  if (value.length === 1) {
                    oneTimeShareFormRef.current?.setFieldValue('salt', '')
                  } else {
                    oneTimeShareFormRef.current?.setFieldValue('salt', value)
                  }
                }}
              />
              <div className='flex flex-row justify-end'>
                <button type='button' className='btn btn-sm btn-success text-xs' onClick={handleAutoGenerateKey}>Auto Generate</button>
              </div>

              <label className='block text-sm font-medium text-black-700'>Expires</label>
              <Field as='select' id='expiresAt' name='expiresAt' className='select select-bordered w-full mb-2'>
                <option value='' label='Expires' />
                {expireOptions.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name='expiresAt' component='div' className='text-red-500 text-sm' />

              <Button type='submit' variant='btn-primary mt-3 text-white'>Generate Link</Button>
            </Form>
          </div>
        </Modal>

      )
    }
      <OneTimeShareLinkModal
        showOneTimeShareLinkModal={showOneTimeShareLinkModal}
        closeOneTimeShareLinkModal={closeOneTimeShareLinkModal}
        selectedData={selectedData}
        id={secretId}
        salt={oneTimeShareFormRef.current?.values?.salt}
      />
    </>
  )
}

export default OneTimeShareModal
