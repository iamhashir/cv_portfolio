"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { FileText } from "lucide-react"
import styles from "./layout.module.css"
import ThemeToggle from "./ThemeToggle"

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#@$%"
const TITLES = ["Full-Stack Developer", "AI Automations Engineer", "Systems Architect"]

function NavCenterTitle() {
  const [idx, setIdx] = useState(0)
  const [display, setDisplay] = useState(TITLES[0])
  const idxRef = useRef(0)

  useEffect(() => {
    const cycle = () => {
      const next = (idxRef.current + 1) % TITLES.length
      const target = TITLES[next]
      let iter = 0
      const frame = setInterval(() => {
        setDisplay(
          target.split("").map((c, i) => {
            if (c === " ") return " "
            if (i < iter) return target[i]
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }).join("")
        )
        iter += 0.45
        if (iter >= target.length) {
          clearInterval(frame)
          idxRef.current = next
          setIdx(next)
        }
      }, 28)
    }

    const interval = setInterval(cycle, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.navCenter}>
      <span className={styles.navBracket}>[</span>
      <span className={styles.navTitle}>{display}</span>
      <span className={styles.navCursor} />
      <span className={styles.navBracket}>]</span>
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = [
    { name: "Home",    href: "/"        },
    { name: "Work",    href: "/work"    },
    { name: "About",   href: "/about"   },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ""}`}>
      {/* Animated gradient line */}
      <div className={styles.navbarGradientLine} />

      {/* Cycling scramble title — absolutely positioned */}
      <NavCenterTitle />

      <div className={`container ${styles.navContainer}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>Malik Hashir</Link>
        </div>

        <ul className={styles.navLinks}>
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <li key={link.href}>
                <Link href={link.href} className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}>
                  {link.name}
                </Link>
              </li>
            )
          })}
          {pathname === "/hr" && (
            <li>
              <button type="button" className={styles.cvLink}
                onClick={() => window.dispatchEvent(new CustomEvent("open-cv-modal"))}>
                <FileText size={13} />
                <span>View CV</span>
              </button>
            </li>
          )}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  )
}
