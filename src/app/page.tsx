"use client"

import React, { useEffect, useState } from "react"
import { site } from "@/data/site"
import { projects, Project } from "@/data/projects"
import { PortfolioFrame } from "@/components/PortfolioFrame"
import styles from "./new-page.module.css"

// ─── Slug → display filename ────────────────────────────────────
function getFilename(project: Project): string {
  const map: Record<string, string> = {
    reactor: "Reactor.framework",
    "mina-games": "MINA.realtime",
    opsflow: "OpsFlow.sys",
    financesmith: "FinanceSmith.infra",
    traverse: "Traverse.ai",
    "ui-analyzer": "UIAnalyzer.ai",
  }
  return map[project.slug] ?? `${project.slug}.sys`
}

// ─── Status badge label ─────────────────────────────────────────
function getBadgeLabel(project: Project): string {
  if (project.status.toLowerCase().includes("private")) return "[PRIVATE]"
  if (project.githubUrl) return "[MIT LICENSE]"
  return "[PRODUCTION]"
}

// ─── Telemetry card data for hero right panel ───────────────────
const TELEMETRY = [
  {
    title: "REACTOR.FRAMEWORK",
    badge: "[MIT]",
    rows: [
      { key: "TYPE", val: "Zero-dependency engine" },
      { key: "STACK", val: "TypeScript // Custom JSX" },
      { key: "TESTS", val: "100% PASSING" },
      { key: "METRIC", val: "Custom rendering pipeline" },
    ],
  },
  {
    title: "OPSFLOW.SYS",
    badge: "[LIVE]",
    rows: [
      { key: "TYPE", val: "CRM + Workflow Platform" },
      { key: "STACK", val: "React // Node.js // PG" },
      { key: "TESTS", val: "Deployed · Production" },
      { key: "METRIC", val: "1,200+ daily records" },
    ],
  },
  {
    title: "MINA.REALTIME",
    badge: "[LIVE]",
    rows: [
      { key: "TYPE", val: "Multiplayer Platform" },
      { key: "STACK", val: "Fastify // WebSockets" },
      { key: "TESTS", val: "Sub-50ms latency" },
      { key: "METRIC", val: "Real-time sync engine" },
    ],
  },
]

