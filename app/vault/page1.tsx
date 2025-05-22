// 'use client'
// import React, { useEffect, useState } from 'react'
// import { saveFolder } from '../services/folderService'
// import { Folder } from '@/types/folder'
// import { getSession } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
// import { VaultTypes } from '@/enums/enum'

// interface Props {}
// type VaultData = {
//   [key in VaultTypes]: string[];
// }
// const vaultData: VaultData = {
//   [VaultTypes.Passwords]: ['Password 1', 'Password 2', 'Password 3'],
//   [VaultTypes.Notes]: ['Note 1', 'Note 2'],
//   [VaultTypes.CreditCards]: ['Card 1', 'Card 2'],
//   [VaultTypes.BankAccounts]: ['Account 1', 'Account 2']
// }

// const Vault = (props: Props) => {
//   const [selectedType, setSelectedType] = useState('Passwords')
//   const [showAddFolderModal, setShowAddFolderModal] = useState(false)
//   const [showAddBankAccountsModal, setshowAddBankAccountsModal] = useState(false)
//   const [folderName, setFolderName] = useState('')
//   const [folders, setFolders] = useState([])
//   const router = useRouter()

//   const handleFolderNameChange = (e) => {
//     setFolderName(e.target.value)
//   }
//   const handleTypeClick = (type: any): any => {
//     setSelectedType(type)
//   }

//   const [showOptions, setShowOptions] = useState(false)

//   const toggleOptions = () => {
//     setShowOptions(!showOptions)
//   }

//   const createItem = () => {
//     setShowOptions(false)
//     if (selectedType === VaultTypes.BankAccounts) {
//       setshowAddBankAccountsModal(true)
//     }
//   }

//   const createFolder = () => {
//     setShowOptions(false)
//     setShowAddFolderModal(true)
//   }
//   const closeAddFolderModal = () => {
//     setShowAddFolderModal(false)
//   }
//   const handleAddFolder = async (e) => {
//     const session = await getSession()

//     if (session == null) {
//       return router.push('/login')
//     }

//     e.preventDefault()
//     setShowAddFolderModal(false)
//     const folder: Folder = {
//       name: folderName
//     }
//     const folderSaved = await saveFolder(folder, session?.user.accessToken)
//     if (folderSaved) {
//       alert('Folder saved')
//     }
//   }

//   const [formData, setFormData] = useState({
//     name: '',
//     folder: '',
//     bankName: '',
//     accountType: '',
//     routingNumber: '',
//     accountNumber: '',
//     swiftCode: '',
//     ibanNumber: '',
//     pin: '',
//     branchAddress: '',
//     branchPhone: '',
//     notes: ''
//   })

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value
//     })
//   }

//   const handleBankAccountSubmit = (e) => {
//     e.preventDefault()
//     // Logic to handle form submission (e.g., sending data to backend)
//     console.log(formData) // For example, log the form data
//   }

