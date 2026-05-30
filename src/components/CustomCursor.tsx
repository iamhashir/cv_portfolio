"use client"

import React, { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // We only want the custom cursor on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let cursorX = mouseX
    let cursorY = mouseY

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // A simple animation loop to smoothly follow the mouse
    let animationFrameId: number
    const loop = () => {
      // Lerp for smooth trailing effect
      cursorX += (mouseX - cursorX) * 0.2
      cursorY += (mouseY - cursorY) * 0.2
      
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
      animationFrameId = requestAnimationFrame(loop)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // If hovering over links or buttons
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)
    loop()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (pointer: fine) {
          body {
            cursor: none;
          }
          a, button, [role="button"] {
            cursor: none;
          }
        }
      `}} />
      <div 
        ref={cursorRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '16px',
          height: '16px',
          marginLeft: '-8px',
          marginTop: '-8px',
          borderRadius: '50%',
          backgroundColor: isHovering ? 'transparent' : 'var(--accent-color)',
          border: isHovering ? '1px solid var(--accent-color)' : 'none',
          transform: 'translate3d(-100px, -100px, 0)', // start off-screen
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.2s, height 0.2s, background-color 0.2s, margin 0.2s',
          ...(isHovering ? {
            width: '40px',
            height: '40px',
            marginLeft: '-20px',
            marginTop: '-20px',
            backgroundColor: 'rgba(201, 169, 110, 0.1)', // var(--accent-color) with opacity
            backdropFilter: 'blur(2px)'
          } : {})
        }}
      />
    </>
  )
}
