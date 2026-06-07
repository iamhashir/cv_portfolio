"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import styles from "./page.module.css"

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#@$%"

const TECH_PILLS = [
  { label: "React",       pos: styles.pillTL, delay: "0s"    },
  { label: "TypeScript",  pos: styles.pillTR, delay: "0.6s"  },
  { label: "Node.js",     pos: styles.pillML, delay: "1.1s"  },
  { label: "Python",      pos: styles.pillMR, delay: "0.3s"  },
  { label: "PostgreSQL",  pos: styles.pillBL, delay: "1.4s"  },
  { label: "AI / ML",     pos: styles.pillBR, delay: "0.8s"  },
]

const SPLASH_LINES = [
  { prefix: ">",  text: "ssh malik@malik-hashir.dev",      dim: false },
  { prefix: "✓",  text: "connected  ·  latency 12ms",      dim: false },
  { prefix: "✓",  text: "build: PASSING  ·  tests: 100%",  dim: false },
  { prefix: "✓",  text: "uptime: 99.98%  ·  last deploy: 2m ago", dim: false },
  { prefix: "",   text: "",                                 dim: true  },
]

function SplashTerminal({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    SPLASH_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 120 + i * 420))
    })
    const total = 120 + SPLASH_LINES.length * 420
    timers.push(setTimeout(() => setFading(true), total + 300))
    timers.push(setTimeout(() => onDone(),        total + 1100))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div className={`${styles.splash} ${fading ? styles.splashOut : ""}`}>
      <div className={styles.splashInner}>
        <div className={styles.splashHeader}>malik-hashir.dev</div>
        {SPLASH_LINES.slice(0, step).map(({ prefix, text }, i) => (
          <div key={i} className={styles.splashLine}>
            <span className={styles.splashGt}>{prefix}&nbsp;</span>
            {text}
          </div>
        ))}
        {step >= SPLASH_LINES.length && <span className={styles.splashBlink} />}
      </div>
    </div>
  )
}

function useScramble(text: string) {
  const [display, setDisplay] = useState(text)
  useEffect(() => {
    let iteration = 0
    let frame: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      frame = setInterval(() => {
        setDisplay(
          text.split("").map((letter, i) => {
            if (letter === " ") return " "
            if (i < iteration) return text[i]
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }).join("")
        )
        iteration += 0.4
        if (iteration >= text.length) clearInterval(frame)
      }, 28)
    }, 900)
    return () => { clearTimeout(timeout); clearInterval(frame) }
  }, [text])
  return display
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, delay: 0.3 + i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

export default function Home() {
  const sectionRef = useRef<HTMLElement>(null)
  const coordRef   = useRef<HTMLSpanElement>(null)
  const scrambled  = useScramble("Eliminate Friction")
  const [splashDone, setSplashDone] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("splashShown")) setSplashDone(true)
  }, [])

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem("splashShown", "1")
    setSplashDone(true)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const section = sectionRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    const ripple = document.createElement("div")
    ripple.className = styles.clickRipple
    ripple.style.left = `${e.clientX - rect.left}px`
    ripple.style.top  = `${e.clientY - rect.top}px`
    section.appendChild(ripple)
    setTimeout(() => ripple.remove(), 1000)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      section.style.setProperty("--mx", `${e.clientX - rect.left}px`)
      section.style.setProperty("--my", `${e.clientY - rect.top}px`)
      if (coordRef.current) {
        coordRef.current.textContent =
          `${String(Math.round(e.clientX)).padStart(4, "0")} / ${String(Math.round(e.clientY)).padStart(4, "0")}`
      }
    }
    section.addEventListener("mousemove", onMove)
    return () => section.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <>
    {!splashDone && <SplashTerminal onDone={handleSplashDone} />}
    <section ref={sectionRef} className={styles.heroContainer} onClick={handleClick}>

      {/* Dot grid */}
      <div className={styles.dotGrid} />

      {/* Mouse spotlight */}
      <div className={styles.spotlight} />

      {/* Ambient glows */}
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      {/* Corner crosshairs */}
      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerTR}`} />
      <div className={`${styles.corner} ${styles.cornerBL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      {/* Floating tech pills — hidden on mobile */}
      {TECH_PILLS.map(({ label, pos, delay }) => (
        <span key={label} className={`${styles.pill} ${pos}`} style={{ animationDelay: delay }}>
          {label}
        </span>
      ))}

      {/* Live cursor coordinates */}
      <div className={styles.coordDisplay}>
        <span className={styles.coordDot} />
        <span ref={coordRef} className={styles.coordText}>0000 / 0000</span>
      </div>

      {/* Vertical rule lines */}
      <div className={styles.ruleLeft} />
      <div className={styles.ruleRight} />

      {/* Main content */}
      <div className={styles.heroContent}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className={styles.badge}>
          <span className={styles.badgeDot} />
          Full-Stack &amp; AI Engineer
        </motion.div>

        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible" className={styles.heroTitle}>
          <span className={styles.titleGradient}>Building Systems That</span>
          <br />
          <span className={styles.titleAccent}>{scrambled}</span>
        </motion.h1>

        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible" className={styles.heroSubtitle}>
          I architect production AI systems, real-time platforms, and workflow automation
          that turn operational chaos into reliable software. Custom internal tools built for scale.
        </motion.p>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className={styles.ctaContainer}>
          <Link href="/work" className={styles.ctaPrimary}>
            See the Work <ArrowRight size={16} />
          </Link>
          <Link href="mailto:magnotekbyasool@gmail.com" className={styles.ctaSecondary}>
            Get in Touch
          </Link>
        </motion.div>

        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className={styles.metricsRow}>
          <div className={styles.metric}>
            <span className={styles.metricValue}>6</span>
            <span className={styles.metricLabel}>production systems shipped</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metric}>
            <span className={styles.metricValue}>15h+/wk</span>
            <span className={styles.metricLabel}>operations time saved</span>
          </div>
          <div className={styles.metricDivider} />
          <div className={styles.metric}>
            <span className={styles.metricValue}>90%</span>
            <span className={styles.metricLabel}>manual work eliminated</span>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}
