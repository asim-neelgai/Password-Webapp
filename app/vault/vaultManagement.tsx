'use client'
import VaultDataContext from '@/app/VaultDataContext'
import { deleteBulkVault } from '@/app/services/vaultService'
import { components } from '@/apptypes/api-schema'
import { TableColumn, TableRow } from '@/apptypes/keys'
import CollectionForm from '@/components/CollectionForm'
import ConfirmModal from '@/components/ConfirmModal'
import Drawer from '@/components/Drawer'
import { DropdownItem } from '@/components/Dropdown'
import DynamicForm from '@/components/DynamicForm'
import Icon from '@/components/Icon'
import PageHeader from '@/components/PageHeader'
import Table from '@/components/Table'
import { typeNormalize } from '@/lib/typeIconMapHelper'
import { getSession } from 'next-auth/react'
import React, { useContext, useState } from 'react'
import ItemDrawer from './itemDrawer'
import Pagination from './pagination'
import OneTimeShareModal from '@/components/OneTimeShareModal'
import CollectionContext from '../CollectionContext'

interface VaultManagementProps {
  columns: TableColumn[]
  pageSize: number
  type?: components['schemas']['SecretType']
  collectionId?: string
}
const excludedPropertiesInOneTimeShare = ['id', 'content', 'isShared', 'createdAt', 'createdBy', 'collectionSecretModels', 'type', 'dropdownItems']

