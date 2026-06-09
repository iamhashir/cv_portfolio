"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Heartbeat as Activity } from "@phosphor-icons/react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion"
import { Project } from "@/data/projects"
import ExplodedProjectView from "@/components/ExplodedProjectView"
import { useAppStore } from "@/lib/store"
import styles from "./featured-project-card.module.css"

interface FeaturedProjectCardProps {
  project: Project
}

export default function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const mainOutcome = project.outcome[0]
  const setActiveProject = useAppStore((state) => state.setActiveProject)
  const shouldReduceMotion = useReducedMotion()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [5, -5]), { stiffness: 280, damping: 32 })
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), { stiffness: 280, damping: 32 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width * 2 - 1)
    mouseY.set((e.clientY - rect.top) / rect.height * 2 - 1)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      className={styles.cardWrapper}
      style={shouldReduceMotion ? {} : { rotateX, rotateY, transformPerspective: 1100 }}
      whileHover="hover"
      initial="initial"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
                <Activity size={18} weight="duotone" />
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
              <ArrowRight size={18} weight="bold" />
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
