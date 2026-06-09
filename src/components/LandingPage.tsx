"use client"

import Link from "next/link"
import { Activity, ArrowRight, ChevronDown, FileText, Github, Linkedin, Mail, MessageCircle } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import dynamic from "next/dynamic"
const CVModal = dynamic(() => import("@/components/CVModal"), { ssr: false })
import ProjectBriefCard from "@/components/ProjectBriefCard"
import ProjectCard from "@/components/ProjectCard"
import ScrollReveal from "@/components/ScrollReveal"
import SectionHeader from "@/components/SectionHeader"
import Timeline, { type TimelineStep } from "@/components/Timeline"
import { projectCategoryGroups, projects, type Project } from "@/data/projects"
import { site } from "@/data/site"
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

const DEFAULT_EMAIL = site.email
const DEFAULT_WHATSAPP = "971504442178"
const whatsAppMessage = encodeURIComponent("Hi Malik, I'd like to discuss an engineering role.")

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
  cvHref?: string
  process: SectionContent
  timeline: TimelineStep[]
  featured: SectionContent
  additional: SectionContent
  ctaLabel: string
  ctaTitle: string
  ctaDescription: string
  ctaAction: string
  ctaHref: string
  showProcess?: boolean
  showTechFilter?: boolean
  availability?: { label: string; active: boolean }
  currentFocus?: string
  email?: string
  whatsappNumber?: string
  socialLinks?: { github?: string; linkedin?: string }
}

