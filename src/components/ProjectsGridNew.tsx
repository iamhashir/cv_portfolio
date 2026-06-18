"use client"

import React, { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { projects, Project } from "@/data/portfolioData"
import { ProjectCardNew } from "./ProjectCardNew"
import ScrollStack, { ScrollStackItem } from "./ScrollStack"
import styles from "./projects-grid-new.module.css"

interface ProjectsGridNewProps {
  expandedSlug: string | null
  onToggle: (slug: string) => void
  onClose: () => void
}

function AccordionDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      className={styles.accordionRow}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.accordionInner}>
        <button className={styles.accordionClose} onClick={onClose}>
          [CLOSE ×]
        </button>
        <div>
          <h3 className={styles.accordionTitle}>{project.title}</h3>
          <p className={styles.accordionSummary}>{project.solution}</p>

          <div className={styles.accordionSection}>
            <p className={styles.sectionLabel}>Architecture</p>
            <div className={styles.archRow}>
              <span>Frontend</span>
              <span>{project.architecture.frontend}</span>
            </div>
            <div className={styles.archRow}>
              <span>Backend</span>
              <span>{project.architecture.backend}</span>
            </div>
            <div className={styles.archRow}>
              <span>Database</span>
              <span>{project.architecture.database}</span>
            </div>
          </div>

          <div className={styles.accordionSection}>
            <p className={styles.sectionLabel}>Tech Stack</p>
            <div className={styles.stackFull}>{project.techStack.join(" // ")}</div>
          </div>

          {project.outcome && (
            <div className={styles.accordionSection}>
              <p className={styles.sectionLabel}>Outcomes</p>
              <ul className={styles.outcomesList}>
                {project.outcome.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {project.metric && (
            <p className={styles.metricBig}>{project.metric}</p>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              ↗ Source on GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return isMobile
}

export function ProjectsGridNew({
  expandedSlug,
  onToggle,
  onClose,
}: ProjectsGridNewProps) {
  const isMobile = useIsMobile()

  const cardIndices = useMemo(() => {
    const indices: { [slug: string]: number } = {}
    projects.forEach((project, i) => {
      indices[project.slug] = i
    })
    return indices
  }, [])

  const expandedProject = expandedSlug
    ? projects.find((p) => p.slug === expandedSlug) ?? null
    : null

  if (isMobile) {
    return (
      <div className={styles.mobileWrapper}>
        <ScrollStack
          useWindowScroll
          itemDistance={0}
          itemStackDistance={10}
          stackPosition="0%"
          scaleEndPosition="0%"
          baseScale={0.9}
          itemScale={0.025}
          onStackComplete={undefined}
        >
          {projects.map((project) => {
            const idx = cardIndices[project.slug]
            return (
              <ScrollStackItem key={project.slug}>
                <ProjectCardNew
                  project={project}
                  isExpanded={expandedSlug === project.slug}
                  onToggle={() => onToggle(project.slug)}
                  index={idx}
                  disableEffects
                />
              </ScrollStackItem>
            )
          })}
        </ScrollStack>

        <AnimatePresence>
          {expandedProject && (
            <AccordionDetail
              key={`accordion-${expandedProject.slug}`}
              project={expandedProject}
              onClose={onClose}
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  const COL_COUNT = 3
  const rows: Project[][] = []
  for (let i = 0; i < projects.length; i += COL_COUNT) {
    rows.push(projects.slice(i, i + COL_COUNT))
  }

  return (
    <div className={styles.grid}>
      {rows.map((row, ri) => {
        const expandedInRow = row.find((p) => p.slug === expandedSlug) ?? null
        return (
          <React.Fragment key={`row-${ri}`}>
            {row.map((project) => {
              const idx = cardIndices[project.slug]
              return (
                <ProjectCardNew
                  key={project.slug}
                  project={project}
                  isExpanded={expandedSlug === project.slug}
                  onToggle={() => onToggle(project.slug)}
                  index={idx}
                />
              )
            })}
            {expandedInRow && (
              <AccordionDetail
                key={`accordion-${expandedInRow.slug}`}
                project={expandedInRow}
                onClose={onClose}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
