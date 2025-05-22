import axios from 'axios'
import { UserKeys } from '../../apptypes/keys'
const BACKEND_URL = process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL

export const fetchUser = async (token: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/User`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

export const saveUser = async (userKeys: UserKeys, token?: string): Promise<any> => {
  try {
    const response = await axios.post(`${BACKEND_URL}/User`, userKeys, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error saving user:', error)
  }
}
