"use client"

import React from "react"
import { useReducedMotion } from "framer-motion"
import styles from "./marquee.module.css"

interface MarqueeProps {
  items: string[]
  speed?: number // speed in seconds for one full translation loop
}

export default function Marquee({ items, speed = 30 }: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion()

  // Triple items for gapless visual wrap-around
  const marqueeItems = [...items, ...items, ...items]

  return (
    <div className={styles.marqueeContainer}>
      <div 
        className={`${styles.marqueeTrack} ${shouldReduceMotion ? styles.reducedMotion : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {marqueeItems.map((item, idx) => (
          <div key={idx} className={styles.marqueeItem}>
            <span>{item}</span>
            <span className={styles.separator}>◆</span>
          </div>
        ))}
      </div>
    </div>
  )
}
