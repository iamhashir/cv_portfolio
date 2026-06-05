"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FileText } from "lucide-react"
import styles from "./layout.module.css"

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initialize state on mount

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const links = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/work" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ""}`}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            Malik Hashir
          </Link>
        </div>

        <ul className={styles.navLinks}>
          {links.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
                >
                  {link.name}
                </Link>
              </li>
            )
          })}
          {pathname === "/hr" && (
            <li>
              <a
                href="/Malik_Hashir_CV.pdf"
                target="_blank"
                rel="noreferrer"
                className={styles.cvLink}
              >
                <FileText size={13} />
                <span>View CV</span>
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
