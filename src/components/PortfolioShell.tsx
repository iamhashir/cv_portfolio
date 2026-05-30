"use client"

import { usePathname } from "next/navigation"
import AuditToggle from "@/components/AuditToggle"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import Scene from "@/components/Scene"

export default function PortfolioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/") {
    return <main className="gateway-content">{children}</main>
  }

  return (
    <>
      <AuditToggle />
      <Scene />
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  )
}
