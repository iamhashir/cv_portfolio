"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown, FileText, Mail, MessageCircle } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import CVModal from "@/components/CVModal"
import ScrambleText from "@/components/ScrambleText"
import FeaturedProjectCard from "@/components/FeaturedProjectCard"
import ProjectCard from "@/components/ProjectCard"
import ScrollReveal from "@/components/ScrollReveal"
import SectionHeader from "@/components/SectionHeader"
import SectionMinimap from "@/components/SectionMinimap"
import SignalTicker from "@/components/SignalTicker"
import Timeline, { type TimelineStep } from "@/components/Timeline"
import { projectCategoryGroups, projects, type Project } from "@/data/projects"
import { useAppStore } from "@/lib/store"
import styles from "./landing-page.module.css"


const systemVisuals: Record<string, { label: string; accent: string }> = {
  reactor: { label: "JSX → hooks → render", accent: "#d4b896" },
  "mina-games": { label: "players → socket → state", accent: "#6ee7b7" },
  opsflow: { label: "orders → records → alerts", accent: "#c9a96e" },
  financesmith: { label: "invoices → ledger → reports", accent: "#f0c36a" },
  traverse: { label: "signals → AI → discovery", accent: "#8bd3ff" },
  "ui-analyzer": { label: "screens → vision → fixes", accent: "#b7a4ff" },
}

const emailAddress = "malikhashir@example.com"
const whatsAppMessage = encodeURIComponent("Hi Malik, I would like to discuss a software project.")

type SectionContent = {
  label: string
  title: string
  description: string
}

export type LandingPageContent = {
  badge: string
  heroPrefix: string
  heroHighlight: string
  heroSuffix: string
  heroDescription: string
  primaryAction: string
  secondaryAction: string
  secondaryHref: string
  cvHref?: string
  process: SectionContent
  timeline: TimelineStep[]
  featured: SectionContent
  additional: SectionContent
  ctaLabel: string
  ctaTitle: string
  ctaDescription: string
  ctaAction: string
  ctaHref: string
  showProcess?: boolean
  showTechFilter?: boolean
  availability?: { label: string; active: boolean }
}

