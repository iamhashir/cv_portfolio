"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Project } from "@/data/portfolioData"
import styles from "./project-card-new.module.css"

interface ProjectCardNewProps {
  project: Project
  isExpanded: boolean
  onToggle: () => void
  index: number
}

export function ProjectCardNew({ project, isExpanded, onToggle, index }: ProjectCardNewProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const lastUpdateRef = useRef(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    // Throttle mouse position updates to every 16ms (~60fps)
    const now = Date.now()
    if (now - lastUpdateRef.current < 16) return
    lastUpdateRef.current = now

    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x: x * 10, y: y * 10 })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${isExpanded ? styles.cardExpanded : ""}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onToggle}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      style={{
        rotateX: isHovered ? mousePos.y * 0.5 : 0,
        rotateY: isHovered ? mousePos.x * 0.5 : 0,
      }}
    >
      {/* Background Blob Overlay */}
      <motion.svg
        className={styles.cardBlob}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <defs>
          <linearGradient id={`blobGrad-${project.slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-coral)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <motion.path
          d="M100,20 C120,20 140,30 150,50 C160,70 155,90 145,110 C140,125 130,140 110,150 C90,160 70,160 50,150 C30,140 20,125 15,110 C5,90 10,70 20,50 C30,30 80,20 100,20"
          fill={`url(#blobGrad-${project.slug})`}
          animate={{
            d: isHovered
              ? "M100,15 C130,15 155,25 165,55 C175,85 165,105 150,125 C140,140 125,150 105,155 C85,160 60,155 40,145 C20,135 10,115 10,90 C10,60 25,30 50,20 C75,15 85,15 100,15"
              : "M100,20 C120,20 140,30 150,50 C160,70 155,90 145,110 C140,125 130,140 110,150 C90,160 70,160 50,150 C30,140 20,125 15,110 C5,90 10,70 20,50 C30,30 80,20 100,20",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </motion.svg>

      {/* Geometric Corner Accent */}
      <div className={styles.cornerAccent} aria-hidden="true" />

      {/* Card Content */}
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <motion.span
            className={styles.cardTag}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            PRJ-{String(index + 1).padStart(2, "0")}
          </motion.span>
          <motion.span
            className={styles.cardCategory}
            animate={{ color: isHovered ? "#D97936" : "#C17A5F" }}
            transition={{ duration: 0.3 }}
          >
            {project.category}
          </motion.span>
        </div>

        <h3 className={styles.cardTitle}>{project.title}</h3>

        <p className={styles.cardSummary}>{project.summary}</p>

        {/* Visible Metric on Card Face */}
        {project.metric && (
          <motion.div
            className={styles.cardMetric}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <span className={styles.metricLabel}>Impact:</span>
            <span className={styles.metricValue}>{project.metric.split("·")[0]?.trim() || project.metric}</span>
          </motion.div>
        )}

        {/* Tech Stack as Inline Tags */}
        <div className={styles.cardTags}>
          {project.techStack.slice(0, 3).map((tech, i) => (
            <motion.span
              key={tech}
              className={styles.techTag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              animate={{ scale: isHovered ? 1.08 : 1 }}
            >
              {tech}
            </motion.span>
          ))}
          {project.techStack.length > 3 && (
            <span className={styles.techTagMore}>+{project.techStack.length - 3}</span>
          )}
        </div>

        {/* Interactive CTA */}
        <motion.div
          className={styles.cardCta}
          animate={{
            backgroundColor: isHovered ? "#C17A5F" : "transparent",
            color: isHovered ? "#F5F1E8" : "#C17A5F",
          }}
          transition={{ duration: 0.3 }}
        >
          <span>
            {isExpanded ? "Close Details" : "View Details"}
          </span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0, scale: isHovered ? 1.2 : 1 }}
            transition={{ duration: 0.4 }}
          >
            →
          </motion.span>
        </motion.div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className={styles.cardGlow}
        animate={{
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      />
    </motion.div>
  )
}