// ─── Accordion detail panel ─────────────────────────────────────
function AccordionDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className={styles.accordionRow}>
      <div className={styles.accordionInner}>
        {/* Close button spanning full width */}
        <div className={styles.accordionClose}>
          <button className={styles.accordionCloseBtn} onClick={onClose}>
            [CLOSE ×]
          </button>
        </div>

        {/* Left column */}
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
          <div className={styles.accordionStackFull}>
            {project.techStack.join(" // ")}
          </div>
        </div>

        {/* Right column */}
        <div>
          <p className={styles.accordionSectionLabel}>Outcomes</p>
          <ul className={styles.accordionOutcomes}>
            {project.outcome.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {project.metric && (
            <p className={styles.accordionMetricBig}>{project.metric}</p>
          )}

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
}: {
  project: Project
  isExpanded: boolean
  onToggle: () => void
}) {
  const filename = getFilename(project)
  const badge = getBadgeLabel(project)

  return (
    <div
      className={styles.projectCard}
      onClick={onToggle}
      style={{ outline: isExpanded ? "1px solid rgba(201,169,110,0.4)" : "none" }}
    >
      <div className={styles.projectFilename}>{filename}</div>
      <hr className={styles.projectDivider} />
      <div className={styles.projectCategory}>{project.category}</div>
      <p className={styles.projectSummary}>{project.summary}</p>
      <div className={styles.projectStack}>{project.techStack.join(" // ")}</div>
      <div className={styles.projectFooter}>
        <span className={styles.projectBadge}>{badge}</span>
        {project.metric && (
          <span className={styles.projectMetric}>
            {project.metric.split("·")[0]?.trim()}
          </span>
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
    </div>
  )
}

// ─── Build the grid with accordion panels injected per row ───────
function ProjectsGrid({
  expandedSlug,
  onToggle,
  onClose,
}: {
  expandedSlug: string | null
  onToggle: (slug: string) => void
  onClose: () => void
}) {
  // 3-column grid on desktop. Accordion spans full row.
  // We chunk into rows of 3 and inject the accordion after each row that contains the expanded project.
  const COL_COUNT = 3
  const rows: Project[][] = []
  for (let i = 0; i < projects.length; i += COL_COUNT) {
    rows.push(projects.slice(i, i + COL_COUNT))
  }

  return (
    <div className={styles.projectsGrid}>
      {rows.map((row, ri) => {
        const expandedProject = row.find((p) => p.slug === expandedSlug) ?? null
        return (
          <React.Fragment key={`row-${ri}`}>
            {row.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                isExpanded={expandedSlug === project.slug}
                onToggle={() => onToggle(project.slug)}
              />
            ))}
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

  // Track scroll for header background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleToggle(slug: string) {
    setExpandedSlug((prev: string | null) => (prev === slug ? null : slug))
  }

  return (
    <div className={styles.page}>
      <PortfolioFrame />

      {/* ── Header ── */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <a href="#hero" className={styles.headerLogo}>M.H.</a>
        <nav className={styles.headerLinks}>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.headerLink}
          >
            GitHub ↗
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.headerLink}
          >
            LinkedIn ↗
          </a>
          <a href={`mailto:${site.email}`} className={styles.headerLink}>
            Email →
          </a>
        </nav>
      </header>

      {/* ── Section 1: Hero ── */}
      <section id="hero" className={styles.hero}>
        {/* Left column — warm off-white */}
        <div className={styles.heroLeft}>
          <p className={styles.eyebrow}>FULL-STACK · AI · SYSTEMS</p>

          <h1 className={styles.heroH1}>
            I build complete web and mobile systems from scratch.
          </h1>

          <p className={styles.heroSub}>
            Full-stack developer specializing in CRM automation, AI workflows,
            and internal operations platforms.
          </p>

          <p className={styles.availabilityLine}>
            <span className={styles.greenDot} />
            AVAILABLE · Abu Dhabi, UAE · Remote worldwide
          </p>

          <div className={styles.ctaGroup}>
            <a
              href="/Malik_Hashir_CV.pdf"
              download
              className={styles.ctaPrimary}
            >
              Download CV →
            </a>
            <a href="#systems" className={styles.ctaSecondary}>
              View Systems ↓
            </a>
          </div>

          <p className={styles.heroMetrics}>
            12 systems built · 4 domains · UAE based
          </p>
        </div>

        {/* Right column — obsidian with telemetry */}
        <div className={styles.heroRight}>
          <p className={styles.systemsLabel}>ACTIVE SYSTEMS // 12</p>
          <div className={styles.telemetryCards}>
            {TELEMETRY.map((card) => (
              <div key={card.title} className={styles.telemetryCard}>
                <div className={styles.telemetryCardHeader}>
                  <span className={styles.telemetryCardTitle}>{card.title}</span>
                  <span className={styles.telemetryCardBadge}>{card.badge}</span>
                </div>
                <hr className={styles.telemetryDivider} />
                {card.rows.map((row) => (
                  <div key={row.key} className={styles.telemetryRow}>
                    <span className={styles.telemetryKey}>{row.key}</span>
                    <span className={styles.telemetryVal}>{row.val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Work Gallery ── */}
      <section id="systems" className={styles.systems}>
        <p className={styles.sectionLabel}>02 // SYSTEMS</p>
        <h2 className={styles.sectionH2}>Engineering Systems</h2>
        <p className={styles.sectionSubtitle}>
          Production-grade platforms, frameworks, and tools.
        </p>

        <ProjectsGrid
          expandedSlug={expandedSlug}
          onToggle={handleToggle}
          onClose={() => setExpandedSlug(null)}
        />
      </section>

      {/* ── Section 3: About ── */}
      <section id="about" className={styles.about}>
        <p className={styles.sectionLabel}>03 // ABOUT</p>
        <h2 className={styles.sectionH2}>{site.name}</h2>
        <p style={{ fontSize: "0.9rem", color: "rgba(11,11,12,0.45)", marginBottom: 0 }}>
          {site.role} · {site.location}
        </p>

        <div className={styles.aboutGrid}>
          <div>
            <p className={styles.aboutBio}>{site.bio}</p>
            <p className={styles.aboutAvailability}>{site.availability}</p>
          </div>

          <div>
            <p className={styles.capabilitiesLabel}>Capabilities</p>
            <div className={styles.capabilitiesGrid}>
              {[
                "CRM Systems",
                "React / Next.js",
                "Workflow Automation",
                "Node.js / Fastify",
                "AI Integrations",
                "PostgreSQL / Redis",
                "Operations Platforms",
                "TypeScript",
              ].map((cap) => (
                <span key={cap} className={styles.capabilityItem}>{cap}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Contact ── */}
      <section id="contact" className={styles.contact}>
        <p className={styles.contactSectionLabel}>04 // CONTACT</p>
        <h2 className={styles.contactH2}>Get in touch.</h2>

        <div className={styles.contactRows}>
          <a href={`mailto:${site.email}`} className={styles.contactRow}>
            <span className={styles.contactRowLabel}>Email</span>
            <span className={styles.contactRowValue}>{site.email}</span>
            <span className={styles.contactRowArrow}>→</span>
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactRow}
          >
            <span className={styles.contactRowLabel}>LinkedIn</span>
            <span className={styles.contactRowValue}>{site.linkedinHandle}</span>
            <span className={styles.contactRowArrow}>↗</span>
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactRow}
          >
            <span className={styles.contactRowLabel}>GitHub</span>
            <span className={styles.contactRowValue}>github.com/{site.githubHandle}</span>
            <span className={styles.contactRowArrow}>↗</span>
          </a>
        </div>

        <p className={styles.contactStatusBar}>
          01 // Abu Dhabi, UAE &nbsp;·&nbsp; 02 // Available for Work &nbsp;·&nbsp; uptime: 99.98% &nbsp;·&nbsp; © 2025 Malik Hashir
        </p>
      </section>
    </div>
  )
}
