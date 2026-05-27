import { AxiosClient } from '@/src/helpers/api-client'
import { UserInfoResponse } from '@/src/types/users'
import { useQuery } from '@tanstack/react-query'

export const useTraineesInfo = (handles: string[]) =>
  useQuery({
    queryKey: ['trainees-info', handles],
    async queryFn() {
      if (!handles || handles.length === 0) {
        return []
      }

      const { data }: { data: UserInfoResponse } = await AxiosClient.get('/user.info', {
        params: { handles: handles.join(';'), lang: 'en' },
      })

      return data.result
    },
    enabled: handles.length > 0,
  })