//   return (
//     <div className='p-4 flex'>
//       <div className='w-1/4 pr-4'>
//         <h2 className='text-lg font-semibold mb-4'>Vault Types</h2>
//         <ul className='space-y-2'>
//           {Object.keys(vaultData).map((type) => (
//             <li
//               key={type}
//               className={`cursor-pointer p-2 rounded ${
//                 selectedType === type ? 'bg-blue-500 text-white' : ''
//               }`}
//               onClick={() => handleTypeClick(type)}
//             >
//               {type}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className='w-3/4'>
//         <div className='flex'>
//           <div className='w-1/4'>
//             <h2 className='text-lg font-semibold mb-4'>{selectedType}</h2>
//           </div>
//           <div className='w-3/4'>
//             <button className='btn btn-info' onClick={toggleOptions}>
//               <svg
//                 xmlns='http://www.w3.org/2000/svg'
//                 className='h-5 w-5 mr-2'
//                 viewBox='0 0 20 20'
//                 fill='currentColor'
//               >
//                 <path
//                   fillRule='evenodd'
//                   d='M10 3a1 1 0 0 1 1 1v5h5a1 1 0 0 1 0 2h-5v5a1 1 0 0 1-2 0v-5H4a1 1 0 0 1 0-2h5V4a1 1 0 0 1 1-1z'
//                   clipRule='evenodd'
//                 />
//               </svg>
//             </button>
//             {showOptions && (
//               <div className='origin-top-right absolute  mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100'>
//                 <div className='py-1'>
//                   <button
//                     onClick={createItem}
//                     className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
//                   >
//                     Create Item
//                   </button>
//                   <button
//                     onClick={createFolder}
//                     className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
//                   >
//                     Create Folder
//                   </button>
//                 </div>
//               </div>
//             )}
//             {showAddFolderModal && (
//               <div className='fixed z-10 inset-0 overflow-y-auto'>
//                 <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
//                   <div
//                     className='fixed inset-0 transition-opacity'
//                     aria-hidden='true'
//                   >
//                     <div className='absolute inset-0 bg-gray-500 opacity-75' />
//                   </div>
//                   <span
//                     className='hidden sm:inline-block sm:align-middle sm:h-screen'
//                     aria-hidden='true'
//                   >
//                     &#8203;
//                   </span>
//                   <div
//                     className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
//                     role='dialog'
//                     aria-modal='true'
//                     aria-labelledby='modal-headline'
//                   >
//                     <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
//                       <div className='sm:flex sm:items-start'>
//                         <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
//                           <h3
//                             className='text-lg leading-6 font-medium text-gray-900 mb-4'
//                             id='modal-headline'
//                           >
//                             Add Folder
//                           </h3>
//                           <div className='mt-2'>
//                             <form onSubmit={handleAddFolder}>
//                               <input
//                                 type='text'
//                                 value={folderName}
//                                 onChange={handleFolderNameChange}
//                                 placeholder='Enter folder name'
//                                 className='w-full border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring focus:border-blue-500'
//                               />
//                               <div className='flex justify-end'>
//                                 <button
//                                   type='submit'
//                                   className='bg-blue-500 text-white rounded-md px-4 py-2 transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500'
//                                 >
//                                   Create Folder
//                                 </button>
//                                 <button
//                                   type='button'
//                                   onClick={closeAddFolderModal}
//                                   className='ml-2 text-gray-500 rounded-md px-4 py-2 transition duration-300 hover:bg-gray-200 focus:outline-none focus:ring'
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </form>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             {showAddBankAccountsModal && (
//               <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
//                 <div className='bg-white rounded-lg p-6 w-96'>
//                   <h2 className='text-xl font-semibold mb-4'>Add Bank Account</h2>
//                   <form onSubmit={handleBankAccountSubmit}>
//                     <div className='mb-4'>
//                       <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
//                         Name
//                       </label>
//                       <input
//                         type='text'
//                         id='name'
//                         name='name'
//                         value={formData.name}
//                         onChange={handleChange}
//                         className='w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500'
//                       />
//                     </div>
//                     <div className='mb-4'>
//                       <label htmlFor='folder' className='block text-sm font-medium text-gray-700 mb-1'>
//                         Choose Folder
//                       </label>
//                       <select
//                         id='folder'
//                         name='folder'
//                         value={formData.folder}
//                         onChange={handleChange}
//                         className='w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500'
//                       >
//                         <option value=''>Select Folder</option>
//                         {folders.map((folder) => (
//                           <option key={folder.id} value={folder.id}>
//                           {folder.name}
//                         </option>
//                         ))}
//                       </select>
//                     </div>
//                     {/* Other fields */}
//                     {/* Bank Name */}
//                     {/* Account Type */}
//                     {/* Routing Number */}
//                     {/* Account Number */}
//                     {/* SWIFT Code */}
//                     {/* IBAN Number */}
//                     {/* PIN */}
//                     {/* Branch Address */}
//                     {/* Branch Phone */}
//                     {/* Notes */}
//                     {/* Sample field below */}
//                     <div className='mb-4'>
//                       <label htmlFor='bankName' className='block text-sm font-medium text-gray-700 mb-1'>
//                         Bank Name
//                       </label>
//                       <input
//                         type='text'
//                         id='bankName'
//                         name='bankName'
//                         value={formData.bankName}
//                         onChange={handleChange}
//                         className='w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500'
//                       />
//                     </div>
//                     {/* Other fields go here */}
//                     <button
//                       type='submit'
//                       className='bg-blue-500 text-white rounded-md py-2 px-4 transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500'
//                     >
//                       Add Bank Account
//                     </button>
//                   </form>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <ul className='space-y-2'>
//           {vaultData[selectedType].map((item, index) => (
//             <li
//               key={index}
//               className='border rounded p-2 hover:bg-gray-100 transition duration-300'
//             >
//               {item}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   )
// }

// export default Vault
