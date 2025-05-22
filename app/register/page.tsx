import FormContainer from '@/components/FormContainer'
import { RegisterForm } from './RegisterForm'
import Navigation from '../navigation'
import Footer from '../footer'

const RegisterPage = (): React.ReactNode => {
  return (
    <div className='bg-gray-2 flex flex-col min-h-screen w-full'>
      <div className='mx-24'>

        <Navigation fromRegister />
      </div>
      <FormContainer>
        <RegisterForm />
      </FormContainer>
      <Footer />

    </div>

  )
}

export default RegisterPage
