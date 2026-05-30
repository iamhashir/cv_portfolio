"use client"

import { useState } from "react"
import { projects } from "@/data/projects"
import ProjectCard from "@/components/ProjectCard"
import styles from "./work.module.css"

const CATEGORIES = ["All", "CRM / Ops", "AI", "Realtime", "Framework / Systems"]

export default function Work() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "All") return true
    return project.category === activeCategory
  })

  return (
    <div className={`container ${styles.workPage}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Case Studies</h1>
        <p className={styles.description}>
          A detailed look at the software architectures, database schemas, and commercial outcomes of systems I have designed and deployed.
        </p>
      </header>

      {/* Filter Tabs */}
      <div className={styles.filterContainer}>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`${styles.filterBtn} ${activeCategory === category ? styles.activeFilter : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project Card Grid */}
      {filteredProjects.length > 0 ? (
        <div className={styles.grid}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          No projects found in this category.
        </div>
      )}
    </div>
  )
}
