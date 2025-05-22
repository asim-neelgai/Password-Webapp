import Button from '@/components/Button'
import Form from '@/components/Form'
import InputField from '@/components/InputField'
import { getKey } from '@/lib/crypto'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  mfacode: Yup.string().required()
})

interface FormValues {
  mfacode: string
}

const initialValues: FormValues = {
  mfacode: ''
}
interface Props {
  email: string
  password: string
  session: string
}

const MfaForm = ({ email, password, session }: Props): React.ReactNode => {
  const router = useRouter()
  const handleSubmit = async (values: { [key: string]: any }): Promise<void> => {
    const stretchedMasterKey = await getKey(email, password)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      masterPassword: stretchedMasterKey,
      session,
      mfacode: values.mfacode
    })
    if (res?.status === 200) {
      router.push('/vault')
    }
    if (res?.status === 401) {
      alert('Invalid MFA code')
    }
  }
  return (
    <>
      <h1>Multi-factor Authentication</h1>
      <p className='py-5'>Enter an MFA code to complete sign-in.</p>
      <Form
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <InputField label='MFA Code' name='mfacode' />

        <Button type='submit' variant='btn-primary text-white mt-4' block='w-full'>Verify</Button>
      </Form>
    </>
  )
}

export default MfaForm
