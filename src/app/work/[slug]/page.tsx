import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Server, Cpu, Database, Link2, Key, Info, HelpCircle } from "lucide-react"
import { projects } from "@/data/projects"
import { ArchitectureDiagram } from "@/lib/architectureDiagrams"
import styles from "./project-detail.module.css"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <div className={`container ${styles.detailPage}`}>
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
      <section className={styles.snapshotBox}>
        <h3 className={styles.snapshotTitle}>Project Snapshot</h3>
        <div className={styles.snapshotGrid}>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Problem</span>
            <span className={styles.snapshotVal}>{project.problem.slice(0, 150)}...</span>
          </div>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Target Users</span>
            <span className={styles.snapshotVal}>
              {slug === "opsflow" && "Operations staff, supply coordinators, and executive management."}
              {slug === "financesmith" && "Accounting personnel, operational supervisors, and ledger auditors."}
              {slug === "ui-analyzer" && "UI/UX designers, accessibility evaluators, and frontend developers."}
              {!["opsflow", "financesmith", "ui-analyzer"].includes(slug) && "Commercial operators and development engineers."}
            </span>
          </div>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Core Stack</span>
            <span className={styles.snapshotVal}>{project.stack.join(", ")}</span>
          </div>
          <div className={styles.snapshotItem}>
            <span className={styles.snapshotLabel}>Deliverables</span>
            <span className={styles.snapshotVal}>{project.solution}</span>
          </div>
        </div>
      </section>

      {/* 3. Problem Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <HelpCircle className={styles.archIcon} size={24} />
          <span>The Problem</span>
        </h2>
        <p className={styles.sectionText}>{project.problem}</p>
      </section>

      {/* 4. Solution Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Cpu className={styles.archIcon} size={24} />
          <span>The Solution</span>
        </h2>
        <p className={styles.sectionText}>{project.solution}</p>
      </section>

      {/* 5. Features Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Features</h2>
        <ul className={styles.bulletList}>
          {project.features.map((feature, i) => (
            <li key={i} className={styles.bulletItem}>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* 6. Architecture Section */}
      <section className={styles.section}>
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

      {/* 10. Blueprint Diagram / Gallery mock */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>System Blueprint &amp; Data Flows</h2>
        <div className={styles.diagramBox}>
          <span className={styles.diagramTitle}>Architecture Topology</span>
          <ArchitectureDiagram slug={slug} className={styles.diagramSvg} />
          <span className={styles.diagramCaption}>
            Figure 1: Internal topology mapping request channels, backend microservices, database transactions, and integration gateways.
          </span>
        </div>
      </section>

      {/* 7. Technical Decisions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Technical Decisions</h2>
        <p className={styles.sectionText}>
          {slug === "opsflow" &&
            "Opting for Firebase allowed fast real-time status syncing across concurrent warehouse operators. However, because client operations require strict sales reconciliation, we linked Firebase data endpoints to an relational PostgreSQL database running Prisma ORM to keep invoicing fully compliant."}
          {slug === "financesmith" &&
            "We selected Fastify to ensure high request throughput during ledger uploads. Standardizing schema checks using JSON models at the API gateway layer prevents incomplete records from reaching the double-entry bookkeeping ledger."}
          {slug === "ui-analyzer" &&
            "A separate FastAPI python engine was structured to run visual heuristical parsing libraries asynchronously, preventing high computer vision latencies from blocking the Node.js API server or client UI loads."}
          {!["opsflow", "financesmith", "ui-analyzer"].includes(slug) &&
            "The architecture was designed with modular components to isolate heavy CPU calculations from UI threads, selecting databases optimized for specific data structures (e.g. key-value caching vs relational indexing)."}
        </p>
      </section>

      {/* 8. Challenges Section */}
      <section className={styles.section}>
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

      {/* 9. Outcome Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Business Outcomes</h2>
        <ul className={styles.bulletList}>
          {project.outcome.map((result, i) => (
            <li key={i} className={styles.bulletItem}>
              {result}
            </li>
          ))}
        </ul>
      </section>

      {/* 11. Reflection Section */}
      <section className={styles.section}>
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
