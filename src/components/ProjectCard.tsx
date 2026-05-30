import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Project } from "@/data/projects"
import styles from "./project-card.module.css"

type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/work/${project.slug}`} className={styles.card}>
      <div className={styles.category}>{project.category}</div>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.summary}>{project.summary}</p>

      <div className={styles.metadataGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Role</span>
          <span className={styles.metaVal} title={project.role}>
            {project.role}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Status</span>
          <span className={styles.metaVal} title={project.status || "Active"}>
            {project.status ? (
              project.status.includes("/") ? project.status.split("/")[0].trim() : project.status
            ) : (
              `Active // ${project.year}`
            )}
          </span>
        </div>
      </div>

      <ul className={styles.stackList}>
        {project.techStack?.slice(0, 4).map((tech) => (
          <li key={tech} className={styles.stackItem}>
            {tech}
          </li>
        ))}
        {project.techStack?.length > 4 && (
          <li className={styles.stackItem}>+{project.techStack.length - 4}</li>
        )}
      </ul>

      <span className={styles.ctaLink}>
        <span>View case study</span>
        <ArrowRight size={16} />
      </span>
    </Link>
  )
}
