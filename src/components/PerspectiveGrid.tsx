"use client"

import React from "react"
import { motion } from "framer-motion"
import styles from "./perspective-grid.module.css"

import InteractiveParticles from "./InteractiveParticles"

export default function PerspectiveGrid() {

  return (
    <div className={styles.gridContainer}>
      {/* Subtle warm mesh grid background */}
      <div className={styles.meshOverlay} />
      
      {/* Light grid layout lines */}
      <div className={styles.lineGrid} />
    </div>
  )
}
