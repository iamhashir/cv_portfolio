import Link from "next/link"
import { EnvelopeSimple as Mail, LinkedinLogo as Linkedin, GithubLogo as Github, MapPin } from "@/components/ui/Icons"
import { Magnetic } from "@/components/ui/Magnetic"
import styles from "./layout.module.css"
import { site } from "@/data/site"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerTop}>
          <div className={styles.footerInfo}>
            <h3 className={styles.footerInfoTitle}>{site.name}</h3>
            <p className={styles.footerInfoDesc}>
              Product-minded full-stack developer specializing in CRM systems, workflow automation, and custom internal operations platforms.
            </p>
          </div>

          <div className={styles.footerLinksGroup}>
            <div className={styles.footerLinksCol}>
              <span className={styles.footerLinksHeading}>Navigation</span>
              <ul className={styles.footerList}>
                {site.navLinks.map((link) => (
                  <li key={link.href}>
                    <Magnetic strength={5}>
                      <Link href={link.href} className={styles.footerLink}>{link.name}</Link>
                    </Magnetic>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.footerLinksCol}>
              <span className={styles.footerLinksHeading}>Connect</span>
              <ul className={styles.footerList}>
                <li>
                  <Magnetic strength={5}>
                    <a href={`mailto:${site.email}`} className={styles.footerLink}>
                      <Mail size={18} weight="duotone" />
                      <span>Email</span>
                    </a>
                  </Magnetic>
                </li>
                <li>
                  <Magnetic strength={5}>
                    <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                      <Linkedin size={18} weight="duotone" />
                      <span>LinkedIn</span>
                    </a>
                  </Magnetic>
                </li>
                <li>
                  <Magnetic strength={5}>
                    <a href={site.github} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                      <Github size={18} weight="duotone" />
                      <span>GitHub</span>
                    </a>
                  </Magnetic>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.footerCopyright}>
            &copy; {currentYear} {site.name}. Built with Next.js &amp; Vanilla CSS.
          </span>
          <div className={styles.footerLocation}>
            <MapPin size={16} weight="duotone" />
            <span>{site.location}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
