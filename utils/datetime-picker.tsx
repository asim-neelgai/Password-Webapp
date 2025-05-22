import React, { useState } from 'react'
import { Field, ErrorMessage, useFormikContext } from 'formik'
import { format } from 'date-fns/format'
import { Calendar } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Icon from '@/components/Icon'

interface DateTimeValuesProps {
  label?: string
  name?: string
  type?: string
}

const DatePicker = ({ label, name = '', type = '' }: DateTimeValuesProps): any => {
  const [date, setDate] = useState('')
  const [open, setOpen] = useState(false)

  const formik: any = useFormikContext()

  const handleClick = (): void => {
    setOpen(true)
  }

  const handleChange = (value: any): any => {
    const formattedDate = format(value, 'dd/MM/yyyy')
    setDate(formattedDate)
    formik.setFieldValue(name, formattedDate)
    setOpen(!open)
  }

  const handleClear = (): void => {
    setDate('')
    setOpen(false)
  }

  return (
    <div className='relative'>
      <label htmlFor={name}>{label}</label>
      <div className='flex flex-row relative'>
        <Field
          id={name}
          name={name}
          readOnly
          onClick={handleClick}
          value={formik.values?.expire ?? date}
          type={type}
          placeholder='DD/MM/YYYY'
          className={`border border-gray-300 rounded-md w-full p-2 h-12 ${formik?.errors[name] && formik?.touched[name] ? 'border-red-500 hover:border-red-500 focus:border-red-500 hover:outline-0 focus:outline-0' : ''}`}
        />
        <Icon name='calendar' className='absolute right-2 top-2' />
      </div>
      {open &&
        <div className='absolute z-10 w-full'>
          <div className='flex flex-col appearance-none shadow border rounded p-4 items-center bg-white'>
            <Calendar onChange={(value) => handleChange(value)} />
            <div className='flex justify-center w-full mt-2'>
              <button className='btn btn-md' type='button' onClick={handleClear}>Clear</button>
            </div>
          </div>
        </div>}

      <ErrorMessage name={name} component='div' className='text-red-500 text-sm mt-1' />

    </div>
  )
}

export default DatePicker
