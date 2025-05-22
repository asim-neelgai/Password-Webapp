import { useRef } from 'react'

interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  width?: string
}
const Modal = ({ isOpen, children, width }: ModalProps): React.ReactNode => {
  const modalRef = useRef<HTMLDialogElement>(null)

  const closeModal = (): void => {
    if (modalRef?.current != null) {
      modalRef?.current?.close()
    }
  }
  if (isOpen && modalRef?.current != null) {
    modalRef?.current?.showModal()
  } else {
    closeModal()
  }
  return (
    <dialog open={isOpen} className='modal' ref={modalRef}>
      <div className='modal-box sm:max-w-screen-sm' style={{ maxWidth: width }}>
        {children}
      </div>
    </dialog>
  )
}

export default Modal
