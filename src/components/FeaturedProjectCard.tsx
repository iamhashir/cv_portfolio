"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { Project } from "@/data/projects"
import { ArchitectureDiagram } from "@/lib/architectureDiagrams"
import styles from "./featured-project-card.module.css"

interface FeaturedProjectCardProps {
  project: Project
}

export default function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  // Grab the first outcome metric as the showcase highlight
  const mainOutcome = project.outcome[0]

  return (
    <motion.div 
      className={styles.cardWrapper}
      whileHover="hover"
      initial="initial"
    >
      <div className={styles.cardContainer}>
        {/* Left Column: Metadata & Narrative */}
        <div className={styles.infoColumn}>
          <div className={styles.headerRow}>
            <span className={styles.categoryBadge}>{project.category}</span>
            <span className={styles.statusChip}>
              <span className={styles.pulseDot} />
              {project.status.includes("/") ? project.status.split("/")[0].trim() : project.status}
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
              {project.stack.map((tech) => (
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
          <motion.div 
            className={styles.diagramContainer}
            variants={{
              hover: { 
                scale: 1.02,
                borderColor: "var(--border-focus)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px var(--accent-glow-hover)"
              }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className={styles.blueprintGrid} />
            <div className={styles.diagramWrapper}>
              <ArchitectureDiagram slug={project.slug} className={styles.svgDiagram} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
