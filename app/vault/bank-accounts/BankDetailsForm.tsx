import CollectionContext from '@/app/CollectionContext'
import { fetchUser } from '@/app/services/userService'
import { fetchVaultById, saveVault, updateVault } from '@/app/services/vaultService'
import { fetchCollection } from '@/app/services/collectionService'
import { components } from '@/apptypes/api-schema'
import Button from '@/components/Button'
import Form from '@/components/Form'
import InputField from '@/components/InputField'
import MultipleSelect from '@/components/SelectDropdown'
import TextareaField from '@/components/TextareaField'
import cognitoHelpers from '@/lib/cognitoHelpers'
import { getDecryptedSymmetricKey, getIvAndEncryptedData } from '@/lib/crypto'
import { getSessionStorage } from '@/lib/store'
import { decryptDataWithKey, encryptDataWithKey } from '@/lib/vault'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup'
import Loader from '@/components/Loader'

interface BankFormValues {
  name: string
  accountType: string
  pin: string
  address: string
  phone: string
  collection: object
  notes: string
}
interface CollectionModel {
  collectionId: string
  name: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  accountType: Yup.string().required().label('Account Type'),
  pin: Yup.string().required().label('PIN'),
  address: Yup.string().required().label('Address'),
  phone: Yup.string()
    .matches(/^\d{1,10}$/, 'Phone number can be at most 10 numeric digits')
    .required()
    .label('Phone'),
  notes: Yup.string().label('Notes')
})

const initialValues: BankFormValues = {
  name: '',
  accountType: '',
  pin: '',
  address: '',
  phone: '',
  collection: [],
  notes: ''
}

interface BankDetailsFormProps {
  id: string
  handleReload: () => void
  handleDrawerCloseClicked: () => void
}

const BankDetailsForm = ({ id, handleReload, handleDrawerCloseClicked }: BankDetailsFormProps): React.ReactNode => {
  const [bankDetails, setBankDetails] = useState(initialValues)
  const [collections, setCollections] = useState<Array<{ name: string, id: string }>>([])
  const [collectionData, setCollectionData] = useState([])

  const { collection, setCollection } = useContext(CollectionContext)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (id !== '') {
        const masterKeyString = getSessionStorage('masterKey')
        const token = await cognitoHelpers.getToken()
        if (token == null) {
          return router.push('/login')
        }

        const userDetails = await fetchUser(token)
        const protectedSymmetricKeyString = userDetails.key

        if (masterKeyString === null || protectedSymmetricKeyString === null) {
          return router.push('/login')
        }
        const decryptedSymmetricKey = await getDecryptedSymmetricKey(masterKeyString, protectedSymmetricKeyString)

        const secretResponse = await fetchVaultById(token, id)
        const contentObj = JSON.parse(secretResponse.content)
        const result = getIvAndEncryptedData(contentObj)
        if (result !== null) {
          const decryptedData = await decryptDataWithKey(result, decryptedSymmetricKey)
          if (decryptedData !== undefined) {
            const decryptedDataObj = JSON.parse(decryptedData)
            const updatedCollection: CollectionModel = secretResponse.collectionSecretModels.map((collectionModel: CollectionModel) => ({
              value: collectionModel.collectionId,
              label: collectionModel.name
            }))
            decryptedDataObj.collection = updatedCollection
            setCollectionData(decryptedDataObj.collection)
            setBankDetails(decryptedDataObj.secret)
          }
        }
      } else {
        setBankDetails(initialValues)
      }
      setIsLoading(false)
    }
    void fetchData()
  }, [id])

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

  const handleSubmit = async (
    values: { [key: string]: any }, { resetForm }: { resetForm: () => void }
  ): Promise<void> => {
    const masterKeyString = getSessionStorage('masterKey')
    const accessToken = await cognitoHelpers.getToken()
    if (accessToken == null) {
      return router.push('/login')
    }
    const userDetails = await fetchUser(accessToken)
    const protectedSymmetricKeyString = userDetails.key
    if (masterKeyString === null || protectedSymmetricKeyString === null) {
      return router.push('/login')
    }
    const decryptedSymmetricKey = await getDecryptedSymmetricKey(masterKeyString, protectedSymmetricKeyString)
    const { collection, ...secret } = values
    const encryptedData = await encryptDataWithKey(
      JSON.stringify({ secret }),
      decryptedSymmetricKey
    )
    if (encryptedData != null) {
      const vaultData: components['schemas']['SecretModel'] = {
        content: JSON.stringify(encryptedData),
        type: 'bank_accounts',
        name: 'web'
      }
      const dataToSave: components['schemas']['SecretWithCollectionsRequestModel'] = {
        secret: vaultData,
        collectionIds: collection?.map((c: any) => c.value)
      }
      if (id !== '') {
        const response = await updateVault(dataToSave, id, accessToken)
        if (response.status === 204) {
          handleDrawerCloseClicked()
          handleReload()
        } else {
          alert('Error updating vault')
        }
      } else {
        const response = await saveVault(dataToSave, accessToken)
        if (response.status === 201) {
          handleDrawerCloseClicked()
          handleReload()
        } else {
          alert('Error saving vault')
        }
      }
    }
    resetForm()
  }

  return (
    <div className='mx-8 mt-6'>
      <h1 className='my-3 text-lg font-medium'>Bank Details</h1>
      {isLoading
        ? (
          <div className='flex flex-col items-center justify-center h-full'>
            <Loader />
          </div>
          )
        : (
          <Form
            initialValues={{
              name: bankDetails.name,
              accountType: bankDetails.accountType,
              pin: bankDetails.pin,
              address: bankDetails.address,
              phone: bankDetails.phone,
              collection: collectionData,
              notes: bankDetails.notes
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col mt-6 gap-2'>
              <InputField label='Bank Name' name='name' placeholder='Your Bank Name' />
              <InputField label='Account Type' name='accountType' placeholder='Your Account Type' />
              <InputField label='PIN' name='pin' placeholder='Your PIN' type='number' />
              <InputField label='Address' name='address' placeholder='Your Address' />
              <InputField label='Phone' name='phone' placeholder='Your Phone' />
              {collections?.length !== 0
                ? (
                  <MultipleSelect label='Collection' name='collection' data={collections} setData={collectionData} />
                  )
                : null}

              <TextareaField label='Notes' name='notes' />
            </div>
            <div className='flex'>
              <Button type='submit' variant='btn-primary text-white'>Save</Button>
            </div>
          </Form>
          )}
    </div>

  )
}

export default BankDetailsForm
