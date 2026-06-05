import Link from "next/link"
import { ArrowRight, FileText, Github, Mail } from "lucide-react"
import { projects } from "@/data/projects"
import styles from "./page.module.css"

export default function Home() {
  const featured = projects.filter((p) => p.featured)

  return (
    <div className={styles.home}>
      {/* Identity */}
      <section className={styles.intro}>
        <div className="container">
          <p className={styles.name}>Malik Hashir</p>
          <h1 className={styles.role}>
            Full-stack engineer building operational software for businesses.
          </h1>
          <p className={styles.descriptor}>
            CRM systems, workflow automation, and AI tooling — the internal software that replaces manual coordination and runs reliably in production.
          </p>
          <div className={styles.links}>
            <a
              href="https://github.com/iamhashir"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <Github size={15} aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <a href="mailto:magnotekbyasool@gmail.com" className={styles.link}>
              <Mail size={15} aria-hidden="true" />
              <span>magnotekbyasool@gmail.com</span>
            </a>
            <a
              href="/Malik_Hashir_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <FileText size={15} aria-hidden="true" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className={styles.workSection}>
        <div className="container">
          <h2 className={styles.sectionLabel}>Selected work</h2>
          <ul className={styles.projectList}>
            {featured.map((project) => (
              <li key={project.slug} className={styles.projectRow}>
                <div className={styles.projectMeta}>
                  <span className={styles.projectCategory}>{project.category}</span>
                  <span className={styles.projectYear}>{project.year}</span>
                </div>
                <div className={styles.projectInfo}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectSummary}>{project.summary}</p>
                </div>
                <div className={styles.projectActions}>
                  {project.githubUrl &&
                    !project.status?.toLowerCase().includes("private") && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.codeLink}
                      >
                        View code ↗
                      </a>
                    )}
                  <Link href={`/work/${project.slug}`} className={styles.caseLink}>
                    Case study <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/work" className={styles.allWork}>
            See all work <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Audience signposts */}
      <section className={styles.signpostSection}>
        <div className="container">
          <div className={styles.signposts}>
            <Link href="/hr" className={styles.signpost}>
              <div>
                <h3 className={styles.signpostTitle}>Looking to hire?</h3>
                <p className={styles.signpostDesc}>
                  Open to AI automation and full-stack engineering roles
                </p>
              </div>
              <ArrowRight size={18} className={styles.signpostArrow} aria-hidden="true" />
            </Link>
            <Link href="/client" className={styles.signpost}>
              <div>
                <h3 className={styles.signpostTitle}>Need software built?</h3>
                <p className={styles.signpostDesc}>
                  Available for contract CRM, automation, and operations work
                </p>
              </div>
              <ArrowRight size={18} className={styles.signpostArrow} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
