import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Server, Cpu, Database, Link2, Key, HelpCircle } from "lucide-react"
import { projects } from "@/data/projects"
import { ArchitectureDiagram } from "@/lib/architectureDiagrams"
import SectionMinimap from "@/components/SectionMinimap"
import ProjectConsole from "@/components/ProjectConsole"
import styles from "./project-detail.module.css"

/** Prototype: projects routed through the new Console layout. */
const CONSOLE_PROTOTYPE = new Set(["mina-games"])

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

const MINIMAP_SECTIONS = [
  { id: "snapshot", label: "Snapshot" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "features", label: "Features" },
  { id: "architecture", label: "Architecture" },
  { id: "blueprint", label: "Blueprint" },
  { id: "decisions", label: "Decisions" },
  { id: "challenges", label: "Challenges" },
  { id: "outcomes", label: "Outcomes" },
  { id: "reflections", label: "Reflections" },
]

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  if (CONSOLE_PROTOTYPE.has(slug)) {
    return <ProjectConsole project={project} slug={slug} />
  }

  return (
    <div className={`container ${styles.detailPage}`}>
      <SectionMinimap sections={MINIMAP_SECTIONS} />

      {/* Back link */}
      <Link href="/work" className={styles.backLink}>
        <ArrowLeft size={16} />
        <span>Back to selected work</span>
      </Link>

      {/* 1. Project Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.summary}>{project.summary}</p>

        <div className={styles.headerMetaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Role</span>
            <span className={styles.metaVal}>{project.role}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Status</span>
            <span className={styles.metaVal}>{project.status}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Main Category</span>
            <span className={styles.metaVal}>{project.category}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Links</span>
            <span className={styles.metaVal}>
              {project.status.toLowerCase().includes("private") ? (
                <span style={{ color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Key size={14} /> Private Project
                </span>
              ) : project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.metaLink}>
                  <Link2 size={14} /> View Repository
                </a>
              ) : (
                <span className={styles.metaLink}>
                  <Link2 size={14} /> Case Study Only
                </span>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Project Snapshot Box */}
      <section id="snapshot" className={styles.snapshotBox}>
        <h3 className={styles.snapshotTitle}>Project Snapshot</h3>
        <div className={styles.snapshotGrid}>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Problem</span>
            <span className={styles.snapshotVal}>{project.problem.slice(0, 150)}...</span>
          </div>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Target Users</span>
            <span className={styles.snapshotVal}>{project.targetUsers}</span>
          </div>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Core Stack</span>
            <span className={styles.snapshotVal}>{project.techStack.join(", ")}</span>
          </div>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Deliverables</span>
            <span className={styles.snapshotVal}>{project.solution}</span>
          </div>
        </div>
      </section>

      {/* 3. Problem Section */}
      <section id="problem" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <HelpCircle className={styles.archIcon} size={24} />
          <span>The Problem</span>
        </h2>
        <p className={styles.sectionText}>{project.problem}</p>
      </section>

      {/* 4. Solution Section */}
      <section id="solution" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Cpu className={styles.archIcon} size={24} />
          <span>The Solution</span>
        </h2>
        <p className={styles.sectionText}>{project.solution}</p>
      </section>

      {/* 5. Features Section */}
      <section id="features" className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Features</h2>
        <ul className={styles.bulletList}>
          {project.features.map((feature, i) => (
            <li key={i} className={styles.bulletItem}>{feature}</li>
          ))}
        </ul>
      </section>

      {/* 6. Architecture Section */}
      <section id="architecture" className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Server className={styles.archIcon} size={24} />
          <span>System Architecture</span>
        </h2>
        <p className={styles.sectionText}>
          How the application layers communicate to ensure stability, fast response, and data consistency:
        </p>
        <div className={styles.architectureGrid}>
          <div className={styles.archCard}>
            <div className={styles.archHeader}>
              <Cpu size={18} className={styles.archIcon} />
              <span>Frontend Interface</span>
            </div>
            <div className={styles.archContent}>{project.architecture.frontend}</div>
          </div>
          <div className={styles.archCard}>
            <div className={styles.archHeader}>
              <Server size={18} className={styles.archIcon} />
              <span>Backend Services</span>
            </div>
            <div className={styles.archContent}>{project.architecture.backend}</div>
          </div>
          <div className={styles.archCard}>
            <div className={styles.archHeader}>
              <Database size={18} className={styles.archIcon} />
              <span>Database Ledger</span>
            </div>
            <div className={styles.archContent}>{project.architecture.database}</div>
          </div>
          <div className={styles.archCard}>
            <div className={styles.archHeader}>
              <Link2 size={18} className={styles.archIcon} />
              <span>Integrations &amp; Hosting</span>
            </div>
            <div className={styles.archContent}>
              {project.architecture.integrations?.join(", ") || "Custom REST API connectors"}{" "}
              {project.architecture.deployment && `deployed on ${project.architecture.deployment}`}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Blueprint Diagram */}
      <section id="blueprint" className={styles.section}>
        <h2 className={styles.sectionTitle}>System Blueprint &amp; Data Flows</h2>
        <div className={styles.diagramBox}>
          <span className={styles.diagramTitle}>Architecture Topology</span>
          <ArchitectureDiagram slug={slug} className={styles.diagramSvg} />
          <span className={styles.diagramCaption}>
            Figure 1: Internal topology mapping request channels, backend microservices, database transactions, and integration gateways.
          </span>
        </div>
      </section>

      {/* 8. Technical Decisions */}
      <section id="decisions" className={styles.section}>
        <h2 className={styles.sectionTitle}>Technical Decisions</h2>
        <p className={styles.sectionText}>{project.technicalDecisions}</p>
      </section>

      {/* 9. Challenges Section */}
      <section id="challenges" className={styles.section}>
        <h2 className={styles.sectionTitle}>Engineering Challenges</h2>
        <div>
          {project.challenges.map((challenge, i) => {
            const [title, desc] = challenge.split(". ")
            return (
              <div key={i} className={styles.challengeCard}>
                <h3 className={styles.challengeTitle}>{title}</h3>
                <p className={styles.challengeDesc}>{desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 10. Outcome Section */}
      <section id="outcomes" className={styles.section}>
        <h2 className={styles.sectionTitle}>Business Outcomes</h2>
        <ul className={styles.bulletList}>
          {project.outcome.map((result, i) => (
            <li key={i} className={styles.bulletItem}>{result}</li>
          ))}
        </ul>
      </section>

      {/* 11. Reflection Section */}
      <section id="reflections" className={styles.section}>
        <h2 className={styles.sectionTitle}>Case Reflections</h2>
        <div className={styles.reflectionBox}>
          <ul className={styles.reflectionList}>
            {project.reflection.map((reflect, i) => (
              <li key={i} className={styles.reflectionItem}>
                <span className={styles.reflectionBullet}></span>
                <span>{reflect}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
