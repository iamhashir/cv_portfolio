"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowLeft, Cpu, HardDrives as Server, Database, Link as Link2, Key, Question as HelpCircle } from "@phosphor-icons/react"
import { projects } from "@/data/projects"
import { useAppStore } from "@/lib/store"
import ProjectConsole from "@/components/ProjectConsole"
import SectionMinimap from "@/components/SectionMinimap"
import WorkflowDemo from "@/components/WorkflowDemo"
import CodePreview from "@/components/CodePreview"
import styles from "./project-modal.module.css"

const CONSOLE_PROTOTYPE = new Set<string>([
  "reactor",
  "mina-games",
  "opsflow",
  "financesmith",
  "traverse",
  "ui-analyzer"
])

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

export default function ProjectModal() {
  const { selectedProjectSlug, setSelectedProjectSlug } = useAppStore()

  useEffect(() => {
    if (selectedProjectSlug) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedProjectSlug])

  const handleClose = () => {
    setSelectedProjectSlug(null)
    window.history.pushState(null, "", "/")
  }

  const project = projects.find((p) => p.slug === selectedProjectSlug)

  if (!project) return null

  const isConsole = CONSOLE_PROTOTYPE.has(project.slug)

  return (
    <AnimatePresence>
      {selectedProjectSlug && (
        <div className={styles.overlay} onClick={handleClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header/Titlebar */}
            <div className={styles.titlebar}>
              <div className={styles.lights}>
                <span className={styles.red} onClick={handleClose} />
                <span className={styles.yellow} />
                <span className={styles.green} />
              </div>
              <div className={styles.crumb}>
                <span>work</span>
                <span>/</span>
                <span className={styles.activeFile}>{project.slug}.case</span>
              </div>
              <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
                <X size={16} weight="bold" />
              </button>
            </div>

            {/* Modal Body scroll area */}
            <div className={styles.content}>
              {isConsole ? (
                <ProjectConsole project={project} />
              ) : (
                <div className={styles.detailPage}>
                  <SectionMinimap sections={MINIMAP_SECTIONS} />

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
                        <span className={styles.metaLabel}>Category</span>
                        <span className={styles.metaVal}>{project.category}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Links</span>
                        <span className={styles.metaVal}>
                          {project.status.toLowerCase().includes("private") ? (
                            <span style={{ color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <Key size={16} weight="duotone" /> Private
                            </span>
                          ) : project.githubUrl ? (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.metaLink}>
                              <Link2 size={16} weight="duotone" /> Repository
                            </a>
                          ) : (
                            <span className={styles.metaLink}>Case Study</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </header>

                  {project.imageUrl && (
                    <div className={styles.bannerContainer}>
                      <img
                        src={project.imageUrl}
                        alt={`${project.title} dashboard concept`}
                        className={styles.bannerImage}
                        loading="eager"
                      />
                    </div>
                  )}

                  <section id="snapshot" className={styles.snapshotBox}>
                    {project.metric && (
                      <p className={styles.snapshotMetric}>{project.metric}</p>
                    )}
                    <div className={styles.snapshotGrid}>
                      <div className={styles.snapshotItem}>
                        <span className={styles.snapshotLabel}>Target Users</span>
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
                    </div>
                  </section>

                  <section id="problem" className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                      <HelpCircle className={styles.sectionIcon} size={24} weight="duotone" />
                      <span>The Problem</span>
                    </h2>
                    <p className={styles.sectionText}>{project.problem}</p>
                  </section>

                  <section id="solution" className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                      <Cpu className={styles.sectionIcon} size={24} weight="duotone" />
                      <span>The Solution</span>
                    </h2>
                    <p className={styles.sectionText}>{project.solution}</p>
                  </section>

                  <section id="features" className={styles.section}>
                    <h2 className={styles.sectionTitle}>Key Features</h2>
                    <ul className={styles.bulletList}>
                      {project.features.map((feature, i) => (
                        <li key={i} className={styles.bulletItem}>{feature}</li>
                      ))}
                    </ul>
                  </section>

                  <section id="architecture" className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                      <Server className={styles.sectionIcon} size={24} weight="duotone" />
                      <span>System Architecture</span>
                    </h2>
                    <div className={styles.architectureGrid}>
                      <div className={styles.archCard}>
                        <div className={styles.archHeader}>Frontend</div>
                        <div className={styles.archContent}>{project.architecture.frontend}</div>
                      </div>
                      <div className={styles.archCard}>
                        <div className={styles.archHeader}>Backend</div>
                        <div className={styles.archContent}>{project.architecture.backend}</div>
                      </div>
                      <div className={styles.archCard}>
                        <div className={styles.archHeader}>Database</div>
                        <div className={styles.archContent}>{project.architecture.database}</div>
                      </div>
                    </div>
                  </section>

                  {project.workflow && (
                    <section id="blueprint" className={styles.section}>
                      <h2 className={styles.sectionTitle}>Workflow Blueprint</h2>
                      <WorkflowDemo steps={project.workflow} />
                    </section>
                  )}

                  <section id="decisions" className={styles.section}>
                    <h2 className={styles.sectionTitle}>Decisions</h2>
                    <p className={styles.sectionText}>{project.technicalDecisions}</p>
                  </section>

                  {project.demoSnippet && (
                    <section id="practice" className={styles.section}>
                      <h2 className={styles.sectionTitle}>Source Code</h2>
                      <CodePreview snippet={project.demoSnippet} />
                    </section>
                  )}

                  <section id="challenges" className={styles.section}>
                    <h2 className={styles.sectionTitle}>Challenges</h2>
                    <div>
                      {project.challenges.map((challenge, i) => (
                        <div key={i} className={styles.challengeCard}>
                          <p>{challenge}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section id="outcomes" className={styles.section}>
                    <h2 className={styles.sectionTitle}>Outcomes</h2>
                    <ul className={styles.bulletList}>
                      {project.outcome.map((o, i) => (
                        <li key={i} className={styles.bulletItem}>{o}</li>
                      ))}
                    </ul>
                  </section>

                  <section id="reflections" className={styles.section}>
                    <h2 className={styles.sectionTitle}>Reflections</h2>
                    <ul className={styles.bulletList}>
                      {project.reflection.map((r, i) => (
                        <li key={i} className={styles.bulletItem}>{r}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
