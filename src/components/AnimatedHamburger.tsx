'use client'

import { motion } from 'framer-motion'
import styles from './animated-hamburger.module.css'

interface AnimatedHamburgerProps {
  isOpen: boolean
  onClick: () => void
}

export function AnimatedHamburger({ isOpen, onClick }: AnimatedHamburgerProps) {
  return (
    <button
      className={styles.hamburger}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <motion.line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          animate={isOpen ? { y1: 12, y2: 12, rotate: 45 } : { y1: 6, y2: 6, rotate: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ originX: '12px', originY: '12px' }}
        />
        <motion.line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        />
        <motion.line
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          animate={isOpen ? { y1: 12, y2: 12, rotate: -45 } : { y1: 18, y2: 18, rotate: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ originX: '12px', originY: '12px' }}
        />
      </svg>
    </button>
  )
}
