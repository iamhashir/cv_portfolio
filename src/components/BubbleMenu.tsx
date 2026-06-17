'use client'

import { useState, useRef, useEffect, CSSProperties, ReactNode } from 'react'
import { gsap } from 'gsap'
import './BubbleMenu.css'

interface MenuItem {
  label: string
  href: string
  ariaLabel?: string
  rotation?: number
  external?: boolean
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
  items?: MenuItem[]
  animationEase?: string
  animationDuration?: number
  staggerDelay?: number
}

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#111',
  menuContentColor = '#c8ff00',
  useFixedPosition = true,
  items = [],
  animationEase = 'back.out(1.5)',
  animationDuration = 0.45,
  staggerDelay = 0.14,
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([])
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])

  const containerClassName = ['bubble-menu', useFixedPosition ? 'fixed' : 'absolute', className]
    .filter(Boolean)
    .join(' ')

  const handleToggle = () => {
    const nextState = !isMenuOpen
    if (nextState) setShowOverlay(true)
    setIsMenuOpen(nextState)
    onMenuClick?.(nextState)
  }

  const handleLinkClick = () => {
    setIsMenuOpen(false)
    onMenuClick?.(false)
  }

  useEffect(() => {
    const overlay = overlayRef.current
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLElement[]
    const labels = labelRefs.current.filter(Boolean) as HTMLElement[]

    if (!overlay || !bubbles.length) return

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' })
      gsap.killTweensOf([...bubbles, ...labels])
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(labels, { y: 24, autoAlpha: 0 })

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.04, 0.04)
        const tl = gsap.timeline({ delay })
        tl.to(bubble, { scale: 1, duration: animationDuration, ease: animationEase })
        if (labels[i]) {
          tl.to(
            labels[i],
            { y: 0, autoAlpha: 1, duration: animationDuration, ease: 'power3.out' },
            `-=${animationDuration * 0.9}`
          )
        }
      })
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels])
      gsap.to(labels, { y: 24, autoAlpha: 0, duration: 0.18, ease: 'power3.in' })
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.18,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' })
          setShowOverlay(false)
        },
      })
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay])

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean) as HTMLElement[]
        const isDesktop = window.innerWidth >= 900
        bubbles.forEach((bubble, i) => {
          const item = items[i]
          if (bubble && item) {
            gsap.set(bubble, { rotation: isDesktop ? (item.rotation ?? 0) : 0 })
          }
        })
      }
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
          aria-pressed={isMenuOpen}
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
          aria-hidden={!isMenuOpen}
        >
          <ul className="bm-list" role="menu" aria-label="Menu links">
            {items.map((item, idx) => (
              <li key={idx} role="none" className="bm-col">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="bm-link"
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  style={{
                    ['--item-rot' as string]: `${item.rotation ?? 0}deg`,
                    ['--pill-bg' as string]: menuBg,
                    ['--pill-color' as string]: menuContentColor,
                    ['--hover-bg' as string]: item.hoverStyles?.bgColor ?? '#1a1a1a',
                    ['--hover-color' as string]: item.hoverStyles?.textColor ?? menuContentColor,
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
