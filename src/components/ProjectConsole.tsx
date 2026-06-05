"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Cpu,
  Server,
  Database,
  Link2,
  Key,
  GitCompare,
  LayoutDashboard,
  Boxes,
  Wrench,
  TrendingUp,
} from "lucide-react"
import type { Project } from "@/data/projects"
import WorkflowDemo from "@/components/WorkflowDemo"
import styles from "./project-console.module.css"

type ViewId = "overview" | "diff" | "stack" | "build" | "impact"

const VIEWS: { id: ViewId; label: string; icon: typeof Cpu }[] = [
  { id: "overview", label: "overview", icon: LayoutDashboard },
  { id: "diff", label: "the_shift.diff", icon: GitCompare },
  { id: "stack", label: "architecture", icon: Boxes },
  { id: "build", label: "engineering", icon: Wrench },
  { id: "impact", label: "outcomes", icon: TrendingUp },
]

/** Split prose into clause-level lines (keeping punctuation) for the diff gutter. */
function toLines(text: string): string[] {
  return text
    .split(/(?<=[,.])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function ProjectConsole({ project }: { project: Project }) {
  const [view, setView] = useState<ViewId>("overview")
  const isPrivate = project.status.toLowerCase().includes("private")

  // Keyboard navigation: ↑/↓ to move between views, 1–5 to jump.
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    const idx = VIEWS.findIndex((v) => v.id === view)
    if (e.key === "ArrowDown" || e.key === "j") {
      e.preventDefault()
      setView(VIEWS[(idx + 1) % VIEWS.length].id)
    } else if (e.key === "ArrowUp" || e.key === "k") {
      e.preventDefault()
      setView(VIEWS[(idx - 1 + VIEWS.length) % VIEWS.length].id)
    } else if (/^[1-5]$/.test(e.key)) {
      setView(VIEWS[Number(e.key) - 1].id)
    }
  }, [view])

  useEffect(() => {
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onKey])

  return (
    <div className={styles.shell}>
      {/* Window chrome */}
      <div className={styles.titlebar}>
        <div className={styles.lights} aria-hidden="true">
          <span /><span /><span />
        </div>
        <Link href="/work" className={styles.crumb}>
          <ArrowLeft size={13} />
          <span>work</span>
        </Link>
        <span className={styles.path}>/ {project.slug}.case</span>
        <span className={styles.statusPill}>
          <span className={styles.statusDot} />
          {project.status}
        </span>
      </div>

      <div className={styles.body}>
        {/* Left rail — section tree */}
        <nav className={styles.nav} aria-label="Case study views">
          <span className={styles.navHint}>VIEWS</span>
          {VIEWS.map((v, i) => {
            const Icon = v.icon
            const active = v.id === view
            return (
              <button
                key={v.id}
                className={`${styles.navItem} ${active ? styles.navActive : ""}`}
                onClick={() => setView(v.id)}
              >
                <span className={styles.navIndex}>{i + 1}</span>
                <Icon size={15} className={styles.navIcon} />
                <span className={styles.navLabel}>{v.label}</span>
              </button>
            )
          })}
          <span className={styles.navKeys}>↑ ↓ / 1–5 to navigate</span>
        </nav>

        {/* Center — active panel */}
        <main className={styles.panel} key={view}>
          {view === "overview" && <Overview project={project} />}
          {view === "diff" && <Diff project={project} />}
          {view === "stack" && <Stack project={project} />}
          {view === "build" && <Build project={project} />}
          {view === "impact" && <Impact project={project} />}
        </main>

        {/* Right rail — live readouts */}
        <aside className={styles.metrics}>
          <Stat n={project.techStack.length} label="stack" />
          <Stat n={project.features.length} label="systems" />
          <Stat n={project.outcome.length} label="shipped" />
          <div className={styles.metaBlock}>
            <span className={styles.metaKey}>role</span>
            <span className={styles.metaVal}>{project.role}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaKey}>category</span>
            <span className={styles.metaVal}>{project.category}</span>
          </div>
          <div className={styles.metaBlock}>
            <span className={styles.metaKey}>source</span>
            {isPrivate ? (
              <span className={styles.metaVal}><Key size={13} /> private</span>
            ) : project.githubUrl ? (
              <a className={styles.metaLink} href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Link2 size={13} /> repository
              </a>
            ) : (
              <span className={styles.metaVal}><Link2 size={13} /> case study</span>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

/* ── Panels ─────────────────────────────────────────────── */

function Overview({ project }: { project: Project }) {
  return (
    <div className={styles.view}>
      <h1 className={styles.title}>{project.title}</h1>
      <p className={styles.lead}>{project.summary}</p>

      {project.metric && <p className={styles.metric}>{project.metric}</p>}

      <div className={styles.registers}>
        <Register label="target users" value={project.targetUsers} />
        <Register label="core problem" value={project.problem.split(/(?<=\.)\s+/)[0]} />
      </div>

      <span className={styles.fieldLabel}>capabilities</span>
      <div className={styles.chips}>
        {project.features.map((f, i) => (
          <span key={i} className={styles.chip}>{f}</span>
        ))}
      </div>
    </div>
  )
}

function Diff({ project }: { project: Project }) {
  const before = toLines(project.problem)
  const after = toLines(project.solution)
  let ln = 0
  return (
    <div className={styles.view}>
      <div className={styles.diffHead}>
        <GitCompare size={15} className={styles.navIcon} />
        <span>the_shift.diff</span>
        <span className={styles.diffStat}>
          <span className={styles.del}>−{before.length}</span>
          <span className={styles.add}>+{after.length}</span>
        </span>
      </div>
      <div className={styles.diff}>
        <div className={styles.hunk}>@@ before · the problem @@</div>
        {before.map((line, i) => (
          <div key={`d${i}`} className={`${styles.line} ${styles.lineDel}`}>
            <span className={styles.gutter}>{++ln}</span>
            <span className={styles.sign}>−</span>
            <span>{line}</span>
          </div>
        ))}
        <div className={styles.hunk}>@@ after · what shipped @@</div>
        {after.map((line, i) => (
          <div key={`a${i}`} className={`${styles.line} ${styles.lineAdd}`}>
            <span className={styles.gutter}>{++ln}</span>
            <span className={styles.sign}>+</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stack({ project }: { project: Project }) {
  const a = project.architecture
  const layers = [
    { icon: Cpu, label: "frontend", value: a.frontend },
    { icon: Server, label: "backend", value: a.backend },
    { icon: Database, label: "database", value: a.database },
    {
      icon: Link2,
      label: "integrations",
      value: `${a.integrations?.join(", ") || "Custom connectors"}${a.deployment ? ` · ${a.deployment}` : ""}`,
    },
  ]
  return (
    <div className={styles.view}>
      <h2 className={styles.viewTitle}>System architecture</h2>
      <div className={styles.layers}>
        {layers.map((l, i) => {
          const Icon = l.icon
          return (
            <div key={i} className={styles.layer}>
              <div className={styles.layerHead}><Icon size={15} className={styles.navIcon} />{l.label}</div>
              <p className={styles.layerBody}>{l.value}</p>
            </div>
          )
        })}
      </div>
      {project.workflow && project.workflow.length > 0 && (
        <>
          <span className={styles.fieldLabel}>runtime workflow</span>
          <div className={styles.diagramFrame}>
            <WorkflowDemo steps={project.workflow} />
          </div>
        </>
      )}
    </div>
  )
}

function Build({ project }: { project: Project }) {
  return (
    <div className={styles.view}>
      <h2 className={styles.viewTitle}>Engineering</h2>
      <div className={styles.decision}>
        <span className={styles.fieldLabel}>key decision</span>
        <p className={styles.decisionText}>{project.technicalDecisions}</p>
      </div>
      <span className={styles.fieldLabel}>challenges</span>
      <div className={styles.issues}>
        {project.challenges.map((c, i) => {
          const [title, ...rest] = c.split(/(?<=\.)\s+/)
          return (
            <div key={i} className={styles.issue}>
              <span className={styles.issueId}>#{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={styles.issueTitle}>{title}</h3>
                <p className={styles.issueDesc}>{rest.join(" ")}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Impact({ project }: { project: Project }) {
  return (
    <div className={styles.view}>
      <h2 className={styles.viewTitle}>Outcomes</h2>
      <ol className={styles.outcomes}>
        {project.outcome.map((o, i) => (
          <li key={i} className={styles.outcome}>
            <span className={styles.outcomeNo}>{String(i + 1).padStart(2, "0")}</span>
            <span>{o}</span>
          </li>
        ))}
      </ol>
      <span className={styles.fieldLabel}>reflections</span>
      <ul className={styles.reflections}>
        {project.reflection.map((r, i) => (
          <li key={i} className={styles.reflection}>{r}</li>
        ))}
      </ul>
    </div>
  )
}

/* ── Atoms ──────────────────────────────────────────────── */

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statN}>{String(n).padStart(2, "0")}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

function Register({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.register}>
      <span className={styles.fieldLabel}>{label}</span>
      <p className={styles.registerVal}>{value}</p>
    </div>
  )
}
