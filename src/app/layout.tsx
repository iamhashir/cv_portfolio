import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { site } from "@/data/site"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: site.seo.title,
  description: site.seo.description,
  keywords: site.seo.keywords,
  authors: [{ name: site.name }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    url: `https://${site.domain}`,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    creator: `@${site.githubHandle}`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a href="#hero" className="skip-to-main">Skip to main content</a>
        {children}
      </body>
    </html>
  )
}
