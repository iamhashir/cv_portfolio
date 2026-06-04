"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown, Mail, MessageCircle } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useState, type CSSProperties } from "react"
import FeaturedProjectCard from "@/components/FeaturedProjectCard"
import ProjectCard from "@/components/ProjectCard"
import ScrollReveal from "@/components/ScrollReveal"
import SectionHeader from "@/components/SectionHeader"
import SignalTicker from "@/components/SignalTicker"
import Timeline, { type TimelineStep } from "@/components/Timeline"
import { projectCategoryGroups, projects, type Project } from "@/data/projects"
import { useAppStore } from "@/lib/store"
import styles from "./landing-page.module.css"

const systemVisuals: Record<string, { label: string; accent: string }> = {
  reactor: { label: "JSX → hooks → render", accent: "#d4b896" },
  "mina-games": { label: "players → socket → state", accent: "#6ee7b7" },
  opsflow: { label: "orders → records → alerts", accent: "#c9a96e" },
  financesmith: { label: "invoices → ledger → reports", accent: "#f0c36a" },
  traverse: { label: "signals → AI → discovery", accent: "#8bd3ff" },
  "ui-analyzer": { label: "screens → vision → fixes", accent: "#b7a4ff" },
}

const emailAddress = "malikhashir@example.com"
const whatsAppMessage = encodeURIComponent("Hi Malik, I would like to discuss a software project.")

type SectionContent = {
  label: string
  title: string
  description: string
}

export type LandingPageContent = {
  badge: string
  heroPrefix: string
  heroHighlight: string
  heroSuffix: string
  heroDescription: string
  primaryAction: string
  secondaryAction: string
  secondaryHref: string
  process: SectionContent
  timeline: TimelineStep[]
  featured: SectionContent
  additional: SectionContent
  ctaLabel: string
  ctaTitle: string
  ctaDescription: string
  ctaAction: string
  ctaHref: string
}

export default function LandingPage({ content }: { content: LandingPageContent }) {
  const featuredProjects = projects.filter((p) => p.featured)
  const secondaryProjects = projects.filter((p) => !p.featured)
  const shouldReduceMotion = useReducedMotion()
  const activeProject = useAppStore((state) => state.activeProject)
  const activeVisual = systemVisuals[activeProject ?? "opsflow"] ?? systemVisuals.opsflow

  const heroMetrics = [
    { value: `${projects.length}`, label: "documented systems" },
    { value: `${projectCategoryGroups.length}`, label: "delivery domains" },
    { value: "UAE", label: "based, remote-ready" },
  ]

  return (
    <div
      className={styles.landing}
      style={{ "--system-accent": activeVisual.accent } as CSSProperties}
    >
      <div className={styles.backdrop} aria-hidden="true">
        <span>{activeVisual.label}</span>
      </div>

      <section className={styles.hero}>
        <div className={styles.mesh} aria-hidden="true" />
        <div className={styles.badge}>{content.badge}</div>

        <motion.div
          className={styles.heroBody}
          initial={shouldReduceMotion ? false : { y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
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
        </motion.div>

        <div className={styles.heroActions}>
          <Link href="#projects" className={styles.primaryAction}>
            <span>{content.primaryAction}</span>
            <ArrowRight size={18} />
          </Link>
          <Link href={content.secondaryHref} className={styles.secondaryAction}>
            <span>{content.secondaryAction}</span>
          </Link>
        </div>

        <div className={styles.tickerWrapper} aria-hidden="true">
          <SignalTicker />
        </div>
      </section>

      <section className={styles.processSection}>
        <div className="container">
          <SectionHeader {...content.process} />
          <ScrollReveal direction="up">
            <Timeline steps={content.timeline} />
          </ScrollReveal>
        </div>
      </section>

      <section id="projects" className={styles.projectsSection}>
        <header className={styles.sectionIntro}>
          <span>{content.featured.label}</span>
          <h2>{content.featured.title}</h2>
        </header>

        <div className={styles.mobileProjectStack}>
          {projects.map((project) => (
            <ProjectAccordionCard key={project.slug} project={project} />
          ))}
        </div>

        <div className={styles.desktopProjectStack}>
          <div className={styles.featuredShowcase}>
            {featuredProjects.map((project) => (
              <ScrollReveal key={project.slug} delay={0.05}>
                <FeaturedProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
          <SectionHeader {...content.additional} />
          <div className="grid-2">
            {secondaryProjects.map((project) => (
              <ScrollReveal key={project.slug}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.skillsSection}>
        <header className={styles.sectionIntro}>
          <span>Technical stack</span>
          <h2>Built across the stack</h2>
        </header>
        <div className={styles.skillLanes}>
          {projectCategoryGroups.map((category) => {
            const skills = Array.from(
              new Set(
                projects
                  .filter((p) => p.categoryGroup === category)
                  .flatMap((p) => p.techStack)
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
        <header className={styles.sectionIntro}>
          <span>{content.ctaLabel}</span>
          <h2>{content.ctaTitle}</h2>
        </header>
        <div className={styles.mobileContactActions}>
          <a href={`https://wa.me/?text=${whatsAppMessage}`} className={styles.whatsappAction}>
            <MessageCircle size={19} />
            <span>WhatsApp me directly</span>
          </a>
          <a href={`mailto:${emailAddress}`} className={styles.emailAction}>
            <Mail size={19} />
            <span>Send an email</span>
          </a>
        </div>
        <div className={styles.desktopCtaCard}>
          <p className={styles.ctaDescription}>{content.ctaDescription}</p>
          <div className={styles.desktopCtaActions}>
            <Link href={content.ctaHref} className="btn-primary">
              <span>{content.ctaAction}</span>
              <ArrowRight size={16} />
            </Link>
            <a href={`mailto:${emailAddress}`} className="btn-secondary">
              {emailAddress}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProjectAccordionCard({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const setActiveProject = useAppStore((state) => state.setActiveProject)
  const activeProject = useAppStore((state) => state.activeProject)
  const isActive = activeProject === project.slug

  const handleToggle = () => {
    const expanding = !isExpanded
    setIsExpanded(expanding)
    setActiveProject(expanding ? project.slug : null)
  }

  return (
    <article
      className={`${styles.projectCard} ${isExpanded ? styles.projectCardExpanded : ""} ${isActive ? styles.projectCardActive : ""}`}
    >
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
