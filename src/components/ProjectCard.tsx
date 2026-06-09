import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Project } from "@/data/projects"
import styles from "./project-card.module.css"

function isPrivate(status?: string) {
  return status?.toLowerCase().includes("private") ?? false
}

type ProjectCardProps = {
  project: Project
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}
    >
      <div className={styles.category}>
        {project.category}
        {featured && <span className={styles.featuredBadge}>Featured</span>}
      </div>
      <div className={`${styles.cardBody} ${featured ? styles.cardBodyFeatured : ""}`}>
        <h3 className={`${styles.title} ${featured ? styles.titleFeatured : ""}`}>
          {project.title}
        </h3>
        <p className={styles.summary}>{project.summary}</p>

        {project.metric && (
          <div className={styles.metricCallout}>
            {project.metric.split(" · ").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className={styles.metricDot}> · </span>}
              </span>
            ))}
          </div>
        )}

        <div className={styles.metadataGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Role</span>
            <span className={styles.metaVal} title={project.role}>
              {project.role}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Year</span>
            <span className={styles.metaVal}>{project.year}</span>
          </div>
          {featured && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Stack</span>
              <span className={styles.metaVal}>{project.techStack?.slice(0, 3).join(", ")}</span>
            </div>
          )}
        </div>

        {!featured && (
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
        )}

        {featured && (
          <ul className={styles.stackList}>
            {project.techStack?.map((tech) => (
              <li key={tech} className={styles.stackItem}>
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className={styles.ctaRow}>
          <span className={styles.ctaLink}>
            <span>View case study</span>
            <ArrowRight size={16} />
          </span>
          {project.githubUrl && !isPrivate(project.status) && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.codeLink}
              onClick={(e) => e.stopPropagation()}
            >
              View code ↗
            </a>
          )}
        </div>
      </div>
    </Link>
  )
}
