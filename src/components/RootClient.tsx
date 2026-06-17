'use client'

import { useClickSqueeze } from '@/hooks/useClickSqueeze'

export function RootClient({ children }: { children: React.ReactNode }) {
  useClickSqueeze()
  return <>{children}</>
}
