"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { Project } from "@/data/projects"
import ExplodedProjectView from "@/components/ExplodedProjectView"
import { useAppStore } from "@/lib/store"
import styles from "./featured-project-card.module.css"

interface FeaturedProjectCardProps {
  project: Project
}

export default function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  // Grab the first outcome metric as the showcase highlight
  const mainOutcome = project.outcome[0]
  const setActiveProject = useAppStore((state) => state.setActiveProject)

  return (
    <motion.div 
      className={styles.cardWrapper}
      whileHover="hover"
      initial="initial"
      onViewportEnter={() => setActiveProject(project.slug)}
      onViewportLeave={() => setActiveProject(null)}
      viewport={{ margin: "-200px 0px -200px 0px" }}
    >
      <div className={styles.cardContainer}>
        {/* Left Column: Metadata & Narrative */}
        <div className={styles.infoColumn}>
          <div className={styles.headerRow}>
            <span className={styles.categoryBadge}>{project.category}</span>
            <span className={styles.statusChip}>
              {project.status ? (
                project.status.includes("/") ? project.status.split("/")[0] : project.status
              ) : (
                `Active // ${project.year}`
              )}
            </span>
          </div>

          <h3 className={styles.title}>{project.title}</h3>
          
          <p className={styles.summary}>{project.summary}</p>

          {/* Outcome Metric Callout */}
          {mainOutcome && (
            <div className={styles.outcomeCallout}>
              <div className={styles.outcomeIcon}>
                <Activity size={16} />
              </div>
              <div className={styles.outcomeText}>
                <span className={styles.outcomeLabel}>Key Operational Impact</span>
                <p className={styles.outcomeValue}>{mainOutcome}</p>
              </div>
            </div>
          )}

          {/* Tech Stack Tags */}
          <div className={styles.stackContainer}>
            <span className={styles.stackLabel}>Engineered with</span>
            <div className={styles.tagGrid}>
              {project.techStack?.map((tech) => (
                <span key={tech} className={styles.techTag}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Link */}
          <Link href={`/work/${project.slug}`} className={styles.ctaLink}>
            <span>Analyze System Architecture</span>
            <motion.span 
              className={styles.arrowIcon}
              variants={{
                hover: { x: 5 }
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </div>

        {/* Right Column: Visual Architecture Blueprint */}
        <div className={styles.visualColumn}>
          <ExplodedProjectView projectId={project.slug} className={styles.diagramContainer} />
        </div>
      </div>
    </motion.div>
  )
}
