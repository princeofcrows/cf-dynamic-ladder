import { AxiosClient } from '@/src/helpers/api-client'
import { UserInfoResponse } from '@/src/types/users'
import { useQuery } from '@tanstack/react-query'
import { UsersInfoParams } from '@/src/types/users'

export const useUserInfo = (params: UsersInfoParams) =>
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
