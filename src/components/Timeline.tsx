"use client"

import React, { useRef } from "react"
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion"
import styles from "./timeline.module.css"

const steps = [
  {
    stepNumber: "01 / SCOPE",
    stepName: "Discovery & Scope",
    title: "Uncovering Operational Bottlenecks",
    desc: "We analyze your spreadsheet pipelines, manual check sheets, and email loops to isolate operational friction and outline a database schema."
  },
  {
    stepNumber: "02 / ARCHITECT",
    stepName: "System Architecture",
    title: "Mapping Models & Workflows",
    desc: "Design full-scale data models, background worker flows, API structures, and permission rules, ensuring compliance and sub-second response times."
  },
  {
    stepNumber: "03 / DELIVER",
    stepName: "Deployment & Audit",
    title: "Production Release & Training",
    desc: "Roll out the CRM/ledger dashboards, integrate automated communication gateways (WhatsApp, Slack), and run real-world transaction testing."
  }
]

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Smooth out scroll progression using spring dynamics
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 20 })

  return (
    <div ref={containerRef} className={styles.timelineWrapper}>
      {/* Connector Line */}
      <div className={styles.timelineLineContainer}>
        <div className={styles.timelineLineBackground} />
        {!shouldReduceMotion ? (
          <motion.div 
            className={styles.timelineLineActive} 
            style={{ scaleY }}
          />
        ) : (
          <div className={`${styles.timelineLineActive} ${styles.draw}`} />
        )}
      </div>

      {/* Steps List */}
      <div className={styles.timelineItems}>
        {steps.map((step, idx) => {
          return (
            <div key={idx} className={styles.timelineItem}>
              {/* Animated Node Circle */}
              <ScrollRevealNode index={idx}>
                <div className={styles.timelineDot} />
              </ScrollRevealNode>

              {/* Content Panel */}
              <motion.div 
                className={styles.timelineContent}
                initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              >
                <div className={styles.timelineStepLabel}>
                  <span className={styles.stepNumber}>{step.stepNumber}</span>
                  <span className={styles.stepName}>{step.stepName}</span>
                </div>
                <div className={styles.stepBody}>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ScrollRevealNodeProps {
  children: React.ReactNode
  index: number
}

function ScrollRevealNode({ children, index }: ScrollRevealNodeProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className={`${styles.timelineNode} ${styles.timelineNodeActive}`}>
        {children}
      </div>
    )
  }

  return (
    <motion.div 
      className={styles.timelineNode}
      initial={{ borderColor: "var(--border-muted)", scale: 0.8 }}
      whileInView={{ 
        borderColor: "var(--accent-color)", 
        scale: 1,
        boxShadow: "0 0 12px rgba(201, 169, 110, 0.25)"
      }}
      viewport={{ once: true, margin: "0px 0px -150px 0px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      {children}
    </motion.div>
  )
}
