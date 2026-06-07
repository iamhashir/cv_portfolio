"use client"

import styles from "./system-feed.module.css"

/**
 * SystemFeed — the "Noise" panel.
 * An ambient, dev-native activity stream that reads like a live `tail -f`
 * across the projects in this portfolio. Purely decorative (aria-hidden),
 * it signals "AI + realtime + ops systems engineer" at a glance without
 * generic particle/neural-network clichés. Pauses on hover so it's readable.
 */

type LogLevel = "deploy" | "ws" | "infer" | "cron" | "db" | "ok" | "warn"

type LogLine = {
  t: string
  level: LogLevel
  tag: string
  msg: string
}

const FEED: LogLine[] = [
  { t: "12:04:21", level: "deploy", tag: "build", msg: "reactor@2.1.0 — bundle 41kb · passed in 1.8s" },
  { t: "12:04:22", level: "ws", tag: "mina", msg: "1,204 live sessions · server tick 60fps stable" },
  { t: "12:04:24", level: "infer", tag: "analyzer", msg: "audit run complete · 0.8s · 14 issues flagged" },
  { t: "12:04:25", level: "cron", tag: "opsflow", msg: "whatsapp broadcast → 38 customers · 0 failed" },
  { t: "12:04:27", level: "db", tag: "finance", msg: "monthly report generated · 412 rows · pdf+xlsx" },
  { t: "12:04:29", level: "infer", tag: "traverse", msg: "feed reweighted · 7 emirates · 2,019 places" },
  { t: "12:04:31", level: "ok", tag: "health", msg: "all services green · p95 latency 84ms" },
  { t: "12:04:33", level: "ws", tag: "mina", msg: "tournament bracket advanced · round 3/4" },
  { t: "12:04:35", level: "deploy", tag: "ci", msg: "type-check clean · 0 errors · 0 warnings" },
  { t: "12:04:36", level: "infer", tag: "analyzer", msg: "self-hosted vision model · cold start 240ms" },
  { t: "12:04:38", level: "cron", tag: "opsflow", msg: "balance sheet reconciled · 3 ledgers synced" },
  { t: "12:04:40", level: "db", tag: "finance", msg: "invoice validated · no duplicate entries" },
  { t: "12:04:42", level: "ws", tag: "mina", msg: "matchmaking queue drained · avg wait 1.2s" },
  { t: "12:04:44", level: "ok", tag: "health", msg: "uptime 99.9% · last incident — none" },
]

export default function SystemFeed() {
  // Duplicated track enables a seamless CSS loop without JS re-renders.
  const track = [...FEED, ...FEED]

  return (
    <div className={styles.monitor} aria-hidden="true">
      <div className={styles.bar}>
        <span className={styles.dots}>
          <i /><i /><i />
        </span>
        <span className={styles.barLabel}>system://activity — tail -f</span>
        <span className={styles.live}>
          <span className={styles.liveDot} />LIVE
        </span>
      </div>

      <div className={styles.screen}>
        <div className={styles.track}>
          {track.map((line, i) => (
            <div className={styles.line} key={i}>
              <span className={styles.time}>{line.t}</span>
              <span className={`${styles.level} ${styles[line.level]}`}>
                {line.level}
              </span>
              <span className={styles.tag}>{line.tag}</span>
              <span className={styles.msg}>{line.msg}</span>
            </div>
          ))}
        </div>
        <div className={styles.scanline} />
        <div className={styles.fadeTop} />
        <div className={styles.fadeBottom} />
      </div>
    </div>
  )
}
