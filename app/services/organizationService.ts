import axios from 'axios'
import { components } from '@/apptypes/api-schema'
const BACKEND_URL = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL as string

export const fetchOrganization = async (token: string): Promise<any> => {
  let response, errorMessage
  try {
    response = await axios.get(`${BACKEND_URL}/Organization/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}

export const saveOrganization = async (organization: components['schemas']['OrganizationRequestModel'], token: string): Promise<any> => {
  let response, errorMessage
  try {
    response = await axios.post(`${BACKEND_URL}/Organization`, organization, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    )
  } catch (error) {
    errorMessage = error
  }
  return { data: response, error: errorMessage }
}
