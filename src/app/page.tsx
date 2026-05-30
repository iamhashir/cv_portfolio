"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useReducedMotion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react"
import styles from "./page.module.css"

type Door = "hr" | "client" | null

export default function Home() {
  const shouldReduceMotion = useReducedMotion()
  const router = useRouter()
  const [activeDoor, setActiveDoor] = useState<Door>(null)
  const [navigatingDoor, setNavigatingDoor] = useState<Door>(null)
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (navigationTimer.current) clearTimeout(navigationTimer.current)
    }
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (shouldReduceMotion) return

    const bounds = event.currentTarget.getBoundingClientRect()
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    })
  }

  const handleDoorClick = (event: MouseEvent<HTMLAnchorElement>, door: Exclude<Door, null>, href: string) => {
    const isTouchCanvas = window.matchMedia("(max-width: 720px), (pointer: coarse)").matches

    if (!isTouchCanvas || shouldReduceMotion) return

    event.preventDefault()
    setNavigatingDoor(door)
    navigationTimer.current = setTimeout(() => router.push(href), 520)
  }

  return (
    <section
      className={`${styles.gateway} ${activeDoor ? styles[`${activeDoor}Active`] : ""} ${navigatingDoor ? styles.expanding : ""}`}
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
        className={`${styles.door} ${styles.hrDoor} ${navigatingDoor === "hr" ? styles.selectedDoor : ""}`}
        onPointerEnter={() => setActiveDoor("hr")}
        onFocus={() => setActiveDoor("hr")}
        onBlur={() => setActiveDoor(null)}
        onClick={(event) => handleDoorClick(event, "hr", "/hr")}
      >
        <span className={styles.doorText} data-text="I'm hiring">
          I&apos;m hiring
        </span>
        <ArrowUpRight className={styles.arrow} strokeWidth={1.25} aria-hidden="true" />
      </Link>

      <Link
        href="/client"
        className={`${styles.door} ${styles.clientDoor} ${navigatingDoor === "client" ? styles.selectedDoor : ""}`}
        onPointerEnter={() => setActiveDoor("client")}
        onFocus={() => setActiveDoor("client")}
        onBlur={() => setActiveDoor(null)}
        onClick={(event) => handleDoorClick(event, "client", "/client")}
      >
        <span className={styles.doorText} data-text="I need software built">
          I need software built
        </span>
        <ArrowUpRight className={styles.arrow} strokeWidth={1.25} aria-hidden="true" />
      </Link>
    </section>
  )
}
