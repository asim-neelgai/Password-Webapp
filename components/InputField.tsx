import React, { useState, ChangeEvent } from 'react'
import { Field, ErrorMessage, useFormikContext } from 'formik'
import informationRed from 'public/informationred.svg'
import Image from 'next/image'
import eye from 'public/eye.svg'
import eyeOff from 'public/eye-off.svg'
import Icon from './Icon'

interface InputFieldProps {
  label?: string
  name: string
  type?: string
  placeholder?: string
  className?: string
  value?: string
  isDisabled?: boolean
  hasCopy?: boolean
  copyContent?: () => Promise<void>
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void

}

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  className = 'input input-bordered focus:outline-0 hover:outline-0 w-full',
  value,
  isDisabled = false,
  hasCopy = false,
  copyContent,
  onChange

}: InputFieldProps): React.ReactNode => {
  const [showPassword, setShowPassword] = useState(false)
  const formik: any = useFormikContext()
  const { setFieldValue } = useFormikContext()

  const isEmailInvalid = formik.errors[name] && formik.touched[name] && type === 'email'

  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const { name, value } = event.target
    await setFieldValue(name, value.trim() === '' ? '' : value)
    if (typeof onChange === 'function') {
      onChange(event)
    }
  }
  const inputStyle = hasCopy ? { paddingRight: '2.5rem' } : {}
  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-black-700 mb-1'>
        {label}
      </label>
      <div className='relative'>
        <Field
          disabled={isDisabled}
          type={showPassword ? 'text' : type}
          id={name} name={name} value={formik.values[name] || value}
          className={`${className} ${formik?.errors[name] && formik?.touched[name] ? 'border-red-500 hover:border-red-500 focus:border-red-500 hover:outline-0 focus:outline-0' : ''
            }`}
          placeholder={placeholder}
          onChange={handleChange}
          style={inputStyle}
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
        {isEmailInvalid === true && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
            <Image src={informationRed} alt='fallback' priority className='w-5 h-5' />
          </div>
        )}
        {hasCopy && (
          <button
            className='absolute inset-y-0 right-0 px-3 flex items-center cursor-pointer z-index-10'
            onClick={async () => await ((copyContent != null) && copyContent())}
          >
            <Icon name='fi-rr-copy-alt' />
          </button>
        )}
      </div>

      <ErrorMessage name={name} component='div' className='text-red-500 text-sm mt-1' />
    </div>
  )
}

export default InputField
