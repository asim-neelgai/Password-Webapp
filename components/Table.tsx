import { TableColumn, TableRow } from '@/apptypes/keys'
import React, { useContext, useEffect, useState } from 'react'
import Dropdown, { type DropdownItem } from './Dropdown'
import Icon from './Icon'
import { timeAgo } from '@/lib/dateHelpher'
import Loader from './Loader'
import { typeIconMap } from '@/lib/typeIconMapHelper'
import Link from 'next/link'
import { components } from '@/apptypes/api-schema'
import VaultDataContext from '@/app/VaultDataContext'

interface TableProps {
  columns: TableColumn[]
  data: TableRow[]
  dropdownItems: DropdownItem[]
  handleRowClick?: (id: string, type: string) => void
  isLoading?: boolean
  checkedRows?: any
  checkedRowsData?: any
}

interface CheckboxCellProps {
  checked: boolean
  onChange: () => void
}

const CheckboxCell = ({ checked, onChange }: CheckboxCellProps): React.ReactElement => (
  <input type='checkbox' className='checkbox checkbox-success' checked={checked} onChange={onChange} />
)

const Table = ({ columns, data, dropdownItems, isLoading = false, checkedRows, checkedRowsData, handleRowClick = (id: string, type: string) => { } }: TableProps): React.ReactNode => {
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectedData, setSelectedData] = useState<[] | any[]>([])

  const { setChecked, setIsAllRowChecked } = useContext(VaultDataContext)

  useEffect(() => {
    if (selectedRows.length === 0) {
      checkedRows([])
    }
  }, [selectedRows])

  const toggleSelectAll = (): void => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    if (newSelectAll) {
      const allRowIds = data.map(row => row.id)
      setSelectedRows(allRowIds)
      checkedRows(allRowIds)
      setSelectedData(data)
      checkedRowsData(data)
      if (selectedRows?.length === 0) {
        setIsAllRowChecked(true)
      }
    } else {
      setSelectedRows([])
      checkedRows([])
      setSelectedData([])
      checkedRowsData([])
      setIsAllRowChecked(false)
    }
  }

  const handleRowCheckboxChange = (id: string, row: any): void => {
    const index = selectedRows.indexOf(id)
    if (index === -1) {
      setSelectedRows([...selectedRows, id])
      checkedRows([...selectedRows, id])

      setSelectedData([...selectedData, row])
      if (selectedData?.length >= 0) {
        setChecked(true)
      }
      checkedRowsData([...selectedData, row])
    } else {
      const updatedSelectedRows = [...selectedRows]
      updatedSelectedRows.splice(index, 1)
      checkedRows(updatedSelectedRows)
      setSelectedRows(updatedSelectedRows)

      const updatedSelectedData = selectedData.filter(item => item.id !== id)
      setSelectedData(updatedSelectedData)
      checkedRowsData(updatedSelectedData)
      if (selectedData?.length <= 1) {
        setChecked(false)
      }
    }
  }

  const renderLoadingState = (): JSX.Element => (
    <tbody>
      <tr>
        <td colSpan={columns.length + 3} className='text-center h-96'>
          <Loader />
        </td>
      </tr>
    </tbody>
  )
  const renderNoDataState = (): JSX.Element => (
    <tbody>
      <tr>
        <td colSpan={columns.length + 4} className='w-96 flex-1 items-center h-96'>
          <div className='ml-[50%] translate-x-[-10px]'>
            <Icon name='no-data' />
            <p className='text-gray-400 translate-x-[-14px]'>No data available</p>
          </div>
        </td>
      </tr>
    </tbody>
  )

  const filterDropdownItems = (secretType: components['schemas']['SecretType']): (typeof dropdownItems) => {
    return dropdownItems.filter((dropdownItem) => {
      return dropdownItem?.visibleFor?.includes(secretType)
    })
  }

  return (
    <div className='border rounded-lg h-450 my-8 sm:w-[450px] md:w-[650px] lg:w-full overflow-hidden w-[360px] overflow-x-auto '>
      <table className='table md:w-[625px] sm:w-[500px] lg:w-full '>
        <thead>
          <tr>
            <th>
              <CheckboxCell checked={selectAll} onChange={toggleSelectAll} />
            </th>
            {columns.map((column) => (
              <th className='text-sm font-semibold text-blacks' key={column.key}>{column.label}</th>
            ))}
            <th className='relative w-10' />
            <th className='text-sm font-semibold text-blacks'>Action</th>
          </tr>
        </thead>

        {isLoading
          ? (
              renderLoadingState()
            )
          : (
              (data?.length === 0 && !isLoading)
                ? (
                    renderNoDataState()
                  )
                : (
                  <tbody>
                    {data?.map((row, index) => (
                      <tr key={index} className='hover:bg-gray-100 z-[10]'>
                        <td>
                          <CheckboxCell
                            checked={selectedRows.includes(row.id)}
                            onChange={() => handleRowCheckboxChange(row.id, row)}
                          />
                        </td>
                        {columns.map((column) => (
                          <td key={column.key} onClick={column.key !== 'url' ? () => handleRowClick(row.id, row.type) : undefined}>
                            {(() => {
                              let icon = null
                              switch (column.key) {
                                case 'name':
                                  icon = typeIconMap[row.type]
                                  return (
                                    <div className='flex'>
                                      {icon !== undefined && <Icon name={icon} />}

                                      <div className='ml-2'>
                                        <p className='text-blacks text-sm font-semibold'>{row[column.key]}</p>
                                        <p className='text-blacks text-sm'>{row.username}</p>
                                      </div>
                                    </div>
                                  )
                                case 'createdAt':
                                  return (
                                    <div>
                                      <p className='text-blacks text-sm font-medium'>
                                        {timeAgo(new Date(row[column.key]))}
                                      </p>
                                    </div>
                                  )
                                case 'createdBy':
                                  return (
                                    <div className='flex'>
                                      <span className='bg-gray-1 rounded-md flex items-center h-6 px-3 '>
                                        {row[column.key]}
                                      </span>
                                    </div>
                                  )
                                case 'url':
                                  return (
                                    <div>
                                      <Link href={row[column.key]} className='text-blue-500 hover:underline' target='_blank' rel='noreferrer'>
                                        {row[column.key]}
                                      </Link>
                                    </div>
                                  )
                                default:
                                  return (
                                    <p className='text-blacks text-sm font-medium'>
                                      {row.collectionSecretModels?.slice(0, 2).map((collection: any, index: any) => (
                                        <span key={index}>
                                          {index > 0 && ', '}
                                          {collection.name}
                                        </span>
                                      ))}
                                      {row.collectionSecretModels != null && row.collectionSecretModels.length > 2 && (
                                        <>
                                          {' +'}
                                          {row.collectionSecretModels.length - 2}
                                        </>
                                      )}
                                    </p>
                                  )
                              }
                            })()}
                          </td>
                        ))}
                        <td />
                        <td className='flex justify-start ml-4'>
                          <Dropdown icon='ellipsis-horizontal' top='top-7' items={filterDropdownItems(row.type)} id={row.id} width='w-56' row={row.url} data={row} className='bg-gray-1 rounded-md h-6 w-6 flex justify-center' />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  )
            )}
      </table>
    </div>
  )
}

export default Table
