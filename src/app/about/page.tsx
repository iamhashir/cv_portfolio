import styles from "./about.module.css"

export const metadata = {
  title: "About | Malik Hashir",
  description: "Read about Malik Hashir's professional journey, combining full-stack software development with operational logic and sales operations backgrounds.",
}

export default function About() {
  return (
    <div className={`container ${styles.aboutPage}`}>
      {/* 1. Intro Section */}
      <section className={styles.introSection}>
        <div className={styles.introContent}>
          <h1 className={styles.title}>Malik Hashir</h1>
          <p className={styles.subtitle}>
            Full-stack developer building CRM, automation, and operations platforms.
          </p>

          <p className={styles.bioParagraph}>
            I design and ship internal software, custom operations systems, and AI-assisted workflows that replace complex spreadsheet grids with structured databases and clean interfaces.
          </p>
          <p className={styles.bioParagraph}>
            Unlike generic developers who focus exclusively on syntax, I bring a background in sales operations and business workflow coordination. This helps me translate loose operational guidelines into type-safe code that reduces manual errors and overhead hours.
          </p>
          <p className={styles.bioParagraph}>
            Currently based in Abu Dhabi, UAE, I work on contract development projects, consult on internal systems scoping, and study advanced software architectures and AI integration patterns.
          </p>
        </div>

        <div className={styles.strategicBox}>
          <span className={styles.strategicHeading}>System Alignment</span>
          <p className={styles.strategicText}>
            <strong>Core Focus:</strong> Custom business operations, multi-step approval routing, immutability, and real-time syncing.
          </p>
          <p className={styles.strategicText}>
            <strong>Philosophy:</strong> Software is an operations multiplier. One well-designed internal tool that fits a team&apos;s natural habits is worth ten rigid SaaS packages.
          </p>
        </div>
      </section>

      <hr className="section-divider" />

      {/* 2. Strengths Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Core Capabilities</h2>
        <div className={styles.strengthsGrid}>
          <div className={styles.strengthCard}>
            <h3 className={styles.strengthTitle}>Scoping messy workflows</h3>
            <p className={styles.strengthDesc}>
              Analyzing manual spreadsheets, email chains, and slack updates to design structured database tables and relational keys.
            </p>
          </div>

          <div className={styles.strengthCard}>
            <h3 className={styles.strengthTitle}>Building practical internal tools</h3>
            <p className={styles.strengthDesc}>
              Developing custom invoice OCR parsers, double-entry bookkeeping schemas, dynamic order tracking views, and SMS/WhatsApp notification broadsheets.
            </p>
          </div>

          <div className={styles.strengthCard}>
            <h3 className={styles.strengthTitle}>Technical &amp; Business Alignment</h3>
            <p className={styles.strengthDesc}>
              Communicating directly with managers, warehouse operators, and accounting staff to design clean interfaces they actually use.
            </p>
          </div>

          <div className={styles.strengthCard}>
            <h3 className={styles.strengthTitle}>End-to-end deployment</h3>
            <p className={styles.strengthDesc}>
              Managing the lifecycle from initial database migration to deployment using Docker, NGINX, Vercel, and cloud servers (AWS/GCP).
            </p>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* 3. Stack Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Technical Stacks</h2>
        <div className={styles.stackGrid}>
          <div className={styles.stackCard}>
            <span className={styles.stackGroupName}>Frontend</span>
            <ul className={styles.stackList}>
              <li className={styles.stackItem}><span>React</span></li>
              <li className={styles.stackItem}><span>TypeScript</span></li>
              <li className={styles.stackItem}><span>Next.js (App Router)</span></li>
              <li className={styles.stackItem}><span>Vanilla CSS / Modules</span></li>
              <li className={styles.stackItem}><span>HTML5 Canvas</span></li>
            </ul>
          </div>

          <div className={styles.stackCard}>
            <span className={styles.stackGroupName}>Backend &amp; Database</span>
            <ul className={styles.stackList}>
              <li className={styles.stackItem}><span>Node.js / Express</span></li>
              <li className={styles.stackItem}><span>Fastify / FastAPI</span></li>
              <li className={styles.stackItem}><span>Prisma ORM</span></li>
              <li className={styles.stackItem}><span>Firebase / Firestore</span></li>
              <li className={styles.stackItem}><span>PostgreSQL / SQLite</span></li>
              <li className={styles.stackItem}><span>MongoDB / Redis</span></li>
            </ul>
          </div>

          <div className={styles.stackCard}>
            <span className={styles.stackGroupName}>Infra &amp; Tools</span>
            <ul className={styles.stackList}>
              <li className={styles.stackItem}><span>Docker</span></li>
              <li className={styles.stackItem}><span>Linux / NGINX</span></li>
              <li className={styles.stackItem}><span>Vercel / Railway</span></li>
              <li className={styles.stackItem}><span>AWS / Google Cloud</span></li>
              <li className={styles.stackItem}><span>Git / GitHub Actions</span></li>
              <li className={styles.stackItem}><span>OpenAI Vision / OCR</span></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
