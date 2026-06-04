"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import { systemMaps } from "@/lib/systemMaps"
import styles from "./project-system-backdrop.module.css"

export default function ProjectSystemBackdrop() {
  const activeProject = useAppStore((state) => state.activeProject)
  const shouldReduceMotion = useReducedMotion()
  const [pointer, setPointer] = useState({ x: 50, y: 42 })
  const map = systemMaps[activeProject ?? "idle"] ?? systemMaps.idle

  useEffect(() => {
    if (shouldReduceMotion) return

    const onPointerMove = (event: PointerEvent) => {
      setPointer({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", onPointerMove)
  }, [shouldReduceMotion])

  const nodeLookup = useMemo(() => new Map(map.nodes.map((node) => [node.id, node])), [map.nodes])

  return (
    <div
      className={styles.backdrop}
      style={
        {
          "--system-accent": map.accent,
          "--system-glow": map.glow,
          "--pointer-x": `${pointer.x}%`,
          "--pointer-y": `${pointer.y}%`,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <motion.div
        key={`${map.title}-label`}
        className={styles.systemLabel}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <span>{map.mode}</span>
        <strong>{map.title}</strong>
      </motion.div>

      <svg className={styles.map} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="systemGlow">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g key={`${map.title}-grid`} className={styles.grid}>
          {Array.from({ length: 9 }, (_, index) => (
            <path key={`v-${index}`} d={`M ${10 + index * 10} 8 V 92`} />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <path key={`h-${index}`} d={`M 8 ${14 + index * 12} H 92`} />
          ))}
        </g>

        <g key={`${map.title}-links`} className={styles.links}>
          {map.links.map((link, index) => {
            const from = nodeLookup.get(link.from)
            const to = nodeLookup.get(link.to)
            if (!from || !to) return null
            const midX = (from.x + to.x) / 2
            const midY = (from.y + to.y) / 2 - (link.lane === "secondary" ? 10 : 4)
            const path = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`

            return (
              <g key={`${link.from}-${link.to}`}>
                <path className={link.lane === "secondary" ? styles.secondaryLink : styles.primaryLink} d={path} />
                <motion.circle
                  className={styles.packet}
                  r="0.75"
                  filter="url(#systemGlow)"
                  initial={false}
                  animate={shouldReduceMotion ? undefined : { offsetDistance: ["0%", "100%"] }}
                  transition={{
                    duration: 3.4 + index * 0.25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.25,
                  }}
                  style={{ offsetPath: `path("${path}")` }}
                />
              </g>
            )
          })}
        </g>

        <g key={`${map.title}-nodes`} className={styles.nodes}>
          {map.nodes.map((node, index) => (
            <motion.g
              key={node.id}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
            >
              <circle cx={node.x} cy={node.y} r="2.1" className={styles.nodeCore} />
              <circle cx={node.x} cy={node.y} r="5.2" className={styles.nodeRing} />
              <text x={node.x + 3.6} y={node.y + 0.7}>{node.label}</text>
            </motion.g>
          ))}
        </g>
      </svg>
    </div>
  )
}
