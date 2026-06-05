"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, ChevronUp, ChevronDown } from "lucide-react"
import * as pdfjsLib from "pdfjs-dist"
import styles from "./cv-modal.module.css"

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`

export default function CVModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pageImages, setPageImages] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)

  // Load PDF when modal opens
  useEffect(() => {
    if (!isOpen) return

    const loadPdf = async () => {
      setLoading(true)
      try {
        const pdf = await pdfjsLib.getDocument({ url: "/Malik_Hashir_CV.pdf" }).promise
        setPdf(pdf)
        setTotalPages(pdf.numPages)
        setCurrentPage(1)
        setPageImages({})
      } catch (error) {
        console.error("Error loading PDF:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPdf()
  }, [isOpen])

  // Render current page when it changes
  useEffect(() => {
    if (!pdf || !isOpen) return

    const renderPage = async () => {
      if (pageImages[currentPage]) return

      try {
        const page = await pdf.getPage(currentPage)
        const baseViewport = page.getViewport({ scale: 1 })
        const scale = Math.min(window.innerWidth / baseViewport.width, 2)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!
        const viewport = page.getViewport({ scale })

        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: ctx, viewport, canvas }).promise
        setPageImages((prev) => ({ ...prev, [currentPage]: canvas.toDataURL() }))
      } catch (error) {
        console.error("Error rendering page:", error)
      }
    }

    renderPage()
  }, [pdf, currentPage, isOpen, pageImages])

  // Keyboard nav: arrow keys
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowDown" && currentPage < totalPages) setCurrentPage((p) => p + 1)
      if (e.key === "ArrowUp" && currentPage > 1) setCurrentPage((p) => p - 1)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, onClose, currentPage, totalPages])

  // Prevent scroll on body
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
              {loading && <div className={styles.loadingState}>Loading PDF...</div>}
              {pdf && !loading && (
                <>
                  <div className={styles.pageContainer}>
                    {pageImages[currentPage] && (
                      <img
                        src={pageImages[currentPage]}
                        alt={`PDF Page ${currentPage}`}
                        className={styles.pdfImage}
                      />
                    )}
                  </div>
                  <div className={styles.pageNav}>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className={styles.navBtn}
                      aria-label="Previous page"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <span className={styles.pageCounter}>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className={styles.navBtn}
                      aria-label="Next page"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
