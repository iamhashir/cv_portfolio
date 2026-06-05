"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download } from "lucide-react"
import styles from "./cv-modal.module.css"

const PDF_PATH = "/Malik_Hashir_CV.pdf"

function getViewerSrc(origin: string) {
  const full = `${origin}${PDF_PATH}`
  return `https://docs.google.com/gviewer?embedded=true&url=${encodeURIComponent(full)}`
}

export default function CVModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [viewerSrc, setViewerSrc] = useState("")

  useEffect(() => {
    setViewerSrc(getViewerSrc(window.location.origin))
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="CV Viewer"
        >
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className={styles.toolbar}>
              <span className={styles.toolbarTitle}>Malik Hashir — CV</span>
              <div className={styles.toolbarActions}>
                <a
                  href="/Malik_Hashir_CV.pdf"
                  download
                  className={styles.downloadBtn}
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.closeBtn}
                  aria-label="Close CV viewer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className={styles.frameWrapper}>
              {viewerSrc && (
                <iframe
                  src={viewerSrc}
                  className={styles.pdfFrame}
                  title="Malik Hashir CV"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
