"use client"

import React, { useRef, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { Project } from "@/data/portfolioData"
import styles from "./project-card-new.module.css"

const throttle = (fn: (...args: any[]) => void, delay: number) => {
  let lastCall = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

const SPRING = { damping: 30, stiffness: 100, mass: 2 }
const TOOLTIP_SPRING = { stiffness: 350, damping: 30, mass: 1 }

const CATEGORY_ACCENT: Record<string, string> = {
  "AI":                  "#A78BFA",
  "CRM / Ops":           "#F59E0B",
  "Realtime":            "#22D3EE",
  "Framework / Systems": "#34D399",
}

interface ProjectCardNewProps {
  project: Project
  isExpanded: boolean
  onToggle: () => void
  index: number
  disableEffects?: boolean
}

export function ProjectCardNew({ project, isExpanded, onToggle, index, disableEffects = false }: ProjectCardNewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [lastOffsetY, setLastOffsetY] = useState(0)

  const rotateX = useSpring(useMotionValue(0), SPRING)
  const rotateY = useSpring(useMotionValue(0), SPRING)
  const scale = useSpring(1, SPRING)
  const glowOpacity = useSpring(0, SPRING)
  const tooltipX = useMotionValue(0)
  const tooltipY = useMotionValue(0)
  const tooltipOpacity = useSpring(0)
  const tooltipRotate = useSpring(0, TOOLTIP_SPRING)

  const accentColor = CATEGORY_ACCENT[project.categoryGroup] ?? "#C17A5F"

  const handleMouseMoveImpl = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -12)
    rotateY.set((offsetX / (rect.width / 2)) * 12)
    tooltipX.set(e.clientX - rect.left)
    tooltipY.set(e.clientY - rect.top)
    tooltipRotate.set(-(offsetY - lastOffsetY) * 0.6)
    setLastOffsetY(offsetY)
  }, [lastOffsetY, rotateX, rotateY, tooltipX, tooltipY, tooltipRotate])

  const handleMouseMove = useCallback(
    throttle(handleMouseMoveImpl, 16),
    [handleMouseMoveImpl]
  )

  function handleMouseEnter() {
    setIsHovered(true)
    scale.set(1.04)
    glowOpacity.set(0.35)
    tooltipOpacity.set(1)
  }

  function handleMouseLeave() {
    setIsHovered(false)
    scale.set(1)
    glowOpacity.set(0)
    rotateX.set(0)
    rotateY.set(0)
    tooltipOpacity.set(0)
    tooltipRotate.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${isExpanded ? styles.cardExpanded : ""}`}
      data-category={project.categoryGroup}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{
        ...(!disableEffects && { rotateX, rotateY, scale }),
        transformStyle: "preserve-3d",
        "--card-accent": accentColor,
      } as any}
      onMouseMove={disableEffects ? undefined : handleMouseMove}
      onMouseEnter={disableEffects ? undefined : handleMouseEnter}
      onMouseLeave={disableEffects ? undefined : handleMouseLeave}
      onClick={onToggle}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
    >
      {/* Background Blob Overlay */}
      <motion.svg
        className={styles.cardBlob}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`blobGrad-${project.slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.15" />
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
          <span className={styles.cardCategory}>{project.category}</span>
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
            backgroundColor: isHovered ? accentColor : "transparent",
            color: isHovered ? "#0d0d0d" : accentColor,
            borderColor: accentColor,
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

      {/* Hover Glow */}
      {!disableEffects && (
        <motion.div
          className={styles.cardGlow}
          style={{ opacity: glowOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Floating tooltip — TiltedCard style */}
      {!disableEffects && (
        <motion.div
          className={styles.cardTooltip}
          style={{
            x: tooltipX,
            y: tooltipY,
            opacity: tooltipOpacity,
            rotate: tooltipRotate,
          }}
          aria-hidden="true"
        >
          {project.categoryGroup}
        </motion.div>
      )}
    </motion.div>
  )
}
