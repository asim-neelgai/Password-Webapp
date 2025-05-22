'use client'
import { TableColumn } from '@/apptypes/keys'
import VaultManagement from '../vaultManagement'
import { useContext, useEffect } from 'react'
import CollectionContext from '@/app/CollectionContext'

const columns: TableColumn[] = [
  { key: 'name', label: 'ALL ITEMS' },
  { key: 'createdAt', label: 'DATE CREATED' },
  { key: 'collection', label: 'COLLECTION' },
  { key: 'createdBy', label: 'Owner' }
]

const pageSize = 6

const Page = (collectionId: any): React.ReactNode => {
  const collectionIds = collectionId.searchParams.id

  const { setCollectionVaultId } = useContext(CollectionContext)

  useEffect(() => {
    setCollectionVaultId(collectionIds)
  }, collectionIds)

  return (
    <VaultManagement columns={columns} pageSize={pageSize} />
  )
}

export default Page
