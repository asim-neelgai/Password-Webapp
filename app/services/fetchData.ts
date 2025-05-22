import axios, { AxiosResponse } from 'axios'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  statusCode: number
  body?: any
}

export async function fetchData<T> (
  url: string,
  method: 'POST' | 'GET' | 'PUT' | 'DELETE',
  data?: T
): Promise<ApiResponse<T>> {
  try {
    const axiosConfig = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data != null ? JSON.stringify(data) : undefined
    }

    const response: AxiosResponse = await axios(axiosConfig)

    return {
      success: true,
      statusCode: response.status,
      data: response.data
    }
  } catch (error) {
    throw new Error('An unexpected error occurred.')
  }
}
