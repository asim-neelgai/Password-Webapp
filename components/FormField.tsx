import { useFormikContext, ErrorMessage, Field } from 'formik'
import React, { useState } from 'react'
import Image from 'next/image'
import eye from 'public/eye.svg'
import eyeOff from 'public/eye-off.svg'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  block?: string
  className?: string
  onChange?: (event: { target: { name: any, value: any } }) => void
}
const FormField = ({ name, label, type = 'text', placeholder, className = 'input input-bordered focus:outline-0 hover:outline-0 w-full', onChange, ...props }: FormFieldProps): React.ReactNode => {
  const { setFieldValue } = useFormikContext()
  const [showPassword, setShowPassword] = useState(false)
  const formik: any = useFormikContext()

  const handleChange = async (event: { target: { name: any, value: any } }): Promise<void> => {
    const { value } = event.target
    await setFieldValue(name, value)
    if (typeof onChange === 'function') {
      onChange(event)
    }
  }

  return (
    <div className='mb-4'>
      {label !== '' && <label htmlFor={name} className='block text-sm font-medium text-black-700 mb-1'>{label}</label>}
      <div className='relative'>
        <Field
          type={showPassword ? 'text' : type}
          id={name} name={name} placeholder={placeholder}
          onChange={handleChange}
          className={`${className} ${formik?.errors[name] && formik?.touched[name] ? 'border-red-500 hover:border-red-500 focus:border-red-500 hover:outline-0 focus:outline-0' : ''
                        }`}
        />
        {type === 'password' && (
          <button
            className='absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer'
            onClick={() =>
              setShowPassword(!showPassword)}
          >
            {showPassword ? <Image src={eye} alt='' /> : <Image src={eyeOff} alt='' />}
          </button>
        )}

      </div>
      <ErrorMessage name={name} component='div' className='text-red-500 text-sm mt-1' />
    </div>
  )
}

export default FormField
