"use client"

import Link from "next/link"
import { ArrowRight, Mail, Linkedin, Github } from "lucide-react"
import React, { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { projects } from "@/data/projects"
import ProjectCard from "@/components/ProjectCard"

// Redesign Component Imports
import ScrollReveal from "@/components/ScrollReveal"
import PerspectiveGrid from "@/components/PerspectiveGrid"
import Marquee from "@/components/Marquee"
import FeaturedProjectCard from "@/components/FeaturedProjectCard"
import Timeline from "@/components/Timeline"
import SectionHeader from "@/components/SectionHeader"
import InteractiveParticles from "@/components/InteractiveParticles"

import styles from "./page.module.css"

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured)
  const secondaryProjects = projects.filter((project) => !project.featured)
  const shouldReduceMotion = useReducedMotion()

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const particlesOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.6], [0.1, 0.8])

  // Trust items for the ticker
  const trustItems = [
    "3+ Years Freelance",
    "CRM & Workflows",
    "Abu Dhabi, UAE",
    "React & TypeScript",
    "API Integrations",
    "AI Parsing Systems"
  ]

  // Framer Motion Orchestrations
  const heroContainerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  }

  const heroItemVariants: any = {
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

  const heroFadeVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className={styles.homeWrapper}>
      {/* 1. Hero Section */}
      <section ref={heroRef} className={styles.heroSection}>
        <motion.div style={{ position: "absolute", inset: 0, opacity: gridOpacity }}>
          <PerspectiveGrid />
        </motion.div>
        <motion.div style={{ position: "absolute", inset: 0, opacity: particlesOpacity }}>
          <InteractiveParticles />
        </motion.div>
        
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
                Translating manual workflows into <span className={styles.titleItalic}>scalable software architecture.</span>
              </motion.h1>
              
              <motion.p className={styles.heroSubtitle} variants={heroItemVariants}>
                Full-stack developer engineering order from operational chaos. Building tailored CRM and automation systems.
              </motion.p>
              
              <motion.div className={styles.heroActions} variants={heroItemVariants}>
                <Link href="/work" className="btn-primary">
                  <span>View systems built</span>
                  <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="btn-secondary">
                  <span>Talk operations</span>
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
                Translating manual workflows into <span className={styles.titleItalic}>scalable software architecture.</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Full-stack developer engineering order from operational chaos. Building tailored CRM and automation systems.
              </p>
              <div className={styles.heroActions}>
                <Link href="/work" className="btn-primary">
                  <span>View systems built</span>
                  <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="btn-secondary">
                  <span>Talk operations</span>
                </Link>
              </div>
            </div>
          )}
          
          {/* Monolith removed to focus on strictly structural presentation */}
        </div>
      </section>

      {/* 2. Trust Rail / Subtle Marquee Ticker */}
      <section className={styles.marqueeSection}>
        <Marquee items={trustItems} speed={40} />
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
            label="Secondary Work"
            title="Additional Projects & Tools"
            description="Selected client setups, utility structures, and standalone software products."
          />
          
          <div className="grid-2">
            {secondaryProjects.map((project) => (
              <ScrollReveal key={project.slug}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
          
          <div className={styles.projectsFooter}>
            <Link href="/work" className="btn-secondary">
              <span>View all projects</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Process (Vertical timeline block) */}
      <section className={styles.section}>
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

      {/* 6. Closing CTA - Terminal Style */}
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
                <span className={styles.terminalCommand}>echo "Let's build something worth shipping."</span>
              </p>
              <p className={styles.terminalOutput}>
                Open to custom operations dashboard integrations, CRM extensions, workflow optimizations, and contract contracts.
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
