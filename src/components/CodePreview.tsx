import { DemoSnippet } from "@/data/projects"
import styles from "./code-preview.module.css"

export default function CodePreview({ snippet }: { snippet: DemoSnippet }) {
  const lines = snippet.code.split("\n")

  return (
    <div className={styles.terminal}>
      <div className={styles.header}>
        <span className={styles.dots}>
          <span className={styles.dot} data-color="red" />
          <span className={styles.dot} data-color="yellow" />
          <span className={styles.dot} data-color="green" />
        </span>
        <span className={styles.label}>{snippet.label}</span>
        <span className={styles.lang}>{snippet.language}</span>
      </div>
      <pre className={styles.pre}>
        <span className={styles.codeBlock}>
          {lines.map((line, i) => (
            <span key={i} className={styles.line}>
              <span className={styles.lineNum}>{String(i + 1).padStart(2, " ")}</span>
              <span className={styles.lineContent}>{line || " "}</span>
            </span>
          ))}
        </span>
      </pre>
    </div>
  )
}
