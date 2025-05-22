
export const deriveKeyFromPassword = async (password: string, salt: Uint8Array): Promise<{ derivedKey: CryptoKey, salt: Uint8Array }> => {
  const encoder = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  return { derivedKey, salt }
}

export const securelyStoreKey = async (email: string, keyToStore: Uint8Array): Promise<void> => {
  try {
    const randomSalt = window.crypto.getRandomValues(new Uint8Array(16))
    const { derivedKey, salt } = await deriveKeyFromPassword(
      email,
      randomSalt
    )
    const encodedKey = new TextEncoder().encode(JSON.stringify(keyToStore))
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encryptedKey = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128
      },
      derivedKey,
      encodedKey
    )

    sessionStorage.setItem('encryptedKey', new Uint8Array(encryptedKey).toString())
    sessionStorage.setItem('salt', salt.toString())
    sessionStorage.setItem('iv', iv.toString())
    sessionStorage.setItem('email', email)
  } catch (error) {
    console.error('Error storing key:', error)
  }
}

export const retrieveKey = async (password: string): Promise<Uint8Array | null> => {
  try {
    const saltString = sessionStorage.getItem('salt')
    const salt = convertToUint8Array(saltString!)

    const encryptedKeyString = sessionStorage.getItem('encryptedKey')

    const stringIV = sessionStorage.getItem('iv')
    const iv = convertToUint8Array(stringIV!)

    const encryptedKey = convertToUint8Array(encryptedKeyString!)

    const { derivedKey } = await deriveKeyFromPassword(password, salt)

    const decryptedKey = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128
      },
      derivedKey,
      encryptedKey
    )

    const decodedKey = new TextDecoder().decode(decryptedKey)
    const parsedKey = JSON.parse(decodedKey)
    const commaSeparatedValues = Object.values(parsedKey).join(',')
    const originalKey = convertToUint8Array(commaSeparatedValues)

    return originalKey
  } catch (error) {
    console.error('Error retrieving key:', error)
    return null
  }
}

export function convertToUint8Array (string: string): Uint8Array {
  const numbers = string.split(',').map(Number)
  return new Uint8Array(numbers)
}
export function objectToUint8Array (obj: any): Uint8Array {
  const length = Object.keys(obj).length
  const uint8Array = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    uint8Array[i] = obj[i]
  }
  return uint8Array
}
export function setSessionStorage (key: string, value: string): void {
  sessionStorage.setItem(key, value)
}

export function getSessionStorage (key: string): string | null {
  return sessionStorage.getItem(key)
}
