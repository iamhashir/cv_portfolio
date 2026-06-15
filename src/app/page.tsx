"use client"

import React, { useEffect, useState } from "react"
import {
  site,
  projects,
  Project,
  getFilename,
  getBadgeLabel,
  TELEMETRY,
  CAPABILITIES,
} from "@/data/portfolioData"
import { PortfolioFrame } from "@/components/PortfolioFrame"
import styles from "./new-page.module.css"

// ─── Accordion detail panel ─────────────────────────────────────
function AccordionDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className={styles.accordionRow}>
      <div className={styles.accordionInner}>
        <div className={styles.accordionClose}>
          <button className={styles.accordionCloseBtn} onClick={onClose}>
            [CLOSE ×]
          </button>
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
          <div className={styles.accordionStackFull}>
            {project.techStack.join(" // ")}
          </div>
        </div>

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
  const filename = getFilename(project.slug)
  const badge = getBadgeLabel(project.status, project.githubUrl)

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleToggle(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug))
  }

  return (
    <div className={styles.page}>
      <PortfolioFrame />

      {/* ── Spec 1: Global Frame — rendered inside PortfolioFrame ── */}

      {/* ── Spec 2: Floating Minimalist Header ── */}
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

      {/* ── Spec 3: Asymmetric Split Hero — flex col on mobile, row on desktop ── */}
      <section id="hero" className={styles.hero}>

        {/* Left — 2/3 width: clean off-white #F4F0EA */}
        <div className={styles.heroLeft}>
          <p className={styles.eyebrow}>FULL-STACK · AI · SYSTEMS</p>

          <h1 className={styles.heroH1}>
            I build complete web and mobile systems from scratch.
          </h1>

          <p className={styles.heroSub}>
            Full-stack developer specializing in CRM automation, AI workflows,
            and internal operations platforms across the JavaScript ecosystem.
          </p>

          <p className={styles.availabilityLine}>
            <span className={styles.greenDot} />
            AVAILABLE · Abu Dhabi, UAE · Remote worldwide
          </p>

          <div className={styles.ctaGroup}>
            <a href="/Malik_Hashir_CV.pdf" download className={styles.ctaPrimary}>
              Download CV →
            </a>
            <a href="#systems" className={styles.ctaSecondary}>
              View Systems ↓
            </a>
          </div>

          <p className={styles.heroMetrics}>
            {projects.length} systems built · 4 domains · UAE based
          </p>
        </div>

        {/* Right — 1/3 width: deep dark structural block with telemetry */}
        <div className={styles.heroRight}>
          <p className={styles.systemsLabel}>ACTIVE SYSTEMS // {projects.length}</p>
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

      {/* ── Spec 4: Scrollable Work Gallery — bg-white, plain-text metadata ── */}
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

      {/* ── Spec 5: About — no separate /about route ── */}
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
              {CAPABILITIES.map((cap) => (
                <span key={cap} className={styles.capabilityItem}>{cap}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Spec 5: Contact — no separate /contact route ── */}
      <section id="contact" className={styles.contact}>
        <p className={styles.contactSectionLabel}>04 // CONTACT</p>
        <h2 className={styles.contactH2}>Get in touch.</h2>

        <div className={styles.contactRows}>
          <a href={`mailto:${site.email}`} className={styles.contactRow}>
            <span className={styles.contactRowLabel}>Email</span>
            <span className={styles.contactRowValue}>{site.email}</span>
            <span className={styles.contactRowArrow}>→</span>
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactRow}>
            <span className={styles.contactRowLabel}>LinkedIn</span>
            <span className={styles.contactRowValue}>{site.linkedinHandle}</span>
            <span className={styles.contactRowArrow}>↗</span>
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className={styles.contactRow}>
            <span className={styles.contactRowLabel}>GitHub</span>
            <span className={styles.contactRowValue}>github.com/{site.githubHandle}</span>
            <span className={styles.contactRowArrow}>↗</span>
          </a>
        </div>

        <p className={styles.contactStatusBar}>
          01 // {site.location} &nbsp;·&nbsp; 02 // Available for Work &nbsp;·&nbsp;
          uptime: 99.98% &nbsp;·&nbsp; © {new Date().getFullYear()} {site.name}
        </p>
      </section>
    </div>
  )
}
