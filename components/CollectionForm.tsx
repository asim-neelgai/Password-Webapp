import Form from './Form'
import InputField from './InputField'
import Button from './Button'
import { saveCollection } from '@/app/services/collectionService'
import { FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useContext } from 'react'
import CollectionContext from '@/app/CollectionContext'
import cognitoHelpers from '@/lib/cognitoHelpers'

interface CollectionFormProps {
  handleDrawerCloseClicked: () => void
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Collection Name is required').min(2, 'Collection Name must be at least 2 characters').max(50, 'Collection Name must be at most 50 characters')
})

const CollectionForm = ({ handleDrawerCloseClicked }: CollectionFormProps): React.ReactNode => {
  const { setCollection } = useContext(CollectionContext)

  const handleSubmit = async (formValues: any, { resetForm }: FormikHelpers<any>): Promise<void> => {
    const accessToken = await cognitoHelpers?.getToken()

    try {
      const result = await saveCollection(formValues, accessToken ?? '')
      if (result?.error !== undefined) {
        console.error('Error saving collection:')
      }
      resetForm()
      handleDrawerCloseClicked()
      setCollection(true)
    } catch (error) {
      console.error('Error saving collection:', error)
    }
  }

  return (
    <Form onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={{ name: '' }}>
      <div className=' mt-8 mx-8'>
        <div className='mb-4'>
          <InputField label='Collection' type='text' name='name' placeholder='Create Collection' />
        </div>

        <div className='mt-4'>
          <Button type='submit' variant='btn-primary text-white w-[123px]'>Create</Button>
        </div>
      </div>
    </Form>

  )
}

export default CollectionForm
