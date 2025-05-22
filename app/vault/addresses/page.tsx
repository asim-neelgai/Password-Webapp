'use client'
import { TableColumn } from '@/apptypes/keys'
import VaultManagement from '../vaultManagement'

const columns: TableColumn[] = [
  { key: 'name', label: 'ALL ITEMS' },
  { key: 'createdAt', label: 'DATE CREATED' },
  { key: 'collection', label: 'COLLECTION' }
]

const pageSize = 6

const Addresses = (): React.ReactNode => {
  return (
    <VaultManagement columns={columns} pageSize={pageSize} type='addresses' />
  )
}

export default Addresses
