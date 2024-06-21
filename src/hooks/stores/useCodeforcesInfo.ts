import { create } from 'zustand'
import { UsersInfoParams, UserStatusParams } from '@/src/types/users'
import { devtools, persist } from 'zustand/middleware'

interface CodeforcesInfo {
  handle: string
  infoParams: UsersInfoParams
  statusParams: UserStatusParams
  setHandle: (value: string) => void
  setParams: () => void
}

export const useCodeforcesInfo = create<CodeforcesInfo>()(
  devtools(
    persist(
      set => ({
        handle: '',
        infoParams: null,
        statusParams: null,
        setHandle: value => {
          set({ handle: value })
        },
        setParams: () => {
          set(state => {
            return { infoParams: { handles: state.handle }, statusParams: { handle: state.handle } }
          })
        },
      }),
      { name: 'info-store' }
    )
  )
)
