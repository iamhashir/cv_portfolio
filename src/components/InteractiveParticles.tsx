"use client"

import React, { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  baseAlpha: number
}

export default function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    const particleCount = 45
    const connectionDistance = 110
    const mouse = { x: -1000, y: -1000, active: false, radius: 150 }

    // Resize handler
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      initParticles()
    }

    // Initialize particles
    const initParticles = () => {
      const rect = canvas.getBoundingClientRect()
      particles = []
      for (let i = 0; i < particleCount; i++) {
        const baseAlpha = Math.random() * 0.25 + 0.1
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 1,
          alpha: baseAlpha,
          baseAlpha
        })
      }
    }

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // 1. Update and Draw Particles
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx
        p.y += p.vy

        // Bounce on boundaries
        if (p.x < 0 || p.x > rect.width) p.vx *= -1
        if (p.y < 0 || p.y > rect.height) p.vy *= -1

        // Mouse proximity interaction (attraction & glow)
        let opacityMultiplier = 1
        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.hypot(dx, dy)

          if (dist < mouse.radius) {
            // Glow brighter closer to the cursor
            opacityMultiplier = 1 + (1 - dist / mouse.radius) * 2.5
            // Gentle attraction
            p.x += dx * 0.008
            p.y += dy * 0.008
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${Math.min(p.alpha * opacityMultiplier, 0.85)})`
        ctx.fill()
      })

      // 2. Draw Connection Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.hypot(dx, dy)

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.06
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        // Draw connections to mouse
        if (mouse.active) {
          const p = particles[i]
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.hypot(dx, dy)

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.12
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Mouse listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
      mouse.x = -1000
      mouse.y = -1000
    }

    // Set up canvas and start loop
    handleResize()
    window.addEventListener("resize", handleResize)
    
    // Listen to mouse events on parent container to be more responsive
    const parent = canvas.parentElement
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove)
      parent.addEventListener("mouseleave", handleMouseLeave)
    }

    // Intersection observer to only run animation when visible in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
        } else {
          cancelAnimationFrame(animationFrameId)
        }
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove)
        parent.removeEventListener("mouseleave", handleMouseLeave)
      }
      observer.disconnect()
      cancelAnimationFrame(animationFrameId)
    }
  }, [shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2
      }}
    />
  )
}
