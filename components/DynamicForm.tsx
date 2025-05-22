import BankDetailsForm from '@/app/vault/bank-accounts/BankDetailsForm'
import PasswordForm from '@/app/vault/passwords/PasswordForm'
import PaymentForm from '@/app/vault/payment-cards/PaymentForm'
import SecureNotesForm from '@/app/vault/secure-notes/SecureNotesForm'
import AddressesForm from '@/app/vault/addresses/AddressForm'
import EnvironmentVariablesForm from '@/app/vault/environmentvariables/EnvironmentVariablesForm'
import React from 'react'
import { components } from '@/apptypes/api-schema'

interface DynamicFormProps {
  selectedType: components['schemas']['SecretType']
  id: string
  handleReload: () => void
  handleDrawerCloseClicked: () => void
}

const DynamicForm = ({ selectedType, id, handleReload, handleDrawerCloseClicked }: DynamicFormProps): React.ReactNode => {
  const formComponents: { [key: string]: React.ComponentType<any> } = {
    secure_notes: SecureNotesForm,
    password: PasswordForm,
    addresses: AddressesForm,
    bank_accounts: BankDetailsForm,
    payment_card: PaymentForm,
    environment_variables: EnvironmentVariablesForm
  }
  const SelectedForm = formComponents[selectedType]

  return SelectedForm !== undefined
    ? (
      <SelectedForm
        id={id}
        handleReload={handleReload}
        handleDrawerCloseClicked={handleDrawerCloseClicked}
      />
      )
    : null
}

export default DynamicForm
