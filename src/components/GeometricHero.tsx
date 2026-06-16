"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { site } from "@/data/site"
import styles from "./geometric-hero.module.css"

/**
 * Warm + Earthy Geometric Hero
 * - Playful squishy blob that reacts to scroll
 * - Geometric grid background
 * - Crafted color palette (terracotta, sage, cream)
 */

export function GeometricHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<SVGSVGElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [blobScale, setBlobScale] = useState(1)
  const [isVisible, setIsVisible] = useState(true)

  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end center"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3])
  const blobRotate = useTransform(scrollYProgress, [0, 1], [0, 180])
  const blobScale2 = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  // Mouse tracking for blob
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePos({ x: x * 20 - 10, y: y * 20 - 10 })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Intersection Observer to pause animations when off-screen
  useEffect(() => {
    if (!heroRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  // Blob animation loop (paused when off-screen)
  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setBlobScale(1 + Math.sin(Date.now() / 2000) * 0.08)
    }, 30)
    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Geometric grid background */}
      <div className={styles.gridBackground} aria-hidden="true">
        <svg className={styles.gridSvg} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="rgba(193, 122, 95, 0.12)"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="1200" height="800" fill="url(#grid)" />
        </svg>
      </div>

      {/* Squishy morphing blob */}
      <motion.svg
        ref={blobRef}
        className={styles.blob}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          x: mousePos.x,
          y: mousePos.y,
          rotate: blobRotate,
          scale: blobScale2,
        }}
      >
        <defs>
          <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(193, 122, 95, 0.4)" />
            <stop offset="100%" stopColor="rgba(107, 142, 113, 0.4)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M100,20 C120,20 140,30 150,50 C160,70 155,90 145,110 C140,125 130,140 110,150 C90,160 70,160 50,150 C30,140 20,125 15,110 C5,90 10,70 20,50 C30,30 80,20 100,20"
          fill="url(#blobGradient)"
          animate={{
            d: [
              "M100,20 C120,20 140,30 150,50 C160,70 155,90 145,110 C140,125 130,140 110,150 C90,160 70,160 50,150 C30,140 20,125 15,110 C5,90 10,70 20,50 C30,30 80,20 100,20",
              "M100,15 C130,15 155,25 165,55 C175,85 165,105 150,125 C140,140 125,150 105,155 C85,160 60,155 40,145 C20,135 10,115 10,90 C10,60 25,30 50,20 C75,15 85,15 100,15",
              "M100,20 C120,20 140,30 150,50 C160,70 155,90 145,110 C140,125 130,140 110,150 C90,160 70,160 50,150 C30,140 20,125 15,110 C5,90 10,70 20,50 C30,30 80,20 100,20",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>

      {/* Content */}
      <motion.div className={styles.content} style={{ y: heroY, opacity: heroOpacity }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className={styles.eyebrow}>FULL-STACK · AI · SYSTEMS</p>
        </motion.div>

        <motion.h1
          className={styles.heading}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          I build complete <span className={styles.accentWord}>systems</span> from scratch.
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Full-stack developer specializing in CRM automation, AI workflows, and internal operations
          platforms. I craft software that moves the business forward.
        </motion.p>

        <motion.div
          className={styles.availability}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className={styles.statusDot} />
          AVAILABLE · US · Remote worldwide
        </motion.div>

        <motion.div
          className={styles.ctaGroup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <a href={site.cvPath} download className={styles.ctaPrimary}>
            <span>Download CV</span>
            <span className={styles.ctaArrow}>↓</span>
          </a>
          <a href="#systems" className={styles.ctaSecondary}>
            <span>View Systems</span>
            <span className={styles.ctaArrow}>↓</span>
          </a>
        </motion.div>

        <motion.p
          className={styles.metrics}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          6 systems · 4 domains · Premium quality
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  )
}
