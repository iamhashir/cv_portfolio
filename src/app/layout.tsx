import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SmoothScroller from "@/components/SmoothScroller"
import Scene from "@/components/Scene"
import CustomCursor from "@/components/CustomCursor"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const outfit = Outfit({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Malik Hashir | Full-Stack Developer for CRM & Business Systems",
  description: "Full-stack developer building CRM, workflow automation, and internal operations tools. Custom operations software and AI-assisted workflows in React, TS, and Node.js.",
  keywords: ["Malik Hashir", "Full Stack Developer", "CRM", "Automation", "Operations Software", "Internal Tools", "React", "TypeScript", "Node.js", "Abu Dhabi", "UAE"],
  authors: [{ name: "Malik Hashir" }],
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <CustomCursor />
        <Scene />
        <SmoothScroller>
          <Navbar />
          <main className="main-content">{children}</main>
          <Footer />
        </SmoothScroller>
      </body>
    </html>
  )
}
