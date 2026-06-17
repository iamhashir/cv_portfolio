"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { site, CAPABILITIES } from "@/data/portfolioData"
import styles from "./about.module.css"
import headerStyles from "../new-page.module.css"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatedHamburger } from "@/components/AnimatedHamburger"

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
            { label: "Systems", href: "/#systems" },
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
            <a href={site.github} target="_blank" rel="noopener noreferrer" className={headerStyles.headerLink}>
              GitHub ↗
            </a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={headerStyles.headerLink}>
              LinkedIn ↗
            </a>
            <a href={site.cvPath} download className={headerStyles.headerCvBtn}>
              Download CV →
            </a>
          </nav>
          <AnimatedHamburger isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
        </header>

        {/* About Section */}
        <section className={styles.about}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.container}
          >
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span>/</span>
              <span>About</span>
            </div>

            <h1 className={styles.title}>About Me</h1>

            <div className={styles.grid}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={styles.column}
              >
                <h2 className={styles.sectionTitle}>Who I Am</h2>
                <p className={styles.text}>
                  {site.bio}
                </p>
                <p className={styles.text}>
                  I specialize in building production-grade systems that handle complex workflows,
                  from CRM automation to internal operations platforms. My approach combines
                  technical excellence with deep understanding of business needs.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={styles.column}
              >
                <h2 className={styles.sectionTitle}>My Approach</h2>
                <ul className={styles.list}>
                  <li>Understand the problem deeply before coding</li>
                  <li>Build systems that scale and adapt</li>
                  <li>Write clean, maintainable code</li>
                  <li>Focus on user experience and performance</li>
                  <li>Deliver on time, every time</li>
                </ul>
              </motion.div>
            </div>

            <div className={styles.capabilities}>
              <h2 className={styles.sectionTitle}>Capabilities</h2>
              <div className={styles.capabilitiesGrid}>
                {CAPABILITIES.map((cap, i) => (
                  <motion.div
                    key={cap}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={styles.capabilityTag}
                  >
                    {cap}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={styles.cta}
            >
              <p>Ready to work together?</p>
              <a href="/#contact" className={styles.ctaLink}>
                Get in touch →
              </a>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  )
}