const VaultManagement = ({ columns, pageSize, type, collectionId }: VaultManagementProps): React.ReactNode => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [openCollectionForm, setOpenCollectionForm] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState<React.ReactNode | null>(null)
  const [checkedRowsId, setCheckedRowsId] = useState<string[]>([])
  const [checkedRowsData, setCheckedRowsData] = useState<[] | any[]>([])
  const [id, setId] = useState('')
  const [selectedType, setSelectedType] = useState<components['schemas']['SecretType']>()
  const [showOneTimeShareModal, setShowOneTimeShareModal] = useState(false)
  const [selectedData, setSelectedData] = useState('')
  const [copiedContent, setCopiedContent] = useState<{ [key: string]: boolean }>({})

  const { vaultData, setVaultData, isLoading, isReload, setIsReload, setDrawerClose, drawerClose, setShowModal } = useContext(VaultDataContext)
  const { collectionVaultId, collectionName } = useContext(CollectionContext)

  let response: Array<TableRow & { dropdownItems: DropdownItem[] }> = vaultData.map(vd => ({
    ...vd,
    dropdownItems: []
  }))
  if (collectionVaultId.length > 0) {
    if (type !== undefined) {
      response = vaultData.filter(item =>
        item.type === type &&
            item.collectionSecretModels.some((model: any) => collectionVaultId.includes(model.collectionId))
      ).map(filteredItem => ({
        ...filteredItem,
        dropdownItems: []
      }))
    } else {
      response = vaultData.filter(item =>
        item.collectionSecretModels.some((model: any) => collectionVaultId.includes(model.collectionId))
      ).map(filteredItem => ({
        ...filteredItem,
        dropdownItems: []
      }))
    }
  } else if (type !== undefined) {
    response = vaultData
      .filter(item => item.type === type)
      .map(filteredItem => ({
        ...filteredItem,
        dropdownItems: []
      }))
  }
  const totalItems = response.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const renderData = (): TableRow[] => {
    const startIdx = (currentPage - 1) * pageSize
    const endIdx = Math.min(startIdx + pageSize, totalItems)
    return response.slice(startIdx, endIdx)
  }
  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }
  const dropdownItems: DropdownItem[] = [
    {
      icon: <Icon name='website' />,
      content: 'Go to website',
      onClick: (id, row) => {
        window.open(row, '_blank')
      },
      visibleFor: ['password']
    },
    {
      icon: <Icon name='fi-rr-copy-alt' />,
      content: copiedContent.username ? 'Username Copied' : 'Copy Username',
      onClick: (id, row, data): void => {
        copyToClipboard(data?.username)
          .then(() => {
            setCopiedContent({ ...copiedContent, username: true })
            setTimeout(() => {
              setCopiedContent({})
            }, 1500)
          })
          .catch((error) => {
            console.error('Failed to copy username:', error)
          })
      },
      visibleFor: ['password']
    },
    {
      icon: <Icon name='fi-rr-copy-alt' />,
      content: copiedContent.password ? 'Password Copied' : 'Copy Password',
      onClick: (id, row, data): void => {
        copyToClipboard(data?.password)
          .then(() => {
            setCopiedContent({ ...copiedContent, password: true })
            setTimeout(() => {
              setCopiedContent({})
            }, 1500)
          })
          .catch((error) => {
            console.error('Failed to copy password:', error)
          })
      },
      visibleFor: ['password']
    },
    {
      icon: <Icon name='fi-rr-copy-alt' />,
      content: copiedContent.accountNumber ? 'Account Number Copied' : 'Copy Account Number',
      onClick: (id, row, data): void => {
        copyToClipboard(data?.accountType)
          .then(() => {
            setCopiedContent({ ...copiedContent, accountNumber: true })
            setTimeout(() => {
              setCopiedContent({ ...copiedContent, accountNumber: true })
            }, 1500)
          })
          .catch((error) => {
            console.error('Failed to copy account number:', error)
          })
      },
      visibleFor: ['bank_accounts']
    },
    {
      icon: <Icon name='fi-rr-copy-alt' />,
      content: copiedContent.firstAddress ? 'Addresses Copied' : 'Copy Addresses',
      onClick: (id, row, data): void => {
        copyToClipboard(data?.firstAddress)
          .then(() => {
            setCopiedContent({ ...copiedContent, firstAddress: true })
            setTimeout(() => {
              setCopiedContent({})
            }, 1500)
          })
          .catch((error) => {
            console.error('Failed to copy addresses:', error)
          })
      },
      visibleFor: ['addresses']
    },
    {
      icon: <Icon name='fi-rr-copy-alt' />,
      content: copiedContent.securityCode ? 'Security Code Copied' : 'Copy Security Code',
      onClick: (id, row, data): void => {
        copyToClipboard(data?.securityCode)
          .then(() => {
            setCopiedContent({ ...copiedContent, securityCode: true })
            setTimeout(() => {
              setCopiedContent({})
            }, 1500)
          })
          .catch((error) => {
            console.error('Failed to copy security code:', error)
          })
      },
      visibleFor: ['payment_card']
    },
    {
      icon: <Icon name='email' />,
      content: 'Share Via Email',
      onClick: () => alert('Item 4 clicked'),
      visibleFor: ['password', 'addresses', 'bank_accounts', 'environment_variables', 'payment_card', 'secure_notes']
    },
    {
      icon: <Icon name='link' />,
      content: 'Single Use Link',
      onClick: (id, row, data) => {
        setShowOneTimeShareModal(true)
        const valuesString: string = mapSecrets(data)
        setSelectedData(valuesString)
        setShowModal(true)
      },
      visibleFor: ['password', 'addresses', 'bank_accounts', 'environment_variables', 'payment_card', 'secure_notes']
    },
    {
      icon: <Icon name='fi-rr-trash' />,
      content: 'Delete',
      onClick: (id) => {
        if (id !== undefined) {
          setCheckedRowsId([id])
          setShowDeleteModal(true)
        }
      },
      visibleFor: ['password', 'addresses', 'bank_accounts', 'environment_variables', 'payment_card', 'secure_notes']
    }
  ]

  const copyToClipboard = async (text: string | undefined): Promise<void> => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text)
      } catch (error) {
        console.error('Failed to copy text:', error)
      }
    }
  }

  const handleAddItemClicked = (): void => {
    setDrawerTitle('Add Items')
    setId('')
    setIsDrawerOpen(true)
    setDrawerClose(false)
  }
  const handleAddCollectionClicked = (): void => {
    setOpenCollectionForm(true)
    const icon = <Icon name='fi-rr-folder-1' />
    const drawerTitleElement = (
      <div className='flex items-center'>
        {icon}
        <span className='ml-4 text-xl font-medium'>Add Collection</span>
      </div>
    )
    setDrawerTitle(drawerTitleElement)
  }

  const handleTableRowClicked = (id: string, type: string): void => {
    if (type === undefined) return
    setSelectedType(type as components['schemas']['SecretType'])

    const title = typeNormalize(type)

    setDrawerTitle(`Edit ${title as string}`)
    setIsFormOpen(true)
    setId(id)
  }

  const handleDeleteClicked = async (): Promise<void> => {
    setShowDeleteModal(false)
    const session = await getSession()
    if (checkedRowsId !== undefined && checkedRowsId.length > 0) {
      const response = await deleteBulkVault(
        checkedRowsId,
        session !== null ? session?.user.accessToken : ''
      )
      if (response.error !== undefined) {
        console.log('Delete failed' + String(response.error.message))
        return
      }
      const updatedArray = vaultData.filter(
        (item) => !checkedRowsId.includes(item.id)
      )
      setVaultData(updatedArray)
      if (updatedArray.length === 0) {
        setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)
      }
    }
  }

  const handleCancel = (): void => {
    setShowDeleteModal(false)
  }

  const handleDrawerCloseClicked = (): void => {
    setId('')
    setIsDrawerOpen(false)
    setIsFormOpen(false)
    // setDrawerClose(false)
  }

  const handleBulkDelete = async (): Promise<void> => {
    setShowDeleteModal(true)
  }

  const handleReload = (): void => {
    setIsReload(!isReload)
  }
  const closeOneTimeShareModal = (): void => {
    setShowOneTimeShareModal(false)
  }

  const mapSecrets = (data: any): string => {
    const selectedValues: { [key: string]: any } = {}
    for (const key in data) {
      if (!excludedPropertiesInOneTimeShare.includes(key)) {
        selectedValues[key] = data[key]
      }
    }
    if (data.keyValues && data.keyValues.length > 0) {
      for (const kv of data.keyValues) {
        selectedValues[kv.key] = kv.value
      }
      delete selectedValues.keyValues
    }
    const valuesString: string = Object.entries(selectedValues)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
    return valuesString
  }

  return (
    <div className='w-full sm:ml-20 md:ml-0'>
      {(vaultData?.length === 0 && !isLoading)
        ? (
          <div className='flex flex-col items-center justify-center h-[80vh]  w-full'>
            <Icon name='fi-rr-lock-b' />
            <h1 className='text-center mx-3 my-6'>All your logins in one secure place.</h1>
            <p className='mb-6'>Start adding logins to your fort lock vault.</p>
            <div className='flex flex-row justify-center gap-6'>
              <div>
                <button className='btn btn-primary text-white btn-md md:px-7 lg:px-7 ' onClick={handleAddItemClicked}>
                  <Icon name='add' className='mr-2 hidden md:block lg:block' />
                  <p className='font-medium'>Add Items</p>
                </button>
              </div>
              <div>
                <button className='btn btn-base-100 text-white btn-md md:px-7 lg:px-7' onClick={handleAddCollectionClicked}>
                  <Icon name='fi-rr-folder-2' className='hidden md:block lg:block' />
                  <p className='text-blacks font-medium'>Add Collection</p>
                </button>
              </div>
            </div>
            <Drawer
              drawerOpen={isDrawerOpen}
              title={drawerTitle}
              handleClose={handleDrawerCloseClicked}
              width='w-full sm:w-fit'
            >
              <ItemDrawer id={id} refresh={handleReload} />
            </Drawer>
            <Drawer
              drawerOpen={openCollectionForm}
              title={drawerTitle}
              handleClose={() => setOpenCollectionForm(false)}
              width='w-1/3'
            >
              <CollectionForm handleDrawerCloseClicked={() => setOpenCollectionForm(false)} />
            </Drawer>
          </div>
          )
        : (

          <div className='mt-4 md:pl-6 lg:pl-1 sm:ml-8 md:ml-0'>
            <PageHeader
              title={collectionName}
              addNewItemPressed={handleAddItemClicked}
              deleteItemPressed={handleBulkDelete}
            />
            {
              !drawerClose && (
                <Drawer
                  drawerOpen={isDrawerOpen}
                  title={drawerTitle}
                  handleClose={handleDrawerCloseClicked}
                  width='w-full sm:w-fit'
                >
                  <ItemDrawer id={id} refresh={handleReload} />
                </Drawer>

              )
            }
            <Drawer
              drawerOpen={isFormOpen}
              title={drawerTitle}
              handleClose={handleDrawerCloseClicked}
              width={selectedType === 'environment_variables' ? ' w-full sm:w-[850px]' : 'w-full sm:w-1/3 '}
            >
              <DynamicForm selectedType={selectedType as Exclude<typeof selectedType, undefined>} id={id} handleReload={handleReload} handleDrawerCloseClicked={handleDrawerCloseClicked} />
            </Drawer>
            <Table
              columns={columns}
              data={renderData()}
              dropdownItems={dropdownItems}
              handleRowClick={handleTableRowClicked}
              checkedRows={setCheckedRowsId}
              checkedRowsData={setCheckedRowsData}
              isLoading={isLoading}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
            />
            <ConfirmModal
              isOpen={showDeleteModal}
              content='Selected item will be sent to trash. Are you sure you want to delete?'
              data={checkedRowsData}
              onPressDelete={handleDeleteClicked}
              onPressCancel={handleCancel}
            />
            <OneTimeShareModal
              closeOneTimeShareModal={closeOneTimeShareModal}
              showOneTimeShareModal={showOneTimeShareModal} selectedData={selectedData}
            />
          </div>
          )}
    </div>
  )
}

export default VaultManagement
