
export const encryptDataWithKey = async (data: string | undefined, symmetricKey: Uint8Array | undefined): Promise<{ iv: Uint8Array, encryptedData: Uint8Array } | undefined> => {
  try {
    const iv = window.crypto.getRandomValues(new Uint8Array(16)) // Generate IV

    const firstKey = slicedSymmetricKey(symmetricKey)
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      firstKey,
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    )

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv
      },
      cryptoKey,
      new TextEncoder().encode(data) // Convert data to bytes
    )

    return {
      iv,
      encryptedData: new Uint8Array(encryptedData)
    }
  } catch (error) {
    console.error(error)
  }
}

export const decryptDataWithKey = async (
  encryptedData: { iv: Uint8Array, encryptedData: Uint8Array } | undefined,
  symmetricKey: Uint8Array | undefined
): Promise<string | undefined> => {
  if (encryptedData != null) {
    const { iv, encryptedData: ciphertext } = encryptedData
    const firstKey = slicedSymmetricKey(symmetricKey)
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      firstKey,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    )

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv
      },
      cryptoKey,
      ciphertext
    )

    return new TextDecoder().decode(decryptedData)
  }

  return undefined
}

const slicedSymmetricKey = (symmetricKey: any): Uint8Array => {
  const requiredKeyLength = 128
  const symmetricKeyString = String(symmetricKey) // Ensure symmetricKey is a string

  const symmetricKeyBuffer = hexStringToBuffer(symmetricKeyString)

  // Get the first part of the key as an ArrayBuffer
  // since webcrypton api only accepts 128 or 256 bits
  const firstKey = symmetricKeyBuffer.slice(0, requiredKeyLength / 8) // Divide by 8 as each byte is 8 bits
  return firstKey
}

const hexStringToBuffer = (hexString: string): Uint8Array => {
  const buffer = new Uint8Array(hexString.length / 2)
  for (let i = 0; i < hexString.length; i += 2) {
    buffer[i / 2] = parseInt(hexString.substring(i, i + 2), 16)
  }
  return buffer
}
