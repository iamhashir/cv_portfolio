"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown, Mail, MessageCircle } from "lucide-react"
import { useState, type CSSProperties } from "react"
import type { LandingPageContent } from "@/components/LandingPage"
import { projectCategoryGroups, projects, type Project } from "@/data/projects"
import styles from "./mobile-landing-page.module.css"

const emailAddress = "malikhashir@example.com"
const whatsAppMessage = encodeURIComponent("Hi Malik, I would like to discuss a software project.")
type HeroMetric = {
  value: string
  label: string
}

const mobileSystemVisuals: Record<string, { label: string; accent: string }> = {
  reactor: { label: "JSX -> hooks -> render", accent: "#d4b896" },
  "mina-games": { label: "players -> socket -> state", accent: "#6ee7b7" },
  opsflow: { label: "orders -> records -> alerts", accent: "#c9a96e" },
  financesmith: { label: "invoices -> ledger -> reports", accent: "#f0c36a" },
  traverse: { label: "signals -> AI -> discovery", accent: "#8bd3ff" },
  "ui-analyzer": { label: "screens -> vision -> fixes", accent: "#b7a4ff" },
}

export default function MobileLandingPage({
  content,
  heroMetrics,
}: {
  content: LandingPageContent
  heroMetrics: HeroMetric[]
}) {
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const activeVisual = mobileSystemVisuals[activeProject ?? "opsflow"] ?? mobileSystemVisuals.opsflow

  return (
    <div
      className={styles.mobileLanding}
      style={{ "--mobile-system-accent": activeVisual.accent } as CSSProperties}
    >
      <div className={styles.mobileSystemBackdrop} aria-hidden="true">
        <span>{activeVisual.label}</span>
      </div>
      <section className={styles.hero}>
        <div className={styles.mesh} aria-hidden="true" />
        <div className={styles.badge}>{content.badge}</div>
        <div className={styles.heroBody}>
          <h1 className={styles.heroTitle}>
            {content.heroPrefix} <span>{content.heroHighlight}</span> {content.heroSuffix}
          </h1>
          <p className={styles.heroDescription}>{content.heroDescription}</p>
          <div className={styles.heroMetrics} aria-label="Portfolio proof points">
            {heroMetrics.map((metric) => (
              <div key={metric.label} className={styles.heroMetric}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
        <Link href="#mobile-projects" className={styles.heroCta}>
          <span>{content.primaryAction}</span>
          <ArrowRight size={18} />
        </Link>
      </section>

      <section id="mobile-projects" className={styles.projectsSection}>
        <SectionIntro label={content.featured.label} title={content.featured.title} />
        <div className={styles.projectStack}>
          {projects.map((project) => (
            <MobileProjectCard
              key={project.slug}
              project={project}
              isActive={activeProject === project.slug}
              onActivate={(slug) => setActiveProject((current) => (current === slug ? null : slug))}
            />
          ))}
        </div>
      </section>

      <section className={styles.skillsSection}>
        <SectionIntro label="Technical stack" title="Built across the stack" />
        <div className={styles.skillLanes}>
          {projectCategoryGroups.map((category) => {
            const skills = Array.from(
              new Set(
                projects
                  .filter((project) => project.categoryGroup === category)
                  .flatMap((project) => project.techStack)
              )
            )

            return (
              <div key={category} className={styles.skillLane}>
                <h3>{category}</h3>
                <div className={styles.skillShelf}>
                  {skills.map((skill) => (
                    <button key={skill} type="button" className={styles.skillChip}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className={styles.contactSection}>
        <SectionIntro label={content.ctaLabel} title={content.ctaTitle} />
        <div className={styles.contactActions}>
          <a href={`https://wa.me/?text=${whatsAppMessage}`} className={styles.whatsappAction}>
            <MessageCircle size={19} />
            <span>WhatsApp me directly</span>
          </a>
          <a href={`mailto:${emailAddress}`} className={styles.emailAction}>
            <Mail size={19} />
            <span>Send an email</span>
          </a>
        </div>
      </section>
    </div>
  )
}

function SectionIntro({ label, title }: { label: string; title: string }) {
  return (
    <header className={styles.sectionIntro}>
      <span>{label}</span>
      <h2>{title}</h2>
    </header>
  )
}

function MobileProjectCard({
  project,
  isActive,
  onActivate,
}: {
  project: Project
  isActive: boolean
  onActivate: (slug: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const handleToggle = () => {
    setIsExpanded((expanded) => !expanded)
    onActivate(project.slug)
  }

  return (
    <article className={`${styles.projectCard} ${isExpanded ? styles.projectCardExpanded : ""} ${isActive ? styles.projectCardActive : ""}`}>
      <button
        type="button"
        className={styles.projectToggle}
        onClick={handleToggle}
        aria-expanded={isExpanded}
      >
        <span className={styles.projectCategory}>{project.category}</span>
        <span className={styles.projectHeading}>
          <strong>{project.title}</strong>
          <ChevronDown size={18} aria-hidden="true" />
        </span>
        <span className={styles.projectSummary}>{project.summary}</span>
      </button>

      <div className={styles.techShelf} aria-label={`${project.title} technology stack`}>
        {project.techStack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>

      <div className={styles.projectDetails}>
        <p>{project.outcome[0]}</p>
        <Link href={`/work/${project.slug}`} className={styles.projectLink}>
          <span>View case study</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}
