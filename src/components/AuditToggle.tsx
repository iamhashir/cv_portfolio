"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Activity, ChevronRight, Code, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { projects } from "@/data/projects"
import { useAppStore } from "@/lib/store"
import { systemMaps } from "@/lib/systemMaps"
import styles from "./audit-toggle.module.css"

const boardBehaviors: Record<string, string> = {
  reactor: "Diagonal compile path: JSX input, hook runtime, and renderer stages rise in sequence.",
  "mina-games": "Arena topology: a session ring and distributed player nodes pulse around the match core.",
  opsflow: "Operational lane: central records branch into purchase, balance, reporting, and notification workflows.",
}

export default function AuditToggle() {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
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
            initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
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

function MiniSystemGraph({ slug, accent }: { slug: string; accent: string }) {
  const map = systemMaps[slug] ?? systemMaps.idle
  const nodeLookup = useMemo(() => new Map(map.nodes.map((n) => [n.id, n])), [map.nodes])
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={styles.miniGraph} style={{ "--graph-accent": accent } as React.CSSProperties}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.miniSvg}>
        <defs>
          <filter id="miniGlow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid */}
        <g opacity="0.18">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={`v${i}`} d={`M ${10 + i * 10} 5 V 95`} fill="none" stroke={accent} strokeWidth="0.3" />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <path key={`h${i}`} d={`M 5 ${10 + i * 10} H 95`} fill="none" stroke={accent} strokeWidth="0.3" />
          ))}
        </g>

        {/* Links */}
        {map.links.map((link, i) => {
          const from = nodeLookup.get(link.from)
          const to = nodeLookup.get(link.to)
          if (!from || !to) return null
          const midX = (from.x + to.x) / 2
          const midY = (from.y + to.y) / 2 - (link.lane === "secondary" ? 10 : 4)
          const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`
          return (
            <g key={`${link.from}-${link.to}`}>
              <path
                d={path}
                fill="none"
                stroke={link.lane === "secondary" ? "rgba(240,235,226,0.2)" : accent}
                strokeWidth={link.lane === "secondary" ? 0.6 : 1.0}
                strokeDasharray={link.lane === "secondary" ? "3 3" : undefined}
                strokeOpacity={link.lane === "secondary" ? 1 : 0.65}
              />
              {!shouldReduceMotion && (
                <motion.circle
                  r="0.8"
                  fill={accent}
                  filter="url(#miniGlow)"
                  initial={false}
                  animate={{ offsetDistance: ["0%", "100%"] }}
                  transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
                  style={{ offsetPath: `path("${path}")` }}
                />
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {map.nodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="2.4" fill={accent} filter="url(#miniGlow)" />
            <circle cx={node.x} cy={node.y} r="5.5" fill="rgba(10,9,8,0.4)" stroke={accent} strokeWidth="0.4" strokeOpacity="0.6" />
            <text
              x={node.x + 3.8}
              y={node.y + 0.8}
              fill="rgba(240,235,226,0.8)"
              fontSize="2.4"
              fontFamily="monospace"
              fontWeight="600"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function ProjectAudit({ project }: { project: (typeof projects)[number] }) {
  const map = systemMaps[project.slug]
  const accent = map?.accent ?? "#c9a96e"

  return (
    <div className={styles.panelBody}>
      <p className={styles.summary}>{project.summary}</p>

      <AuditSection label="Live architecture graph">
        <MiniSystemGraph slug={project.slug} accent={accent} />
        <p style={{ marginTop: 10, fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
          {boardBehaviors[project.slug] ?? "Architecture layer view for this case study."}
        </p>
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
