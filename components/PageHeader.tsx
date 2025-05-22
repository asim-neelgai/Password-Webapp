'use client'
import AddItemButton from '@/public/add-item.svg'
import Image from 'next/image'
import { MenuBarVaultTypes } from '@/enums/enum'
import Dropdown, { DropdownItem } from './Dropdown'
import Icon from './Icon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext, useEffect, useRef, useState } from 'react'
import CollectionForm from './CollectionForm'
import Drawer from './Drawer'
import CollectionContext from '@/app/CollectionContext'
import VaultDataContext from '@/app/VaultDataContext'

interface PageHeaderProps {
  title?: string
  addNewItemPressed?: any
  moveToCollectionPressed?: any
  shareViaEmailPressed?: any
  singleUseLinkPressed?: any
  deleteItemPressed?: any
  fromCollection?: boolean
}

type VaultData = {
  [key in MenuBarVaultTypes]: { href: string };
}

const PageHeader = ({ title, addNewItemPressed, moveToCollectionPressed, shareViaEmailPressed, singleUseLinkPressed, deleteItemPressed, fromCollection }: PageHeaderProps): React.ReactNode => {
  const { collectionVaultId } = useContext(CollectionContext)

  const vaultData: VaultData = {
    [MenuBarVaultTypes.All]: { href: collectionVaultId?.length > 0 ? `/vault?id=${collectionVaultId}` : '/vault' },
    [MenuBarVaultTypes.Passwords]: { href: collectionVaultId?.length > 0 ? `/vault/passwords?id=${collectionVaultId}` : '/vault/passwords' },
    [MenuBarVaultTypes.SecureNotes]: { href: collectionVaultId?.length > 0 ? `/vault/secure-notes?id=${collectionVaultId}` : '/vault/secure-notes' },
    [MenuBarVaultTypes.BankAccounts]: { href: collectionVaultId?.length > 0 ? `/vault/bank-accounts?id=${collectionVaultId}` : '/vault/bank-accounts' },
    [MenuBarVaultTypes.PaymentCards]: { href: collectionVaultId?.length > 0 ? `/vault/payment-cards?id=${collectionVaultId}` : '/vault/payment-cards' },
    [MenuBarVaultTypes.Addresses]: { href: collectionVaultId?.length > 0 ? `/vault/addresses?id=${collectionVaultId}` : '/vault/addresses' },
    [MenuBarVaultTypes.EnvVariables]: { href: collectionVaultId?.length > 0 ? `/vault/environmentvariables?id=${collectionVaultId}` : '/vault/environmentvariables' }
  }
  const pathName = usePathname()
  const [showDropDown, setShowDropDown] = useState(false)
  const [openCollectionForm, setOpenCollectionForm] = useState(false)
  const [darwerTitle, setDrawerTitle] = useState<React.ReactNode | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { checked, isAllRowChecked } = useContext(VaultDataContext)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: any): any => {
    const buttonClicked = event.target.closest('.dropdown-button') as HTMLElement
    if (
      (dropdownRef.current === null || !dropdownRef.current.contains(event.target as Node)) &&
      buttonClicked === null
    ) {
      setIsOpen(false)
      setShowDropDown(false)
    }
  }
  useEffect(() => {
    if (showDropDown || isOpen) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showDropDown, isOpen])

  const dropdownItems: DropdownItem[] = [
    {
      icon: <Icon name='move-to-collection' />,
      content: 'Move To Collection',
      onClick: () => handleMoveToCollection(),
      visibleFor: []

    },
    {
      icon: <Icon name='share-via-email' />,
      content: 'Share via Email',
      onClick: () => handleShareViaEmail(),
      visibleFor: []

    },
    {
      icon: <Icon name='fi-rr-trash' />,
      content: 'Delete',
      onClick: () => handleDeleteItem(),
      visibleFor: []

    }
  ]

  const handleAddClicked = (): void => {
    setShowDropDown(true)
    setOpenCollectionForm(false)
  }
  const handleMoveToCollection = (): void => {
    moveToCollectionPressed()
  }
  const handleShareViaEmail = (): void => {
    shareViaEmailPressed()
  }
  const handleDeleteItem = (): any => {
    deleteItemPressed()
  }

  const handleDarwerTitle = (): void => {
    const icon = <Icon name='fi-rr-folder-1' />
    const drawerTitleElement = (
      <div className='flex items-center'>
        {icon}
        <span className='ml-4 text-xl font-medium'>Add Collection</span>
      </div>
    )
    setDrawerTitle(drawerTitleElement)
    setOpenCollectionForm(true)
  }

  const stripId = (url: string): string => {
    const parts = url.split('?')
    return parts[0]
  }

  return (
    <div className='pl-1 w-full'>
      <div className='flex sm:flex-row flex-col sm:justify-between sm:items-center mt-4 gap-2 sm:gap-0 '>
        {title
          ? (
            <h1 className='text-xl text-blacks'>{title}</h1>
            )
          : (
            <h1 className='text-xl text-blacks'>All Vaults</h1>
            )}
        <div className='flex gap-2 mt-4 sm:mt-0 mb-4 sm:mb-0'>
          {(checked || isAllRowChecked) && (
            <Dropdown buttonTitle='Actions' icon='dropdown' top='top-14 sm:top-12' width='w-56' items={dropdownItems} showIcon className='border-2 border-gray-200' />
          )}
          <button className='bg-primary text-white hover hover:bg-blue-800 w-12 h-12 flex justify-center items-center rounded-lg ' onClick={handleAddClicked}>
            <Image src={AddItemButton} alt='' />
          </button>
          {
        showDropDown && (
          <div className='absolute flex flex-col px-5 py-4  mt-14 right-10 items-start h-24 rounded-xl border-[1px] gap-4 w-[260px] bg-base-100 z-10' ref={dropdownRef}>
            <button onClick={() => addNewItemPressed()} className='flex flex-row justify-start gap-4 hover:bg-gray-100 w-full h-[48px]  '>
              <Icon name='fi-rr-file-add' />
              <p>Add Item</p>
            </button>
            <button onClick={handleDarwerTitle} className='flex flex-row justify-start gap-4 hover:bg-gray-100 w-full h-full'>
              <Icon name='fi-rr-folder-2' />
              <p>Add Collection</p>
            </button>
            <Drawer drawerOpen={openCollectionForm} title={darwerTitle} handleClose={() => setOpenCollectionForm(false)} width='w-full sm:w-1/3'>
              <CollectionForm handleDrawerCloseClicked={() => setOpenCollectionForm(false)} />
            </Drawer>
          </div>
        )
      }
        </div>
      </div>

      <div className=' items-center mt-2 border-b-2 hidden  md:flex lg:flex'>
        <ul className='flex items-center'>

          {Object.entries(vaultData).map(([type, { href }]) => (
            <li key={type} className={`mb-[-2px]  ${href === pathName || stripId(href) === stripId(pathName) ? 'border-b-2 active border-primary text-primary' : ''}`}>
              <Link
                href={href}
                className='cursor-pointer rounded flex items-center active:text-primary'
              >
                <span className='p-4 text-sm'>{type}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className='border-[1px] border-secondary rounded-md flex justify-start px-5 items-center w-[200px] h-[32px] mt-5 sm:hidden relative' onClick={() => setIsOpen(!isOpen)}>
        <button className='dropdown-button flex justify-between items-center gap-2 flex-grow'>
          <span className='text-sm flex flex-row justify-center'>
            {Object.entries(vaultData).find(([_, { href }]) => href === pathName)?.[0]}
          </span>
          <Icon name='caret-down' className='w-4 h-4' />

        </button>
        <div className='z-10 '>
          {isOpen && (
            <ul className='absolute -left-4 top-6 mt-4 bg-base-100 w-[250px] border border-gray-100 rounded-lg overflow-hidden shadow-md ml-4 overflow-y-auto h-[200px]'>
              {Object.entries(vaultData).map(([type, { href }]) => (
                <li
                  key={type}
                  className={`p-4 ${
                  href === pathName ? ' text-primary' : ''
                }`}
                >
                  <Link href={href}>{type}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageHeader
