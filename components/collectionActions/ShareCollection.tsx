import Form from '../Form'
import InputField from '../InputField'
import Button from '../Button'
import { FormikHelpers } from 'formik'
import * as Yup from 'yup'

interface CollectionFormProps {
  handleCloseDrawer: () => void
  id: any
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label('Email')
})

const ShareCollectionForm = ({ handleCloseDrawer, id }: CollectionFormProps): React.ReactNode => {
  const handleSubmit = async (formValues: any, { resetForm }: FormikHelpers<any>): Promise<void> => {
    console.log('1')
  }

  return (
    <Form onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={{ name: '' }}>
      <div>
        <p className='mt-[25px] text-base font-medium'>People with access</p>
        <div className='mb-4 mt-8'>
          <InputField label='Email Address' type='email' name='email' placeholder='Email Address' className='input input-bordered focus:outline-0 hover:outline-0 w-[450px]' />
        </div>

        <div className='mt-4'>
          <Button type='submit' variant='btn-primary text-white w-[174px]'>Share Collection</Button>
        </div>
      </div>
    </Form>
  )
}

export default ShareCollectionForm
