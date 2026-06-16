"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Outlines, Environment } from "@react-three/drei"
import * as THREE from "three"

const INDIGO       = "#4F46E5"
const INDIGO_LIGHT = "#818CF8"
const CHARCOAL     = "#18181B"

function ShapeGeom({ geom }: { geom: string }) {
  switch (geom) {
    case "torusKnot": return <torusKnotGeometry args={[0.65, 0.2, 72, 10]} />
    case "ico":       return <icosahedronGeometry args={[0.85, 0]} />
    case "box":       return <boxGeometry args={[1.15, 1.15, 1.15]} />
    case "capsule":   return <capsuleGeometry args={[0.38, 0.65, 6, 12]} />
    case "sphere":    return <sphereGeometry args={[0.75, 18, 18]} />
    case "torus":     return <torusGeometry args={[0.65, 0.26, 10, 30]} />
    default: return null
  }
}

// All shapes have x > 1.8 — left side (text zone, x < 0) is completely clear.
// Camera z=9, fov=52 → half-width at z=0 ≈ 7.8 world-units.
// x=1.8 ≈ 62% from the left edge of the viewport.
const SHAPES = [
  { geom: "torusKnot", color: INDIGO,       pos: [2.5,  0.8,  0.2] as const, scale: 0.55, speed: 1.4, rot: 0.8 },
  { geom: "ico",       color: INDIGO_LIGHT, pos: [4.2, -0.6, -0.3] as const, scale: 0.50, speed: 1.1, rot: 0.5 },
  { geom: "box",       color: CHARCOAL,     pos: [1.8, -2.0,  0.3] as const, scale: 0.45, speed: 0.9, rot: 0.6 },
  { geom: "torus",     color: INDIGO,       pos: [5.0,  0.4, -0.5] as const, scale: 0.48, speed: 1.6, rot: 0.4 },
  { geom: "sphere",    color: INDIGO_LIGHT, pos: [3.5, -2.8,  0.1] as const, scale: 0.42, speed: 1.2, rot: 0.7 },
  { geom: "capsule",   color: CHARCOAL,     pos: [4.8,  2.5, -0.6] as const, scale: 0.40, speed: 0.8, rot: 0.5 },
  { geom: "ico",       color: INDIGO,       pos: [2.0,  2.2, -0.2] as const, scale: 0.35, speed: 1.3, rot: 0.6 },
]

// Shapes float gently on the right side and drift up slightly with scroll.
function RightSideShapes() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0
    // Move group up as user scrolls (parallax drift)
    groupRef.current.position.y = -scrollY * 0.0015
  })

  return (
    <group ref={groupRef}>
      {SHAPES.map((s, i) => (
        <Float
          key={i}
          speed={s.speed}
          rotationIntensity={s.rot}
          floatIntensity={0.55}
          floatingRange={[-0.18, 0.18]}
        >
          <mesh position={s.pos} scale={s.scale}>
            <ShapeGeom geom={s.geom} />
            <meshStandardMaterial color={s.color} roughness={0.22} metalness={0.12} />
            <Outlines thickness={0.045} color={CHARCOAL} opacity={0.8} transparent />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// Next.js "N" logo — squishy capsule geometry, right-side position.
function NextJsNLogo() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0

    const sq = Math.sin(t * 1.6) * 0.06
    groupRef.current.scale.set(
      1.1 * (1 - sq * 0.4),
      1.1 * (1 + sq),
      1.1 * (1 - sq * 0.25),
    )
    groupRef.current.position.y = -3.0 + Math.sin(t * 0.4) * 0.1 - scrollY * 0.001
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.35
    groupRef.current.rotation.x = Math.sin(t * 0.22) * 0.08
  })

  return (
    <group ref={groupRef} position={[3.8, -3.0, 0]}>
      <mesh position={[-0.46, 0, 0]}>
        <capsuleGeometry args={[0.12, 1.45, 10, 20]} />
        <meshPhysicalMaterial color="#0B0B0C" roughness={0.68} metalness={0} clearcoat={0.45} clearcoatRoughness={0.5} />
      </mesh>
      <mesh position={[0.46, 0, 0]}>
        <capsuleGeometry args={[0.12, 1.45, 10, 20]} />
        <meshPhysicalMaterial color="#0B0B0C" roughness={0.68} metalness={0} clearcoat={0.45} clearcoatRoughness={0.5} />
      </mesh>
      <mesh rotation={[0, 0, 0.436]}>
        <capsuleGeometry args={[0.12, 1.72, 10, 20]} />
        <meshPhysicalMaterial color="#0B0B0C" roughness={0.68} metalness={0} clearcoat={0.45} clearcoatRoughness={0.5} />
      </mesh>
    </group>
  )
}

export default function ArtisticCanvas() {
  // Skip on mobile — protects frame rate and the layout is single-column there
  if (typeof window !== "undefined" && window.innerWidth <= 768) return null

  return (
    // This component is rendered OUTSIDE .page in the DOM so the canvas
    // participates in the ROOT stacking context (not .page's).
    // z-index: 0 → painted at root step 6, above body background (step 3).
    // .page has z-index: 1 (root step 7), so all HTML is always on top.
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 52 }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#F4F0EA"]} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} />
      <directionalLight position={[-4, -2, -4]} intensity={0.45} color={INDIGO_LIGHT} />
      <Suspense fallback={null}>
        <RightSideShapes />
        <NextJsNLogo />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
