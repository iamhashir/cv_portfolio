"use client"

import { useEffect, useState } from "react"

const MOBILE_QUERY = "(max-width: 768px)"

export function useMobileExperience() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(media.matches)

    update()
    media.addEventListener("change", update)

    return () => media.removeEventListener("change", update)
  }, [])

  return isMobile
}
