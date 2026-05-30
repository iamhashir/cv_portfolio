"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

interface ExplodedProjectViewProps {
  projectId: string
  className?: string
}

export default function ExplodedProjectView({ projectId, className = "" }: ExplodedProjectViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // We want the explosion to happen as it hits the center of the screen
  // 0 to 0.4: resting state
  // 0.4 to 0.6: explodes
  // 0.6 to 1: remains exploded or collapses slightly
  
  const layer1Y = useTransform(scrollYProgress, [0.3, 0.6], [0, -80])
  const layer2Y = useTransform(scrollYProgress, [0.3, 0.6], [0, -40])
  const layer3Y = useTransform(scrollYProgress, [0.3, 0.6], [0, 0])
  
  const layer1Opacity = useTransform(scrollYProgress, [0.2, 0.4], [0.6, 1])
  const layer2Opacity = useTransform(scrollYProgress, [0.2, 0.4], [0.8, 1])

  if (shouldReduceMotion) {
    return (
      <div className={className} style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "80%", aspectRatio: "1/1", border: "1px solid var(--border-muted)", borderRadius: "8px", background: "var(--bg-secondary)" }} />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ 
        position: "relative", 
        width: "100%", 
        height: "100%", 
        minHeight: "400px",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        perspective: "1000px"
      }}
    >
      <div style={{ 
        position: "relative", 
        width: "280px", 
        height: "280px",
        transformStyle: "preserve-3d",
        transform: "rotateX(60deg) rotateZ(-45deg)"
      }}>
        
        {/* Layer 3: Database / Infrastructure */}
        <motion.div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            y: layer3Y,
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-muted)",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}
        >
          {/* Mock DB Schema visual */}
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
             <div style={{ height: "4px", width: "40%", background: "var(--text-muted)" }} />
             <div style={{ height: "4px", width: "70%", background: "var(--border-focus)" }} />
             <div style={{ height: "4px", width: "50%", background: "var(--border-focus)" }} />
          </div>
        </motion.div>

        {/* Layer 2: API / Logic */}
        <motion.div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            y: layer2Y,
            opacity: layer2Opacity,
            background: "rgba(39, 36, 32, 0.8)",
            backdropFilter: "blur(4px)",
            border: "1px solid var(--border-focus)",
            borderRadius: "12px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
          }}
        >
          {/* Mock Logic visual */}
          <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
             <div style={{ height: "20px", background: "var(--border-muted)", borderRadius: "4px" }} />
             <div style={{ height: "20px", background: "var(--border-muted)", borderRadius: "4px" }} />
             <div style={{ height: "20px", background: "var(--border-muted)", borderRadius: "4px" }} />
             <div style={{ height: "20px", background: "var(--accent-glow)", border: "1px solid var(--accent-muted)", borderRadius: "4px" }} />
          </div>
        </motion.div>

        {/* Layer 1: UI / Client */}
        <motion.div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            y: layer1Y,
            opacity: layer1Opacity,
            background: "rgba(20, 19, 16, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--text-muted)",
            borderRadius: "12px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.6)"
          }}
        >
           {/* Mock UI visual */}
           <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ height: "12px", width: "12px", borderRadius: "50%", background: "var(--text-primary)" }} />
                <div style={{ height: "4px", width: "30%", background: "var(--text-muted)" }} />
             </div>
             <div style={{ flex: 1, border: "1px dashed var(--border-focus)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ height: "30%", width: "50%", background: "var(--bg-tertiary)", borderRadius: "4px" }} />
             </div>
           </div>
        </motion.div>

      </div>
    </div>
  )
}
