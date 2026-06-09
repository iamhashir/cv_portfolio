import { create } from 'zustand'

interface AppState {
  activeProject: string | null
  setActiveProject: (id: string | null) => void
  isAuditMode: boolean
  toggleAuditMode: () => void
  selectedProjectSlug: string | null
  setSelectedProjectSlug: (slug: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeProject: null,
  setActiveProject: (id) => set({ activeProject: id }),
  isAuditMode: false,
  toggleAuditMode: () => set((state) => ({ isAuditMode: !state.isAuditMode })),
  selectedProjectSlug: null,
  setSelectedProjectSlug: (slug) => set({ selectedProjectSlug: slug })
}))
