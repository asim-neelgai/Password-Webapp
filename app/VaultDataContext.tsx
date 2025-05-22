import { TableRow } from '@/apptypes/keys'
import { createContext } from 'react'

interface ContextType {
  vaultData: TableRow[]
  setVaultData: (vaultData: TableRow[]) => void
  collectionVaultData: TableRow[]
  setCollectionVaultData: (collectionVaultData: TableRow[]) => void
  isLoading: boolean
  setIsLoading: {}
  isReload: boolean
  setIsReload: (isReload: boolean) => void
  checked: boolean
  setChecked: (checked: boolean) => void
  isAllRowChecked: boolean
  setIsAllRowChecked: (isChecked: boolean) => void
  drawerClose: boolean
  setDrawerClose: (drawerClose: boolean) => void
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

const defaultValue: ContextType = {
  vaultData: [],
  setVaultData: () => {},
  collectionVaultData: [],
  setCollectionVaultData: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isReload: false,
  setIsReload: () => {},
  checked: false,
  setChecked: () => {},
  isAllRowChecked: false,
  setIsAllRowChecked: () => {},
  drawerClose: false,
  setDrawerClose: () => {},
  showModal: false,
  setShowModal: () => {}
}

const VaultDataContext = createContext<ContextType>(defaultValue)
export default VaultDataContext
