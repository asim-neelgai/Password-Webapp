'use client'
import Navigation from './navigation'
import Password from '@/app/assests/Password.jpg'
import Secret from '@/app/assests/secret.png'

import Image from 'next/image'
import Footer from './footer'
import Faq from '@/components/Faq'
import background from '@/app/assests/Bg.png'
import Ellipse from '@/app/assests/Ellipse1.png'
import Link from 'next/link'

const Home = (): React.ReactNode => {
  const handleScroll = (sectionId: string): void => {
    const section = document.getElementById(sectionId)
    if (section != null) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (

    <div className=' h-full w-full relative'>
      <div className='w-full bg-cover bg-no-repeat bg-image' style={{ backgroundImage: `url(${background.src})` }}>
        <div className='mx-24 '>

          <Navigation handleScroll={handleScroll} />
        </div>
        <section className='sm:mx-16 md:mx-10 lg:text-center mt-[100px] h-full text-start mx-5 '>
          <p className='text-4xl font-medium sm:text-2 lg:text-3.5  '><span className='sm:font-medium'>Your </span><span className='text-darkBlue sm:font-bold'>Ultimate</span> <span className='sm:font-medium'>Password</span><span className='sm:font-medium'> Manager</span> </p>
          <p className='mt-[40px] sm:text-xl text-base font-normal'>Secure your loved ones, your team, or your entire organization with straightforward <br /> security measures, effortless secret sharing, and practical insight reports.</p>
          <Link href='/login' className='btn btn-xl btn-primary sm:btn-sm md:btn-md lg:btn-lg mt-[40px] text-white w-36 sm:w-48 rounded-lg h-12'>Get Started</Link>

          <div className='w-full flex sm:justify-center justify-start mt-[75px] sm:px-20 px-2 pb-10'>
            <Image src={Password} alt='fortlock banner 1' className='w-full ' />
          </div>
        </section>

      </div>

      <section className='text-center mt-16 sm:mt-[100px] bg-white' id='section1'>
        <p className='sm:text-3xl sm:mx-4 md:text-5xl text-3xl text-darkBlue font-semibold'>What do you get with FortLock?</p>

        <div className='flex flex-col items-center  sm:flex sm:flex-row sm:justify-center mt-10 sm:mt-[65px] sm:mx-[100px] mx-4'>
          <div className='sm:w-1/2 bg-gray-3 sm:mr-[30px] h-[408px] sm:h-[470px] lg:h-[500px] mb-5 sm:mb-0 rounded-2xl'>
            <div className='flex flex-col justify-center text-start pt-[59px] px-6 sm:px-[44px]'>
              <p className='text-2xl font-semibold'>
                Access & manage passwords everywhere
              </p>
              <p className='pt-[30px] text-base font-normal'>Employing a Password Manager allows seamless access across various devices and platforms.</p>

              <Image src={Secret} alt='fortlock banner 1' className='w-full ' />

            </div>
          </div>
          <div className='sm:w-1/2 bg-gray-3 h-[408px] sm:h-[470px] lg:h-[500px] rounded-2xl'>
            <div className='flex flex-col justify-center text-start pt-[59px] px-6 sm:px-[44px]'>
              <p className='text-2xl font-semibold'>
                Share secrets
              </p>
              <p className='pt-[30px] text-base font-normal'>Utilizing robust encryption protocols ensures that sensitive information remains protected .</p>
              <Image src={Secret} alt='fortlock banner 1' className='w-full' />

            </div>
          </div>
        </div>
        <div className='flex flex-col items-center  sm:flex sm:justify-center sm:flex-row  sm:mt-4 mt-5 sm:mx-[100px] mx-4'>
          <div className='sm:w-1/2 bg-gray-3 sm:mr-[30px] h-[408px] sm:h-[470px] lg:h-[500px] mb-5 sm:mb-0 rounded-2xl'>
            <div className='flex flex-col justify-center text-start pt-[59px] px-6 sm:px-[44px]'>
              <p className='text-2xl font-semibold'>
                Add and share collection
              </p>
              <p className='pt-[30px] text-base font-normal'>Employing a Password Manager allows seamless access across various devices and platforms.</p>
              <Image src={Secret} alt='fortlock banner 1' className='w-full' />

            </div>
          </div>
          <div className='sm:w-1/2 bg-gray-3 h-[408px] sm:h-[470px] lg:h-[500px] rounded-2xl'>
            <div className='flex flex-col justify-center text-start pt-[59px] px-6 sm:px-[44px]'>
              <p className='text-2xl font-semibold'>
                Two factor authentication
              </p>
              <p className='pt-7 text-base font-normal'>Utilizing robust encryption protocols ensures that sensitive information remains protected .</p>
              <Image src={Secret} alt='fortlock banner 1' className='w-full' />

            </div>
          </div>
        </div>
      </section>
      <section>
        <div className=' sm:mx-24 mx-4 mt-12 sm: bg-primary sm:h-96 h-full rounded-2xl sm:text-center px-10 sm:px-0 bg-no-repeat' style={{ backgroundImage: `url(${Ellipse.src})` }}>
          <p className='text-3xl sm:text-3xl md:text-4xl text-white pt-12 sm:pt-24 font-bold sm:px-2'>Improve password security across your organization</p>
          <p className='text-base text-white mt-4 font-medium  sm:px-4'>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores<br /> eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est</p>
          <Link href='/login' className='btn btn-xl btn-white sm:btn-sm md:btn-md lg:btn-lg mt-10 text-primary text-sm font-semibold sm:mb-0 mb-16'>Let's Get Started</Link>

        </div>
        <section id='section2'>
          <Faq />

        </section>
      </section>
      <Footer />
    </div>
  )
}

export default Home
