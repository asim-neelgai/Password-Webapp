import { TableRow } from '@/apptypes/keys'
import { createContext } from 'react'

interface ContextType {
  collection: boolean
  setCollection: (collection: boolean) => void
  collectionVaultId: TableRow[]
  setCollectionVaultId: (collectionVaultId: TableRow[]) => void
  collectionName: string
  setCollectionName: (collectionName: string) => void
}

const defaultValue: ContextType = {
  collection: false,
  setCollection: () => {},
  collectionVaultId: [],
  setCollectionVaultId: () => {},
  collectionName: '',
  setCollectionName: () => {}
}

const CollectionContext = createContext<ContextType>(defaultValue)
export default CollectionContext
