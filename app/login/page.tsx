import FormContainer from '@/components/FormContainer'
import { LoginForm } from './LoginForm'
import Navigation from '../navigation'
import Footer from '../footer'

export default function LoginPage (): React.ReactNode {
  return (
    <div className='bg-gray-2 flex flex-col min-h-screen w-full'>

      <div className='mx-24'>

        <Navigation fromLogin />
      </div>
      <FormContainer>
        <LoginForm />
      </FormContainer>
      <div className='flex flex-grow items-end'>

        <Footer />

      </div>

    </div>

  )
}
