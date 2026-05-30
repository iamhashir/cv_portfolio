"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import React from "react"
import { motion, type Variants, useReducedMotion } from "framer-motion"
import { projects } from "@/data/projects"
import ProjectCard from "@/components/ProjectCard"

// Redesign Component Imports
import ScrollReveal from "@/components/ScrollReveal"

import FeaturedProjectCard from "@/components/FeaturedProjectCard"
import Timeline from "@/components/Timeline"
import SectionHeader from "@/components/SectionHeader"

import styles from "./page.module.css"

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured)
  const secondaryProjects = projects.filter((project) => !project.featured)
  const shouldReduceMotion = useReducedMotion()

  // Framer Motion Orchestrations
  const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  }

  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <div className={styles.homeWrapper}>
      {/* 1. Hero Section - Transparent for WebGL Background */}
      <section className={styles.heroSection}>

        
        <div className={`container ${styles.heroContainer}`}>
          {/* Left: Text Block */}
          {!shouldReduceMotion ? (
            <motion.div 
              className={styles.heroContent}
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className={styles.heroBadgeWrapper} variants={heroItemVariants}>
                <div className="badge-active">
                  <span className="pulse-dot"></span>
                  <span>Available for contract projects</span>
                </div>
              </motion.div>
              
              <motion.h1 className={styles.heroTitle} variants={heroItemVariants}>
                I engineer <span className={styles.titleItalic}>operational chaos</span> into scalable software.
              </motion.h1>
              
              <motion.p className={styles.heroSubtitle} variants={heroItemVariants}>
                With a foundation in sales and event operations, I don&apos;t just write code. I audit business workflows and build the bespoke technical infrastructure needed to scale them.
              </motion.p>
              
              <motion.div className={styles.heroActions} variants={heroItemVariants}>
                <Link href="#featured-work" className="btn-primary">
                  <span>View System Architecture</span>
                  <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="btn-secondary">
                  <span>Talk Operations</span>
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className={styles.heroContent}>
              <div className={styles.heroBadgeWrapper}>
                <div className="badge-active">
                  <span className="pulse-dot"></span>
                  <span>Available for contract projects</span>
                </div>
              </div>
              <h1 className={styles.heroTitle}>
                I engineer <span className={styles.titleItalic}>operational chaos</span> into scalable software.
              </h1>
              <p className={styles.heroSubtitle}>
                With a foundation in sales and event operations, I don&apos;t just write code. I audit business workflows and build the bespoke technical infrastructure needed to scale them.
              </p>
              <div className={styles.heroActions}>
                <Link href="#featured-work" className="btn-primary">
                  <span>View System Architecture</span>
                  <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="btn-secondary">
                  <span>Talk Operations</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. The Blueprint (Vertical timeline block) */}
      <section className={styles.sectionSecondary}>
        <div className="container">
          <SectionHeader
            label="Execution Plan"
            title="Methodical Development"
            description="How I take systems from messy paper checklists to automated operations code."
          />

          <ScrollReveal direction="up">
            <Timeline />
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Featured Systems */}
      <section id="featured-work" className={styles.section}>
        <div className="container">
          <SectionHeader
            label="Featured systems"
            title="Core Operational Platforms"
            description="Deep architecture breakdowns and outcomes for systems designed for core business processes."
          />
          
          <div className={styles.featuredShowcase}>
            {featuredProjects.map((project, index) => (
              <ScrollReveal key={project.slug} delay={0.05}>
                <div className={styles.showcaseItemWrapper}>
                  <span className={styles.sectionCounter}>0{index + 1}</span>
                  <FeaturedProjectCard project={project} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. More Projects */}
      <section className={styles.sectionSecondary}>
        <div className="container">
          <SectionHeader
            label="The Arsenal"
            title="Additional Infrastructure"
            description="Selected client setups, utility structures, and standalone software products."
          />
          
          <div className="grid-2">
            {secondaryProjects.map((project) => (
              <ScrollReveal key={project.slug}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Closing CTA - Terminal Style */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaContainer}`}>
          <div className={styles.terminalCta}>
            <div className={styles.terminalHeader}>
              <span className={styles.terminalDot} style={{ background: "#ff5f56" }} />
              <span className={styles.terminalDot} style={{ background: "#ffbd2e" }} />
              <span className={styles.terminalDot} style={{ background: "#27c93f" }} />
              <span className={styles.terminalTitle}>system_ready.sh</span>
            </div>
            <div className={styles.terminalBody}>
              <p className={styles.terminalLine}>
                <span className={styles.terminalPrompt}>~ </span> 
                <span className={styles.terminalCommand}>echo &quot;Let&apos;s build something worth shipping.&quot;</span>
              </p>
              <p className={styles.terminalOutput}>
                Open to custom operations dashboard integrations, CRM extensions, workflow optimizations, and contract projects.
              </p>
              <p className={styles.terminalLine}>
                <span className={styles.terminalPrompt}>~ </span>
                <span className={styles.terminalCommand}>./connect --options</span>
              </p>
              <div className={styles.terminalOutput}>
                <ul className={styles.terminalLinks}>
                  <li>[01] <a href="mailto:malikhashir@example.com">malikhashir@example.com</a></li>
                  <li>[02] <a href="https://linkedin.com/in/malikhashir">linkedin.com/in/malikhashir</a></li>
                  <li>[03] <a href="https://github.com/iamhashir">github.com/iamhashir</a></li>
                </ul>
              </div>
              <p className={styles.terminalLine}>
                <span className={styles.terminalPrompt}>~ </span>
                <span className={styles.blinkingCursor}>_</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
