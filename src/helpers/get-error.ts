import { isAxiosError } from 'axios'

export const getAxiosError = (error: unknown, isError: boolean) => {
  if (!isError) return null
  if (isAxiosError(error)) {
    return error.response?.data?.comment
  }

  return 'Something went wrong.'
}
