"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { FileText } from "@phosphor-icons/react"
import { Magnetic } from "@/components/ui/Magnetic"
import styles from "./layout.module.css"
import ThemeToggle from "./ThemeToggle"
import { site } from "@/data/site"

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#@$%"
const TITLES: string[] = [...site.roles]

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

  const links = site.navLinks

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ""}`}>
      {/* Animated gradient line */}
      <div className={styles.navbarGradientLine} />

      {/* Cycling scramble title — absolutely positioned */}
      <NavCenterTitle />

      <div className={`container ${styles.navContainer}`}>
        <div className={styles.brand}>
          <Magnetic strength={5}>
            <Link href="/" className={styles.logo}>{site.name}</Link>
          </Magnetic>
        </div>

        <ul className={styles.navLinks}>
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <li key={link.href}>
                <Magnetic strength={8}>
                  <Link href={link.href} className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}>
                    {link.name}
                  </Link>
                </Magnetic>
              </li>
            )
          })}
          {pathname === "/hr" && (
            <li>
              <Magnetic strength={10}>
                <button type="button" className={styles.cvLink}
                  onClick={() => window.dispatchEvent(new CustomEvent("open-cv-modal"))}>
                  <FileText size={16} weight="duotone" />
                  <span>View CV</span>
                </button>
              </Magnetic>
            </li>
          )}
          <li>
            <Magnetic strength={10}>
              <div className="inline-block">
                <ThemeToggle />
              </div>
            </Magnetic>
          </li>
        </ul>
      </div>
    </nav>
  )
}
