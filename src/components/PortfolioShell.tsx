"use client"

import { usePathname } from "next/navigation"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import PageTransition from "@/components/PageTransition"
import { useMobileExperience } from "@/lib/useMobileExperience"

export default function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useMobileExperience()
  const isAudienceLanding = pathname === "/hr" || pathname === "/client"

  // Audience landings on confirmed mobile: no navbar, no footer
  if (isAudienceLanding && isMobile === true) {
    return (
      <main className="mobile-main-content">
        <PageTransition>{children}</PageTransition>
      </main>
    )
  }

  return (
    <>
      <Navbar />
      <main className={isAudienceLanding ? "audience-main-content" : "main-content"}>
        <PageTransition>{children}</PageTransition>
      </main>
      {!isAudienceLanding && <Footer />}
    </>
  )
}
