"use client"

import React, { useRef } from "react"
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion"

interface ExplodedProjectViewProps {
  projectId: string
  className?: string
}

type ProjectVariant = "reactor" | "mina-games" | "opsflow"

type VisualLayer = {
  label: string
  title: string
  items: string[]
}

type ProjectVisual = {
  variant: ProjectVariant
  accent: string
  glow: string
  layers: [VisualLayer, VisualLayer, VisualLayer]
}

const projectVisuals: Record<ProjectVariant, ProjectVisual> = {
  reactor: {
    variant: "reactor",
    accent: "#d4b896",
    glow: "rgba(212, 184, 150, 0.18)",
    layers: [
      { label: "03 / OUTPUT", title: "DOM Renderer", items: ["view updates", "render nodes"] },
      { label: "02 / RUNTIME", title: "Hooks Engine", items: ["state", "lifecycle"] },
      { label: "01 / INPUT", title: "JSX + Router", items: ["components", "routes"] },
    ],
  },
  "mina-games": {
    variant: "mina-games",
    accent: "#6ee7b7",
    glow: "rgba(110, 231, 183, 0.16)",
    layers: [
      { label: "03 / CLIENT", title: "Game Arena", items: ["players", "match UI"] },
      { label: "02 / REALTIME", title: "WebSocket Hub", items: ["events", "sessions"] },
      { label: "01 / SERVICES", title: "Fastify + Prisma", items: ["tournaments", "profiles"] },
    ],
  },
  opsflow: {
    variant: "opsflow",
    accent: "#c9a96e",
    glow: "rgba(201, 169, 110, 0.18)",
    layers: [
      { label: "03 / OPERATIONS", title: "Workflow Console", items: ["orders", "balances"] },
      { label: "02 / LOGIC", title: "CRM Automation", items: ["purchases", "reports"] },
      { label: "01 / RECORDS", title: "Firebase + WhatsApp", items: ["shared data", "alerts"] },
    ],
  },
}

const getVisual = (projectId: string): ProjectVisual => {
  return projectVisuals[projectId as ProjectVariant] ?? projectVisuals.opsflow
}

export default function ExplodedProjectView({ projectId, className = "" }: ExplodedProjectViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const visual = getVisual(projectId)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const topY = useTransform(scrollYProgress, [0.3, 0.6], [0, -92])
  const middleY = useTransform(scrollYProgress, [0.3, 0.6], [0, -46])
  const topOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0.65, 1])
  const middleOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0.8, 1])

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
        perspective: "1000px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "290px",
          height: "290px",
          transformStyle: "preserve-3d",
          transform: "rotateX(60deg) rotateZ(-45deg)",
        }}
      >
        {visual.layers.map((layer, index) => (
          <ArchitectureLayer
            key={layer.label}
            layer={layer}
            layerIndex={index}
            visual={visual}
            y={shouldReduceMotion ? index * 46 - 92 : index === 0 ? topY : index === 1 ? middleY : undefined}
            opacity={shouldReduceMotion ? undefined : index === 0 ? topOpacity : index === 1 ? middleOpacity : undefined}
          />
        ))}
      </div>
    </div>
  )
}

function ArchitectureLayer({
  layer,
  layerIndex,
  visual,
  y,
  opacity,
}: {
  layer: VisualLayer
  layerIndex: number
  visual: ProjectVisual
  y?: MotionValue<number> | number
  opacity?: MotionValue<number>
}) {
  const elevation = 30 - layerIndex * 10

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        y,
        opacity,
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "18px",
        overflow: "hidden",
        background: layerIndex === 0 ? "rgba(20, 19, 16, 0.94)" : "rgba(29, 27, 23, 0.88)",
        border: `1px solid ${layerIndex === 0 ? visual.accent : "var(--border-focus)"}`,
        borderRadius: "12px",
        boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0, 0, 0, 0.5), 0 0 24px ${visual.glow}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <span style={{ color: visual.accent, fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em" }}>
          {layer.label}
        </span>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: visual.accent, boxShadow: `0 0 12px ${visual.accent}` }} />
      </div>

      <strong style={{ color: "var(--text-primary)", fontSize: "17px", fontWeight: 600 }}>{layer.title}</strong>

      <LayerDiagram variant={visual.variant} layerIndex={layerIndex} accent={visual.accent} />

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "auto" }}>
        {layer.items.map((item) => (
          <span
            key={item}
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              padding: "4px 7px",
              border: "1px solid var(--border-muted)",
              borderRadius: "4px",
              background: "rgba(0, 0, 0, 0.16)",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function LayerDiagram({ variant, layerIndex, accent }: { variant: ProjectVariant; layerIndex: number; accent: string }) {
  if (variant === "mina-games") {
    return (
      <div style={{ position: "relative", flex: 1, minHeight: "110px", border: "1px dashed var(--border-focus)", borderRadius: "50%" }}>
        {[0, 1, 2, 3].map((node) => (
          <span
            key={node}
            style={{
              position: "absolute",
              width: node === layerIndex ? "16px" : "11px",
              height: node === layerIndex ? "16px" : "11px",
              borderRadius: "50%",
              background: node === layerIndex ? accent : "var(--border-focus)",
              left: `${16 + (node % 2) * 62}%`,
              top: `${14 + Math.floor(node / 2) * 62}%`,
              boxShadow: node === layerIndex ? `0 0 18px ${accent}` : "none",
            }}
          />
        ))}
        <span style={{ position: "absolute", width: "42px", height: "42px", borderRadius: "50%", border: `1px solid ${accent}`, left: "calc(50% - 21px)", top: "calc(50% - 21px)" }} />
      </div>
    )
  }

  if (variant === "reactor") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
        {[0, 1, 2, 3].map((node) => (
          <React.Fragment key={node}>
            <span style={{ width: "28px", height: `${36 + node * 9}px`, border: `1px solid ${node === layerIndex ? accent : "var(--border-focus)"}`, background: node === layerIndex ? "var(--accent-glow)" : "rgba(0, 0, 0, 0.14)", borderRadius: "5px" }} />
            {node < 3 && <span style={{ flex: 1, height: "1px", background: accent, opacity: 0.7 }} />}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", flex: 1 }}>
      {[0, 1, 2, 3, 4, 5].map((node) => (
        <span
          key={node}
          style={{
            minHeight: "34px",
            border: `1px solid ${node === layerIndex || node === layerIndex + 3 ? accent : "var(--border-focus)"}`,
            borderRadius: "5px",
            background: node === layerIndex || node === layerIndex + 3 ? "var(--accent-glow)" : "rgba(0, 0, 0, 0.14)",
          }}
        />
      ))}
    </div>
  )
}
