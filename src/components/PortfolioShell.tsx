"use client"

import { useEffect, useState, type ComponentType } from "react"
import { usePathname } from "next/navigation"
import AuditToggle from "@/components/AuditToggle"
import Cursor from "@/components/Cursor"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import PageTransition from "@/components/PageTransition"
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

  // Gateway: bare, no chrome — cursor still active
  if (pathname === "/") {
    return (
      <>
        <Cursor />
        <main className="gateway-content">
          <PageTransition>{children}</PageTransition>
        </main>
      </>
    )
  }

  // Audience landings on confirmed mobile: no navbar, no footer, no scene
  // Default (null) falls through to full shell so desktop never flashes mobile layout
  if (isAudienceLanding && isMobile === true) {
    return (
      <main className="mobile-main-content">
        <PageTransition>{children}</PageTransition>
      </main>
    )
  }


  // All other pages + audience landings on desktop:
  // Audience landings skip the footer (they have their own contact section)
  return (
    <>
      <Cursor />
      {isMobile === false && <AuditToggle />}
      {DesktopScene && <DesktopScene />}
      <Navbar />
      <main className={isAudienceLanding ? "audience-main-content" : "main-content"}>
        <PageTransition>{children}</PageTransition>
      </main>
      {!isAudienceLanding && <Footer />}
    </>
  )
}
