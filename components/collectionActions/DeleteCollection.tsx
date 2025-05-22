
import Modal from '../Modal'
import Icon from '../Icon'

interface CollectionFormProps {
  id: any
  openDeleteCollection: boolean
  handleDelete: (id: any) => any
  handleDrawerClose: () => void
}

const DeleteCollectionForm = ({ id, openDeleteCollection, handleDelete, handleDrawerClose }: CollectionFormProps): React.ReactNode => {
  return (
    <Modal isOpen={openDeleteCollection}>
      <div className='h-52 relative'>
        <div className='flex flex-row gap-4 mb-6'>
          <Icon name='fi-rr-trash-black' />
          <p className='text-xl font-medium text-blacks '>
            Delete Collection
          </p>
          <button onClick={handleDrawerClose} className='absolute top-1 right-1 hidden sm:block'>
            <Icon name='close' />
          </button>

        </div>
        <p className='text-base text-blacks font-normal'>Are you sure you want to delete this collection? </p>
        <div className='absolute bottom-0 right-0 flex gap-4'>
          <button type='button' className='btn bg-white w-24 text-black' onClick={handleDrawerClose}>Close</button>
          <button type='button' className='btn-error w-24 text-white btn ' onClick={async () => handleDelete(id)}>Delete</button>

        </div>

      </div>
    </Modal>
  )
}

export default DeleteCollectionForm
