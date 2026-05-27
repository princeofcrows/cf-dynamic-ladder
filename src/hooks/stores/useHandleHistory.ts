import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type HandleHistoryState = {
  handles: string[]
  append: (handle: string) => void
  remove: (handle: string) => void
  clear: () => void
}

const MAX_HANDLES = 12

function norm(h: string) {
  return h.trim()
}

export const useHandleHistory = create<HandleHistoryState>()(
  devtools(
    persist(
      set => ({
        handles: [],
        append: handle => {
          const trimmed = norm(handle)
          if (!trimmed) return
          set(state => {
            const prev = Array.isArray(state.handles) ? state.handles : []
            const next = [trimmed, ...prev.filter(h => h.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_HANDLES)
            return { handles: next }
          })
        },
        remove: handle => {
          const trimmed = norm(handle)
          if (!trimmed) return
          set(state => {
            const prev = Array.isArray(state.handles) ? state.handles : []
            return { handles: prev.filter(h => h.toLowerCase() !== trimmed.toLowerCase()) }
          })
        },
        clear: () => set({ handles: [] }),
      }),
      { name: 'coach-handle-history' }
    )
  )
)
