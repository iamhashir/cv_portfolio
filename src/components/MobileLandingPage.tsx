"use client"

import Link from "next/link"
import { ArrowRight, ChevronDown, Mail, MessageCircle } from "lucide-react"
import { useState } from "react"
import type { LandingPageContent } from "@/components/LandingPage"
import { projectCategoryGroups, projects, type Project } from "@/data/projects"
import styles from "./mobile-landing-page.module.css"

const emailAddress = "malikhashir@example.com"
const whatsAppMessage = encodeURIComponent("Hi Malik, I would like to discuss a software project.")

export default function MobileLandingPage({ content }: { content: LandingPageContent }) {
  return (
    <div className={styles.mobileLanding}>
      <section className={styles.hero}>
        <div className={styles.mesh} aria-hidden="true" />
        <div className={styles.badge}>{content.badge}</div>
        <div className={styles.heroBody}>
          <h1 className={styles.heroTitle}>
            {content.heroPrefix} <span>{content.heroHighlight}</span> {content.heroSuffix}
          </h1>
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
            <MobileProjectCard key={project.slug} project={project} />
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

function MobileProjectCard({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <article className={`${styles.projectCard} ${isExpanded ? styles.projectCardExpanded : ""}`}>
      <button
        type="button"
        className={styles.projectToggle}
        onClick={() => setIsExpanded((expanded) => !expanded)}
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
