// 'use client'
// import { decryptProtectedSymmetricKey } from '@/lib/crypto'
// import { convertToUint8Array, objectToUint8Array } from '@/lib/store'
// import { decryptDataWithKey, encryptDataWithKey } from '@/lib/vault'
// import { useRouter } from 'next/navigation'
// import React, { ChangeEvent, useEffect, useState } from 'react'
// import { fetchUser } from '../services/userService'
// import { getSession } from 'next-auth/react'
// import { fetchVault, saveVault } from '../services/vaultService'
// import { Vault } from '@/types/vault'

// interface VaultItem {
//   website: string
//   username: string
//   password: string
// }

// const VaultForm = (): any => {
//   const [formData, setFormData] = useState<VaultItem[]>([])
//   const router = useRouter()
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const stretchedMasterKeyString =
//           sessionStorage.getItem('stretchedMasterKey')
//         const session = await getSession()

//         if (session == null) {
//           return router.push('/login')
//         }

//         const userDetails = await fetchUser(session?.user.accessToken)
//         console.log('userDetails', userDetails)
//         const protectedSymmetricKeyString = userDetails.key

//         if (!stretchedMasterKeyString || !protectedSymmetricKeyString) {
//           // Handle missing keys or navigate to login
//           // router.push('/login');
//           return
//         }

//         const stretchedMasterKey = convertToUint8Array(
//           stretchedMasterKeyString
//         )
//         const protectedSymmetricKey = JSON.parse(protectedSymmetricKeyString)

//         const decryptedSymmetricKey = await decryptProtectedSymmetricKey(
//           stretchedMasterKey,
//           protectedSymmetricKey
//         )

//         const storedVault = await fetchVault(session?.user.accessToken)
//         const storedVaultObj = JSON.parse(storedVault.content)
//         const { iv, encryptedData } = storedVaultObj
//         const ivUint8Array = objectToUint8Array(iv)
//         const encryptedDataUint8Array = objectToUint8Array(encryptedData)
//         const result = {
//           iv: ivUint8Array,
//           encryptedData: encryptedDataUint8Array
//         }

//         if (result) {
//           const decryptedData = await decryptDataWithKey(
//             result,
//             decryptedSymmetricKey
//           )
//           if (decryptedData !== undefined) {
//             const decryptedDataObj = JSON.parse(decryptedData)
//             setFormData(decryptedDataObj.formData)
//           }
//         }
//       } catch (error) {
//         // Handle errors
//         console.error('Error fetching data:', error)
//       }
//     }

//     fetchData()
//   }, [])

//   const handleInputChange = (
//     index: number,
//     event: ChangeEvent<HTMLInputElement>
//   ): void => {
//     const { name, value } = event.target
//     const fieldName = name.split('-')[0]
//     setFormData((prevFormData) => {
//       const updatedFormData = [...prevFormData]
//       updatedFormData[index] = {
//         ...updatedFormData[index],
//         [fieldName]: value
//       }
//       return updatedFormData
//     })
//   }

//   const handleAddField = () => {
//     setFormData([...formData, { website: '', username: '', password: '' }])
//   }

//   const handleRemoveField = (index: number) => {
//     const updatedFormData = [...formData]
//     updatedFormData.splice(index, 1)
//     setFormData(updatedFormData)
//     window.sessionStorage.setItem('vault', JSON.stringify(updatedFormData))
//   }

//   const handleSubmit = async (e: any): Promise<void> => {
//     e.preventDefault()
//     debugger
//     const stretchedMasterKeyString =
//       sessionStorage.getItem('stretchedMasterKey')
//     const session = await getSession()
//     if (session == null) {
//       return router.push('/login')
//     }
//     const userDetails = await fetchUser(session?.user.accessToken)
//     console.log('userDetails', userDetails)
//     const protectedSymmetricKeyString = userDetails.key
//     if (!stretchedMasterKeyString || !protectedSymmetricKeyString) {
//       // router.push('/login')
//     }

//     const stretchedMasterKey = convertToUint8Array(stretchedMasterKeyString)
//     const protectedSymmetricKey = JSON.parse(protectedSymmetricKeyString)

//     const decryptedSymmetricKey = await decryptProtectedSymmetricKey(
//       stretchedMasterKey,
//       protectedSymmetricKey
//     )
//     console.log(decryptProtectedSymmetricKey)
//     const encryptedData = await encryptDataWithKey(
//       JSON.stringify({ formData }),
//       decryptedSymmetricKey
//     )
//     if (encryptedData != null) {
//       const vaultData: Vault = {
//         content: JSON.stringify(encryptedData),
//         type: 1,
//         name: 'web'
//       }
//       const session = await getSession()

//       const saved = await saveVault(vaultData, session?.user.accessToken)
//       if (!saved) {
//         alert('Error saving vault')
//       }
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       {formData?.map((field, index) => (
//         <div className='my-4 flex flex-wrap items-center' key={index}>
//           <div className='w-1/4 pr-2'>
//             <label
//               className='block font-semibold mb-1'
//               htmlFor={`website-${index}`}
//             >
//               Website
//             </label>
//             <input
//               type='text'
//               id={`website-${index}`}
//               name={`website-${index}`}
//               value={field.website}
//               onChange={(e) => handleInputChange(index, e)}
//               placeholder='Website'
//               className='border rounded-md p-2 w-full'
//             />
//           </div>
//           <div className='w-1/4 px-2'>
//             <label
//               className='block font-semibold mb-1'
//               htmlFor={`username-${index}`}
//             >
//               Username
//             </label>
//             <input
//               type='text'
//               id={`username-${index}`}
//               name={`username-${index}`}
//               value={formData[index].username}
//               onChange={(e) => handleInputChange(index, e)}
//               placeholder='Username'
//               className='border rounded-md p-2 w-full'
//             />
//           </div>
//           <div className='w-1/4 pl-2'>
//             <label
//               className='block font-semibold mb-1'
//               htmlFor={`password-${index}`}
//             >
//               Password
//             </label>
//             <input
//               type='password'
//               id={`password-${index}`}
//               name={`password-${index}`}
//               value={formData[index].password}
//               onChange={(e) => handleInputChange(index, e)}
//               placeholder='Password'
//               className='border rounded-md p-2 w-full'
//             />
//           </div>
//           <div className='w-1/4 pl-2 pt-3'>
//             <button
//               type='button'
//               onClick={() => handleRemoveField(index)}
//               className='bg-red-500 text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center mt-2 ml-2'
//             >
//               -
//             </button>
//           </div>
//         </div>
//       ))}

//       <button
//         type='button'
//         onClick={handleAddField}
//         className='bg-blue-500 text-white py-2 px-4 rounded-md mt-4'
//       >
//         Add
//       </button>

//       <button
//         type='submit'
//         className='bg-green-500 text-white py-2 px-4 rounded-md ml-4'
//       >
//         Save vault
//       </button>
//     </form>
//   )
// }

// export default VaultForm
