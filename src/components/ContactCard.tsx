import React, { ReactNode } from "react"
import styles from "./contact-card.module.css"

interface ContactCardProps {
  title: string
  value: string
  href: string
  icon: ReactNode
}

export default function ContactCard({ title, value, href, icon }: ContactCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.contactCard}
    >
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.textGroup}>
        <span className={styles.title}>{title}</span>
        <span className={styles.value}>{value}</span>
      </div>
    </a>
  )
}
