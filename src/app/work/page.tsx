"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { projects, projectCategoryGroups } from "@/data/projects"
import ProjectCard from "@/components/ProjectCard"
import styles from "./work.module.css"

const CATEGORIES = ["All", ...projectCategoryGroups]

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "All") return true
    return project.categoryGroup === activeCategory
  })

  function countFor(cat: string) {
    if (cat === "All") return projects.length
    return projects.filter((p) => p.categoryGroup === cat).length
  }

  return (
    <div className={`container ${styles.workPage}`}>

      {/* ── Header ── */}
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          {filteredProjects.length} {activeCategory === "All" ? "projects" : "in " + activeCategory}
        </motion.p>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          Case Studies
        </motion.h1>
        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A detailed look at the software architectures, database schemas, and commercial
          outcomes of systems I have designed and deployed.
        </motion.p>
      </motion.header>

      {/* ── Filter Tabs ── */}
      <motion.div
        className={styles.filterContainer}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`${styles.filterBtn} ${isActive ? styles.activeFilter : ""}`}
            >
              <span>{category}</span>
              <span className={`${styles.filterCount} ${isActive ? styles.filterCountActive : ""}`}>
                {countFor(category)}
              </span>
            </button>
          )
        })}
      </motion.div>

      {/* ── Project Grid ── */}
      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          <motion.div
            key={activeCategory}
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredProjects.map((project, i) => {
              const isFeaturedHero = i === 0 && project.featured
              return (
                <motion.div
                  key={project.slug}
                  className={isFeaturedHero ? styles.featuredCell : styles.cell}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ProjectCard project={project} featured={isFeaturedHero} />
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className={styles.noResults}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No projects found in this category.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
