"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  site,
  projects,
  Project,
  getFilename,
  getBadgeLabel,
  CAPABILITIES,
} from "@/data/portfolioData"
import { PortfolioFrame } from "@/components/PortfolioFrame"
import dynamic from "next/dynamic"
import styles from "./new-page.module.css"

const ArtisticCanvas = dynamic(() => import("@/components/ArtisticCanvas"), { ssr: false })

const ease = [0.25, 0.46, 0.45, 0.94] as const

// ─── Accordion detail panel ─────────────────────────────────────
function AccordionDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className={styles.accordionRow}>
      <div className={styles.accordionInner}>
        <div className={styles.accordionClose}>
          <button className={styles.accordionCloseBtn} onClick={onClose}>[CLOSE ×]</button>
        </div>
        <div>
          <h3 className={styles.accordionTitle}>{project.title}</h3>
          <p className={styles.accordionFullSummary}>{project.solution}</p>
          <p className={styles.accordionSectionLabel}>Architecture</p>
          <div className={styles.accordionArchRow}>
            <span className={styles.accordionArchKey}>Frontend</span>
            <span className={styles.accordionArchVal}>{project.architecture.frontend}</span>
          </div>
          <div className={styles.accordionArchRow}>
            <span className={styles.accordionArchKey}>Backend</span>
            <span className={styles.accordionArchVal}>{project.architecture.backend}</span>
          </div>
          <div className={styles.accordionArchRow}>
            <span className={styles.accordionArchKey}>Database</span>
            <span className={styles.accordionArchVal}>{project.architecture.database}</span>
          </div>
          <p className={styles.accordionSectionLabel} style={{ marginTop: 20 }}>Tech Stack</p>
          <div className={styles.accordionStackFull}>{project.techStack.join(" // ")}</div>
        </div>
        <div>
          <p className={styles.accordionSectionLabel}>Outcomes</p>
          <ul className={styles.accordionOutcomes}>
            {project.outcome.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          {project.metric && <p className={styles.accordionMetricBig}>{project.metric}</p>}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.accordionGithubLink}
            >
              ↗ Source on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Project card ───────────────────────────────────────────────
function ProjectCard({
  project,
  isExpanded,
  onToggle,
  index,
}: {
  project: Project
  isExpanded: boolean
  onToggle: () => void
  index: number
}) {
  const filename = getFilename(project.slug)
  const badge = getBadgeLabel(project.status, project.githubUrl)

  return (
    <motion.div
      className={styles.projectCard}
      onClick={onToggle}
      style={{ outline: isExpanded ? "1px solid rgba(79,70,229,0.35)" : "none" }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.09, ease }}
    >
      <div className={styles.projectFilename}>{filename}</div>
      <hr className={styles.projectDivider} />
      <div className={styles.projectCategory}>{project.category}</div>
      <p className={styles.projectSummary}>{project.summary}</p>
      <div className={styles.projectStack}>{project.techStack.join(" // ")}</div>
      <div className={styles.projectFooter}>
        <span className={styles.projectBadge}>{badge}</span>
        {project.metric && (
          <span className={styles.projectMetric}>{project.metric.split("·")[0]?.trim()}</span>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.projectSourceLink}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            ↗ Source
          </a>
        )}
      </div>
    </motion.div>
  )
}

