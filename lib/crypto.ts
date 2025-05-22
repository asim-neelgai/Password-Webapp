import { convertToUint8Array, objectToUint8Array } from './store'

export const deriveMasterKeyWeb = async (password: string, email: string): Promise<Uint8Array> => {
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)
  const saltBuffer = encoder.encode(email)

  const algorithm = 'PBKDF2'
  const iterations = 600000
  const hash = 'SHA-256'
  const keyLength = 256

  try {
    const derivedKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: algorithm },
      false,
      ['deriveBits']
    )

    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: algorithm,
        salt: saltBuffer,
        iterations,
        hash: { name: hash }
      },
      derivedKey,
      keyLength
    )

    return new Uint8Array(derivedBits)
  } catch (error) {
    throw new Error('Error deriving master key: ' + error)
  }
}

export const stretchMasterKeyWeb = async (
  masterKey: Uint8Array
): Promise<Uint8Array> => {
  const hashAlgorithm = 'SHA-256'
  const expandedKeyLength = 256 / 8 // 256 bits
  const info = new TextEncoder().encode('FortLock')
  const importAlgorithm = {
    name: 'HKDF',
    hash: { name: hashAlgorithm },
    length: expandedKeyLength * 8,
    info
  }
  try {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      masterKey,
      importAlgorithm,
      false,
      ['deriveBits']
    )
    const salt = new Uint8Array([
      0x54, 0x68, 0x69, 0x73, 0x49, 0x73, 0x41,
      0x53
    ])
    const hkdfParams = {
      name: 'HKDF',
      hash: hashAlgorithm,
      salt,
      info
    }

    const derivedKey = await window.crypto.subtle.deriveBits(
      hkdfParams,
      keyMaterial,
      expandedKeyLength * 8
    )

    return new Uint8Array(derivedKey)
  } catch (error: any) {
    throw new Error('Error stretching master key: ' + error)
  }
}

export const getKey = async (email: string, password: string): Promise<Uint8Array> => {
  const masterKey = await deriveMasterKeyWeb(
    password,
    email
  )
  const stretchedMasterKey = await stretchMasterKeyWeb(masterKey)
  return stretchedMasterKey
}
export const generateProtectedSymmetricKey = async (stretchedMasterKey: Uint8Array): Promise<{ iv: Uint8Array, encryptedKey: Uint8Array }> => {
  const keySize = 256 // Using 256-bit key
  const algorithm = { name: 'AES-CBC', length: keySize }

  // Generate a single 256-bit key
  const key = await window.crypto.subtle.generateKey(algorithm, true, [
    'encrypt',
    'decrypt'
  ])

  const iv = window.crypto.getRandomValues(new Uint8Array(16)) // Initialization Vector

  // Export the generated key
  const exportedKey = await window.crypto.subtle.exportKey('raw', key)

  // Use the same key twice to simulate a 512-bit key by concatenation
  const concatenatedKey = new Uint8Array([
    // @ts-expect-error
    ...new Uint8Array(exportedKey),
    // @ts-expect-error
    ...new Uint8Array(exportedKey)
  ])
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    stretchedMasterKey, // 32
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  )
  const encryptedKey = await window.crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv
    },
    cryptoKey,
    concatenatedKey
  )

  return {
    iv,
    encryptedKey: new Uint8Array(encryptedKey)
  }
}

export const decryptProtectedSymmetricKey = async (
  stretchedMasterKey: Uint8Array,
  protectedSymmetricKey: { iv: any, encryptedKey: any }
): Promise<Uint8Array | undefined> => {
  const { iv, encryptedKey } = protectedSymmetricKey

  const encryptedKeyArr = objectToArray(encryptedKey)
  const encryptedKeyBuffer = convertToUint8Array(encryptedKeyArr.join(','))

  const ivArr = objectToArray(iv)
  const ivBuffer = convertToUint8Array(ivArr.join(','))

  try {
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      stretchedMasterKey,
      { name: 'AES-CBC' },
      false,
      ['encrypt', 'decrypt']
    )

    const decryptedKey = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: ivBuffer
      },
      cryptoKey,
      encryptedKeyBuffer
    )
    return new Uint8Array(decryptedKey)
  } catch (error) {
    throw new Error('Error decrypting protected symmetric key' + error)
  }
}

const objectToArray = (object: { [x: string]: any }): string[] => {
  const stringArray = []
  for (const key in object) {
    stringArray.push(String(object[key]))
  }
  return stringArray
}

export const getDecryptedSymmetricKey = async (masterKeyString: string, protectedSymmetricKeyString: any): Promise<Uint8Array | undefined> => {
  const masterKey = convertToUint8Array(masterKeyString)
  const stretchedMasterKey = await stretchMasterKeyWeb(masterKey)

  const protectedSymmetricKey = JSON.parse(protectedSymmetricKeyString)

  const decryptedSymmetricKey = await decryptProtectedSymmetricKey(
    stretchedMasterKey,
    protectedSymmetricKey
  )
  return decryptedSymmetricKey
}

export const getIvAndEncryptedData = (contentObj: any): {
  iv: Uint8Array
  encryptedData: Uint8Array
} => {
  const { iv, encryptedData } = contentObj
  const ivUint8Array = objectToUint8Array(iv)
  const encryptedDataUint8Array = objectToUint8Array(encryptedData)
  const result = {
    iv: ivUint8Array,
    encryptedData: encryptedDataUint8Array
  }
  return result
}

export const generateSalt = (): string => {
  const randomBytes = new Uint8Array(16)

  window.crypto.getRandomValues(randomBytes)

  const hexString = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
  return hexString
}

export const generateRandomIV = (): Uint8Array => {
  return window.crypto.getRandomValues(new Uint8Array(16))
}

export const encrypt = async (data: string, salt: string, iv: Uint8Array): Promise<string> => {
  const encodedData = new TextEncoder().encode(data)
  const encodedSalt = new TextEncoder().encode(salt)

  const derivedKey = await window.crypto.subtle.importKey(
    'raw',
    encodedSalt,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encodedSalt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    derivedKey,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt']
  )

  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    aesKey,
    encodedData
  )

  return Buffer.from(encryptedData).toString('base64')
}
