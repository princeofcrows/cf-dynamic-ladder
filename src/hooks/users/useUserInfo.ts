import { AxiosClient } from '@/src/helpers/api-client'
import { UserInfoResponse } from '@/src/types/users'
import { useQuery } from '@tanstack/react-query'

export type UserInfoParams = {
  handles: string
} | null

export const useUserInfo = (params: UserInfoParams) =>
  useQuery({
    queryKey: ['user-info', params],
    async queryFn() {
      if (params == null) {
        return null
      }

      const { data }: { data: UserInfoResponse } = await AxiosClient.get('/user.info', {
        params: { ...params, lang: 'en' },
      })

      return data.result.at(0)
    },
  })
