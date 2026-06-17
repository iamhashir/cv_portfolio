"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import {
  site,
  projects,
  projectCategoryGroups,
  Project,
  WorkflowStep,
  DemoSnippet,
  getFilename,
  getBadgeLabel,
  CAPABILITIES,
} from "@/data/portfolioData"
import { PortfolioFrame } from "@/components/PortfolioFrame"
import PillNav from "@/components/PillNav"
import dynamic from "next/dynamic"
import styles from "./new-page.module.css"
import { GeometricHero } from "@/components/GeometricHero"
import { ProjectsGridNew } from "@/components/ProjectsGridNew"

const ArtisticCanvas = dynamic(() => import("@/components/ArtisticCanvas"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "var(--bg-primary, #0f0c08)" }} />,
})

const SplashCursor = dynamic(() => import("@/components/SplashCursor"), {
  ssr: false,
  loading: () => null,
})

const ease = [0.25, 0.46, 0.45, 0.94] as const

// Marquee content pulled from site data — no hardcoding
const MARQUEE_ITEMS = [...site.seo.keywords, site.location, "Available for Work"].join(" · ")

// ─── Workflow steps ──────────────────────────────────────────────
function WorkflowSteps({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className={styles.workflowSection}>
      <p className={styles.accordionSectionLabel}>Workflow</p>
      <div className={styles.workflowSteps}>
        {steps.map((step, i) => (
          <div key={i} className={styles.workflowStep}>
            <div
              className={`${styles.workflowDot} ${
                step.actor === "human"     ? styles.workflowDotHuman    :
                step.actor === "realtime" ? styles.workflowDotRealtime  :
                                            styles.workflowDotSystem
              }`}
            />
            <div>
              <p className={styles.workflowStepTitle}>{step.title}</p>
              <p className={styles.workflowStepDetail}>{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Code snippet with syntax highlighting ───────────────────────
function CodeSnippet({ snippet }: { snippet: DemoSnippet }) {
  return (
    <div className={styles.codeSection}>
      <p className={styles.codeLabel}>{snippet.label}</p>
      <div className={styles.codeBlock}>
        <SyntaxHighlighter
          language={snippet.language}
          style={oneDark}
          customStyle={{ margin: 0, background: "transparent", padding: "20px 22px" }}
          codeTagProps={{ style: { fontFamily: "var(--font-mono, monospace)", fontSize: "0.72rem" } }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

// ─── Accordion detail panel ──────────────────────────────────────
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
          <div className={styles.accordionStackFull}>{project.techStack.join("  ")}</div>
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
        {project.workflow   && <WorkflowSteps steps={project.workflow} />}
        {project.demoSnippet && <CodeSnippet  snippet={project.demoSnippet} />}
      </div>
    </div>
  )
}

// ─── Project card ────────────────────────────────────────────────
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
  const badge    = getBadgeLabel(project.status, project.githubUrl)

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
      <div className={styles.projectStack}>{project.techStack.join("  ")}</div>
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


// ─── Page ────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled,     setScrolled]     = useState(false)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [systemsInView, setSystemsInView] = useState(false)
  const [activeNav, setActiveNav] = useState("")
  const systemsRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setSystemsInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (systemsRef.current) observer.observe(systemsRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )
    if (systemsRef.current) observer.observe(systemsRef.current)
    if (aboutRef.current) observer.observe(aboutRef.current)
    if (contactRef.current) observer.observe(contactRef.current)
    return () => observer.disconnect()
  }, [])

  function handleToggle(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug))
  }

  return (
    <>
      <div className={styles.backgroundStage} aria-hidden="true">
        <ArtisticCanvas />
      </div>
      <div className={styles.page}>
        <PortfolioFrame />

        {/* ── Header ── */}
        <PillNav
          logoText="malik hashir"
          items={[
            { label: "Home", href: "/" },
            { label: "Systems", href: "#systems" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
            { label: "GitHub ↗", href: site.github },
            { label: "LinkedIn ↗", href: site.linkedin },
            { label: "CV →", href: site.cvPath },
          ]}
          activeHref={`#${activeNav}`}
          baseColor="#c9a96e"
          pillColor="transparent"
          hoveredPillTextColor="#c9a96e"
          pillTextColor="#f8f0dc"
          ease="power2.easeOut"
        />

        {/* ── Geometric Hero ── */}
        <GeometricHero />

        {/* ── Marquee strip (driven from site.seo.keywords) ── */}
        <div className={styles.marqueeStrip} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            <span className={styles.marqueeContent}>{MARQUEE_ITEMS}&nbsp;·&nbsp;</span>
            <span className={styles.marqueeContent}>{MARQUEE_ITEMS}&nbsp;·&nbsp;</span>
          </div>
        </div>

        {/* ── Systems ── */}
        <section id="systems" className={styles.systems} ref={systemsRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease }}
          >
            <p className={styles.sectionLabel}>02 SYSTEMS</p>
            <span aria-hidden="true" className={styles.sectionDecorNum}>02</span>
            <h2 className={styles.sectionH2}>Engineering Systems</h2>
            <p className={styles.sectionSubtitle}>
              Production-grade platforms, frameworks, and tools. Click any card for full details.
            </p>
          </motion.div>
          <ProjectsGridNew
            expandedSlug={expandedSlug}
            onToggle={handleToggle}
            onClose={() => setExpandedSlug(null)}
          />
        </section>

        {/* ── About ── */}
        <section id="about" className={styles.about} ref={aboutRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease }}
          >
            <p className={styles.sectionLabel}>03 ABOUT</p>
            <span aria-hidden="true" className={styles.sectionDecorNum}>03</span>
            <h2 className={styles.sectionH2}>{site.name}</h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(11,11,12,0.55)", marginBottom: 0 }}>
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
        <section id="contact" className={styles.contact} ref={contactRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease }}
          >
            <p className={styles.contactSectionLabel}>04 CONTACT</p>
            <span aria-hidden="true" className={styles.sectionDecorNumLight}>04</span>
            <h2 className={styles.contactH2}>Get in touch.</h2>
          </motion.div>

          <div className={styles.contactRows}>
            {([
              { label: "Email",    value: site.email,                        href: `mailto:${site.email}`, arrow: "→", ext: false },
              { label: "LinkedIn", value: site.linkedinHandle,               href: site.linkedin,          arrow: "↗", ext: true  },
              { label: "GitHub",   value: `github.com/${site.githubHandle}`, href: site.github,            arrow: "↗", ext: true  },
            ] as const).map(({ label, value, href, arrow, ext }, i) => (
              <motion.a
                key={label}
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className={styles.contactRow}
                aria-label={`${label}: ${value}`}
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
            {site.location} &nbsp;·&nbsp; Available for Work &nbsp;·&nbsp;
            uptime: 99.98% &nbsp;·&nbsp; © {new Date().getFullYear()} {site.name}
          </p>
        </section>
      </div>

      {/* ── Splash Cursor (Systems Section Only) ── */}
      {systemsInView && (
        <SplashCursor
          DENSITY_DISSIPATION={3.5}
          VELOCITY_DISSIPATION={2}
          PRESSURE={0.1}
          CURL={3}
          SPLAT_RADIUS={0.2}
          SPLAT_FORCE={6000}
          COLOR_UPDATE_SPEED={10}
          COLOR="#84CC16"
          RAINBOW_MODE={false}
          SHADING={true}
        />
      )}
    </>
  )
}
