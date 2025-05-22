export const typeIconMap: Record<string, string> = {
  password: 'fi-rr-globe',
  secure_notes: 'fi-rr-notebook',
  bank_accounts: 'fi-rr-bank',
  payment_card: 'fi-rr-credit-card',
  addresses: 'fi-rr-address-book',
  environment_variables: 'fi-rr-scale'
}

export const typeNormalize = (type: string | undefined): string | undefined => {
  return type?.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
