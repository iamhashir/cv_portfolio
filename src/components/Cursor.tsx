"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"
import styles from "./cursor.module.css"

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      })
    }

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [role='button'], label, input, textarea, select")) {
        document.documentElement.dataset.cursorHover = "true"
      }
    }

    const onOut = (e: MouseEvent) => {
      const related = (e as MouseEvent & { relatedTarget: Element | null }).relatedTarget
      if (!related?.closest("a, button, [role='button'], label, input, textarea, select")) {
        delete document.documentElement.dataset.cursorHover
      }
    }

    document.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseover", onOver, { passive: true })
    document.addEventListener("mouseout", onOut, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout", onOut)
      delete document.documentElement.dataset.cursorHover
    }
  }, [shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  )
}
