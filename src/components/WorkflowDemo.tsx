"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { WorkflowStep } from "@/data/projects"
import styles from "./workflow-demo.module.css"

const STEP_DURATION = 3000

const ACTOR_LABELS: Record<WorkflowStep["actor"], string> = {
  human: "↑ You",
  system: "⟳ System",
  realtime: "⚡ Live",
}

interface Props {
  steps: WorkflowStep[]
}

export default function WorkflowDemo({ steps }: Props) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % steps.length)
  }, [steps.length])

  useEffect(() => {
    if (prefersReduced.current || paused) return
    timerRef.current = setInterval(advance, STEP_DURATION)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [advance, paused])

  const jumpTo = (idx: number) => {
    setActive(idx)
    if (timerRef.current) clearInterval(timerRef.current)
    if (!prefersReduced.current) {
      timerRef.current = setInterval(advance, STEP_DURATION)
    }
  }

  return (
    <div
      className={styles.demo}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.track}>
        {steps.map((step, i) => {
          const isActive = i === active
          return (
            <button
              key={i}
              type="button"
              className={`${styles.step} ${isActive ? styles.stepActive : ""} ${styles[`actor_${step.actor}`]}`}
              onClick={() => jumpTo(i)}
              aria-pressed={isActive}
            >
              <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.stepTitle}>{step.title}</span>
              {isActive && (
                <>
                  <p className={styles.stepDetail}>{step.detail}</p>
                  <span className={`${styles.actorBadge} ${styles[`badge_${step.actor}`]}`}>
                    {ACTOR_LABELS[step.actor]}
                  </span>
                  {!prefersReduced.current && !paused && (
                    <span className={styles.progressBar} key={`${i}-${paused}`} />
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