export default function LandingPage({ content }: { content: LandingPageContent }) {
  const shouldReduceMotion = useReducedMotion()
  const activeProject = useAppStore((state) => state.activeProject)
  const activeVisual = systemVisuals[activeProject ?? "opsflow"] ?? systemVisuals.opsflow
  const landingRef = useRef<HTMLDivElement>(null)
  const pointerRafRef = useRef<number>(0)
  const [cvOpen, setCvOpen] = useState(false)
  const gyroRafRef = useRef<number>(0)
  const computedAvailability = useMemo(getAvailability, [])
  const activeAvailability = content.availability ?? computedAvailability
  const minimapSections = useMemo(() => [
    { id: "landing-hero", label: "Intro" },
    ...(content.showProcess !== false ? [{ id: "landing-process", label: "Process" }] : []),
    { id: "landing-projects", label: "Work" },
    { id: "landing-skills", label: "Stack" },
    { id: "landing-contact", label: "Contact" },
  ], [content.showProcess])
  const [filterTech, setFilterTech] = useState<string | null>(null)

  const allTechs = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.techStack))).sort(),
    []
  )
  const handleTechClick = (tech: string) => setFilterTech((t) => (t === tech ? null : tech))
  const filteredProjects = filterTech ? projects.filter((p) => p.techStack.includes(filterTech)) : projects
  const featuredProjects = filteredProjects.filter((p) => p.featured)
  const secondaryProjects = filteredProjects.filter((p) => !p.featured)

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    cancelAnimationFrame(pointerRafRef.current)
    pointerRafRef.current = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      landingRef.current?.style.setProperty("--pointer-x", `${x}%`)
      landingRef.current?.style.setProperty("--pointer-y", `${y}%`)
    })
  }

  // Gyroscope: on mobile, device tilt drives the ambient glow + grid parallax
  useEffect(() => {
    if (!("DeviceOrientationEvent" in window)) return

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return
      cancelAnimationFrame(gyroRafRef.current)
      gyroRafRef.current = requestAnimationFrame(() => {
        // gamma: left/right tilt (−90° to 90°) → pointer-x (25% to 75%)
        // beta: front/back tilt (0°–180°, natural hold ≈45°) → pointer-y (32% to 68%)
        const x = 50 + (e.gamma! / 45) * 25
        const y = 50 + ((e.beta! - 45) / 40) * 18
        const gx = (e.gamma! / 45).toFixed(3)   // −1 to 1 for grid parallax
        const gy = ((e.beta! - 45) / 40).toFixed(3)
        landingRef.current?.style.setProperty("--pointer-x", `${x.toFixed(1)}%`)
        landingRef.current?.style.setProperty("--pointer-y", `${y.toFixed(1)}%`)
        landingRef.current?.style.setProperty("--gyro-x", gx)
        landingRef.current?.style.setProperty("--gyro-y", gy)
      })
    }

    window.addEventListener("deviceorientation", handleOrientation, { passive: true })
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
      cancelAnimationFrame(gyroRafRef.current)
    }
  }, [])

  const filterBar = (
    <div className={styles.techFilterBar} role="group" aria-label="Filter projects by technology">
      <button
        type="button"
        className={`${styles.techFilterChip} ${!filterTech ? styles.techFilterChipActive : ""}`}
        onClick={() => setFilterTech(null)}
      >
        All
      </button>
      {allTechs.map((tech) => (
        <button
          key={tech}
          type="button"
          className={`${styles.techFilterChip} ${filterTech === tech ? styles.techFilterChipActive : ""}`}
          onClick={() => handleTechClick(tech)}
        >
          {tech}
        </button>
      ))}
    </div>
  )

  const heroMetrics = [
    { value: `${projects.length}`, label: "documented systems" },
    { value: `${projectCategoryGroups.length}`, label: "delivery domains" },
    { value: "UAE", label: "based, remote-ready" },
  ]

  return (
    <>
    {content.cvHref && (
      <CVModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    )}
    <div
      ref={landingRef}
      className={styles.landing}
      style={{ "--system-accent": activeVisual.accent, "--pointer-x": "50%", "--pointer-y": "30%", "--gyro-x": "0", "--gyro-y": "0" } as CSSProperties}
      onPointerMove={handlePointerMove}
    >
      <div className={styles.backdrop} aria-hidden="true">
        {/* Pointer glow: no transition, snaps to cursor in real time */}
        <div className={styles.ambientGlow} />
        <span>{activeVisual.label}</span>
      </div>

      <div className={styles.minimapWrapper} aria-hidden="true">
        <SectionMinimap sections={minimapSections} />
      </div>

      <section id="landing-hero" className={styles.hero}>
        <div className={styles.mesh} aria-hidden="true" />
        <div className={styles.badge}>{content.badge}</div>

        <motion.div
          className={styles.heroBody}
          initial={shouldReduceMotion ? false : { y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.heroTitle}>
            {content.heroPrefix}{" "}
            <ScrambleText
              text={content.heroHighlight}
              className={styles.heroHighlight}
              delay={320}
            />{" "}
            {content.heroSuffix}
          </h1>
          <p className={styles.heroDescription}>{content.heroDescription}</p>
          <div className={styles.heroMetrics} aria-label="Portfolio proof points">
            {heroMetrics.map((metric) => (
              <div key={metric.label} className={styles.heroMetric}>
                <CountUp value={metric.value} />
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.availabilityBadge} aria-live="polite">
            <span
              className={`${styles.availabilityDot} ${activeAvailability.active ? styles.availabilityDotActive : ""}`}
            />
            <span>{activeAvailability.label}</span>
          </div>
        </motion.div>

        <div className={styles.heroActions}>
          {content.cvHref && (
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              className={styles.cvAction}
            >
              <FileText size={18} />
              <span>View CV</span>
            </button>
          )}
          <Link href="#landing-projects" className={styles.primaryAction}>
            <span>{content.primaryAction}</span>
            <ArrowRight size={18} />
          </Link>
          <Link href={content.secondaryHref} className={styles.secondaryAction}>
            <span>{content.secondaryAction}</span>
          </Link>
        </div>

        <div className={styles.tickerWrapper} aria-hidden="true">
          <SignalTicker />
        </div>
      </section>

      {content.showProcess !== false && (
        <section id="landing-process" className={styles.processSection}>
          <div className="container">
            <SectionHeader {...content.process} />
            <ScrollReveal direction="up">
              <Timeline steps={content.timeline} />
            </ScrollReveal>
          </div>
        </section>
      )}

      <section id="landing-projects" className={styles.projectsSection}>
        <header className={styles.sectionIntro}>
          <span>{content.featured.label}</span>
          <h2>{content.featured.title}</h2>
        </header>

        <div className={styles.mobileProjectStack}>
          {content.showTechFilter !== false && filterBar}
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectAccordionCard
                key={project.slug}
                project={project}
                activeTech={content.showTechFilter !== false ? filterTech : null}
                onTechClick={content.showTechFilter !== false ? handleTechClick : undefined}
              />
            ))
          ) : (
            <p className={styles.filterEmpty}>No projects match &ldquo;{filterTech}&rdquo;</p>
          )}
        </div>

        <div className={styles.desktopProjectStack}>
          {content.showTechFilter !== false && filterBar}
          {featuredProjects.length > 0 && (
            <div className={styles.featuredShowcase}>
              {featuredProjects.map((project) => (
                <ScrollReveal key={project.slug} delay={0.05}>
                  <FeaturedProjectCard project={project} />
                </ScrollReveal>
              ))}
            </div>
          )}
          {secondaryProjects.length > 0 && (
            <>
              <SectionHeader {...content.additional} />
              <div className="grid-2">
                {secondaryProjects.map((project) => (
                  <ScrollReveal key={project.slug}>
                    <ProjectCard project={project} />
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
          {filteredProjects.length === 0 && (
            <p className={styles.filterEmpty}>No projects match &ldquo;{filterTech}&rdquo;</p>
          )}
        </div>
      </section>

      <section id="landing-skills" className={styles.skillsSection}>
        <header className={styles.sectionIntro}>
          <span>Technical stack</span>
          <h2>Built across the stack</h2>
        </header>
        <div className={styles.skillLanes}>
          {projectCategoryGroups.map((category) => {
            const skills = Array.from(
              new Set(
                projects
                  .filter((p) => p.categoryGroup === category)
                  .flatMap((p) => p.techStack)
              )
            )
            return (
              <div key={category} className={styles.skillLane}>
                <h3>{category}</h3>
                <div className={styles.skillShelf}>
                  {skills.map((skill) => (
                    <button key={skill} type="button" className={styles.skillChip}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section id="landing-contact" className={styles.contactSection}>
        <header className={styles.sectionIntro}>
          <span>{content.ctaLabel}</span>
          <h2>{content.ctaTitle}</h2>
        </header>
        <div className={styles.mobileContactActions}>
          <a href={`https://wa.me/?text=${whatsAppMessage}`} className={styles.whatsappAction}>
            <MessageCircle size={19} />
            <span>WhatsApp me directly</span>
          </a>
          <a href={`mailto:${emailAddress}`} className={styles.emailAction}>
            <Mail size={19} />
            <span>Send an email</span>
          </a>
        </div>
        <div className={styles.desktopCtaCard}>
          <p className={styles.ctaDescription}>{content.ctaDescription}</p>
          <div className={styles.desktopCtaActions}>
            <Link href={content.ctaHref} className="btn-primary">
              <span>{content.ctaAction}</span>
              <ArrowRight size={16} />
            </Link>
            <a href={`mailto:${emailAddress}`} className="btn-secondary">
              {emailAddress}
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAvailability() {
  const uae = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" }))
  const h = uae.getHours()
  const d = uae.getDay() // 0=Sun … 6=Sat; UAE work week is Sun–Thu (0–4)

  if (d <= 4 && h >= 9 && h < 18) return { active: true, label: "Available now · GST" }

  // Compute hours until next 9am work day
  const next = new Date(uae)
  next.setSeconds(0, 0)
  next.setMinutes(0)
  if (h < 9 && d <= 4) {
    next.setHours(9)
  } else {
    next.setHours(9)
    next.setDate(next.getDate() + 1)
    while (next.getDay() === 5 || next.getDay() === 6) next.setDate(next.getDate() + 1)
  }
  const hrs = Math.max(1, Math.round((next.getTime() - uae.getTime()) / 3_600_000))
  return { active: false, label: `Responds in ~${hrs}h · GST` }
}

function CountUp({ value, duration = 1100 }: { value: string; duration?: number }) {
  const num = parseInt(value, 10)
  const [count, setCount] = useState(0)
  const elRef = useRef<HTMLElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (isNaN(num)) return
    const el = elRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        observer.disconnect()
        const t0 = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - t0) / duration, 1)
          setCount(Math.round((1 - (1 - t) ** 3) * num))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [num, duration])

  if (isNaN(num)) return <strong>{value}</strong>
  return <strong ref={elRef}>{count}</strong>
}

// ─── Project accordion card ───────────────────────────────────────────────────

function ProjectAccordionCard({
  project,
  activeTech = null,
  onTechClick,
}: {
  project: Project
  activeTech?: string | null
  onTechClick?: (tech: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const setActiveProject = useAppStore((state) => state.setActiveProject)
  const activeProject = useAppStore((state) => state.activeProject)
  const isActive = activeProject === project.slug

  const handleToggle = () => {
    if ("vibrate" in navigator) navigator.vibrate(8)
    const expanding = !isExpanded
    setIsExpanded(expanding)
    setActiveProject(expanding ? project.slug : null)
  }

  return (
    <article
      className={`${styles.projectCard} ${isExpanded ? styles.projectCardExpanded : ""} ${isActive ? styles.projectCardActive : ""}`}
    >
      <button
        type="button"
        className={styles.projectToggle}
        onClick={handleToggle}
        aria-expanded={isExpanded}
      >
        <span className={styles.projectCategory}>{project.category}</span>
        <span className={styles.projectHeading}>
          <strong>{project.title}</strong>
          <ChevronDown size={18} aria-hidden="true" />
        </span>
        <span className={styles.projectSummary}>{project.summary}</span>
      </button>
      <div className={styles.techShelf} aria-label={`${project.title} technology stack`}>
        {project.techStack.map((tech) => (
          <button
            key={tech}
            type="button"
            className={`${styles.techChip} ${activeTech === tech ? styles.techChipActive : ""}`}
            onClick={onTechClick ? () => onTechClick(tech) : undefined}
            aria-pressed={onTechClick ? activeTech === tech : undefined}
          >
            {tech}
          </button>
        ))}
      </div>
      {project.metric && !isExpanded && (
        <div className={styles.projectMetric}>{project.metric}</div>
      )}
      <div className={styles.projectDetails}>
        <p>{project.outcome[0]}</p>
        <Link href={`/work/${project.slug}`} className={styles.projectLink}>
          <span>View case study</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}
