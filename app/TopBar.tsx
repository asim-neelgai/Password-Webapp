'use client'
import Drawer from '@/components/Drawer'
import Dropdown, { type DropdownItem } from '@/components/Dropdown'
import Icon from '@/components/Icon'
import SearchIcon from '@/components/SearchIcon'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import Settings from './Settings'
import Loader from '@/components/Loader'
import VaultDataContext from './VaultDataContext'
import { TableRow } from '@/apptypes/keys'
import SearchCard from '@/components/SearchCard'
import NavBarContext from './NavBarContext'
import LeftNav from './LeftNav'

const TopBar = (): React.ReactNode => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchedData, setSearchedData] = useState<TableRow>([])
  const [searchInput, setSearchInput] = useState('')

  const router = useRouter()
  const { data } = useSession()
  const { vaultData } = useContext(VaultDataContext)
  const { setIsOpen, isOpen } = useContext(NavBarContext)
  const [isSearchModelOpen, setIsSearchModelOpen] = useState(false)

  const dropdownItems: DropdownItem[] = [
    {
      icon: <Icon name='fi-rr-settings' />,
      content: 'Settings',
      onClick: () => setIsDrawerOpen(true),
      visibleFor: []
    },
    {
      icon: <Icon name='fi-rr-sign-out' />,
      content: 'Log Out',
      onClick: () => {
        void signOut({ redirect: false })
          .then(() => {
            router.push('/')
          })
      },
      visibleFor: []

    }
  ]

  const handleDrawerCloseClicked = (): void => {
    setIsDrawerOpen(false)
  }

  const handleSearchModelCloseClicked = (): void => {
    setIsSearchModelOpen(false)
    setSearchedData([])
    setSearchInput('')
  }

  const initials = (): string | undefined => {
    const nameParts = data?.user?.cognitoUser?.split(' ')
    if (nameParts != null) {
      const firstName = nameParts?.length > 0 ? nameParts[0].charAt(0) : ''
      const lastName = nameParts?.length > 1 ? nameParts[1].charAt(0) : ''
      return firstName + lastName
    }
  }
  const handleSearch = (event: any): void => {
    setSearchInput(event.target.value)
    setIsSearchModelOpen(true)
    const searchText = event.target.value.toLowerCase()
    if (searchText.length === 0) {
      setSearchedData([])
      setIsSearchModelOpen(false)
      return
    }

    const filteredData = vaultData.filter(item =>
      [item.name, item.url, item.username, item.notes].some(property =>
        typeof property === 'string' && property.toLowerCase().includes(searchText)
      )
    )
    const groupedData: Record<string, any[]> = filteredData.reduce((acc, { type, ...rest }) => {
      acc[type] = [...(acc[type] || []), rest]
      return acc
    }, {})
    setSearchedData(groupedData)
  }
  const handleClick = (): void => {
    setIsOpen(true)
  }
  return (
    <div>
      <div className='flex relative flex-row mb-4 w-full'>
        <button onClick={handleClick} className='z-10 sm:hidden block mr-7 '>
          <Icon name='fi-rr-menu-burger1' className='w-[24px] h-[24px]' />
        </button>
        <div className='sm:flex-grow relative w-[220px]  md:w-280px] lg:w-[300px]'>
          <SearchIcon />
          <input type='text' placeholder='Search vaults...' className='input input-bordered w-full max-w-xs pl-12 rounded-xl' value={searchInput} onChange={handleSearch} />
        </div>

        <div role='button' className='flex flex-row hover:cursor-pointer dropdown dropdown-end items-center ml-10 sm:ml-0' tabIndex={0}>
          <div>
            {data?.user?.cognitoEmail === undefined && <Loader />}
            <div className='text-right hidden md:block lg:block'>{data?.user?.cognitoUser}</div>
            <div className='text-right text-xs text-gray-400 hidden md:block lg:block'>{data?.user.cognitoEmail}</div>
          </div>
          <div className='avatar placeholder ml-4 mr-2'>
            <div className='bg-gray-200 rounded-full w-12 h-12'>
              <span className='text-xl'>
                {initials()}
              </span>
            </div>
          </div>

          <Dropdown icon='caret-down' top='top-10' items={dropdownItems} className='w-4 h-4' />
        </div>

      </div>
      <Drawer drawerOpen={isDrawerOpen} title='Settings' handleClose={handleDrawerCloseClicked} width='w-full sm:w-1/3'>
        <Settings />
      </Drawer>
      <SearchCard
        searchedData={searchedData}
        onClose={() => handleSearchModelCloseClicked()}
        isSearchModelOpen={isSearchModelOpen}
      />
      {isOpen && <LeftNav />}
      <div className='border-b-[1px] border-secondary' />
    </div>

  )
}

export default TopBar
