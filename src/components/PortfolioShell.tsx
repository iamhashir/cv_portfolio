"use client"

import { useEffect, useState, type ComponentType } from "react"
import { usePathname } from "next/navigation"
import AuditToggle from "@/components/AuditToggle"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { useMobileExperience } from "@/lib/useMobileExperience"

export default function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useMobileExperience()
  const [DesktopScene, setDesktopScene] = useState<ComponentType | null>(null)
  const isAudienceLanding = pathname === "/hr" || pathname === "/client"

  useEffect(() => {
    if (isMobile !== false) return

    let isActive = true

    import("@/components/Scene").then(({ default: Scene }) => {
      if (isActive) setDesktopScene(() => Scene)
    })

    return () => {
      isActive = false
    }
  }, [isMobile])

  if (pathname === "/") {
    return <main className="gateway-content">{children}</main>
  }

  if (isAudienceLanding && isMobile !== false) {
    return <main className="mobile-main-content">{children}</main>
  }

  return (
    <>
      {isMobile === false && <AuditToggle />}
      {DesktopScene && <DesktopScene />}
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  )
}
