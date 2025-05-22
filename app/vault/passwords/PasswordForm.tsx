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

interface FormValues {
  url: string
  name: string
  username: string
  password: string
  collection: object
  notes: string
}

const validationSchema = Yup.object().shape({
  url: Yup.string().url().required().label('URL'),
  name: Yup.string().required().label('Name'),
  username: Yup.string().required().label('Username'),
  password: Yup.string().required().label('Password'),
  notes: Yup.string().label('Notes')
})

const initialValues: FormValues = {
  url: '',
  name: '',
  username: '',
  password: '',
  collection: [],
  notes: ''
}
interface CollectionModel {
  collectionId: string
  name: string
}

interface PasswordFormProps {
  id: string
  handleReload: () => void
  handleDrawerCloseClicked: () => void
}

const PasswordForm = ({ id, handleReload, handleDrawerCloseClicked }: PasswordFormProps): React.ReactNode => {
  const [secret, setSecret] = useState(initialValues)
  const [collections, setCollections] = useState<Array<{ name: string, id: string }>>([])
  const [collectionData, setCollectionData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { collection, setCollection } = useContext(CollectionContext)

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
            setSecret(decryptedDataObj.secret)
          }
        }
      } else {
        setSecret(initialValues)
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
  const router = useRouter()

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
        type: 'password',
        name: 'web'
      }
      const dataToSave: components['schemas']['SecretWithCollectionsRequestModel'] = {
        secret: vaultData,
        collectionIds: collection?.map((c: any) => c?.value)
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
    setSecret(initialValues)
    setCollections([])
  }

  return (
    <div className='mx-8 mt-6'>
      <h1 className='my-3 text-lg font-medium'>Login Details</h1>
      {isLoading
        ? (
          <div className='flex flex-col items-center justify-center h-full'>
            <Loader />
          </div>
          )
        : (
          <Form
            initialValues={{
              url: secret.url,
              name: secret.name,
              username: secret.username,
              password: secret.password,
              collection: collectionData,
              notes: secret.notes
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <div className='space-y-2 flex flex-col mt-6 gap-2'>
              <InputField label='URL' name='url' type='text' />
              <InputField label='Name' name='name' placeholder='Your Name' />
              <InputField label='Username' name='username' placeholder='Your Username' />
              <InputField label='Password' name='password' type='password' />
              {collections?.length !== 0
                ? (
                  <MultipleSelect label='Collection' name='collection' data={collections} setData={collectionData} />
                  )
                : null}

              <TextareaField label='Notes' name='notes' />
            </div>
            <div className='flex mt-4'>
              <Button type='submit' variant='btn-primary text-white w-32 h-12'>Save</Button>
            </div>
          </Form>)}
    </div>
  )
}

export default PasswordForm
