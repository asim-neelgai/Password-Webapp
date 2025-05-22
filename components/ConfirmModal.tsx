import { useRef } from 'react'
import Image from 'next/image'
import bin from './../public/delete-bin.svg'
import Icon from './Icon'

interface ConfirmModalProps {
  content?: string
  isOpen?: boolean
  data?: any
  onPressDelete?: () => Promise<void>
  onPressCancel?: () => void
}

const ConfirmModal = ({ isOpen = true, content, data, onPressDelete, onPressCancel }: ConfirmModalProps): React.ReactNode => {
  const confirmModalRef = useRef<HTMLDialogElement>(null)

  const closeModal = (): void => {
    if (confirmModalRef.current != null) {
      confirmModalRef.current.close()
    }
  }
  if (isOpen && confirmModalRef.current != null) {
    confirmModalRef.current.showModal()
  } else {
    closeModal()
  }
  return (
    <dialog open={isOpen} className='modal' ref={confirmModalRef}>
      <div className='modal-box overflow-hidden'>
        <div className='flex flex-row justify-start mb-6'>
          <Image src={bin} alt='bin' />
          <h3 className='ml-3'>Permanently delete these logins?</h3>
          <button className='absolute top-6 right-6' onClick={onPressCancel}>
            <Icon name='close' />
          </button>
        </div>
        <p className='mb-4'>{content}</p>
        {data.map((item: any) => (
          <div key={item.id} className='ml-2 flex flex-column gap-3 mt-3'>
            <Icon name='fi-rr-globe' />
            <div className='flex flex-col items-baseline ml-2'>
              <p className='text-blacks text-sm font-medium'>{item.name}</p>
              <p className='text-blacks text-sm font-medium overflow-hidden whitespace-nowrap'> {item?.url?.length > 57 ? `${item?.url?.substring(0, 57)}...` : item?.url}</p>
            </div>
          </div>
        ))}
        <div className='flex flex-row gap-3 justify-end'>
          <button type='button' className='btn bg-white mt-3 text-black' onClick={onPressCancel}>Close</button>
          <button type='button' className='btn btn-error mt-3 text-white' onClick={onPressDelete}>Delete</button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmModal
