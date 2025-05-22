'use client'
import { TableColumn } from '@/apptypes/keys'
import VaultManagement from './vaultManagement'

const columns: TableColumn[] = [
  { key: 'name', label: 'ALL ITEMS' },
  { key: 'createdAt', label: 'DATE CREATED' },
  { key: 'collection', label: 'COLLECTION' },
  { key: 'createdBy', label: 'Owner' }
]

const pageSize = 6

const Page = (): React.ReactNode => {
  return (
    <VaultManagement columns={columns} pageSize={pageSize} />
  )
}

export default Page
