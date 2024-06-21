import { AxiosClient } from '@/src/helpers/api-client'
import { UserStatusParams, UserStatusResponse } from '@/src/types/users'
import { useQuery } from '@tanstack/react-query'

export const useUserStatus = (params: UserStatusParams) =>
  useQuery({
    queryKey: ['user-status', params],
    async queryFn() {
      if (params == null) {
        return null
      }

      const { data }: { data: UserStatusResponse } = await AxiosClient.get('/user.status', {
        params: { ...params, lang: 'en' },
      })

      return data.result
    },
  })
