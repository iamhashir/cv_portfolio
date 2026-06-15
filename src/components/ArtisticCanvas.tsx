"use client"

import { Suspense, useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Outlines, Environment } from "@react-three/drei"
import * as THREE from "three"

const INDIGO = "#4F46E5"
const INDIGO_LIGHT = "#818CF8"
const CREAM = "#F4F0EA"
const CHARCOAL = "#18181B"

const COLORS = [INDIGO, INDIGO_LIGHT, CHARCOAL, INDIGO, INDIGO_LIGHT, CREAM]
type GeomKey = "torusKnot" | "ico" | "box" | "capsule" | "sphere" | "torus"
const GEOMS: GeomKey[] = ["torusKnot", "ico", "box", "capsule", "sphere", "torus"]

const COLS = 5
const ROWS = 4
const N = COLS * ROWS  // 20 shapes

interface ShapeData {
  geom: GeomKey
  color: string
  scale: number
  sPos: [number, number, number]
  sRot: [number, number, number]
  gPos: [number, number, number]
}

function buildShapes(): ShapeData[] {
  return Array.from({ length: N }, (_, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)

    const gx = (col - (COLS - 1) / 2) * 1.35
    const gy = (row - (ROWS - 1) / 2) * 1.35

    const a = (i / N) * Math.PI * 2 + i * 0.91
    const r = 5 + Math.abs(Math.sin(i * 1.3)) * 4
    const sx = Math.cos(a) * r + Math.sin(i * 2.1) * 1.5
    const sy = Math.sin(a) * r + Math.cos(i * 1.7) * 1.5
    const sz = Math.sin(i * 0.9) * 4 - 4

    return {
      geom: GEOMS[i % GEOMS.length],
      color: COLORS[i % COLORS.length],
      scale: 0.28 + Math.abs(Math.sin(i * 2.3)) * 0.22,
      sPos: [sx, sy, sz],
      sRot: [
        Math.sin(i * 1.1) * Math.PI,
        Math.cos(i * 0.7) * Math.PI,
        Math.sin(i * 1.9) * Math.PI,
      ],
      gPos: [gx, gy, 0],
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

      const float = (1 - eased) * 0.1

      mesh.position.x =
        THREE.MathUtils.lerp(shape.sPos[0], shape.gPos[0], eased) +
        Math.cos(t * 0.7 + i * 0.9) * float
      mesh.position.y =
        THREE.MathUtils.lerp(shape.sPos[1], shape.gPos[1], eased) +
        Math.sin(t * 0.55 + i * 1.1) * float
      mesh.position.z = THREE.MathUtils.lerp(shape.sPos[2], shape.gPos[2], eased)

      mesh.rotation.x =
        THREE.MathUtils.lerp(shape.sRot[0], 0.3, eased) + t * 0.18 * (1 - eased)
      mesh.rotation.y =
        THREE.MathUtils.lerp(shape.sRot[1], 0, eased) + t * 0.13 * (1 - eased)
    })

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
          scale={shape.scale}
        >
          <ShapeGeom geom={shape.geom} />
          <meshStandardMaterial color={shape.color} roughness={0.22} metalness={0.12} />
          <Outlines
            thickness={0.045}
            color={CHARCOAL}
            opacity={shape.color === CREAM ? 0.5 : 0.85}
            transparent
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ArtisticCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 52 }}
      style={{ position: "fixed", inset: 0, zIndex: -1 }}
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
