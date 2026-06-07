import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Server, Cpu, Database, Link2, Key, HelpCircle } from "lucide-react"
import { projects } from "@/data/projects"
import SectionMinimap from "@/components/SectionMinimap"
import WorkflowDemo from "@/components/WorkflowDemo"
import CodePreview from "@/components/CodePreview"
import ProjectConsole from "@/components/ProjectConsole"
import styles from "./project-detail.module.css"

interface Props {
  params: Promise<{ slug: string }>
}

/** Prototype: projects routed through the new Console layout. */
const CONSOLE_PROTOTYPE = new Set<string>([])

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
  { id: "blueprint", label: "Workflow" },
  { id: "decisions", label: "Decisions" },
  { id: "practice", label: "Code" },
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
    return <ProjectConsole project={project} />
  }

  const idx = projects.findIndex((p) => p.slug === slug)
  const prevProject = idx > 0 ? projects[idx - 1] : null
  const nextProject = idx < projects.length - 1 ? projects[idx + 1] : null

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
        {project.metric && (
          <p className={styles.snapshotMetric}>{project.metric}</p>
        )}
        <div className={styles.snapshotGrid}>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Built for</span>
            <span className={styles.snapshotVal}>{project.targetUsers}</span>
          </div>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Deliverable</span>
            <span className={styles.snapshotVal}>{project.solution}</span>
          </div>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Core stack</span>
            <span className={styles.snapshotVal}>{project.techStack.join(", ")}</span>
          </div>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Outcomes</span>
            <span className={styles.snapshotVal}>{project.outcome.length} documented results</span>
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

      {/* 7. Workflow Demo */}
      {project.workflow && (
        <section id="blueprint" className={styles.section}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <WorkflowDemo steps={project.workflow} />
        </section>
      )}

      {/* 8. Technical Decisions */}
      <section id="decisions" className={styles.section}>
        <h2 className={styles.sectionTitle}>Technical Decisions</h2>
        <p className={styles.sectionText}>{project.technicalDecisions}</p>
      </section>

      {/* 9. In Practice — code snippet */}
      {project.demoSnippet && (
        <section id="practice" className={styles.section}>
          <h2 className={styles.sectionTitle}>In Practice</h2>
          <p className={styles.sectionText}>
            A representative excerpt from the codebase illustrating the key engineering decision above.
          </p>
          <CodePreview snippet={project.demoSnippet} />
        </section>
      )}

      {/* 10. Challenges Section */}
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
        <ol className={styles.outcomeList}>
          {project.outcome.map((result, i) => (
            <li key={i} className={styles.outcomeItem}>
              <span className={styles.outcomeIdx}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.outcomeText}>{result}</span>
            </li>
          ))}
        </ol>
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

      {/* Project navigation */}
      {(prevProject || nextProject) && (
        <nav className={styles.projectNav}>
          {prevProject ? (
            <Link href={`/work/${prevProject.slug}`} className={styles.navLink}>
              <span className={styles.navDir}>← Previous</span>
              <span className={styles.navTitle}>{prevProject.title}</span>
              <span className={styles.navSub}>{prevProject.category}</span>
            </Link>
          ) : <span />}
          {nextProject ? (
            <Link href={`/work/${nextProject.slug}`} className={`${styles.navLink} ${styles.navLinkRight}`}>
              <span className={styles.navDir}>Next →</span>
              <span className={styles.navTitle}>{nextProject.title}</span>
              <span className={styles.navSub}>{nextProject.category}</span>
            </Link>
          ) : <span />}
        </nav>
      )}
    </div>
  )
}