export default function LandingPage({ content }: { content: LandingPageContent }) {
  const email = content.email ?? DEFAULT_EMAIL
  const whatsappNumber = content.whatsappNumber ?? DEFAULT_WHATSAPP
  const shouldReduceMotion = useReducedMotion()
  const activeProject = useAppStore((state) => state.activeProject)
  const activeVisual = systemVisuals[activeProject ?? "opsflow"] ?? systemVisuals.opsflow
  const landingRef = useRef<HTMLDivElement>(null)
  const [cvOpen, setCvOpen] = useState(false)

  useEffect(() => {
    const handler = () => setCvOpen(true)
    window.addEventListener("open-cv-modal", handler)
    return () => window.removeEventListener("open-cv-modal", handler)
  }, [])
  const computedAvailability = useMemo(getAvailability, [])
  const activeAvailability = content.availability ?? computedAvailability
  const [filterTech, setFilterTech] = useState<string | null>(null)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  const allTechs = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.techStack))).sort(),
    []
  )
  const handleTechClick = (tech: string) => setFilterTech((t) => (t === tech ? null : tech))
  const filteredProjects = filterTech ? projects.filter((p) => p.techStack.includes(filterTech)) : projects
  const featuredProjects = filteredProjects.filter((p) => p.featured)
  const secondaryProjects = filteredProjects.filter((p) => !p.featured)

  const filterBar = (
    <div className={styles.techFilterBar} role="group" aria-label="Filter projects by technology">
      <button
        type="button"
        className={`${styles.techFilterChip} ${!filterTech ? styles.techFilterChipActive : ""}`}
        onClick={() => setFilterTech(null)}
      >
        All
      </button>
      {allTechs.map((tech) => (
        <button
          key={tech}
          type="button"
          className={`${styles.techFilterChip} ${filterTech === tech ? styles.techFilterChipActive : ""}`}
          onClick={() => handleTechClick(tech)}
        >
          {tech}
        </button>
      ))}
    </div>
  )

  const heroMetrics = [
    { value: `${projects.length}`, label: "documented systems" },
    { value: `${projectCategoryGroups.length}`, label: "delivery domains" },
    { value: "UAE", label: "based, remote-ready" },
  ]

  return (
    <>
    {content.cvHref && (
      <CVModal isOpen={cvOpen} onClose={() => setCvOpen(false)} />
    )}
    <div
      ref={landingRef}
      className={styles.landing}
      style={{ "--system-accent": activeVisual.accent } as CSSProperties}
    >
      <section id="landing-hero" className={styles.hero}>
        <div className={styles.badge}>{content.badge}</div>

        <motion.div
          className={styles.heroBody}
          initial={shouldReduceMotion ? false : { y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.heroTitle}>
            {content.heroPrefix}{" "}
            <span className={styles.heroHighlight}>{content.heroHighlight}</span>{" "}
            {content.heroSuffix}
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
          <div className={styles.availabilityBadge} aria-live="polite">
            <span
              className={`${styles.availabilityDot} ${activeAvailability.active ? styles.availabilityDotActive : ""}`}
            />
            <span>{activeAvailability.label}</span>
          </div>
          {content.currentFocus && (
            <p className={styles.currentFocus}>
              <span className={styles.currentFocusLabel}>Now:</span>
              {content.currentFocus}
            </p>
          )}
        </motion.div>

        {/* Evidence strip — case study previews above the fold */}
        <div className={styles.heroProof} aria-label="Featured case study previews">
          {projects.filter((p) => p.featured).slice(0, 3).map((project) => (
            <Link key={project.slug} href={`/work/${project.slug}`} className={styles.heroProofItem}>
              <div className={styles.heroProofMain}>
                <span className={styles.heroProofCategory}>{project.category}</span>
                <span className={styles.heroProofTitle}>{project.title}</span>
                <span className={styles.heroProofOutcome}>{project.outcome[0]}</span>
              </div>
              <ArrowRight size={14} className={styles.heroProofArrow} aria-hidden="true" />
            </Link>
          ))}
        </div>

        <div className={styles.heroActions}>
          {content.cvHref && (
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              className={styles.cvAction}
              aria-label="View CV"
            >
              <FileText size={18} />
              <span>View CV</span>
            </button>
          )}
          <Link href="#landing-projects" className={styles.primaryAction}>
            <span>{content.primaryAction}</span>
            <ArrowRight size={18} />
          </Link>
          <Link href={content.secondaryHref} className={styles.secondaryAction}>
            <span>{content.secondaryAction}</span>
          </Link>
          {content.socialLinks && (
            <div className={styles.socialLinks}>
              {content.socialLinks.github && (
                <a
                  href={content.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                  aria-label="GitHub profile"
                >
                  <Github size={18} />
                </a>
              )}
              {content.socialLinks.linkedin && (
                <a
                  href={content.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                  aria-label="LinkedIn profile"
                >
                  <Linkedin size={18} />
                </a>
              )}
            </div>
          )}
        </div>

      </section>

      {content.showProcess !== false && (
        <section id="landing-process" className={styles.processSection}>
          <div className="container">
            <SectionHeader {...content.process} />
            <ScrollReveal direction="up">
              <Timeline steps={content.timeline} />
            </ScrollReveal>
          </div>
        </section>
      )}

      <section id="landing-projects" className={styles.projectsSection}>
        <header className={styles.sectionIntro}>
          <span>{content.featured.label}</span>
          <h2>{content.featured.title}</h2>
        </header>

        <div className={styles.mobileProjectStack}>
          {content.showTechFilter !== false && filterBar}
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectAccordionCard
                key={project.slug}
                project={project}
                activeTech={content.showTechFilter !== false ? filterTech : null}
                onTechClick={content.showTechFilter !== false ? handleTechClick : undefined}
              />
            ))
          ) : (
            <p className={styles.filterEmpty}>No projects match &ldquo;{filterTech}&rdquo;</p>
          )}
        </div>

        <div className={styles.desktopProjectStack}>
          {content.showTechFilter !== false && filterBar}
          {featuredProjects.length > 0 && (
            <>
              {/* Brief strip */}
              <ScrollReveal>
                <div className={styles.briefsRow}>
                  {featuredProjects.map((project) => (
                    <ProjectBriefCard
                      key={project.slug}
                      project={project}
                      isExpanded={expandedSlug === project.slug}
                      onToggle={() =>
                        setExpandedSlug((prev) => (prev === project.slug ? null : project.slug))
                      }
                    />
                  ))}
                </div>
              </ScrollReveal>

              {/* Expand panel */}
              {(() => {
                const ep = expandedSlug
                  ? featuredProjects.find((p) => p.slug === expandedSlug) ?? null
                  : null
                return (
                  <div
                    className={`${styles.briefPanelOuter} ${ep ? styles.briefPanelOpen : ""}`}
                  >
                    <div className={styles.briefPanelInner}>
                      {ep && (
                        <div className={styles.briefPanelContent}>
                          {/* Info column */}
                          <div className={styles.briefPanelInfo}>
                            <div className={styles.bpHeaderRow}>
                              <span className={styles.bpCategory}>{ep.category}</span>
                              <span className={styles.bpStatus}>
                                {ep.status
                                  ? ep.status.includes("/")
                                    ? ep.status.split("/")[0].trim()
                                    : ep.status
                                  : `Active // ${ep.year}`}
                              </span>
                            </div>
                            <h3 className={styles.bpTitle}>{ep.title}</h3>
                            <p className={styles.bpSummary}>{ep.summary}</p>
                            {ep.outcome?.[0] && (
                              <div className={styles.bpOutcome}>
                                <span className={styles.bpOutcomeIcon}>
                                  <Activity size={14} />
                                </span>
                                <div className={styles.bpOutcomeText}>
                                  <span className={styles.bpOutcomeLabel}>Key Operational Impact</span>
                                  <p className={styles.bpOutcomeValue}>{ep.outcome[0]}</p>
                                </div>
                              </div>
                            )}
                            <div className={styles.bpStackWrap}>
                              <span className={styles.bpStackLabel}>Engineered with</span>
                              <div className={styles.bpTagGrid}>
                                {ep.techStack?.map((tech) => (
                                  <span key={tech} className={styles.bpTag}>{tech}</span>
                                ))}
                              </div>
                            </div>
                            <div className={styles.bpCtaRow}>
                              <Link href={`/work/${ep.slug}`} className={styles.bpCta}>
                                <span>Analyze System Architecture</span>
                                <ArrowRight size={15} />
                              </Link>
                              {ep.githubUrl && !ep.status?.toLowerCase().includes("private") && (
                                <a href={ep.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.bpCodeLink}>
                                  View code ↗
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
            </>
          )}
          {secondaryProjects.length > 0 && (
            <>
              <SectionHeader {...content.additional} />
              <div className="grid-2">
                {secondaryProjects.map((project) => (
                  <ScrollReveal key={project.slug}>
                    <ProjectCard project={project} />
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
          {filteredProjects.length === 0 && (
            <p className={styles.filterEmpty}>No projects match &ldquo;{filterTech}&rdquo;</p>
          )}
        </div>
      </section>

      <section id="landing-skills" className={styles.skillsSection}>
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

      <section id="landing-contact" className={styles.contactSection}>
        <header className={styles.sectionIntro}>
          <span>{content.ctaLabel}</span>
          <h2>{content.ctaTitle}</h2>
        </header>
        <div className={styles.mobileContactActions}>
          <a href={`https://wa.me/${whatsappNumber}?text=${whatsAppMessage}`} className={styles.whatsappAction}>
            <MessageCircle size={19} />
            <span>WhatsApp me directly</span>
          </a>
          <a href={`mailto:${email}`} className={styles.emailAction}>
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
            <a href={`mailto:${email}`} className="btn-secondary">
              {email}
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAvailability() {
  const uae = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" }))
  const h = uae.getHours()
  const d = uae.getDay() // 0=Sun … 6=Sat; UAE work week is Sun–Thu (0–4)

  if (d <= 4 && h >= 9 && h < 18) return { active: true, label: "Available now · GST" }

  // Compute hours until next 9am work day
  const next = new Date(uae)
  next.setSeconds(0, 0)
  next.setMinutes(0)
  if (h < 9 && d <= 4) {
    next.setHours(9)
  } else {
    next.setHours(9)
    next.setDate(next.getDate() + 1)
    while (next.getDay() === 5 || next.getDay() === 6) next.setDate(next.getDate() + 1)
  }
  const hrs = Math.max(1, Math.round((next.getTime() - uae.getTime()) / 3_600_000))
  return { active: false, label: `Responds in ~${hrs}h · GST` }
}

// ─── Project accordion card ───────────────────────────────────────────────────

function ProjectAccordionCard({
  project,
  activeTech = null,
  onTechClick,
}: {
  project: Project
  activeTech?: string | null
  onTechClick?: (tech: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const setActiveProject = useAppStore((state) => state.setActiveProject)
  const activeProject = useAppStore((state) => state.activeProject)
  const isActive = activeProject === project.slug

  const handleToggle = () => {
    if ("vibrate" in navigator) navigator.vibrate(8)
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
          <button
            key={tech}
            type="button"
            className={`${styles.techChip} ${activeTech === tech ? styles.techChipActive : ""}`}
            onClick={onTechClick ? () => onTechClick(tech) : undefined}
            aria-pressed={onTechClick ? activeTech === tech : undefined}
          >
            {tech}
          </button>
        ))}
      </div>
      {project.metric && !isExpanded && (
        <div className={styles.projectMetric}>{project.metric}</div>
      )}
      <div className={styles.projectDetails}>
        <p>{project.outcome[0]}</p>
        <div className={styles.projectLinkRow}>
          <Link href={`/work/${project.slug}`} className={styles.projectLink}>
            <span>View case study</span>
            <ArrowRight size={16} />
          </Link>
          {project.githubUrl && !project.status?.toLowerCase().includes("private") && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.projectCodeLink}>
              View code ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
