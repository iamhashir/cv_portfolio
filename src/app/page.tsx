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
            {featuredProjects.map((project) => (
              <ScrollReveal key={project.slug} delay={0.05}>
                <FeaturedProjectCard project={project} />
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

      {/* 5. Closing CTA */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaContainer}`}>
          <div className={styles.ctaCard}>
            <span className={styles.ctaLabel}>Available for contract projects</span>
            <h2 className={styles.ctaTitle}>Need an operational system that fits the way your team works?</h2>
            <p className={styles.ctaDescription}>
              I scope workflow bottlenecks, design the data model, and build the interface around the real process.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/contact" className="btn-primary">
                <span>Discuss a system</span>
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
