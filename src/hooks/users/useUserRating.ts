import { AxiosClient } from '@/src/helpers/api-client'
import { UserStatusParams, UserRatingResponse } from '@/src/types/users'
import { useQuery } from '@tanstack/react-query'

export const useUserRating = (params: UserStatusParams) =>
  useQuery({
    queryKey: ['user-rating', params],
    async queryFn() {
      if (params == null) {
        return null
      }

      const { data }: { data: UserRatingResponse } = await AxiosClient.get('/user.rating', {
        params: { ...params },
      })

      return data.result
    },
  })
