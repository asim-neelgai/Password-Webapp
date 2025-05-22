import Drawer from '@/components/Drawer'
import Icon from '@/components/Icon'
import React, { useContext, useState } from 'react'
import DynamicForm from '@/components/DynamicForm'
import { components } from '@/apptypes/api-schema'
import { typeNormalize } from '@/lib/typeIconMapHelper'
import VaultDataContext from '../VaultDataContext'

interface DrawerValues {
  id: string
  refresh: () => void
  isOpen?: boolean
}

const ItemDrawer = ({ id, refresh, isOpen }: DrawerValues): React.ReactNode => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [darwerTitle, setDrawerTitle] = useState<React.ReactNode | null>(null)
  const [selectedType, setSelectedType] = useState<components['schemas']['SecretType']>()

  const { setDrawerClose } = useContext(VaultDataContext)

  const handlePasswordFormClick = (type: components['schemas']['SecretType']): void => {
    setIsDrawerOpen(true)
    setSelectedType(type)
    const icon = <Icon name='fi-rr-globe1' />
    const title = typeNormalize(type)
    const drawerTitleElement = (
      <div className='flex items-center'>
        {icon}
        <span className='ml-4 text-xl font-medium'>Add {title as string}</span>
      </div>
    )
    setDrawerTitle(drawerTitleElement)
  }

  const handleDrawerCloseClicked = (): void => {
    setIsDrawerOpen(false)
    setDrawerClose(true)
  }

  return (

    <div className='mr-7'>
      <ul className='grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-6 mt-4 ml-7'>
        <li className='flex flex-col border rounded-box justify-center sm:w-32 h-32 hover:border-primary hover:text-primary'>
          <button onClick={() => handlePasswordFormClick('password')} className='flex flex-col items-center gap-2'>
            <Icon name='password' />
            <p className='text-sm font-medium'>Password</p>
          </button>
        </li>
        <li className='flex flex-col border rounded-box sm:w-32 h-32 justify-center hover:border-primary hover:text-primary gap-5'>
          <button onClick={() => handlePasswordFormClick('secure_notes')} className='flex flex-col items-center gap-2'>
            <Icon name='secure-notes' />
            <p className='text-sm font-medium'>Secure Notes</p>
          </button>
        </li>
        <li className='flex flex-col border rounded-box sm:w-32 h-32 justify-center hover:border-primary hover:text-primary gap-5'>
          <button onClick={() => handlePasswordFormClick('bank_accounts')} className='flex flex-col items-center gap-2'>
            <Icon name='bank-accounts' />
            <p className='text-sm font-medium whitespace-nowrap'>Bank Accounts</p>
          </button>
        </li>
        <li className='flex flex-col border rounded-box sm:w-32 h-32 justify-center hover:border-primary hover:text-primary gap-5'>
          <button onClick={() => handlePasswordFormClick('payment_card')} className='flex flex-col items-center gap-2'>
            <Icon name='payment-cards' />
            <p className='text-sm font-medium whitespace-nowrap'>Payment Cards</p>
          </button>
        </li>
        <li className='flex flex-col border rounded-box sm:w-32 h-32 justify-center hover:border-primary hover:text-primary gap-5'>
          <button onClick={() => handlePasswordFormClick('addresses')} className='flex flex-col items-center gap-2'>
            <Icon name='addresses' />
            <p className='text-sm font-medium'>Addresses</p>
          </button>
        </li>
        <li className='flex flex-col border rounded-box sm:w-32 h-32 justify-center hover:border-primary hover:text-primary gap-5'>
          <button onClick={() => handlePasswordFormClick('environment_variables')} className='flex flex-col items-center gap-2'>
            <Icon name='code' />
            <p className='text-sm font-medium'>Env variabes</p>
          </button>
        </li>
      </ul>
      <Drawer
        drawerOpen={isDrawerOpen}
        title={darwerTitle}
        handleClose={handleDrawerCloseClicked}
        width={selectedType === 'environment_variables' ? 'w-full sm:w-[850px]' : 'w-full'}
      >
        <DynamicForm selectedType={selectedType as Exclude<typeof selectedType, undefined>} id={id} handleReload={refresh} handleDrawerCloseClicked={handleDrawerCloseClicked} />
      </Drawer>
    </div>
  )
}

export default ItemDrawer
