import { components } from '@/apptypes/api-schema'
import { typeIconMap, typeNormalize } from '@/lib/typeIconMapHelper'
import { useState } from 'react'
import Drawer from './Drawer'
import DynamicForm from './DynamicForm'
import Icon from './Icon'

interface SearchResultsCardProps {
  searchedData: any
  onClose: () => void
  isSearchModelOpen: boolean
}

interface SearchResultsCardProps {
  searchedData: any
  onClose: () => void
  isSearchModelOpen: boolean
}

const SearchCard = ({ searchedData, onClose, isSearchModelOpen }: SearchResultsCardProps): React.ReactNode => {
  if (!isSearchModelOpen) {
    return null
  }
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState('')
  const [searchType, setSearchType] = useState<components['schemas']['SecretType']>()
  const [isReload, setIsReload] = useState(false)
  const [id, setId] = useState('')

  const handleDrawerCloseClicked = (): void => {
    setId('')
    setIsDrawerOpen(false)
  }

  const handleReload = (): void => {
    setIsReload(!isReload)
  }

  const handleRowClick = (id: string, type: string): void => {
    setSearchType(type as components['schemas']['SecretType'])
    const title = typeNormalize(type)
    if (title !== undefined) {
      setDrawerTitle(`Edit ${title}`)
    }
    setId(id)
    setIsDrawerOpen(true)
  }

  return (
    <div className='card  bg-base-100 shadow-xl z-10 absolute w-full sm:w-[300px]'>
      <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={onClose}>✕</button>
      <div className='card-body'>
        {Object.keys(searchedData).length === 0
          ? (
            <p>No Data</p>
            )
          : (Object.keys(searchedData).map((type) => (
            <div key={type}>
              <h3 className='uppercase text-sm font-semibold px-2'>{type}</h3>
              {searchedData[type].map((item: any) => (
                <div key={item.id} className='flex flex-row items-center gap-2 py-3 px-2 rounded-md hover:bg-gray-100' onClick={() => handleRowClick(item.id, type)}>
                  <Icon name={typeIconMap[type]} />
                  <p>{item.name}</p>
                  <span className='bg-gray-1 rounded-md flex items-center h-6 px-3 '>
                    {item.createdBy}
                  </span>
                </div>
              ))}
            </div>
            )))}
      </div>
      <Drawer
        drawerOpen={isDrawerOpen}
        title={drawerTitle}
        handleClose={handleDrawerCloseClicked}
        width={searchType === 'environment_variables' ? 'w-[850px]' : 'w-full sm:w-1/3'}
      >
        <DynamicForm selectedType={searchType as Exclude<typeof searchType, undefined>} id={id} handleReload={handleReload} handleDrawerCloseClicked={handleDrawerCloseClicked} />

      </Drawer>
    </div>
  )
}

export default SearchCard
