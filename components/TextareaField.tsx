import { ErrorMessage, Field, useFormikContext } from 'formik'

interface TextareaFieldProps {
  label: string
  name: string
  value?: string
  isDisabled?: boolean
  fieldClassName?: string
}

const TextareaField = ({ label, name, value, isDisabled = false, fieldClassName = '' }: TextareaFieldProps): React.ReactElement => {
  const formik: any = useFormikContext()

  return (
    <div className='mb-3'>
      <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-2'>
        {label}:
      </label>
      <Field as='textarea' id={name} name={name} value={formik.values[name] || value} disabled={isDisabled} className={`input input-bordered w-full h-20 mb-2 ${fieldClassName}`} />
      <ErrorMessage name={name} component='div' className='text-red-500 text-sm' />
    </div>
  )
}

export default TextareaField
