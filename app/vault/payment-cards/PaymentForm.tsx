import Button from '@/components/Button'
import Form from '@/components/Form'
import InputField from '@/components/InputField'
import TextareaField from '@/components/TextareaField'
import React, { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup'
import DatePicker from '@/utils/datetime-picker'
import { getSessionStorage } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { fetchUser } from '@/app/services/userService'
import { getDecryptedSymmetricKey, getIvAndEncryptedData } from '@/lib/crypto'
import { decryptDataWithKey, encryptDataWithKey } from '@/lib/vault'
import { components } from '@/apptypes/api-schema'
import { fetchVaultById, saveVault, updateVault } from '@/app/services/vaultService'
import { fetchCollection } from '@/app/services/collectionService'
import cognitoHelpers from '@/lib/cognitoHelpers'
import MultipleSelect from '@/components/SelectDropdown'
import CollectionContext from '@/app/CollectionContext'
import Loader from '@/components/Loader'

interface PaymentValues {
  name: string
  cardHolder: string
  number: string
  expire: string
  securityCode: string
  collection: object
  notes: string
}

interface CollectionModel {
  collectionId: string
  name: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  cardHolder: Yup.string().required().label('Card Holder Name'),
  number: Yup.number().required().label('Number'),
  expire: Yup.string().required().label('Expiration Date'),
  securityCode: Yup.string().required().label('Security Code'),
  notes: Yup.string().label('Notes')
})

const initialValues: PaymentValues = {
  name: '',
  cardHolder: '',
  number: '',
  expire: '',
  securityCode: '',
  collection: [],
  notes: ''
}

interface PaymentFormProps {
  id: string
  handleReload: () => void
  handleDrawerCloseClicked: () => void
}

const PaymentForm = ({ id, handleReload, handleDrawerCloseClicked }: PaymentFormProps): React.ReactNode => {
  const [paymentDetails, setPaymentDetails] = useState(initialValues)
  const [collections, setCollections] = useState<Array<{ name: string, id: string }>>([])
  const [collectionData, setCollectionData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { collection, setCollection } = useContext(CollectionContext)

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
            setPaymentDetails(decryptedDataObj.secret)
          }
        }
      } else {
        setPaymentDetails(initialValues)
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
        type: 'payment_card',
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
      <h1 className='my-3 text-lg font-medium'>Payment Method Details</h1>
      {
        isLoading
          ? (
            <div className='flex flex-col items-center justify-center h-full'>
              <Loader />
            </div>
            )
          : (
            <Form
              initialValues={{
                name: paymentDetails.name,
                cardHolder: paymentDetails.cardHolder,
                number: paymentDetails.number,
                expire: paymentDetails.expire,
                securityCode: paymentDetails.securityCode,
                collection: collectionData,
                notes: paymentDetails.notes
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <div className='flex flex-col mt-6 gap-2'>
                <InputField label='Name' name='name' placeholder='Your Name' />
                <InputField label='Card Holder Name' name='cardHolder' placeholder='Card Holder' />
                <InputField label='Number' name='number' placeholder='Your Number' type='number' />
                <DatePicker label='Expiration Date' name='expire' />
                <InputField label='Security Code' name='securityCode' placeholder='Your Security Code' type='number' />
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
            </Form>)
      }
    </div>
  )
}

export default PaymentForm
