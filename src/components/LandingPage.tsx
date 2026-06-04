"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import FeaturedProjectCard from "@/components/FeaturedProjectCard"
import MobileLandingPage from "@/components/MobileLandingPage"
import ProjectCard from "@/components/ProjectCard"
import ScrollReveal from "@/components/ScrollReveal"
import SectionHeader from "@/components/SectionHeader"
import SignalTicker from "@/components/SignalTicker"
import Timeline, { type TimelineStep } from "@/components/Timeline"
import { projectCategoryGroups, projects } from "@/data/projects"
import styles from "./landing-page.module.css"

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
  const featuredProjects = projects.filter((project) => project.featured)
  const secondaryProjects = projects.filter((project) => !project.featured)
  const shouldReduceMotion = useReducedMotion()
  const heroMetrics = [
    { value: `${projects.length}`, label: "documented systems" },
    { value: `${projectCategoryGroups.length}`, label: "delivery domains" },
    { value: "UAE", label: "based, remote-ready" },
  ]

  const hero = (
    <>
      <div className={styles.heroBadgeWrapper}>
        <div className="badge-active">
          <span>{content.badge}</span>
        </div>
      </div>
      <h1 className={styles.heroTitle}>
        {content.heroPrefix} <span className={styles.titleItalic}>{content.heroHighlight}</span>{" "}
        {content.heroSuffix}
      </h1>
      <p className={styles.heroSubtitle}>{content.heroDescription}</p>
      <div className={styles.heroActions}>
        <Link href="#featured-work" className="btn-primary">
          <span>{content.primaryAction}</span>
          <ArrowRight size={16} />
        </Link>
        <Link href={content.secondaryHref} className="btn-secondary">
          <span>{content.secondaryAction}</span>
        </Link>
      </div>
      <div className={styles.heroMetrics} aria-label="Portfolio proof points">
        {heroMetrics.map((metric) => (
          <div key={metric.label} className={styles.heroMetric}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
      <SignalTicker />
    </>
  )

  return (
    <div className={styles.homeWrapper}>
      <div className={styles.desktopLanding}>
        <section className={styles.heroSection}>
          <div className={`container ${styles.heroContainer}`}>
            {shouldReduceMotion ? (
              <div className={styles.heroContent}>{hero}</div>
            ) : (
              <motion.div
                className={styles.heroContent}
                initial={{ y: 16 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {hero}
              </motion.div>
            )}
          </div>
        </section>

        <section className={styles.sectionSecondary}>
          <div className="container">
            <SectionHeader {...content.process} />
            <ScrollReveal direction="up">
              <Timeline steps={content.timeline} />
            </ScrollReveal>
          </div>
        </section>

        <section id="featured-work" className={styles.section}>
          <div className="container">
            <SectionHeader {...content.featured} />
            <div className={styles.featuredShowcase}>
              {featuredProjects.map((project) => (
                <ScrollReveal key={project.slug} delay={0.05}>
                  <FeaturedProjectCard project={project} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionSecondary}>
          <div className="container">
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

        <section className={styles.ctaSection}>
          <div className={`container ${styles.ctaContainer}`}>
            <div className={styles.ctaCard}>
              <span className={styles.ctaLabel}>{content.ctaLabel}</span>
              <h2 className={styles.ctaTitle}>{content.ctaTitle}</h2>
              <p className={styles.ctaDescription}>{content.ctaDescription}</p>
              <div className={styles.ctaActions}>
                <Link href={content.ctaHref} className="btn-primary">
                  <span>{content.ctaAction}</span>
                  <ArrowRight size={16} />
                </Link>
                <a href="mailto:malikhashir@example.com" className="btn-secondary">
                  malikhashir@example.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <MobileLandingPage content={content} heroMetrics={heroMetrics} />
    </div>
  )
}
