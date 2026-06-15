// ─── Single consolidated data source for the portfolio page ─────
// Re-exports site identity and project records so page.tsx has
// one import path and zero knowledge of the underlying files.

export { site } from "./site"
export { projects } from "./projects"
export type { Project } from "./projects"

// ─── Display filename for each project slug ──────────────────────
export const PROJECT_FILENAMES: Record<string, string> = {
  reactor:       "Reactor.framework",
  "mina-games":  "MINA.realtime",
  opsflow:       "OpsFlow.sys",
  financesmith:  "FinanceSmith.infra",
  traverse:      "Traverse.ai",
  "ui-analyzer": "UIAnalyzer.ai",
}

export function getFilename(slug: string): string {
  return PROJECT_FILENAMES[slug] ?? `${slug}.sys`
}

export function getBadgeLabel(status: string, githubUrl?: string): string {
  if (status.toLowerCase().includes("private")) return "[PRIVATE]"
  if (githubUrl) return "[MIT LICENSE]"
  return "[PRODUCTION]"
}

// ─── Hero telemetry cards (right dark panel) ─────────────────────
export const TELEMETRY = [
  {
    title: "REACTOR.FRAMEWORK",
    badge: "[MIT]",
    rows: [
      { key: "TYPE",   val: "Zero-dependency engine" },
      { key: "STACK",  val: "TypeScript // Custom JSX" },
      { key: "TESTS",  val: "100% PASSING" },
      { key: "METRIC", val: "Custom rendering pipeline" },
    ],
  },
  {
    title: "OPSFLOW.SYS",
    badge: "[LIVE]",
    rows: [
      { key: "TYPE",   val: "CRM + Workflow Platform" },
      { key: "STACK",  val: "React // Node.js // PG" },
      { key: "STATUS", val: "Deployed · Production" },
      { key: "METRIC", val: "1,200+ daily records" },
    ],
  },
  {
    title: "MINA.REALTIME",
    badge: "[LIVE]",
    rows: [
      { key: "TYPE",   val: "Multiplayer Platform" },
      { key: "STACK",  val: "Fastify // WebSockets" },
      { key: "PERF",   val: "Sub-50ms latency" },
      { key: "METRIC", val: "Real-time sync engine" },
    ],
  },
] as const

// ─── Capabilities list for About section ─────────────────────────
export const CAPABILITIES = [
  "CRM Systems",
  "React / Next.js",
  "Workflow Automation",
  "Node.js / Fastify",
  "AI Integrations",
  "PostgreSQL / Redis",
  "Operations Platforms",
  "TypeScript",
] as const
