"use client"

import Link from "next/link"
import { ArrowRight, Mail, Linkedin, Github } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { projects } from "@/data/projects"
import ProjectCard from "@/components/ProjectCard"

// Redesign Component Imports
import ScrollReveal from "@/components/ScrollReveal"
import PerspectiveGrid from "@/components/PerspectiveGrid"
import Marquee from "@/components/Marquee"
import FeaturedProjectCard from "@/components/FeaturedProjectCard"
import Timeline from "@/components/Timeline"
import ContactCard from "@/components/ContactCard"
import SectionHeader from "@/components/SectionHeader"

import styles from "./page.module.css"

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured)
  const secondaryProjects = projects.filter((project) => !project.featured)
  const shouldReduceMotion = useReducedMotion()

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
      <section className={styles.heroSection}>
        <PerspectiveGrid />
        <div className="ambient-glow" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }} />
        
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
                Building high-performance <span className={styles.titleItalic}>CRM, automation,</span> and operations systems.
              </motion.h1>
              
              <motion.p className={styles.heroSubtitle} variants={heroItemVariants}>
                Full-stack developer translating manual workflows and spreadsheet bottlenecks into tailored, operational database platforms.
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
                Building high-performance <span className={styles.titleItalic}>CRM, automation,</span> and operations systems.
              </h1>
              <p className={styles.heroSubtitle}>
                Full-stack developer translating manual workflows and spreadsheet bottlenecks into tailored, operational database platforms.
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
          
          {/* Right: Floating Sculptural Monolith */}
          {!shouldReduceMotion ? (
            <motion.div 
              className={styles.heroVisualContainer}
              variants={heroFadeVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className={styles.monolithContainer}
                animate={{
                  y: [0, -12, 0],
                  rotateY: [0, 4, -4, 0],
                  rotateX: [0, -2, 2, 0]
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 50px 100px rgba(201, 169, 110, 0.12)"
                }}
                transition={{
                  y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                  rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                  scale: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <svg
                  viewBox="0 0 340 480"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "100%", height: "100%" }}
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="monolithBody" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2a2520" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#1c1a17" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#111009" stopOpacity="0.98" />
                    </linearGradient>
                    <radialGradient id="amberCore" cx="50%" cy="45%" r="40%">
                      <stop offset="0%" stopColor="#c9a96e" stopOpacity="0.22" />
                      <stop offset="60%" stopColor="#c9a96e" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#c9a96e" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="edgeLeft" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f0ebe2" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#f0ebe2" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="edgeRight" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="0%" stopColor="#f0ebe2" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#f0ebe2" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="edgeTop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4b896" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#d4b896" stopOpacity="0" />
                    </linearGradient>
                    <clipPath id="monolithClip">
                      <rect x="60" y="20" width="220" height="440" rx="18" />
                    </clipPath>
                  </defs>

                  <rect x="60" y="20" width="220" height="440" rx="18" fill="url(#monolithBody)" />
                  <rect x="60" y="20" width="220" height="440" rx="18" fill="url(#amberCore)" />

                  <g clipPath="url(#monolithClip)" opacity="0.6">
                    {[80, 120, 160, 200, 240, 280, 320, 360, 400].map((y, i) => (
                      <line
                        key={i}
                        x1="75"
                        y1={y}
                        x2="265"
                        y2={y}
                        stroke="#c9a96e"
                        strokeWidth="0.5"
                        strokeOpacity={i % 3 === 0 ? 0.45 : 0.15}
                      />
                    ))}

                    <line x1="170" y1="40" x2="170" y2="440" stroke="#c9a96e" strokeWidth="0.5" strokeOpacity="0.25" />

                    <circle cx="170" cy="160" r="3" fill="#c9a96e" fillOpacity="0.75" />
                    <circle cx="170" cy="240" r="2" fill="#c9a96e" fillOpacity="0.5" />
                    <circle cx="170" cy="320" r="3" fill="#c9a96e" fillOpacity="0.65" />

                    <line x1="105" y1="160" x2="155" y2="160" stroke="#c9a96e" strokeWidth="1" strokeOpacity="0.6" />
                    <line x1="185" y1="160" x2="235" y2="160" stroke="#c9a96e" strokeWidth="1" strokeOpacity="0.6" />
                    <line x1="105" y1="320" x2="155" y2="320" stroke="#c9a96e" strokeWidth="1" strokeOpacity="0.5" />
                    <line x1="185" y1="320" x2="235" y2="320" stroke="#c9a96e" strokeWidth="1" strokeOpacity="0.5" />

                    <text x="82" y="155" fill="#c9a96e" fillOpacity="0.55" fontSize="7.5" fontFamily="monospace">CRM.OPS</text>
                    <text x="82" y="235" fill="#c9a96e" fillOpacity="0.4" fontSize="7.5" fontFamily="monospace">WORKFLOW</text>
                    <text x="82" y="315" fill="#c9a96e" fillOpacity="0.55" fontSize="7.5" fontFamily="monospace">LEDGER</text>
                  </g>

                  <rect x="60" y="20" width="8" height="440" rx="0" fill="url(#edgeLeft)" />
                  <rect x="272" y="20" width="8" height="440" rx="0" fill="url(#edgeRight)" />
                  <rect x="60" y="20" width="220" height="12" rx="12" fill="url(#edgeTop)" />

                  <rect x="60" y="20" width="220" height="440" rx="18" stroke="#f0ebe2" strokeWidth="0.75" strokeOpacity="0.12" fill="none" />
                  <ellipse cx="170" cy="478" rx="90" ry="6" fill="#c9a96e" fillOpacity="0.08" />
                </svg>
              </motion.div>
            </motion.div>
          ) : (
            <div className={styles.heroVisualContainer}>
              <div className={styles.monolithContainer}>
                <svg
                  viewBox="0 0 340 480"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "100%", height: "100%" }}
                  aria-hidden="true"
                >
                  <rect x="60" y="20" width="220" height="440" rx="18" fill="url(#monolithBody)" />
                  <rect x="60" y="20" width="220" height="440" rx="18" fill="url(#amberCore)" />
                  <rect x="60" y="20" width="220" height="440" rx="18" stroke="#f0ebe2" strokeWidth="0.75" strokeOpacity="0.1" fill="none" />
                </svg>
              </div>
            </div>
          )}
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
            {secondaryProjects.map((project, idx) => (
              <ScrollReveal key={project.slug} direction="up" delay={idx * 0.08}>
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

      {/* 6. Closing CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGridWrapper}>
          <PerspectiveGrid />
        </div>
        <div className="ambient-glow" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.5 }} />
        
        <div className={`container ${styles.ctaContainer}`}>
          <ScrollReveal direction="up">
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Let&apos;s build something worth shipping.</h2>
              <p className={styles.ctaText}>
                Open to custom operations dashboard integrations, CRM extensions, workflow optimizations, and contract contracts.
              </p>
              
              <div className={styles.ctaCards}>
                <ContactCard
                  title="Direct Email"
                  value="malikhashir@example.com"
                  href="mailto:malikhashir@example.com"
                  icon={<Mail size={22} />}
                />
                <ContactCard
                  title="LinkedIn Connect"
                  value="linkedin.com/in/malikhashir"
                  href="https://linkedin.com/in/malikhashir"
                  icon={<Linkedin size={22} />}
                />
                <ContactCard
                  title="GitHub Source"
                  value="github.com/iamhashir"
                  href="https://github.com/iamhashir"
                  icon={<Github size={22} />}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
