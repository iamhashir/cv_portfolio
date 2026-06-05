"use client"

import { useState } from "react"
import { Mail, Linkedin, Github, Copy, Check, ExternalLink, MessageCircle } from "lucide-react"
import styles from "@/components/contact.module.css"

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const emailAddress = "malikhashir@example.com"
  const whatsAppMessage = encodeURIComponent("Hi Malik, I would like to discuss a software project.")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className={`container ${styles.contactPage}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Let&apos;s Connect</h1>
        <p className={styles.description}>
          I am currently open to technical contracts, operations system consulting, and full-stack software development roles in Abu Dhabi and remote worldwide.
        </p>
      </header>

      <div className={styles.mobileActions}>
        <a href={`https://wa.me/?text=${whatsAppMessage}`} className={styles.mobilePrimaryAction}>
          <MessageCircle size={19} />
          <span>WhatsApp me directly</span>
        </a>
        <a href={`mailto:${emailAddress}`} className={styles.mobileSecondaryAction}>
          <Mail size={19} />
          <span>Send an email</span>
        </a>
      </div>

      {/* Connection Cards */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <Mail size={22} />
          </div>
          <h3 className={styles.cardTitle}>Direct Email</h3>
          <p className={styles.cardDesc}>
            For project inquiries, technical scoping, contract reviews, and direct developer correspondence.
          </p>
          <a href={`mailto:${emailAddress}`} className={styles.link}>
            <span>Send email</span>
            <ExternalLink size={14} />
          </a>
        </div>

        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <Linkedin size={22} />
          </div>
          <h3 className={styles.cardTitle}>LinkedIn Profile</h3>
          <p className={styles.cardDesc}>
            For professional networking, employment opportunities, operational discussions, and referrals.
          </p>
          <a href="https://linkedin.com/in/malikhashir" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span>View profile</span>
            <ExternalLink size={14} />
          </a>
        </div>

        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <Github size={22} />
          </div>
          <h3 className={styles.cardTitle}>GitHub Repository</h3>
          <p className={styles.cardDesc}>
            For exploring open-source repositories, system architecture blueprints, and active code metrics.
          </p>
          <a href="https://github.com/iamhashir" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span>View repositories</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Business Card */}
      <section className={styles.copySection}>
        <div className={styles.cardFace}>
          <div className={styles.cardName}>Malik Hashir</div>
          <div className={styles.cardRole}>Full-Stack Engineer · Systems</div>
          <div className={styles.cardDivider} aria-hidden="true" />
          <div className={styles.emailDisplay}>{emailAddress}</div>
          <a
            href="https://linkedin.com/in/malikhashir"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cardSocial}
          >
            linkedin.com/in/malikhashir
          </a>
        </div>
        <button
          onClick={handleCopy}
          className={`${styles.copyBtn} ${copied ? styles.copiedState : ""}`}
          title="Click to copy email address"
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Email Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy Email Address</span>
            </>
          )}
        </button>
      </section>
    </div>
  )
}
