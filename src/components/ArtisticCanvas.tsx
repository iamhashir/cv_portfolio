"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Outlines, Environment } from "@react-three/drei"
import type { Group } from "three"

// ─── Palette ─────────────────────────────────────────────────────
const INDIGO = "#4F46E5"
const INDIGO_LIGHT = "#818CF8"
const CREAM = "#F4F0EA"
const INK = "#18181B"

// ─── A single squishy, outlined primitive ────────────────────────
type ShapeProps = {
  position: [number, number, number]
  scale?: number
  color?: string
  floatSpeed?: number
  children: React.ReactNode
}

function Squishy({ position, scale = 1, color = INDIGO, floatSpeed = 3, children }: ShapeProps) {
  return (
    <Float speed={floatSpeed} rotationIntensity={2} floatIntensity={2}>
      <mesh position={position} scale={scale} castShadow receiveShadow>
        {children}
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} />
        {/* Black outlines — the bold inked edge seen in the reference */}
        <Outlines thickness={0.05} color={INK} opacity={1} transparent={false} />
      </mesh>
    </Float>
  )
}

// ─── Cluster that tilts toward the cursor ────────────────────────
function ShapeCluster() {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    // Pointer is normalized to -1..1 by R3F. Ease the whole cluster
    // toward it for a subtle, immersive parallax tilt.
    const targetY = state.pointer.x * 0.6
    const targetX = -state.pointer.y * 0.4
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
  })

  return (
    <group ref={group}>
      {/* Hero — artistic torus knot */}
      <Squishy position={[0, 0, 0]} scale={1} color={INDIGO} floatSpeed={2.5}>
        <torusKnotGeometry args={[1, 0.32, 128, 16]} />
      </Squishy>

      {/* Floating accent cube */}
      <Squishy position={[1.9, 1.4, -0.5]} scale={0.5} color={CREAM} floatSpeed={3.5}>
        <boxGeometry args={[1, 1, 1]} />
      </Squishy>

      {/* Floating accent sphere */}
      <Squishy position={[-2, 1.1, 0.3]} scale={0.45} color={INDIGO_LIGHT} floatSpeed={4}>
        <icosahedronGeometry args={[1, 1]} />
      </Squishy>

      {/* Lower capsule */}
      <Squishy position={[-1.7, -1.5, -0.4]} scale={0.4} color={CREAM} floatSpeed={3}>
        <capsuleGeometry args={[0.5, 0.8, 8, 16]} />
      </Squishy>

      {/* Lower small cube */}
      <Squishy position={[1.8, -1.3, 0.2]} scale={0.38} color={INDIGO_LIGHT} floatSpeed={4.5}>
        <boxGeometry args={[1, 1, 1]} />
      </Squishy>
    </group>
  )
}

// ─── Canvas wrapper ──────────────────────────────────────────────
export default function ArtisticCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.6} castShadow />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color={INDIGO_LIGHT} />
      <Suspense fallback={null}>
        <ShapeCluster />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
