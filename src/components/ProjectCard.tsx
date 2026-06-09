import { useAppStore } from "@/lib/store"
import { Project } from "@/data/projects"
import { ArrowRight } from "@/components/ui/Icons"
import styles from "./project-card.module.css"

function isPrivate(status?: string) {
  return status?.toLowerCase().includes("private") ?? false
}

type ProjectCardProps = {
  project: Project
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const { setSelectedProjectSlug } = useAppStore()

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking a sub-link (like Github View code ↗), let it proceed naturally
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      return;
    }
    
    e.preventDefault();
    setSelectedProjectSlug(project.slug);
    window.history.pushState(null, "", `/work/${project.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.category}>
        {project.category}
        {featured && <span className={styles.featuredBadge}>Featured</span>}
      </div>

      {project.imageUrl && !featured && (
        <div className={styles.cardImageContainer}>
          <img
            src={project.imageUrl}
            alt={project.title}
            className={styles.cardImage}
            loading="lazy"
          />
        </div>
      )}

      <div className={`${styles.cardBody} ${featured ? styles.cardBodyFeatured : ""}`}>
        <h3 className={`${styles.title} ${featured ? styles.titleFeatured : ""}`}>
          {project.title}
        </h3>
        <p className={styles.summary}>{project.summary}</p>

        {featured && project.imageUrl && (
          <div className={styles.featuredImageContainer}>
            <img
              src={project.imageUrl}
              alt={project.title}
              className={styles.featuredImage}
              loading="lazy"
            />
          </div>
        )}

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
            <ArrowRight size={16} weight="bold" />
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
    </div>
  )
}
