'use client'
import { TableColumn } from '@/apptypes/keys'
import VaultManagement from '../vaultManagement'

const columns: TableColumn[] = [
  { key: 'name', label: 'ALL ITEMS' },
  { key: 'createdAt', label: 'DATE CREATED' },
  { key: 'collection', label: 'C0LLECTION' }
]

const pageSize = 6

const SecureNotes = (): React.ReactNode => {
  return (
    <VaultManagement columns={columns} pageSize={pageSize} type='secure_notes' />
  )
}

export default SecureNotes
