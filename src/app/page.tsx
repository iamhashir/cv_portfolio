import Link from "next/link"
import { ArrowRight, ArrowUpRight, FileText, Github, Mail } from "lucide-react"
import { projects } from "@/data/projects"
import SystemFeed from "@/components/SystemFeed"
import styles from "./page.module.css"

/** Honest signal metrics, derived from real portfolio data. */
const SIGNALS = [
  { value: "6", unit: "", label: "production systems shipped" },
  { value: "4", unit: "", label: "domains — AI · realtime · ops · systems" },
  { value: "15", unit: "+hrs", label: "operations time saved / week" },
  { value: "90", unit: "%", label: "manual review time cut" },
]

/** Short headline metric for a card face — first segment before the dot. */
function headline(metric?: string) {
  if (!metric) return null
  return metric.split("·")[0].trim()
}

export default function Home() {
  return (
    <div className={styles.home}>
      {/* ───────── Hero: Signal (left) + Noise (right) ───────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          {/* Signal */}
          <div className={styles.signal}>
            <span className={styles.availability}>
              <span className={styles.availDot} />
              Available for work — roles & contracts
            </span>

            <p className={styles.name}>Malik Hashir</p>
            <h1 className={styles.role}>
              AI engineer &amp; full-stack developer who ships
              <span className={styles.roleAccent}> systems that run in production.</span>
            </h1>
            <p className={styles.descriptor}>
              I build the software businesses actually run on — AI tooling,
              realtime platforms, and operations systems that replace manual
              work and stay reliable under load.
            </p>

            {/* Metric rail */}
            <dl className={styles.metrics}>
              {SIGNALS.map((s) => (
                <div className={styles.metric} key={s.label}>
                  <dt className={styles.metricValue}>
                    {s.value}
                    <span className={styles.metricUnit}>{s.unit}</span>
                  </dt>
                  <dd className={styles.metricLabel}>{s.label}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.ctaRow}>
              <Link href="/work" className={styles.ctaPrimary}>
                See the work <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/hr" className={styles.ctaSecondary}>
                Hire me
              </Link>
            </div>

            <div className={styles.links}>
              <a
                href="https://github.com/ihashirr"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <Github size={15} aria-hidden="true" />
                <span>GitHub</span>
              </a>
              <a href="mailto:magnotekbyasool@gmail.com" className={styles.link}>
                <Mail size={15} aria-hidden="true" />
                <span>Email</span>
              </a>
              <a
                href="/Malik_Hashir_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <FileText size={15} aria-hidden="true" />
                <span>CV</span>
              </a>
            </div>
          </div>

          {/* Noise */}
          <div className={styles.noise}>
            <SystemFeed />
          </div>
        </div>
      </section>

      {/* ───────── Project matrix (dashboard grid) ───────── */}
      <section className={styles.matrixSection}>
        <div className="container">
          <div className={styles.matrixHead}>
            <h2 className={styles.sectionLabel}>// selected systems</h2>
            <Link href="/work" className={styles.allWork}>
              All work <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.matrix}>
            {projects.map((project, i) => {
              const id = `PRJ-${String(i + 1).padStart(2, "0")}`
              const metric = headline(project.metric)
              return (
                <Link
                  href={`/work/${project.slug}`}
                  key={project.slug}
                  className={styles.cell}
                >
                  <div className={styles.cellTop}>
                    <span className={styles.cellId}>
                      {id} <span className={styles.cellSlug}>// {project.slug}</span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className={styles.cellArrow}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className={styles.cellTitle}>{project.title}</h3>
                  <span className={styles.cellCategory}>{project.category}</span>
                  <p className={styles.cellSummary}>{project.summary}</p>

                  {metric && (
                    <div className={styles.cellMetric}>
                      <span className={styles.cellMetricDot} />
                      {metric}
                    </div>
                  )}

                  <div className={styles.cellTags}>
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span className={styles.tag} key={tech}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────── Audience signposts ───────── */}
      <section className={styles.signpostSection}>
        <div className="container">
          <div className={styles.signposts}>
            <Link href="/hr" className={styles.signpost}>
              <div>
                <h3 className={styles.signpostTitle}>Looking to hire?</h3>
                <p className={styles.signpostDesc}>
                  Open to AI engineering and full-stack roles.
                </p>
              </div>
              <ArrowRight size={18} className={styles.signpostArrow} aria-hidden="true" />
            </Link>
            <Link href="/client" className={styles.signpost}>
              <div>
                <h3 className={styles.signpostTitle}>Need software built?</h3>
                <p className={styles.signpostDesc}>
                  Available for contract AI, automation, and operations work.
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
