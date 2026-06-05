"use client"

import { useEffect, useRef } from "react"
import styles from "./scroll-progress.module.css"

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // CSS scroll-driven animation handles it natively — JS only needed as fallback
    if (typeof CSS !== "undefined" && CSS.supports("animation-timeline", "scroll()")) return

    const bar = barRef.current
    if (!bar) return

    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? Math.min(window.scrollY / total, 1) : 0
      bar.style.transform = `scaleX(${progress})`
    }

    window.addEventListener("scroll", update, { passive: true })
    update()
    return () => window.removeEventListener("scroll", update)
  }, [])

  return <div ref={barRef} className={styles.bar} aria-hidden="true" />
}
