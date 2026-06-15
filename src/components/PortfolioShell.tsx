"use client"

import React, { useEffect } from "react"
import { usePathname } from "next/navigation"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import PageTransition from "@/components/PageTransition"
import { useMobileExperience } from "@/lib/useMobileExperience"
import dynamic from "next/dynamic"
import { NoiseOverlay } from "@/components/ui/NoiseOverlay"
import { useAppStore } from "@/lib/store"

// Dynamically load client-heavy components to bypass SSR problems and keep bundle lean
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false })
const AuditToggle = dynamic(() => import("@/components/AuditToggle"), { ssr: false })
const ProjectModal = dynamic(() => import("@/components/ProjectModal"), { ssr: false })

export default function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useMobileExperience()
  const isAudienceLanding = pathname === "/hr" || pathname === "/client"
  const isHome = pathname === "/"
  const { setSelectedProjectSlug } = useAppStore()

  useEffect(() => {
    if (isHome) return
    if (typeof window === "undefined") return

    // 1. Intercept query parameters on load (e.g. direct entry to /work/slug redirecting to /?work=slug)
    const urlParams = new URLSearchParams(window.location.search)
    const work = urlParams.get("work")
    if (work) {
      setSelectedProjectSlug(work)
      window.history.replaceState(null, "", `/work/${work}`)
    }

    // 2. Intercept global link clicks to /work/[slug]
    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      const match = href.match(/^\/work\/([^/]+)$/)
      if (match) {
        const slug = match[1]
        e.preventDefault()
        setSelectedProjectSlug(slug)
        window.history.pushState(null, "", href)
      }
    }

    // 3. Listen to browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname
      const match = path.match(/^\/work\/([^/]+)$/)
      if (match) {
        setSelectedProjectSlug(match[1])
      } else {
        setSelectedProjectSlug(null)
      }
    }

    document.addEventListener("click", handleGlobalClick)
    window.addEventListener("popstate", handlePopState)

    return () => {
      document.removeEventListener("click", handleGlobalClick)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [setSelectedProjectSlug, isHome])

  // New home page is self-contained — skip navbar/footer/scene/auditToggle
  if (isHome) return <>{children}</>

  // Audience landings on confirmed mobile: no navbar, no footer
  if (isAudienceLanding && isMobile === true) {
    return (
      <main className="mobile-main-content">
        <NoiseOverlay />
        <PageTransition>{children}</PageTransition>
      </main>
    )
  }

  return (
    <>
      <NoiseOverlay />
      <ProjectModal />
      {isMobile !== true && <Scene />}
      <AuditToggle />
      <Navbar />
      <main className={isAudienceLanding ? "audience-main-content" : "main-content"}>
        <PageTransition>{children}</PageTransition>
      </main>
      {!isAudienceLanding && <Footer />}
    </>
  )
}


