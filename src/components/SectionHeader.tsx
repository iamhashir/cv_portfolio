"use client"

import React from "react"
import { motion, useReducedMotion } from "framer-motion"
import styles from "./section-header.module.css"

interface SectionHeaderProps {
  label: string
  title: string
  description?: string
}

export default function SectionHeader({ label, title, description }: SectionHeaderProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className={styles.headerContainer}>
        <span className={styles.label}>{label}</span>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    )
  }

  // Animation configuration
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  }

  const childVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <motion.div 
      className={styles.headerContainer}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    >
      <motion.span className={styles.label} variants={childVariants}>
        {label}
      </motion.span>
      
      <motion.h2 className={styles.title} variants={childVariants}>
        {title}
      </motion.h2>
      
      {description && (
        <motion.p className={styles.description} variants={childVariants}>
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
