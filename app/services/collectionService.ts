import axios from 'axios'
import { components } from '@/apptypes/api-schema'
const BACKEND_URL = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL as string

export const fetchCollection = async (token: string): Promise<any> => {
  let response, errorMessage
  try {
    response = await axios.get(`${BACKEND_URL}/collection/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}

export const saveCollection = async (folder: components['schemas']['CollectionModel'], token: string): Promise<any> => {
  let response, errorMessage
  try {
    response = await axios.post(`${BACKEND_URL}/collection`, folder, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}

export const updateCollection = async (folder: components['schemas']['CollectionModel'], token: string, id: string): Promise<any> => {
  let response, errorMessage

  try {
    response = await axios.put(`${BACKEND_URL}/collection/${id}`, folder, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}

export const deleteCollection = async (id: string, token: string): Promise<any> => {
  let response, errorMessage

  try {
    response = await axios.delete(`${BACKEND_URL}/collection/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}
