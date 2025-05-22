'use client'
import { TableColumn } from '@/apptypes/keys'
import VaultManagement from '../vaultManagement'

const columns: TableColumn[] = [
  { key: 'name', label: 'PROJECT NAME' },
  { key: 'createdAt', label: 'DATE CREATED' },
  { key: 'url', label: 'PROJECT URL' },
  { key: 'collection', label: 'C0LLECTION' }
]

const pageSize = 6

const Passwords = (): React.ReactNode => {
  return (
    <VaultManagement columns={columns} pageSize={pageSize} type='environment_variables' />
  )
}

export default Passwords
