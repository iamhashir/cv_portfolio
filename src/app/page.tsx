"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Github, Linkedin, Mail, Code2, Brain, Rocket, CheckCircle2, Database } from "lucide-react"
import styles from "./page.module.css"

// ─── Splash ────────────────────────────────────────────────────
const SPLASH_LINES = [
  { prefix: ">", text: "ssh malik@malik-hashir.dev" },
  { prefix: "✓", text: "connected  ·  latency 12ms" },
  { prefix: "✓", text: "build: PASSING  ·  tests: 100%" },
  { prefix: "✓", text: "uptime: 99.98%  ·  last deploy: 2m ago" },
  { prefix: "",  text: "" },
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
    timers.push(setTimeout(() => onDone(),         total + 1100))
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

// ─── Metric Card ───────────────────────────────────────────────
function MetricCard({ value, label, delay = 0, isDark }: {
  value: string; label: string; delay?: number; isDark: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ duration: 0.6, delay }}
      style={{
        background: isDark
          ? "rgba(255,255,255,0.12)"
          : "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,235,140,0.55) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: isDark
          ? "1px solid rgba(201,169,110,0.38)"
          : "1px solid rgba(255,190,50,0.55)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,169,110,0.08), inset 0 1px 0 rgba(255,255,255,0.12)"
          : "0 8px 32px rgba(180,120,10,0.2), 0 2px 8px rgba(255,160,30,0.15), inset 0 1px 0 rgba(255,255,255,0.95)",
        cursor: "default",
      }}
    >
      <div style={{
        fontSize: "32px", fontWeight: "800",
        background: "linear-gradient(135deg, #c9a96e 0%, #e8b84b 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: "6px", lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", color: isDark ? "rgba(240,235,226,0.7)" : "rgba(26,18,6,0.65)", fontWeight: "500", lineHeight: 1.4 }}>
        {label}
      </div>
    </motion.div>
  )
}

// ─── Tech Pill ─────────────────────────────────────────────────
function TechPill({ icon, label, delay = 0, isDark }: {
  icon: React.ReactNode; label: string; delay?: number; isDark: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ duration: 0.3, delay }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        background: isDark
          ? "rgba(255,255,255,0.14)"
          : "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,230,120,0.45) 100%)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: isDark
          ? "1px solid rgba(201,169,110,0.38)"
          : "1px solid rgba(255,185,40,0.5)",
        borderRadius: "9999px",
        padding: "9px 18px",
        fontSize: "13px",
        fontWeight: "600",
        color: isDark ? "rgba(240,235,226,0.88)" : "rgba(22,14,2,0.78)",
        boxShadow: isDark
          ? "0 4px 16px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 4px 16px rgba(180,120,10,0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
        cursor: "default",
      }}
    >
      {icon}
      {label}
    </motion.div>
  )
}

// ─── Availability Badge ────────────────────────────────────────
function AvailabilityBadge({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(34,197,94,0.1)",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        border: "1px solid rgba(34,197,94,0.32)",
        borderRadius: "9999px",
        padding: "7px 16px",
        fontSize: "12px",
        fontWeight: "600",
        color: isDark ? "#4ade80" : "rgb(22,163,74)",
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.35, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 8px #22c55e",
          flexShrink: 0,
        }}
      />
      Available for Work
    </motion.div>
  )
}

