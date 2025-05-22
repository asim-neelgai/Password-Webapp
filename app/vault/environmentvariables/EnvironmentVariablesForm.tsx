import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import Button from '@/components/Button'
import InputField from '@/components/InputField'
import Icon from '@/components/Icon'
import { getSessionStorage } from '@/lib/store'
import router from 'next/router'
import { fetchUser } from '@/app/services/userService'
import { getDecryptedSymmetricKey, getIvAndEncryptedData } from '@/lib/crypto'
import { decryptDataWithKey, encryptDataWithKey } from '@/lib/vault'
import { components } from '@/apptypes/api-schema'
import cognitoHelpers from '@/lib/cognitoHelpers'
import { fetchVaultById, saveVault, updateVault } from '@/app/services/vaultService'
import MultipleSelect from '@/components/SelectDropdown'
import CollectionContext from '@/app/CollectionContext'
import { fetchCollection } from '@/app/services/collectionService'
import Loader from '@/components/Loader'

interface EnvVariablesProps {
  id: string
  handleReload: () => void
  handleDrawerCloseClicked: () => void
  className?: string
}
interface CollectionModel {
  collectionId: string
  name: string
}
interface EnvValues {
  name: string
  url: string
  collection: CollectionModel[]
  keyValues: Array<{ key: string, value: string }>
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
  url: Yup.string().required('URL is required').url('Invalid URL format')
})

const EnvironmentVariablesForm = ({ id, handleReload, handleDrawerCloseClicked, className = 'mx-8 mt-6 w-[850px]' }: EnvVariablesProps): React.ReactNode => {
  const [envrionmentData, setEnvironmentData] = useState<EnvValues>({
    name: '',
    url: '',
    collection: [],
    keyValues: [{ key: '', value: '' }]
  })
  const [collections, setCollections] = useState<Array<{ name: string, id: string }>>([])
  const [collectionData, setCollectionData] = useState<CollectionModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { collection, setCollection } = useContext(CollectionContext)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (id !== '') {
        const masterKeyString = getSessionStorage('masterKey')
        const token = await cognitoHelpers.getToken()
        if (token == null) {
          await router.push('/login')
          return
        }

        const userDetails = await fetchUser(token)
        const protectedSymmetricKeyString = userDetails.key

        if (masterKeyString === null || protectedSymmetricKeyString === null) {
          await router.push('/login')
          return
        }
        const decryptedSymmetricKey = await getDecryptedSymmetricKey(masterKeyString, protectedSymmetricKeyString)

        const secretResponse = await fetchVaultById(token, id)
        const updatedCollection: CollectionModel[] = secretResponse.collectionSecretModels.map((collectionModel: CollectionModel) => ({
          value: collectionModel.collectionId,
          label: collectionModel.name
        })) ?? []
        setCollectionData(updatedCollection)
        const contentObj = JSON.parse(secretResponse.content)
        const result = getIvAndEncryptedData(contentObj)
        if (result !== null) {
          const decryptedData = await decryptDataWithKey(result, decryptedSymmetricKey)
          if (decryptedData !== undefined) {
            const decryptedDataObj = JSON.parse(decryptedData)
            setEnvironmentData({
              name: decryptedDataObj.secret.name,
              url: decryptedDataObj.secret.url,
              collection: collectionData ?? [],
              keyValues: decryptedDataObj.secret.keyValues

            })
          }
        }
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

  const handleSubmit = async (values: { [key: string]: any }, { resetForm }: { resetForm: () => void }): Promise<void> => {
    const masterKeyString = getSessionStorage('masterKey')
    const accessToken = await cognitoHelpers.getToken()
    if (accessToken == null) {
      await router.push('/login')
      return
    }
    const userDetails = await fetchUser(accessToken)
    const protectedSymmetricKeyString = userDetails.key
    if (masterKeyString === null || protectedSymmetricKeyString === null) {
      await router.push('/login')
      return
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
        type: 'environment_variables',
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
    <div className='mx-8 mt-6 w-full pr-14 z-20'>
      {isLoading
        ? (
          <div className='flex flex-col items-center justify-center h-full'>
            <Loader />
          </div>
          )
        : (
          <Formik
            initialValues={envrionmentData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >

            {({ values }) => (
              <Form>
                <div className='flex flex-col sm:flex sm:flex-row sm:justify-between gap-5'>
                  <div className='w-full'>
                    <InputField label='Project Name' name='name' placeholder='Project Name' />
                  </div>
                  <div className='w-full'>
                    <InputField label='Project URL' name='url' placeholder='Project URL' />
                  </div>
                </div>
                {collections?.length !== 0
                  ? (
                    <div className='w-full sm:w-[350px] mt-5'>
                      <MultipleSelect label='Collection' name='collection' data={collections} setData={collectionData} />
                    </div>
                    )
                  : null}
                <FieldArray name='keyValues'>
                  {({ push, remove, insert }) => (
                    <div>
                      <div className='mt-9 flex flex-col'>
                        <div className='w-full flex flex-col sm:flex sm:flex-row sm:gap-x-[350px] mb-5'>
                          <label>Key</label>
                          <label className='hidden sm:block'>Value</label>
                        </div>

                        {values.keyValues.map((_, index) => (
                          <div key={index} className=' flex flex-col sm:flex sm:flex-row w-full sm:mb-4 sm:gap-5'>
                            <div className='mb-4 w-full input input-bordered flex items-center'>
                              <Field name={`keyValues.${index}.key`} placeholder='Add Key' />
                            </div>
                            <div className='mb-4 w-full input input-bordered flex items-center'>
                              <Field name={`keyValues.${index}.value`} placeholder='Add Value' />
                            </div>
                            {values.keyValues.length === (index + 1)
                              ? (
                                <button
                                  className='w-12 h-12 justify-center flex-row flex items-center bg-secondary rounded-lg p-3' type='button' onClick={() => {
                                    push({ key: '', value: '' })
                                  }}
                                >
                                  <Icon name='add-black' />
                                </button>
                                )
                              : (
                                <button className='w-12 h-12 justify-center flex-row flex items-center bg-error rounded-lg p-3' type='button' onClick={() => remove(index)}>
                                  <Icon name='trash' />
                                </button>

                                )}

                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </FieldArray>

                <div className='flex mt-5'>
                  <Button type='submit' variant='btn-primary text-white'>Save</Button>
                </div>
              </Form>
            )}
          </Formik>)}
    </div>
  )
}

export default EnvironmentVariablesForm
