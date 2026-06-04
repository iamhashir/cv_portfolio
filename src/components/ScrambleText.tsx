"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$_/"

export default function ScrambleText({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const [display, setDisplay] = useState(text)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const startTimeout = setTimeout(() => {
      let frame = 0
      const totalFrames = 20

      const tick = setInterval(() => {
        frame++

        if (frame >= totalFrames) {
          setDisplay(text)
          clearInterval(tick)
          return
        }

        const progress = frame / totalFrames

        setDisplay(
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " "
              // Resolve characters left-to-right as progress advances
              if (i / text.length < progress) return char
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join("")
        )
      }, 38)

      return () => clearInterval(tick)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [text, delay, shouldReduceMotion])

  return <span className={className}>{display}</span>
}
