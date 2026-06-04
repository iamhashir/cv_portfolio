"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./section-minimap.module.css"

export type MinimapSection = {
  id: string
  label: string
}

export default function SectionMinimap({ sections }: { sections: MinimapSection[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "")
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headings = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (headings.length === 0) return

    const onIntersect: IntersectionObserverCallback = (entries) => {
      // Find the topmost visible section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

      if (visible.length > 0) {
        setActiveId(visible[0].target.id)
      }
    }

    observerRef.current = new IntersectionObserver(onIntersect, {
      rootMargin: "-10% 0px -70% 0px",
      threshold: 0,
    })

    headings.forEach((el) => observerRef.current!.observe(el))

    return () => observerRef.current?.disconnect()
  }, [sections])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav className={styles.minimap} aria-label="Section navigator">
      <div className={styles.track}>
        {sections.map((section) => {
          const isActive = section.id === activeId
          return (
            <button
              key={section.id}
              className={`${styles.item} ${isActive ? styles.active : ""}`}
              onClick={() => scrollTo(section.id)}
              title={section.label}
              aria-label={`Jump to ${section.label}`}
            >
              <span className={styles.dot} />
              <span className={styles.label}>{section.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
