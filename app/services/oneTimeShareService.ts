import { components } from '@/apptypes/api-schema'
import axios from 'axios'
const BACKEND_URL = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL as string

export const fetchOnetimeShareById = async (id: string, salt: string): Promise<any> => {
  let response, errorMessage

  try {
    const response = await axios.get(`${BACKEND_URL}/onetimeshare/${id}?salt=${salt}`)
    return response
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}

export const saveOnetimeShare = async (OnetimeShare: components['schemas']['OneTimeShareRequestModel'], token: string): Promise<any> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/onetimeshare`, OnetimeShare, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    throw new Error('Error saving user:' + String(error))
  }
}

export const deleteOnetimeShare = async (id: string, token: string): Promise<any> => {
  let response, errorMessage
  try {
    response = await axios.delete(`${BACKEND_URL}/onetimeshare/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}