// ─── Page ──────────────────────────────────────────────────────
export default function Home() {
  const [splashDone, setSplashDone]       = useState(false)
  const [mousePos,   setMousePos]         = useState({ x: 0, y: 0 })
  const [isDark,     setIsDark]           = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem("splashShown")) setSplashDone(true)
  }, [])

  // Track theme toggle
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light")
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem("splashShown", "1")
    setSplashDone(true)
  }, [])

  // ── Theme-aware design tokens ─────────────────────────────────
  // Light: rich honey-amber mesh gradient — vibrant background makes glass POP
  // Dark:  deep warm ink with dual amber + plum glow
  const bg = isDark
    ? `radial-gradient(ellipse at 20% 20%, rgba(201,169,110,0.28) 0%, transparent 52%),
       radial-gradient(ellipse at 80% 80%, rgba(160,90,140,0.12) 0%, transparent 52%),
       radial-gradient(ellipse at 60% 10%, rgba(201,169,110,0.10) 0%, transparent 40%),
       #080706`
    : `radial-gradient(ellipse at 10% 10%, #ffe5a0 0%, transparent 55%),
       radial-gradient(ellipse at 90% 85%, #ffb347 0%, transparent 55%),
       radial-gradient(ellipse at 55% 50%, rgba(255,210,100,0.55) 0%, transparent 60%),
       linear-gradient(145deg, #fff8e7 0%, #ffecc4 40%, #ffd57a 75%, #ffbc3a 100%)`

  // Panel glass — heavier opacity so it reads clearly on vibrant bg
  const panelBg     = isDark ? "rgba(20,17,14,0.58)"          : "rgba(255,253,245,0.62)"
  const panelShadow = isDark
    ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.1), inset 0 1px 0 rgba(255,255,255,0.08)"
    : "0 32px 80px rgba(180,120,20,0.22), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,200,80,0.3), inset 0 1px 0 rgba(255,255,255,0.95)"

  const textPrimary   = isDark ? "#f0ebe2"                         : "#1a1209"
  const textSecondary = isDark ? "rgba(240,235,226,0.65)"          : "rgba(30,20,8,0.65)"
  const btnGlassBg    = isDark ? "rgba(255,255,255,0.10)"          : "rgba(255,255,255,0.62)"
  const btnGlassBdr   = isDark ? "1px solid rgba(201,169,110,0.3)" : "1px solid rgba(255,255,255,0.8)"
  const socialBg      = isDark ? "rgba(255,255,255,0.09)"          : "rgba(255,255,255,0.58)"

  return (
    <>
      {!splashDone && <SplashTerminal onDone={handleSplashDone} />}

      <div style={{ position: "relative", minHeight: "100vh", width: "100%", overflow: "hidden", background: bg }}>

        {/* Noise texture — adds depth/grain to the gradient */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          opacity: isDark ? 0.055 : 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }} />

        {/* Orb — top-left: vibrant amber */}
        <motion.div
          animate={{ x: [0, 90, 0], y: [0, -70, 0], scale: [1, 1.22, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", width: "700px", height: "700px",
            left: "-160px", top: "-5%", borderRadius: "50%",
            background: isDark
              ? "radial-gradient(circle, rgba(201,169,110,0.38) 0%, transparent 65%)"
              : "radial-gradient(circle, rgba(255,185,40,0.65) 0%, transparent 65%)",
            filter: "blur(72px)",
          }}
        />

        {/* Orb — bottom-right: warm amber/orange */}
        <motion.div
          animate={{ x: [0, -110, 0], y: [0, 90, 0], scale: [1, 1.28, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", width: "580px", height: "580px",
            right: "-80px", bottom: "5%", borderRadius: "50%",
            background: isDark
              ? "radial-gradient(circle, rgba(201,169,110,0.22) 0%, transparent 65%)"
              : "radial-gradient(circle, rgba(255,145,30,0.5) 0%, transparent 65%)",
            filter: "blur(85px)",
          }}
        />

        {/* Orb — dark mode only: warm plum accent for depth */}
        {isDark && (
          <motion.div
            animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", width: "420px", height: "420px",
              right: "20%", top: "10%", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(160,90,140,0.18) 0%, transparent 65%)",
              filter: "blur(90px)",
            }}
          />
        )}

        {/* Mouse-follow spotlight */}
        <motion.div
          animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }}
          transition={{ type: "spring", damping: 28, stiffness: 160 }}
          style={{
            position: "absolute", width: "600px", height: "600px",
            borderRadius: "50%", pointerEvents: "none", zIndex: 1,
            background: isDark
              ? "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 65%)"
              : "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 65%)",
            filter: "blur(55px)",
          }}
        />

        {/* Content wrapper */}
        <div style={{
          position: "relative", zIndex: 10,
          minHeight: "100vh", display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: "clamp(80px, 10vw, 120px) clamp(16px, 4vw, 40px) 48px",
        }}>
          {/* ── Animated border ring + Central Glass Panel ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.panelGlowRing}
            style={{ maxWidth: "1080px", width: "100%", boxShadow: panelShadow }}
          >
          <div
            style={{
              background: panelBg,
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              borderRadius: "32px",
              padding: "clamp(36px, 5vw, 60px) clamp(28px, 5vw, 56px)",
              position: "relative",
            }}
          >
            {/* Inner gradient sheen */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "32px", pointerEvents: "none",
              background: isDark
                ? "linear-gradient(135deg, rgba(201,169,110,0.04) 0%, rgba(255,255,255,0.01) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 100%)",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: "clamp(44px, 7vw, 78px)",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #c9a96e 0%, #d4a853 55%, #b8894a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "12px",
                  lineHeight: "1.08",
                  letterSpacing: "-0.02em",
                }}
              >
                Malik Hashir
              </motion.h1>

              {/* Role */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  fontWeight: "600",
                  color: textPrimary,
                  marginBottom: "20px",
                  opacity: 0.88,
                }}
              >
                Full-Stack & AI Engineer
              </motion.p>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38 }}
                style={{
                  fontSize: "clamp(15px, 1.6vw, 17px)",
                  lineHeight: "1.75",
                  color: textSecondary,
                  marginBottom: "36px",
                  maxWidth: "620px",
                }}
              >
                I architect production AI systems, real-time platforms, and workflow automation
                that turn operational chaos into reliable software. Custom internal tools built for scale.
              </motion.p>

              {/* Tech Pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.44 }}
                style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px" }}
              >
                <TechPill icon={<Code2 size={15} color="#c9a96e" />}     label="React & Next.js"  delay={0.5}  isDark={isDark} />
                <TechPill icon={<Brain size={15} color="#c9a96e" />}      label="AI / ML"          delay={0.54} isDark={isDark} />
                <TechPill icon={<Rocket size={15} color="#c9a96e" />}     label="Node.js"          delay={0.58} isDark={isDark} />
                <TechPill icon={<CheckCircle2 size={15} color="#c9a96e"/>} label="TypeScript"      delay={0.62} isDark={isDark} />
                <TechPill icon={<Code2 size={15} color="#c9a96e" />}      label="Python"           delay={0.66} isDark={isDark} />
                <TechPill icon={<Database size={15} color="#c9a96e" />}   label="PostgreSQL"       delay={0.7}  isDark={isDark} />
              </motion.div>

              {/* Metrics */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "40px",
              }}>
                <MetricCard value="6"       label="Production systems shipped"  delay={0.62} isDark={isDark} />
                <MetricCard value="15h+/wk" label="Operations time saved"        delay={0.72} isDark={isDark} />
                <MetricCard value="90%"     label="Manual work eliminated"       delay={0.82} isDark={isDark} />
              </div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.88 }}
                style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "32px" }}
              >
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/work" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "14px 30px", fontSize: "15px", fontWeight: "600",
                    color: "#fff",
                    background: "linear-gradient(135deg, #c9a96e 0%, #b8894a 100%)",
                    border: "none", borderRadius: "12px", cursor: "pointer", textDecoration: "none",
                    boxShadow: "0 8px 24px rgba(201,169,110,0.38), inset 0 1px 0 rgba(255,255,255,0.22)",
                  }}>
                    See the Work <ArrowRight size={15} />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/contact" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "14px 30px", fontSize: "15px", fontWeight: "600",
                    color: textPrimary,
                    background: btnGlassBg,
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: btnGlassBdr,
                    borderRadius: "12px", cursor: "pointer", textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
                  }}>
                    Get in Touch
                  </Link>
                </motion.div>
              </motion.div>

              {/* Social icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                style={{ display: "flex", gap: "10px" }}
              >
                {[
                  { href: "https://github.com/ihashirr",                    icon: <Github   size={20} color="#c9a96e" />, label: "GitHub"   },
                  { href: "https://linkedin.com",                           icon: <Linkedin size={20} color="#c9a96e" />, label: "LinkedIn" },
                  { href: "mailto:magnotekbyasool@gmail.com",               icon: <Mail     size={20} color="#c9a96e" />, label: "Email"    },
                ].map(({ href, icon, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "46px", height: "46px",
                      background: socialBg,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: isDark ? "1px solid rgba(201,169,110,0.18)" : "1px solid rgba(255,255,255,0.65)",
                      borderRadius: "12px", cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      minWidth: "46px", minHeight: "46px",
                    }}
                  >
                    {icon}
                  </motion.a>
                ))}
              </motion.div>

            </div>
          </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
