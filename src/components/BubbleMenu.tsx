'use client'

import { useState, useRef, useEffect, useCallback, CSSProperties, ReactNode } from 'react'
import { gsap } from 'gsap'
import './BubbleMenu.css'

interface MenuItem {
  label: string
  href: string
  ariaLabel?: string
  rotation?: number
  hoverStyles?: {
    bgColor?: string
    textColor?: string
  }
}

interface BubbleMenuProps {
  logo?: ReactNode
  onMenuClick?: (open: boolean) => void
  className?: string
  style?: CSSProperties
  menuAriaLabel?: string
  menuBg?: string
  menuContentColor?: string
  useFixedPosition?: boolean
  items?: readonly MenuItem[]
  animationEase?: string
  animationDuration?: number
  staggerDelay?: number
}

const isExternal = (href: string) =>
  /^(https?:\/\/|\/\/|mailto:|tel:)/.test(href)

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#111',
  menuContentColor = '#c8ff00',
  useFixedPosition = true,
  items = [] as readonly MenuItem[],
  animationEase = 'back.out(1.5)',
  animationDuration = 0.45,
  staggerDelay = 0.1,
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([])
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])

  const containerClassName = ['bubble-menu', useFixedPosition ? 'fixed' : 'absolute', className]
    .filter(Boolean)
    .join(' ')

  const handleToggle = useCallback(() => {
    const nextState = !isMenuOpen
    if (nextState) setShowOverlay(true)
    setIsMenuOpen(nextState)
    onMenuClick?.(nextState)
  }, [isMenuOpen, onMenuClick])

  const handleLinkClick = useCallback(() => {
    setIsMenuOpen(false)
    onMenuClick?.(false)
  }, [onMenuClick])

  // Trim stale refs when items array shrinks
  useEffect(() => {
    bubblesRef.current.length = items.length
    labelRefs.current.length = items.length
  }, [items.length])

  // GSAP animation
  useEffect(() => {
    const overlay = overlayRef.current
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLElement[]
    const labels = labelRefs.current.filter(Boolean) as HTMLElement[]

    if (!overlay || !bubbles.length) return

    if (isMenuOpen) {
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 600
      gsap.killTweensOf([overlay, ...bubbles, ...labels])
      gsap.set(overlay, { display: 'flex', opacity: 0 })
      bubbles.forEach((bubble, i) => {
        gsap.set(bubble, {
          scale: 0,
          transformOrigin: '50% 50%',
          rotation: isDesktop ? (items[i]?.rotation ?? 0) : 0,
        })
      })
      gsap.set(labels, { y: 20, autoAlpha: 0 })

      // Fade in overlay background
      gsap.to(overlay, { opacity: 1, duration: 0.2, ease: 'power2.out' })

      bubbles.forEach((bubble, i) => {
        const delay = Math.max(0, i * staggerDelay + gsap.utils.random(-0.03, 0.03))
        const tl = gsap.timeline({ delay })
        tl.to(bubble, { scale: 1, duration: animationDuration, ease: animationEase })
        if (labels[i]) {
          tl.to(
            labels[i],
            { y: 0, autoAlpha: 1, duration: animationDuration * 0.8, ease: 'power3.out' },
            `-=${animationDuration * 0.85}`
          )
        }
      })
    } else if (showOverlay) {
      gsap.killTweensOf([overlay, ...bubbles, ...labels])
      gsap.to(labels, { y: 16, autoAlpha: 0, duration: 0.15, ease: 'power3.in' })
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.18,
        ease: 'power3.in',
        onComplete: () => {
          gsap.to(overlay, {
            opacity: 0, duration: 0.12, ease: 'power2.in',
            onComplete: () => {
              gsap.set(overlay, { display: 'none' })
              setShowOverlay(false)
            },
          })
        },
      })
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay])

  // Resize: sync rotation state
  useEffect(() => {
    const handleResize = () => {
      if (!isMenuOpen) return
      const bubbles = bubblesRef.current.filter(Boolean) as HTMLElement[]
      const isDesktop = window.innerWidth >= 600
      bubbles.forEach((bubble, i) => {
        const item = items[i]
        if (bubble && item) {
          gsap.set(bubble, { rotation: isDesktop ? (item.rotation ?? 0) : 0 })
        }
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMenuOpen, items])

  return (
    <>
      <nav className={containerClassName} style={style} aria-label="Main navigation">
        {logo != null && (
          <div className="bubble logo-bubble" aria-label="Logo" style={{ background: menuBg }}>
            <span className="logo-content">
              {typeof logo === 'string'
                ? <img src={logo} alt="Logo" className="bubble-logo" />
                : logo}
            </span>
          </div>
        )}

        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-expanded={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${useFixedPosition ? 'fixed' : 'absolute'}`}
          style={{ opacity: 0, display: 'none' }}
          aria-hidden={!isMenuOpen}
          inert={!isMenuOpen || undefined}
          onClick={handleToggle}
        >
          <div className="bm-close-wrap" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="bm-close-btn"
              aria-label="Close menu"
              onClick={handleToggle}
              style={{ background: menuBg }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1L13 13M13 1L1 13" stroke={menuContentColor} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <ul
            className="bm-list"
            role="menu"
            aria-label="Menu links"
            onClick={e => e.stopPropagation()}
          >
            {items.map((item, idx) => (
              <li key={item.href} role="none" className="bm-col">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel ?? item.label}
                  className="bm-link"
                  target={isExternal(item.href) ? '_blank' : undefined}
                  rel={isExternal(item.href) ? 'noopener noreferrer' : undefined}
                  style={{
                    ['--pill-bg' as string]: menuBg,
                    ['--pill-color' as string]: menuContentColor,
                    ['--hover-bg' as string]: item.hoverStyles?.bgColor ?? '#c8ff00',
                    ['--hover-color' as string]: item.hoverStyles?.textColor ?? '#0a0a0a',
                  }}
                  ref={el => { bubblesRef.current[idx] = el }}
                  onClick={handleLinkClick}
                >
                  <span
                    className="bm-label"
                    ref={el => { labelRefs.current[idx] = el }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
