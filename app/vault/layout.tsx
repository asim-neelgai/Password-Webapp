'use client'
import { useState, useMemo, useEffect } from 'react'
import CollectionContext from '../CollectionContext'
import LeftNav from '../LeftNav'
import TopBar from '../TopBar'
import VaultDataContext from '../VaultDataContext'
import { TableRow } from '@/apptypes/keys'
import { getSessionStorage } from '@/lib/store'
import cognitoHelpers from '@/lib/cognitoHelpers'
import { useRouter } from 'next/navigation'
import { fetchUser } from '../services/userService'
import { getDecryptedSymmetricKey, getIvAndEncryptedData } from '@/lib/crypto'
import { fetchAllVault } from '../services/vaultService'
import { decryptDataWithKey } from '@/lib/vault'
import { tokenExpired } from '@/lib/dateHelpher'
import Icon from '@/components/Icon'
import NavBarContext from '../NavBarContext'

const Layout = ({
  children
}: {
  children: React.ReactNode
}): React.ReactNode => {
  const [collection, setCollection] = useState<boolean>(false)
  const [vaultData, setVaultData] = useState<TableRow[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [collectionVaultData, setCollectionVaultData] = useState<TableRow[]>([])
  const [collectionVaultId, setCollectionVaultId] = useState<TableRow[]>([])
  const [checked, setChecked] = useState<boolean>(false)
  const [isAllRowChecked, setIsAllRowChecked] = useState<boolean>(false)
  const [collectionName, setCollectionName] = useState<string>('')
  const [drawerClose, setDrawerClose] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  const [totalItems, setTotalItems] = useState(0)
  const [isReload, setIsReload] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const contextValue = useMemo(
    () => ({ collection, setCollection, collectionVaultId, setCollectionVaultId, collectionName, setCollectionName }),
    [collection, setCollection, collectionVaultId, setCollectionVaultId, collectionName, setCollectionName]
  )
  const vaultDataContextValue = useMemo(
    () => ({ vaultData, setVaultData, isLoading, setIsLoading, isReload, setIsReload, collectionVaultData, setCollectionVaultData, checked, setChecked, isAllRowChecked, setIsAllRowChecked, drawerClose, setDrawerClose, showModal, setShowModal }),
    [vaultData, setVaultData, totalItems, setTotalItems, isLoading, setIsLoading, isReload, setIsReload, collectionVaultData, setCollectionVaultData, checked, setChecked, isAllRowChecked, setIsAllRowChecked, drawerClose, setDrawerClose, showModal, setShowModal]
  )
  const navBarContextValue = useMemo(
    () => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]
  )
  const router = useRouter()

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true)
      try {
        const token = await cognitoHelpers.getToken()
        if (token == null || tokenExpired(token)) {
          return router.push('/login')
        }
        const userDetails = await fetchUser(token)
        const protectedSymmetricKeyString = userDetails.key

        const masterKeyString = getSessionStorage('masterKey')
        if (masterKeyString === null || protectedSymmetricKeyString === null) {
          return router.push('/login')
        }

        const decryptedSymmetricKey = await getDecryptedSymmetricKey(masterKeyString, protectedSymmetricKeyString)

        const response = await fetchAllVault(token)
        const totalItems = response.length

        const decryptedDataPromises = response.map(async (storedVault: any) => {
          const contentObj = JSON.parse(storedVault.content)
          const result = getIvAndEncryptedData(contentObj)
          if (result != null) {
            const decryptedData = await decryptDataWithKey(result, decryptedSymmetricKey)
            if (decryptedData !== undefined) {
              const decryptedDataObj = JSON.parse(decryptedData)
              return {
                ...storedVault,
                ...decryptedDataObj.secret
              }
            }
          }
          return null
        })

        const decryptedVaults = await Promise.all(decryptedDataPromises)
        const filteredDecryptedVaults = decryptedVaults.filter((vault: any) => vault !== null)
        // setData(filteredDecryptedVaults)
        setVaultData(filteredDecryptedVaults)
        setTotalItems(totalItems)
      } catch (error) {
        setIsLoading(false)
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchData()
  }, [isReload])
  return (
    <div className='flex h-screen w-full pl-2 sm:pl-0 sm:h-screen'>
      <NavBarContext.Provider value={navBarContextValue}>
        <CollectionContext.Provider value={contextValue}>
          <VaultDataContext.Provider value={vaultDataContextValue}>

            <div className='w-1/5 bg-blue-800 hidden md:block lg:block sm:w-[200px] md:w-[220px] lg:w-[270px]'>
              <LeftNav />
            </div>
            <div className='flex-auto pr-6 pt-6 sm:pl-5 w-full sm:w-[500px]'>
              <TopBar />
              {children}
            </div>

          </VaultDataContext.Provider>
        </CollectionContext.Provider>
      </NavBarContext.Provider>
    </div>

  )
}

export default Layout
