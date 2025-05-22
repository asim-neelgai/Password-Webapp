import Form from '../Form'
import InputField from '../InputField'
import Button from '../Button'
import { updateCollection } from '@/app/services/collectionService'
import { FormikHelpers } from 'formik'
import * as Yup from 'yup'
import CollectionContext from '@/app/CollectionContext'
import { useContext } from 'react'
import cognitoHelpers from '@/lib/cognitoHelpers'

interface CollectionFormProps {
  handleCloseDrawer: () => void
  id: any
  name?: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Collection Name is required').min(2, 'Collection Name must be at least 2 characters').max(50, 'Collection Name must be at most 50 characters')
})

const EditCollectionForm = ({ handleCloseDrawer, id, name }: CollectionFormProps): React.ReactNode => {
  const { setCollection } = useContext(CollectionContext)

  const handleSubmit = async (formValues: any, { resetForm }: FormikHelpers<any>): Promise<void> => {
    const accessToken = await cognitoHelpers?.getToken()
    try {
      const result = await updateCollection(formValues, accessToken ?? '', id)
      if (result?.error !== undefined) {
        console.error('Error updating collection:')
      }
      resetForm()
      handleCloseDrawer()
      setCollection(true)
      setTimeout(() => {
        setCollection(false)
      }, 1000)
    } catch (error) {
      console.error('Error updating collection:', error)
    }
  }

  return (
    <Form onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={{ name }}>
      <div>
        <div className='mb-4'>
          <InputField label='Collection' type='text' name='name' placeholder='Update Collection' />
        </div>

        <div className='mt-4'>
          <Button type='submit' variant='btn-primary text-white w-[123px]'>Update</Button>
        </div>
      </div>
    </Form>
  )
}

export default EditCollectionForm
