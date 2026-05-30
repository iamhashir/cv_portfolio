"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useReducedMotion } from "framer-motion"
import { useState, type CSSProperties, type PointerEvent } from "react"
import styles from "./page.module.css"

type Door = "hr" | "client" | null

export default function Home() {
  const shouldReduceMotion = useReducedMotion()
  const [activeDoor, setActiveDoor] = useState<Door>(null)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (shouldReduceMotion) return

    const bounds = event.currentTarget.getBoundingClientRect()
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    })
  }

  return (
    <section
      className={`${styles.gateway} ${activeDoor ? styles[`${activeDoor}Active`] : ""}`}
      style={{ "--pointer-x": `${pointer.x}%`, "--pointer-y": `${pointer.y}%` } as CSSProperties}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setActiveDoor(null)}
    >
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.axis} aria-hidden="true" />

      <div className={styles.identity}>Malik Hashir</div>

      <Link
        href="/hr"
        className={`${styles.door} ${styles.hrDoor}`}
        onPointerEnter={() => setActiveDoor("hr")}
        onFocus={() => setActiveDoor("hr")}
        onBlur={() => setActiveDoor(null)}
      >
        <span className={styles.doorText} data-text="I'm hiring">
          I&apos;m hiring
        </span>
        <ArrowUpRight className={styles.arrow} strokeWidth={1.25} aria-hidden="true" />
      </Link>

      <Link
        href="/client"
        className={`${styles.door} ${styles.clientDoor}`}
        onPointerEnter={() => setActiveDoor("client")}
        onFocus={() => setActiveDoor("client")}
        onBlur={() => setActiveDoor(null)}
      >
        <span className={styles.doorText} data-text="I need software built">
          I need software built
        </span>
        <ArrowUpRight className={styles.arrow} strokeWidth={1.25} aria-hidden="true" />
      </Link>
    </section>
  )
}
