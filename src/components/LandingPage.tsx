"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, type Variants, useReducedMotion } from "framer-motion"
import FeaturedProjectCard from "@/components/FeaturedProjectCard"
import ProjectCard from "@/components/ProjectCard"
import ScrollReveal from "@/components/ScrollReveal"
import SectionHeader from "@/components/SectionHeader"
import Timeline, { type TimelineStep } from "@/components/Timeline"
import { projects } from "@/data/projects"
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

  const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

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
    </>
  )

  return (
    <div className={styles.homeWrapper}>
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroContainer}`}>
          {shouldReduceMotion ? (
            <div className={styles.heroContent}>{hero}</div>
          ) : (
            <motion.div
              className={styles.heroContent}
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={heroItemVariants}>{hero}</motion.div>
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
  )
}
