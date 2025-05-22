import Form from './Form'
import InputField from './InputField'
import Button from './Button'
import { saveOrganization } from '@/app/services/organizationService'
import { FormikHelpers } from 'formik'
import * as Yup from 'yup'
import CollectionContext from '@/app/CollectionContext'
import { useContext } from 'react'
import cognitoHelpers from '@/lib/cognitoHelpers'

interface OrganizationFormProps {
  handleCloseDrawer: () => void
}
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Organization Name is required').min(2, 'Organization Name must be at least 2 characters').max(50, 'Organization Name must be at most 50 characters')
})

const OrganizationForm = ({ handleCloseDrawer }: OrganizationFormProps): React.ReactNode => {
  const { setCollection } = useContext(CollectionContext)

  const handleSubmit = async (formValues: any, { resetForm }: FormikHelpers<any>): Promise<void> => {
    const accessToken = await cognitoHelpers?.getToken()

    try {
      const result = await saveOrganization(formValues, accessToken ?? '')
      if (result?.error !== undefined) {
        console.error('Error saving organization:')
      }
      resetForm()
      setCollection(true)
      handleCloseDrawer()
      setTimeout(() => {
        setCollection(false)
      }, 1000)
    } catch (error) {
      console.error('Error saving organization:', error)
    }
  }

  return (

    <Form onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={{ name: '' }}>
      <div className='mt-[34px] mx-8'>
        <div className='mb-4'>
          <InputField label='Organization Name' type='text' name='name' placeholder='Create Organization' />
        </div>

        <div className='mt-4'>
          <Button type='submit' variant='btn-primary text-white w-[123px]'>Create</Button>
        </div>
      </div>

    </Form>
  )
}

export default OrganizationForm
