"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Activity, ChevronRight, Code, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { projects } from "@/data/projects"
import { useAppStore } from "@/lib/store"
import styles from "./audit-toggle.module.css"

const boardBehaviors: Record<string, string> = {
  reactor: "Diagonal compile path: JSX input, hook runtime, and renderer stages rise in sequence.",
  "mina-games": "Arena topology: a session ring and distributed player nodes pulse around the match core.",
  opsflow: "Operational lane: central records branch into purchase, balance, reporting, and notification workflows.",
}

export default function AuditToggle() {
  const pathname = usePathname()
  const { activeProject, isAuditMode, toggleAuditMode } = useAppStore()
  const routeProjectSlug = pathname.startsWith("/work/") ? pathname.split("/")[2] : null
  const project = projects.find(({ slug }) => slug === activeProject) ?? projects.find(({ slug }) => slug === routeProjectSlug)

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle} ${isAuditMode ? styles.toggleActive : ""}`}
        onClick={toggleAuditMode}
        aria-expanded={isAuditMode}
        aria-controls="system-audit-panel"
      >
        {isAuditMode ? <X size={15} /> : <Activity size={15} />}
        <span>{isAuditMode ? "Close audit" : "Inspect system"}</span>
      </button>

      <AnimatePresence>
        {isAuditMode && (
          <motion.aside
            id="system-audit-panel"
            className={styles.panel}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.eyebrow}>Live architecture audit</span>
                <h2 className={styles.panelTitle}>{project ? project.title : "Portfolio Systems Atlas"}</h2>
              </div>
              <Code size={18} className={styles.headerIcon} />
            </div>

            {project ? <ProjectAudit project={project} /> : <AtlasAudit />}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function ProjectAudit({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className={styles.panelBody}>
      <p className={styles.summary}>{project.summary}</p>

      <AuditSection label="Board transformation">
        <p>{boardBehaviors[project.slug] ?? "Architecture layer view for this case study."}</p>
      </AuditSection>

      <AuditSection label="System layers">
        <AuditRow name="Interface" value={project.architecture.frontend} />
        <AuditRow name="Services" value={project.architecture.backend} />
        <AuditRow name="Records" value={project.architecture.database} />
      </AuditSection>

      <AuditSection label="Core signals">
        <ul className={styles.signalList}>
          {project.features.slice(0, 3).map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </AuditSection>

      <AuditSection label="Engineering decision">
        <p>{project.technicalDecisions}</p>
      </AuditSection>
    </div>
  )
}

function AtlasAudit() {
  return (
    <div className={styles.panelBody}>
      <p className={styles.summary}>
        Scroll through the featured systems. The background board changes shape as each architecture enters the viewport.
      </p>

      <AuditSection label="Transformation index">
        {projects.filter(({ featured }) => featured).map((project) => (
          <div key={project.slug} className={styles.indexRow}>
            <ChevronRight size={13} />
            <div>
              <strong>{project.title}</strong>
              <span>{boardBehaviors[project.slug]}</span>
            </div>
          </div>
        ))}
      </AuditSection>

      <AuditSection label="Reading guide">
        <p>Raised nodes indicate active system stages. Accent changes separate workflow, real-time, and framework behavior.</p>
      </AuditSection>
    </div>
  )
}

function AuditSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionLabel}>{label}</h3>
      {children}
    </section>
  )
}

function AuditRow({ name, value }: { name: string; value: string }) {
  return (
    <div className={styles.auditRow}>
      <span>{name}</span>
      <p>{value}</p>
    </div>
  )
}
