"use client"

import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { Project } from "@/data/projects"
import styles from "./project-brief-card.module.css"

interface Props {
  project: Project
  isExpanded: boolean
  onToggle: () => void
}

export default function ProjectBriefCard({ project, isExpanded, onToggle }: Props) {
  const dotIdx = (project.metric ?? "").indexOf(" · ")
  const headline = dotIdx >= 0 ? project.metric!.slice(0, dotIdx) : (project.metric ?? project.summary)
  const sub = dotIdx >= 0 ? project.metric!.slice(dotIdx + 3) : null

  return (
    <button
      type="button"
      className={`${styles.brief} ${isExpanded ? styles.briefExpanded : ""}`}
      onClick={onToggle}
      aria-expanded={isExpanded}
    >
      <span className={styles.category}>{project.category}</span>

      <div className={styles.metricBlock}>
        <p className={styles.metricHeadline}>{headline}</p>
        {sub && <p className={styles.metricSub}>{sub}</p>}
      </div>

      <div className={styles.footer}>
        <span className={styles.projectName}>{project.title}</span>
        <span className={styles.year}>{project.year}</span>
        <motion.span
          className={styles.chevron}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <ChevronDown size={15} />
        </motion.span>
      </div>
    </button>
  )
}
