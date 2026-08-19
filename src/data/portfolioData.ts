// ─── Single consolidated data source for the portfolio page ─────
// Re-exports site identity and project records so page.tsx has
// one import path and zero knowledge of the underlying files.

export { site } from "./site"

import {
  projects as rawProjects,
  projectCategoryGroups,
} from "./projects"

export { projectCategoryGroups }
export type { Project, WorkflowStep, DemoSnippet } from "./projects"

// Legacy portfolio entries still reference an old GitHub handle whose
// repositories no longer resolve. Hide those URLs from recruiter-facing UI
// until each project can be mapped to a verified public source.
export const projects = rawProjects.map((project) => ({
  ...project,
  githubUrl: project.githubUrl?.includes("github.com/ihashirr/")
    ? undefined
    : project.githubUrl,
}))

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
  const normalized = status.toLowerCase()

  if (normalized.includes("private")) return "[PRIVATE]"
  if (normalized.includes("case study")) return "[CASE STUDY]"
  if (githubUrl) return "[SOURCE]"
  return "[PROJECT]"
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
