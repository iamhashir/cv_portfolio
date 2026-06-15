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
