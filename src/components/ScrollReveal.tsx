"use client"

import React, { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number // Delay in seconds
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  duration?: number
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "none",
  distance = 24,
  duration = 0.85
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  // Animation directions mapping
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {}
  }

  const hiddenState: any = {
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
    ...directions[direction]
  }

  const visibleState: any = {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    x: 0,
    y: 0,
    transition: {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1] // Custom premium cubic-bezier easing
    }
  }

  return (
    <motion.div
      initial={hiddenState}
      whileInView={visibleState}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
