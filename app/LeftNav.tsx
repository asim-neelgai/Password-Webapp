'use client'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import { VaultTypes } from '@/enums/enum'
import Icon from '@/components/Icon'
import { useContext, useEffect, useState } from 'react'
import Drawer from '@/components/Drawer'
import OrganizationForm from '@/components/OrganizationForm'
import { fetchOrganization } from './services/organizationService'
import { deleteCollection, fetchCollection } from './services/collectionService'
import EditCollection from '@/components/collectionActions/EditCollection'
import ShareCollection from '@/components/collectionActions/ShareCollection'
import DeleteCollection from '@/components/collectionActions/DeleteCollection'
import cognitoHelpers from '@/lib/cognitoHelpers'
import CollectionContext from './CollectionContext'
import NavBarContext from './NavBarContext'

type VaultData = {
  [key in VaultTypes]: { icon: React.ReactNode, href: string }
}
interface ReusableDrawerContentProps {
  onEditClick: () => void
  onShareClick: () => void
  onDeleteClick: () => void
}
const LeftNav = (): React.ReactNode => {
  const vaultData: VaultData = {
    [VaultTypes.AllVault]: { icon: <Icon name='home' />, href: '/vault' },
    [VaultTypes.MyVault]: { icon: <Icon name='person' />, href: '/vault' }
  }
  const [selectedTab, setSelectedTab] = useState<VaultTypes>()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [drawerTitle, setDrawerTitle] = useState<React.ReactNode>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCreateOrganizationClicked, setIsCreateOrganizationClicked] = useState<boolean>(false)
  const [organizations, setOrganizations] = useState<Array<{ name: string, id: string | number }>>([])
  const [collections, setCollections] = useState<Array<{ name: string, id: string }>>([])
  const [openCollection, setOpenCollection] = useState(false)
  const [openEditCollection, setOpenEditCollection] = useState(false)
  const [openShareCollection, setOpenShareCollection] = useState(false)
  const [openDeleteCollection, setOpenDeleteCollection] = useState(false)
  const [showBackArrow, setShowBackArrow] = useState(false)
  const [deleteCollections, setDeleteCollections] = useState(false)
  const [previousComponent, setPreviousComponent] = useState(false)

  const [collectionId, setCollectionId] = useState<string>('')
  const [collectionTitle, setCollectionTitle] = useState<string>('')
  const { collection, setCollection, setCollectionVaultId, setCollectionName } = useContext(CollectionContext)
  const { isOpen, setIsOpen } = useContext(NavBarContext)

  const fetchOrganizations = async (): Promise<void> => {
    const accessToken = await cognitoHelpers?.getToken()

    try {
      const fetchedOrganizations = await fetchOrganization(accessToken ?? '')
      if (fetchedOrganizations?.error !== undefined) {
        console.error('Error fetching organizations:')
      }
      setOrganizations(fetchedOrganizations?.data?.data)
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  useEffect(() => {
    void fetchOrganizations()
  }, [isCreateOrganizationClicked])

  const fetchCollections = async (): Promise<void> => {
    const accessToken = await cognitoHelpers?.getToken()

    try {
      const fetchedCollection = await fetchCollection(accessToken ?? '')
      if (fetchedCollection?.error !== undefined) {
        console.error('Error fetching collections:')
      }
      setCollections(fetchedCollection?.data?.data)
      setCollection(false)
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }
  useEffect(() => {
    void fetchCollections()
  }, [collection])

  const handleTabClick = (type: any): void => {
    setSelectedTab(type)
    setCollectionVaultId([])
    setCollectionName(type)
    setIsOpen(false)
  }

  const handleMouseEnter = (index: any): void => {
    setHoveredIndex(index)
  }

  const handleMouseLeave = (): void => {
    setHoveredIndex(null)
  }

  const handleClick = (collectionTitle: string, collectionId: string): void => {
    const icon = <Icon name='fi-rr-folder-1' />
    const drawerTitleElement = (
      <div className='flex items-center'>
        {icon}
        <span className='ml-4 text-xl font-medium'>{collectionTitle}</span>
      </div>
    )
    setDrawerTitle(drawerTitleElement)
    setCollectionTitle(collectionTitle)
    setIsDrawerOpen(true)
    setOpenCollection(true)
    setIsCreateOrganizationClicked(false)
    setOpenEditCollection(false)
    setOpenShareCollection(false)
    setCollectionId(collectionId)
    setShowBackArrow(false)
    setPreviousComponent(false)
    setDeleteCollections(false)
  }

  const handleCreateOrganizationClick = (): void => {
    const icon = <Icon name='fi-rr-building' />
    const drawerTitleElement = (
      <div className='flex items-center'>
        {icon}
        <span className='ml-4 text-xl font-medium'>Create Organization</span>
      </div>
    )
    setDrawerTitle(drawerTitleElement)
    setIsCreateOrganizationClicked(true)
    setOpenCollection(false)
    setIsDrawerOpen(false)
  }

  const handleDrawerCloseClicked = (): void => {
    setIsDrawerOpen(false)
  }
  const onEditClick = (): void => {
    setOpenEditCollection(true)
    setOpenShareCollection(false)
    setShowBackArrow(true)
    setOpenDeleteCollection(false)
    setPreviousComponent(false)
    setDeleteCollections(false)
  }
  const onShareClick = (): void => {
    setOpenShareCollection(true)
    setOpenEditCollection(false)
    setShowBackArrow(true)
    setOpenDeleteCollection(false)
    setPreviousComponent(false)
    setDeleteCollections(false)
  }
  const onDeleteClick = (): void => {
    setOpenDeleteCollection(true)
    setOpenShareCollection(false)
    setOpenEditCollection(false)
    setShowBackArrow(true)
    setDeleteCollections(true)
    setPreviousComponent(false)
  }

  const handleDelete = async (id: string): Promise<void> => {
    const accessToken = await cognitoHelpers?.getToken()
    try {
      const result = await deleteCollection(id, accessToken ?? '')
      if (result?.data?.status === 204) {
        const updatedCollection = collections?.filter((item: { id: string }) => item?.id !== id)
        setCollections(updatedCollection)
        setOpenDeleteCollection(false)
        setPreviousComponent(false)
        setOpenDeleteCollection(false)
        setIsDrawerOpen(false)
      }
    } catch (error) {
      console.error('Error updating collection:', error)
    }
  }

  const renderFolderActions = (): any => {
    const commonContent = (
      <>
        <div className='flex flex-row w-full justify-between'>
          <button className='text-blacks font-medium text-base leading-4' onClick={onEditClick}>Edit Collection</button>
          <Icon name='chevron-right' />
        </div>
        <div className='flex flex-row justify-between w-full'>
          <button className='text-blacks font-medium text-base leading-4' onClick={onShareClick}>Share Collection</button>
          <Icon name='chevron-right' />
        </div>
        <button className='text-error font-medium text-base leading-4' onClick={onDeleteClick}>Delete Collection</button>
      </>
    )

    if (openEditCollection) {
      return (
        <Drawer drawerOpen={isDrawerOpen} title='Edit Collection' handleClose={handleDrawerCloseClicked} backArrow={showBackArrow} handleBackClick={handleBackClick} width='w-full'>
          <div className='flex flex-col items-start ml-[30px] gap-y-9 mt-4 mr-[30px]'>
            <EditCollection handleCloseDrawer={handleDrawerCloseClicked} id={collectionId} name={collectionTitle} />
          </div>
        </Drawer>
      )
    } else if (openShareCollection) {
      return (
        <Drawer drawerOpen={isDrawerOpen} title='Share Collection' handleClose={handleDrawerCloseClicked} backArrow={showBackArrow} handleBackClick={handleBackClick} width='w-full'>
          <div className='flex flex-col items-start ml-[30px] gap-y-9 mt-4 mr-[30px]'>
            <ShareCollection handleCloseDrawer={handleDrawerCloseClicked} id={null} />
          </div>
        </Drawer>
      )
    } else {
      return commonContent
    }
  }
  const handleBackClick = (): void => {
    setPreviousComponent(true)
  }

  const handleCollectionClick = (collection: any): void => {
    setCollectionName(collection?.name)
    setIsOpen(false)
  }

  const ReusableDrawerContent = ({ onEditClick, onShareClick, onDeleteClick }: ReusableDrawerContentProps): React.ReactNode => {
    return (
      <div className='flex flex-col items-start ml-[30px] gap-y-9 mt-4 mr-[30px] z-20 w-full'>
        <div className='flex flex-row w-full justify-between'>
          <button className='text-blacks font-medium text-base leading-4' onClick={onEditClick}>Edit Collection</button>
          <Icon name='chevron-right' />
        </div>
        <div className='flex flex-row justify-between w-full'>
          <button className='text-blacks font-medium text-base leading-4' onClick={onShareClick}>Share Collection</button>
          <Icon name='chevron-right' />
        </div>
        <button className='text-error font-medium text-base leading-4' onClick={onDeleteClick}>Delete Collection</button>
      </div>
    )
  }

  return (
    <>
      <div className='h-full sm:flex sm:flex-col hidden sm:w-[100px] md:w-[120px] lg:w-[270px]'>
        <div className='navbar w-full ml-5 sm:w-20 '>
          <div className='flex-none'>
            <Link href='/' className='max-w-full lg:w-[140px] md:w-32 sm:w-20 '>
              <Image src={logo} alt='Fort Lock logo' priority className='lg:w-60 max-w-full h-auto hidden sm:block sm:w-20' />
            </Link>
          </div>
          <div className='flex-1 ml-4 md:ml-16 lg:ml-10'>
            <button className='btn btn-square btn-ghost'>
              <Icon name='fi-rr-menu-burger' />
            </button>
          </div>

        </div>
        <div className='flex-grow m-3'>
          <ul>
            <div className='text-white uppercase ml-5 mt-5 mb-3 text-xs '>Vault Menu</div>
            {Object.entries(vaultData).map(([type, { icon, href }]) => (
              <li key={type} className=' hover:bg-darkblue rounded-xl transition-all duration-100 ease-in-out'>
                <Link href={href} className='cursor-pointer py-3 pl-5  rounded-xl flex items-center' onClick={() => handleTabClick(type)}>
                  <span className='flex items-center mr-4'>{icon}</span>
                  <span className='text-white text-base'>{type}</span>
                </Link>
              </li>
            ))}
            <ul className='overflow-y-auto max-h-36' style={{ scrollbarWidth: 'thin', scrollbarColor: 'white #3661eb' }}>
              {organizations?.map((organization) => (
                <li key={organization?.id}>
                  <button className='cursor-pointer pl-5 py-3 rounded-xl flex items-center hover:bg-darkblue relative w-full' onClick={() => handleTabClick(organization?.name)}>
                    <span><Icon name='fi-rr-building-white' /></span>
                    <span className='text-white ml-4'>{organization?.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </ul>
          {
          collections?.length > 0 && (
            <div className='flex items-center justify-start mt-6'>
              <div className='text-white uppercase pl-5 text-xs'>Collections</div>
              {selectedTab
                ? (
                  <div className='bg-darkblue ml-3 rounded h-6 flex items-center justify-center w-full sm:w-auto'>
                    <div className='text-white text-xs p-2'>{selectedTab}</div>
                  </div>
                  )
                : null}
            </div>

          )
        }

          <ul className='mt-2 overflow-y-auto max-h-72' style={{ scrollbarWidth: 'thin', scrollbarColor: 'white #3661eb' }}>
            {
            collections?.map((collection, index) => (
              <li key={collection?.id}>
                <Link
                  href={`/vault/collection?id=${collection?.id}`}
                  className='cursor-pointer pl-5 py-3 rounded-xl flex items-center hover:bg-darkblue relative w-full transition-all duration-100 ease-in-out' onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleCollectionClick(collection)}
                >
                  <span><Icon name='fi-rr-folder' /></span>
                  <span className='text-white ml-4'>{collection?.name}</span>

                  {hoveredIndex === index && (

                    <button onClick={() => handleClick(collection?.name, collection?.id)} className=' absolute right-5'>
                      <Icon name='setting' />
                    </button>
                  )}
                </Link>
              </li>
            ))
          }

          </ul>
        </div>
        <button onClick={handleCreateOrganizationClick} type='submit' className='bg-darkblue text-white border-darkblue hover:bg-darkerblue hover:border-darkerblue w-full p-2 sm:w-auto mb-4 mx-3 flex items-center justify-center h-12 rounded-xl'>
          <Icon name='add' />
          <h5 className='ml-4 text-base'>New Organization</h5>
        </button>
        <Drawer drawerOpen={isCreateOrganizationClicked} title={drawerTitle} handleClose={() => setIsCreateOrganizationClicked(false)} backArrow={showBackArrow} handleBackClick={handleBackClick} width='w-[85%] sm:w-1/3'>
          <OrganizationForm handleCloseDrawer={() => setIsCreateOrganizationClicked(false)} />
        </Drawer>
        <Drawer drawerOpen={isDrawerOpen} title={drawerTitle} handleClose={handleDrawerCloseClicked} backArrow={showBackArrow} handleBackClick={handleBackClick} width='w-1/3'>
          {openCollection && (
            <div className='flex flex-col items-start ml-[30px] gap-y-9 mt-4 mr-[30px] z-10'>
              {renderFolderActions()}
            </div>
          )}
        </Drawer>
        {
        previousComponent && (
          <Drawer drawerOpen={isDrawerOpen} title={drawerTitle} handleClose={handleDrawerCloseClicked} handleBackClick={handleBackClick} width='w-1/3'>
            <ReusableDrawerContent onEditClick={onEditClick} onShareClick={onShareClick} onDeleteClick={onDeleteClick} />
          </Drawer>
        )
      }

        {
      deleteCollections && (
        <>
          <Drawer drawerOpen={isDrawerOpen} title={drawerTitle} handleClose={handleDrawerCloseClicked} handleBackClick={handleBackClick} width='w-1/3'>
            <ReusableDrawerContent onEditClick={onEditClick} onShareClick={onShareClick} onDeleteClick={onDeleteClick} />
          </Drawer>
          <DeleteCollection openDeleteCollection={openDeleteCollection} id={collectionId} handleDelete={handleDelete} handleDrawerClose={() => setOpenDeleteCollection(false)} />
        </>
      )
     }
      </div>
      <Drawer drawerOpen={isOpen} handleClose={() => setIsOpen(false)} title='' fromLeftNav width='w-[85%]'>
        <div className='sm:flex sm:flex-col sm:w-[280px] overflow-hidden'>
          <div className='navbar w-full ml-5 sm:w-20 '>
            <div className='flex'>
              <Link href='/' className='md:w-32 sm:w-20 max-w-full'>
                <Icon name='logo' />
              </Link>
            </div>

          </div>
          <div className='flex-grow m-3 relative'>
            <ul>
              <div className='text-white uppercase ml-5 mt-5 mb-3 text-xs '>Vault Menu</div>
              {Object.entries(vaultData).map(([type, { icon, href }]) => (
                <li key={type} className=' hover:bg-darkblue rounded-xl transition-all duration-100 ease-in-out'>
                  <Link href={href} className='cursor-pointer py-3 pl-5  rounded-xl flex items-center' onClick={() => handleTabClick(type)}>
                    <span className='flex items-center mr-4'>{icon}</span>
                    <span className='text-white text-base'>{type}</span>
                  </Link>
                </li>
              ))}
              <ul className='overflow-y-auto max-h-36' style={{ scrollbarWidth: 'thin', scrollbarColor: 'white #3661eb' }}>
                {organizations?.map((organization) => (
                  <li key={organization?.id}>
                    <button className='cursor-pointer pl-5 py-3 rounded-xl flex items-center hover:bg-darkblue relative w-full' onClick={() => handleTabClick(organization?.name)}>
                      <span><Icon name='fi-rr-building-white' /></span>
                      <span className='text-white ml-4'>{organization?.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </ul>
            {
          collections?.length > 0 && (
            <div className='flex items-center justify-start mt-6'>
              <div className='text-white uppercase pl-5 text-xs'>Collections</div>
              {selectedTab
                ? (
                  <div className='bg-darkblue ml-3 rounded h-6 flex items-center justify-center  sm:w-auto'>
                    <div className='text-white text-xs p-2'>{selectedTab}</div>
                  </div>
                  )
                : null}
            </div>

          )
}
            <ul className='mt-2 overflow-y-auto max-h-72' style={{ scrollbarWidth: 'thin', scrollbarColor: 'white #3661eb' }}>
              {
            collections?.map((collection, index) => (
              <li key={collection?.id}>
                <button
                  className='cursor-pointer pl-5 py-3 rounded-xl flex items-center hover:bg-darkblue relative w-full transition-all duration-100 ease-in-out' onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave} onClick={() => handleCollectionClick(collection)}
                >
                  <span><Icon name='fi-rr-folder' /></span>
                  <span className='text-white ml-4'>{collection?.name}</span>

                  {hoveredIndex === index && (

                    <button onClick={() => handleClick(collection?.name, collection?.id)} className=' absolute right-5'>
                      <Icon name='setting' />
                    </button>
                  )}
                </button>
              </li>
            ))
          }

            </ul>
          </div>
          <button onClick={handleCreateOrganizationClick} type='submit' className='bg-darkblue text-white border-darkblue hover:bg-darkerblue hover:border-darkerblue w-[300px] p-2 sm:w-auto mb-4 ml-6  flex items-center justify-center h-12 rounded-xl absolute bottom-10'>
            <Icon name='add' />
            <h5 className='ml-4 text-sm md:text-base lg:text-base'>New Organization</h5>
          </button>
          <Drawer drawerOpen={isCreateOrganizationClicked} title={drawerTitle} handleClose={() => setIsCreateOrganizationClicked(false)} backArrow={showBackArrow} handleBackClick={handleBackClick} fromLeftNav={false} width='w-full'>
            <OrganizationForm handleCloseDrawer={() => setIsCreateOrganizationClicked(false)} />
          </Drawer>
          <Drawer drawerOpen={isDrawerOpen} title={drawerTitle} handleClose={handleDrawerCloseClicked} backArrow={showBackArrow} handleBackClick={handleBackClick} width='w-full' fromLeftNav={false}>
            {openCollection && (
              <div className='flex flex-col items-start ml-[30px] gap-y-9 mt-4 mr-[30px]'>
                {renderFolderActions()}
              </div>
            )}
          </Drawer>
          {
        previousComponent && (
          <Drawer drawerOpen={isDrawerOpen} title={drawerTitle} handleClose={handleDrawerCloseClicked} handleBackClick={handleBackClick} width='w-full' fromLeftNav={false}>
            <ReusableDrawerContent onEditClick={onEditClick} onShareClick={onShareClick} onDeleteClick={onDeleteClick} />
          </Drawer>
        )
      }

          {
      deleteCollections && (
        <>
          <Drawer drawerOpen={isDrawerOpen} title={drawerTitle} handleClose={handleDrawerCloseClicked} handleBackClick={handleBackClick} width='w-full'>
            <ReusableDrawerContent onEditClick={onEditClick} onShareClick={onShareClick} onDeleteClick={onDeleteClick} />
          </Drawer>
          <DeleteCollection openDeleteCollection={openDeleteCollection} id={collectionId} handleDelete={handleDelete} handleDrawerClose={() => setOpenDeleteCollection(false)} />
        </>
      )
     }
        </div>
      </Drawer>
    </>
  )
}

export default LeftNav
