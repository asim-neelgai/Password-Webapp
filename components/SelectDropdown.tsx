import { ErrorMessage, useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'

interface MultiSelectProps {
  data: any
  name: string
  className?: string
  label: string
  setData?: any
}

const MultipleSelect = ({ data, className = '', name = '', label = '', setData }: MultiSelectProps): React.ReactElement => {
  const [selectedCollection, setSelectedCollection] = useState<any[]>([])
  const formik: any = useFormikContext()

  const handleSelect = (value: any): any => {
    formik.setFieldValue(name, value)
    setSelectedCollection(value)
  }
  const dataNames = data?.map((item: any) => ({ label: item.name, value: item.id }))

  useEffect(() => {
    formik.setFieldValue(name, setData)
    setSelectedCollection(setData)
  }, [setData])

  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium'>{label}</label>
      <Select
        id={name}
        name={name}
        onChange={(value) => handleSelect(value)}
        className={`${formik.errors[name] && formik.touched[name] ? 'collection' : ''}`}
        closeMenuOnSelect
        isMulti
        options={dataNames}
        value={selectedCollection ?? null}
        onBlur={() => formik.setFieldTouched(name)}
      />
      <ErrorMessage name={name} component='div' className='text-red-500 text-sm mt-1' />
    </div>
  )
}

export default MultipleSelect
