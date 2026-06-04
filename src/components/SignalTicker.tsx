"use client"

import styles from "./signal-ticker.module.css"

const signals = [
  "WebSocket architecture",
  "WhatsApp automation",
  "CRM systems",
  "UAE-based · remote-ready",
  "React · TypeScript · Node.js",
  "Real-time multiplayer",
  "Operations workflow",
  "AI-assisted tooling",
  "Custom framework internals",
  "Firebase · Prisma · Docker",
]

export default function SignalTicker() {
  // Duplicate the list to create seamless loop
  const items = [...signals, ...signals]

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.track}>
        {items.map((signal, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.dot} />
            {signal}
          </span>
        ))}
      </div>
    </div>
  )
}
