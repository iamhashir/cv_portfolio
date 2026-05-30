"use client"

import React from "react"
import { motion } from "framer-motion"
import styles from "./perspective-grid.module.css"

import InteractiveParticles from "./InteractiveParticles"

export default function PerspectiveGrid() {
  // Generate random coordinates for floating particle systems
  const particles = Array.from({ length: 15 })

  return (
    <div className={styles.gridContainer}>
      {/* Subtle warm mesh grid background */}
      <div className={styles.meshOverlay} />
      
      {/* Light grid layout lines */}
      <div className={styles.lineGrid} />

      {/* Mouse interactive canvas particle layer */}
      <InteractiveParticles />

      {/* Floating ambient light particles */}
      {particles.map((_, i) => {
        const size = Math.random() * 4 + 2
        const initialX = Math.random() * 100
        const initialY = Math.random() * 100
        
        return (
          <motion.div
            key={i}
            className={styles.particle}
            style={{
              width: size,
              height: size,
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              y: [0, Math.random() * -60 - 30, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.45, 0.1],
            }}
            transition={{
              duration: Math.random() * 12 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}
