"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { site } from "@/data/portfolioData"
import styles from "./work.module.css"
import headerStyles from "../new-page.module.css"
import { useState, useEffect } from "react"
import { ProjectsGridNew } from "@/components/ProjectsGridNew"

export default function WorkPage() {
  const [scrolled, setScrolled] = useState(false)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleToggle(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug))
  }

  return (
    <>
      <div className={headerStyles.backgroundStage} aria-hidden="true" />
      <div className={headerStyles.page}>
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
