import { components } from '@/apptypes/api-schema'
import axios from 'axios'
const BACKEND_URL = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL as string

export const fetchVault = async (token: string, page: number, pageSize: number): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/secret/${page}/${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching user:' + String(error))
  }
}
export const fetchAllVault = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/secret`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching user:' + String(error))
  }
}
export const fetchVaultByType = async (token: string, page: number, pageSize: number, type: components['schemas']['SecretType']): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/secret/${type}/${page}/${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching user:' + String(error))
  }
}
export const fetchAllVaultByType = async (token: string, type: components['schemas']['SecretType']): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/secret/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching user:' + String(error))
  }
}

export const fetchVaultById = async (token: string, id: string): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/secret/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching user:' + String(error))
  }
}

export const fetchVaultByCollectionId = async (token: string, collectionId: string): Promise<any> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/secret/collection/${collectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Error fetching user:' + String(error))
  }
}

export const saveVault = async (vault: components['schemas']['SecretWithCollectionsRequestModel'], token: string): Promise<any> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/secret`, vault, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    throw new Error('Error saving user:' + String(error))
  }
}
export const updateVault = async (vault: components['schemas']['SecretWithCollectionsRequestModel'], id: string, token: string): Promise<any> => {
  try {
    const response = await axios.put(`${BACKEND_URL}/secret/${id}`, vault, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    throw new Error('Error updating user:' + String(error))
  }
}

export const deleteVault = async (id: string, token: string): Promise<any> => {
  let response, errorMessage
  try {
    response = await axios.delete(`${BACKEND_URL}/secret/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}

export const deleteBulkVault = async (selectedIds: string[], token: string): Promise<any> => {
  let response, errorMessage
  try {
    response = await axios.delete(`${BACKEND_URL}/secret/bulkDelete`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: selectedIds
    })
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}
