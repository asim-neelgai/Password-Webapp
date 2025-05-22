import React, { useEffect, useState } from 'react'
import Form from './Form'
import InputField from './InputField'
import Modal from './Modal'
import TextareaField from './TextareaField'
import Icon from './Icon'

interface OneTimeShareLinkModalProps {
  showOneTimeShareLinkModal: boolean
  closeOneTimeShareLinkModal: () => void
  selectedData: string
  id: string
  salt: string
}

const OneTimeShareLinkModal = ({
  showOneTimeShareLinkModal,
  closeOneTimeShareLinkModal,
  selectedData,
  id,
  salt
}: OneTimeShareLinkModalProps): React.ReactElement => {
  const url = process.env.NEXT_PUBLIC_ONE_TIME_SHARE_URL as string
  const [isChecked, setIsChecked] = useState(false)
  const [secretLink, setSecretLink] = useState('')
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedSalt, setCopiedSalt] = useState(false)

  let link = `${url}/${id}#${salt}`

  useEffect(() => {
    setSecretLink(link)
  }, [salt, id])

  const handleCheckboxChange = (): void => {
    setIsChecked((isChecked) => !isChecked)
    if (isChecked) {
      link = `${url}/${id}#${salt}`
      setSecretLink(link)
    } else {
      link = `${url}/${id}`
      setSecretLink(link)
    }
  }

  const copyContent = async (text: string, type: string): Promise<void> => {
    await navigator.clipboard.writeText(text)
    if (type === 'url') {
      setCopiedUrl(true)
      setTimeout(() => {
        setCopiedUrl(false)
      }, 2000)
    } else if (type === 'salt') {
      setCopiedSalt(true)
      setTimeout(() => {
        setCopiedSalt(false)
      }, 1000)
    }
  }

  return (
    <Modal isOpen={showOneTimeShareLinkModal} width='800px'>
      <div className='flex flex-col gap-2'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={closeOneTimeShareLinkModal}>
            ✕
          </button>
        </form>
        <h3 className='mb-2 flex flex-row gap-3'>
          <Icon name='sharelink' />
          Share Link
        </h3>
        <p className='mb-4'>Share your secret message with private link.</p>
        <Form
          initialValues={{ content: selectedData, id, expiresAt: '' }}
          validationSchema={() => {}}
          onSubmit={() => {}}
        >
          <TextareaField label='Message' name='content' value={selectedData} isDisabled fieldClassName='disabled:text-blacks disabled:bg-gray-2' />
          <div className='flex justify-between mb-4'>
            <label htmlFor='toggle'>Send decryption key separately.</label>
            <input id='toggle' name='toggle' type='checkbox' checked={isChecked} onChange={handleCheckboxChange} className='toggle toggle-primary' />
          </div>
          <InputField
            value={secretLink}
            label='Your secret Link'
            name='url'
            hasCopy
            copyContent={async () => await copyContent(secretLink, 'url')}
            isDisabled
          />
          {copiedUrl && <div className={`text-gray-900 absolute ${isChecked ? 'top-[64%]' : 'top-[77%]'} right-8`}>Copied!</div>}
          {isChecked && (
            <>
              <InputField
                value={salt}
                label='Decryption Key'
                name='salt'
                hasCopy
                copyContent={async () => await copyContent(salt, 'salt')}
                isDisabled
              />
              {copiedSalt && <div className='text-gray-900 absolute top-[80%] right-8'>Copied!</div>}
            </>
          )}
        </Form>
      </div>
    </Modal>
  )
}

export default OneTimeShareLinkModal