// ─── 3-column grid with inline accordion rows ───────────────────
function ProjectsGrid({
  expandedSlug,
  onToggle,
  onClose,
}: {
  expandedSlug: string | null
  onToggle: (slug: string) => void
  onClose: () => void
}) {
  const COL_COUNT = 3
  const rows: Project[][] = []
  for (let i = 0; i < projects.length; i += COL_COUNT) {
    rows.push(projects.slice(i, i + COL_COUNT))
  }

  let cardIndex = 0
  return (
    <div className={styles.projectsGrid}>
      {rows.map((row, ri) => {
        const expandedProject = row.find((p) => p.slug === expandedSlug) ?? null
        return (
          <React.Fragment key={`row-${ri}`}>
            {row.map((project) => {
              const idx = cardIndex++
              return (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  isExpanded={expandedSlug === project.slug}
                  onToggle={() => onToggle(project.slug)}
                  index={idx}
                />
              )
            })}
            {expandedProject && (
              <AccordionDetail
                key={`accordion-${expandedProject.slug}`}
                project={expandedProject}
                onClose={onClose}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const heroRef = useRef<HTMLElement>(null)

  // Scroll-driven parallax for hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

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
      {/* Canvas sits OUTSIDE .page so it's in the ROOT stacking context.
          z-index:0 (canvas) < z-index:1 (.page) — text is always on top. */}
      <ArtisticCanvas />
      <div className={styles.page}>
      <PortfolioFrame />

      {/* ── Header ── */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <a href="#hero" className={styles.headerLogo}>M.H.</a>
        <nav className={styles.headerLinks}>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className={styles.headerLink}>
            GitHub ↗
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={styles.headerLink}>
            LinkedIn ↗
          </a>
          <a href="/Malik_Hashir_CV.pdf" download className={styles.headerCvBtn}>
            Download CV →
          </a>
        </nav>
      </header>

      {/* ── Hero — full-width with parallax scroll ── */}
      <section ref={heroRef} id="hero" className={styles.hero}>
        <motion.div className={styles.heroContent} style={{ y: heroY, opacity: heroOpacity }}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease }}
          >
            FULL-STACK · AI · SYSTEMS
          </motion.p>

          <motion.h1
            className={styles.heroH1}
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease }}
          >
            I build complete web and mobile systems from scratch.
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.5, ease }}
          >
            Full-stack developer specializing in CRM automation, AI workflows,
            and internal operations platforms across the JavaScript ecosystem.
          </motion.p>

          <motion.p
            className={styles.availabilityLine}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.65 }}
          >
            <span className={styles.greenDot} />
            AVAILABLE · Abu Dhabi, UAE · Remote worldwide
          </motion.p>

          <motion.div
            className={styles.ctaGroup}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.75, ease }}
          >
            <a href="/Malik_Hashir_CV.pdf" download className={styles.ctaPrimary}>
              Download CV →
            </a>
            <a href="#systems" className={styles.ctaSecondary}>
              View Systems ↓
            </a>
          </motion.div>

          <motion.p
            className={styles.heroMetrics}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {projects.length} systems built · 4 domains · UAE based
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          aria-hidden="true"
        >
          <span className={styles.scrollArrow} />
          <span>Scroll</span>
        </motion.div>
      </section>

      {/* ── Marquee strip ── */}
      <div className={styles.marqueeStrip} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          <span className={styles.marqueeContent}>
            Full-Stack Development&nbsp;·&nbsp;AI Integrations&nbsp;·&nbsp;Next.js&nbsp;·&nbsp;Node.js&nbsp;·&nbsp;React&nbsp;·&nbsp;TypeScript&nbsp;·&nbsp;PostgreSQL&nbsp;·&nbsp;Abu Dhabi UAE&nbsp;·&nbsp;Available for Work&nbsp;·&nbsp;
          </span>
          <span className={styles.marqueeContent} aria-hidden="true">
            Full-Stack Development&nbsp;·&nbsp;AI Integrations&nbsp;·&nbsp;Next.js&nbsp;·&nbsp;Node.js&nbsp;·&nbsp;React&nbsp;·&nbsp;TypeScript&nbsp;·&nbsp;PostgreSQL&nbsp;·&nbsp;Abu Dhabi UAE&nbsp;·&nbsp;Available for Work&nbsp;·&nbsp;
          </span>
        </div>
      </div>

      {/* ── Systems ── */}
      <section id="systems" className={styles.systems}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
        >
          <p className={styles.sectionLabel}>02 // SYSTEMS</p>
          <span aria-hidden="true" className={styles.sectionDecorNum}>02</span>
          <h2 className={styles.sectionH2}>Engineering Systems</h2>
          <p className={styles.sectionSubtitle}>
            Production-grade platforms, frameworks, and tools.
          </p>
        </motion.div>
        <ProjectsGrid
          expandedSlug={expandedSlug}
          onToggle={handleToggle}
          onClose={() => setExpandedSlug(null)}
        />
      </section>

      {/* ── About ── */}
      <section id="about" className={styles.about}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
        >
          <p className={styles.sectionLabel}>03 // ABOUT</p>
          <span aria-hidden="true" className={styles.sectionDecorNum}>03</span>
          <h2 className={styles.sectionH2}>{site.name}</h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(11,11,12,0.45)", marginBottom: 0 }}>
            {site.role} · {site.location}
          </p>
        </motion.div>

        <div className={styles.aboutGrid}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.1, ease }}
          >
            <p className={styles.aboutBio}>{site.bio}</p>
            <p className={styles.aboutAvailability}>{site.availability}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.2, ease }}
          >
            <p className={styles.capabilitiesLabel}>Capabilities</p>
            <div className={styles.capabilitiesGrid}>
              {CAPABILITIES.map((cap, i) => (
                <motion.span
                  key={cap}
                  className={styles.capabilityItem}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.045 }}
                >
                  {cap}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className={styles.contact}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
        >
          <p className={styles.contactSectionLabel}>04 // CONTACT</p>
          <span aria-hidden="true" className={styles.sectionDecorNumLight}>04</span>
          <h2 className={styles.contactH2}>Get in touch.</h2>
        </motion.div>

        <div className={styles.contactRows}>
          {([
            { label: "Email",    value: site.email,                      href: `mailto:${site.email}`, arrow: "→", ext: false },
            { label: "LinkedIn", value: site.linkedinHandle,             href: site.linkedin,          arrow: "↗", ext: true  },
            { label: "GitHub",   value: `github.com/${site.githubHandle}`, href: site.github,          arrow: "↗", ext: true  },
          ] as const).map(({ label, value, href, arrow, ext }, i) => (
            <motion.a
              key={label}
              href={href}
              target={ext ? "_blank" : undefined}
              rel={ext ? "noopener noreferrer" : undefined}
              className={styles.contactRow}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease }}
            >
              <span className={styles.contactRowLabel}>{label}</span>
              <span className={styles.contactRowValue}>{value}</span>
              <span className={styles.contactRowArrow}>{arrow}</span>
            </motion.a>
          ))}
        </div>

        <p className={styles.contactStatusBar}>
          01 // {site.location} &nbsp;·&nbsp; 02 // Available for Work &nbsp;·&nbsp;
          uptime: 99.98% &nbsp;·&nbsp; © {new Date().getFullYear()} {site.name}
        </p>
      </section>
    </div>
    </>
  )
}
