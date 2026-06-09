import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, HardDrives as Server, Cpu, Database, Link as Link2, Key, Question as HelpCircle } from "@/components/ui/Icons"
import { projects } from "@/data/projects"
import SectionMinimap from "@/components/SectionMinimap"
import WorkflowDemo from "@/components/WorkflowDemo"
import CodePreview from "@/components/CodePreview"
import ProjectConsole from "@/components/ProjectConsole"
import styles from "./project-detail.module.css"

interface Props {
  params: Promise<{ slug: string }>
}

/** Prototype: projects routed through the new Console layout. */
const CONSOLE_PROTOTYPE = new Set<string>([
  "reactor",
  "mina-games",
  "opsflow",
  "financesmith",
  "traverse",
  "ui-analyzer"
])

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

const MINIMAP_SECTIONS = [
  { id: "snapshot", label: "Snapshot" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "features", label: "Features" },
  { id: "architecture", label: "Architecture" },
  { id: "blueprint", label: "Workflow" },
  { id: "decisions", label: "Decisions" },
  { id: "practice", label: "Code" },
  { id: "challenges", label: "Challenges" },
  { id: "outcomes", label: "Outcomes" },
  { id: "reflections", label: "Reflections" },
]

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  redirect(`/?work=${slug}`)
}
