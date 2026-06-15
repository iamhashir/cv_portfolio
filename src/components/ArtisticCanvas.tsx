"use client"

import { Suspense, useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Outlines, Environment } from "@react-three/drei"
import * as THREE from "three"

const INDIGO = "#4F46E5"
const INDIGO_LIGHT = "#818CF8"
const WHITE = "#FFFFFF"
const CHARCOAL = "#18181B"

// Six colors cycling. WHITE replaces former CREAM (#F4F0EA) which matched the
// canvas background and made those shapes invisible.
const COLORS = [INDIGO, INDIGO_LIGHT, CHARCOAL, INDIGO, INDIGO_LIGHT, WHITE]

type GeomKey = "torusKnot" | "ico" | "box" | "capsule" | "sphere" | "torus"
const GEOMS: GeomKey[] = ["torusKnot", "ico", "box", "capsule", "sphere", "torus"]

const COLS = 5
const ROWS = 4
const N = COLS * ROWS // 20 shapes

interface ShapeData {
  geom: GeomKey
  color: string
  gScale: number        // assembled (grid) scale
  sScale: number        // scatter scale — 45% larger than assembled
  sPos: [number, number, number]
  sRot: [number, number, number]
  gPos: [number, number, number]
  gRot: [number, number] // per-shape assembled tilt (x, y)
}

function buildShapes(): ShapeData[] {
  return Array.from({ length: N }, (_, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)

    // Grid target: 5 × 4, centered, 1.35-unit spacing
    const gx = (col - (COLS - 1) / 2) * 1.35  // −2.7 … 2.7
    const gy = (row - (ROWS - 1) / 2) * 1.35  // −2.025 … 2.025

    // Scatter: golden-angle spiral keeps all shapes inside the camera frustum.
    // Camera z=9, fov=52 → half-height at z=0 ≈ ±4.4 units.
    // Max scatter radius ≈ 3.6 → comfortably on-screen.
    const a = i * 2.399963           // golden angle ≈ 137.5°
    const r = 0.7 + (i % 5) * 0.58  // 0.70, 1.28, 1.86, 2.44, 3.02
    const sx = Math.cos(a) * r + Math.sin(i * 2.1) * 0.55
    const sy = Math.sin(a) * r * 0.75 + Math.cos(i * 1.9) * 0.40
    const sz = Math.sin(i * 1.3) * 1.8 - 0.6  // −2.4 … +1.2

    const gScale = 0.28 + Math.abs(Math.sin(i * 2.3)) * 0.22

    return {
      geom: GEOMS[i % GEOMS.length],
      color: COLORS[i % COLORS.length],
      gScale,
      sScale: gScale * 1.45,
      sPos: [sx, sy, sz],
      sRot: [
        Math.sin(i * 1.1) * Math.PI * 1.5,
        Math.cos(i * 0.7) * Math.PI * 1.5,
        Math.sin(i * 1.9) * Math.PI,
      ],
      gPos: [gx, gy, 0],
      gRot: [
        0.25 + Math.sin(i * 0.83) * 0.18,  // per-shape assembled tilt X
        Math.cos(i * 0.61) * 0.22,          // per-shape assembled tilt Y
      ],
    }
  })
}

function ShapeGeom({ geom }: { geom: GeomKey }) {
  switch (geom) {
    case "torusKnot": return <torusKnotGeometry args={[0.65, 0.2, 72, 10]} />
    case "ico":       return <icosahedronGeometry args={[0.85, 0]} />
    case "box":       return <boxGeometry args={[1.15, 1.15, 1.15]} />
    case "capsule":   return <capsuleGeometry args={[0.38, 0.65, 6, 12]} />
    case "sphere":    return <sphereGeometry args={[0.75, 18, 18]} />
    case "torus":     return <torusGeometry args={[0.65, 0.26, 10, 30]} />
  }
}

function SystemAssembly() {
  const shapes = useMemo(buildShapes, [])
  const meshRefs = useRef<(THREE.Mesh | null)[]>(Array(N).fill(null))
  const groupRef = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })

  // Track pointer via window so tilt works even when mouse is over HTML content
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useFrame((state) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0
    const raw = Math.min(scrollY / 900, 1)
    const eased = THREE.MathUtils.smoothstep(raw, 0, 1)
    const t = state.clock.elapsedTime

    shapes.forEach((shape, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return

      // Position: visible cluster → clean grid
      const floatAmt = (1 - eased) * 0.08
      mesh.position.x =
        THREE.MathUtils.lerp(shape.sPos[0], shape.gPos[0], eased) +
        Math.cos(t * 0.6 + i * 0.9) * floatAmt
      mesh.position.y =
        THREE.MathUtils.lerp(shape.sPos[1], shape.gPos[1], eased) +
        Math.sin(t * 0.5 + i * 1.1) * floatAmt
      mesh.position.z = THREE.MathUtils.lerp(shape.sPos[2], shape.gPos[2], eased)

      // Scale: bigger in scatter, target size in grid
      mesh.scale.setScalar(THREE.MathUtils.lerp(shape.sScale, shape.gScale, eased))

      // Rotation:
      // • Scatter phase — chaotic spin fades out as assembly completes
      // • Assembled phase — gentle per-shape idle oscillation fades in
      const chaosX = THREE.MathUtils.lerp(shape.sRot[0], shape.gRot[0], eased) + t * 0.22 * (1 - eased)
      const chaosY = THREE.MathUtils.lerp(shape.sRot[1], shape.gRot[1], eased) + t * 0.16 * (1 - eased)
      const chaosZ = THREE.MathUtils.lerp(shape.sRot[2], 0, eased)
      const idleX  = Math.sin(t * 0.35 + i * 0.52) * 0.07 * eased
      const idleY  = Math.cos(t * 0.28 + i * 0.67) * 0.06 * eased

      mesh.rotation.x = chaosX + idleX
      mesh.rotation.y = chaosY + idleY
      mesh.rotation.z = chaosZ
    })

    // Subtle mouse-driven group tilt
    if (groupRef.current) {
      const tx = pointer.current.x * 0.28
      const ty = -pointer.current.y * 0.18
      groupRef.current.rotation.y += (tx - groupRef.current.rotation.y) * 0.04
      groupRef.current.rotation.x += (ty - groupRef.current.rotation.x) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el }}
          position={shape.sPos}
          rotation={shape.sRot}
          scale={shape.sScale}
        >
          <ShapeGeom geom={shape.geom} />
          <meshStandardMaterial color={shape.color} roughness={0.22} metalness={0.12} />
          <Outlines
            thickness={0.045}
            color={CHARCOAL}
            opacity={shape.color === WHITE ? 0.6 : 0.85}
            transparent
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ArtisticCanvas() {
  // Client-only (loaded via ssr:false). Skip on mobile to protect frame rate.
  if (typeof window !== "undefined" && window.innerWidth <= 768) return null

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 52 }}
      // z-index 0 places the canvas above the body's block-level background
      // (which paints at stacking step 3) but below .page (z-index: 1, step 7).
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#F4F0EA"]} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} />
      <directionalLight position={[-4, -2, -4]} intensity={0.45} color={INDIGO_LIGHT} />
      <Suspense fallback={null}>
        <SystemAssembly />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
