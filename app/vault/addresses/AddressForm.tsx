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
import { ErrorMessage, Field } from 'formik'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import * as Yup from 'yup'
import Loader from '@/components/Loader'

interface AddressValues {
  name: string
  gender: string
  company: string
  firstAddress: string
  secondAddress: string
  city: string
  state: string
  postalCode: string
  phoneNumber: string
  collection: object
  notes: string
}

interface CollectionModel {
  collectionId: string
  name: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  gender: Yup.string().required().label('Gender'),
  company: Yup.string().required().label('Company'),
  firstAddress: Yup.string().required().label('Address 1'),
  secondAddress: Yup.string().required().label('Address 2'),
  city: Yup.string().label('City'),
  state: Yup.string().label('State'),
  postalCode: Yup.string().label('Postal Code'),
  phoneNumber: Yup.string()
    .matches(/^\d{1,10}$/, 'Phone number can be at most 10 numeric digits')
    .required()
    .label('Phone'),
  notes: Yup.string().label('Notes')
})

const initialValues: AddressValues = {
  name: '',
  gender: '',
  company: '',
  firstAddress: '',
  secondAddress: '',
  city: '',
  state: '',
  postalCode: '',
  phoneNumber: '',
  collection: [],
  notes: ''
}

const genderOptions = ['Male', 'Female']
interface AddressFormProps {
  id: string
  handleReload: () => void
  handleDrawerCloseClicked: () => void
}

const AddressForm = ({ id, handleReload, handleDrawerCloseClicked }: AddressFormProps): React.ReactNode => {
  const [address, setAddress] = useState(initialValues)
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
            setAddress(decryptedDataObj.secret)
          }
        }
      } else {
        setAddress(initialValues)
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
        type: 'addresses',
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
      <h1 className='my-3 text-lg font-medium'>Address Details</h1>
      {isLoading
        ? (
          <div className='flex flex-col items-center justify-center h-full'>
            <Loader />
          </div>
          )
        : (<Form
            initialValues={{
              name: address.name,
              gender: address.gender,
              company: address.company,
              firstAddress: address.firstAddress,
              secondAddress: address.secondAddress,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              phoneNumber: address.phoneNumber,
              collection: collectionData,
              notes: address.notes
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
           >
          <div className='flex flex-col mt-6 gap-2'>
            <InputField label='Name' name='name' placeholder='Your Name' />
            <label htmlFor='gender' className='text-sm font-medium'>Gender</label>
            <Field as='select' id='gender' name='gender' className='select select-bordered w-full'>
              <option value='' label='Select Gender' />
              {genderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Field>
            <ErrorMessage name='gender' component='div' className='text-red-500 text-sm' />
            <InputField label='Company' name='company' placeholder='Your Company' />
            <InputField label='Address 1' name='firstAddress' placeholder='Address 1' />
            <InputField label='Address 2' name='secondAddress' placeholder='Address 2' />
            <InputField label='City' name='city' placeholder='Your City' />
            <InputField label='State' name='state' placeholder='Your State' />
            <InputField label='Postal Code' name='postalCode' placeholder='Your Code' />
            <InputField label='Phone Number' name='phoneNumber' placeholder='Your Phone Number' />
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

export default AddressForm
