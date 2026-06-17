"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { site } from "@/data/portfolioData"
import styles from "./work.module.css"
import headerStyles from "../new-page.module.css"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatedHamburger } from "@/components/AnimatedHamburger"
import { ProjectsGridNew } from "@/components/ProjectsGridNew"

export default function WorkPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  function handleToggle(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug))
  }

  return (
    <>
      <div className={headerStyles.backgroundStage} aria-hidden="true" />
      <div className={headerStyles.page}>
        {/* Mobile nav overlay */}
        <nav
          className={`${headerStyles.mobileNav} ${menuOpen ? headerStyles.mobileNavOpen : ""}`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          <button className={headerStyles.mobileNavClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
          {[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/#contact" },
            { label: "GitHub ↗", href: site.github, ext: true },
          ].map(({ label, href, ext }) => (
            <a
              key={label}
              href={href}
              target={ext ? "_blank" : undefined}
              rel={ext ? "noopener noreferrer" : undefined}
              className={headerStyles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Header */}
        <header className={`${headerStyles.header} ${scrolled ? headerStyles.headerScrolled : ""}`}>
          <Link href="/" className={headerStyles.headerLogo}>M.H.</Link>
          <nav className={headerStyles.headerLinks} aria-label="Primary navigation">
            <Link href="/" className={headerStyles.headerLink}>
              Home
            </Link>
            <Link href="/about" className={headerStyles.headerLink}>
              About
            </Link>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className={headerStyles.headerLink}>
              GitHub ↗
            </a>
            <a href={site.cvPath} download className={headerStyles.headerCvBtn}>
              Download CV →
            </a>
          </nav>
          <AnimatedHamburger isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
        </header>

        {/* Work/Systems Section */}
        <section className={styles.work}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.header}
          >
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Work</span>
            </div>

            <h1 className={styles.title}>Engineering Systems</h1>
            <p className={styles.subtitle}>
              Production-grade platforms, frameworks, and tools. Click any card for full details.
            </p>
          </motion.div>

          <ProjectsGridNew
            expandedSlug={expandedSlug}
            onToggle={handleToggle}
            onClose={() => setExpandedSlug(null)}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={styles.cta}
          >
            <p>Interested in working together?</p>
            <Link href="/#contact" className={styles.ctaLink}>
              Let's talk →
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  )
}
