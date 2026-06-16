"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Outlines, Environment } from "@react-three/drei"
import * as THREE from "three"

const INDIGO       = "#4F46E5"
const INDIGO_LIGHT = "#818CF8"
const CHARCOAL     = "#18181B"

// Each shape has a spread position (hero, floating apart) and a
// formation position (assembly target, tight cluster).
const SHAPES = [
  {
    geom: "torus",
    color: INDIGO,
    spread: [ 0.0,  0.6,  0.0] as [number,number,number],
    form:   [ 0.0,  0.2,  0.0] as [number,number,number],
    floatSpeed: 1.4, rot: 0.8,
  },
  {
    geom: "sphere",
    color: INDIGO_LIGHT,
    spread: [-0.8, -0.8,  0.2] as [number,number,number],
    form:   [-0.4, -0.3,  0.1] as [number,number,number],
    floatSpeed: 1.1, rot: 0.5,
  },
  {
    geom: "ico",
    color: INDIGO,
    spread: [ 0.9, -1.2, -0.3] as [number,number,number],
    form:   [ 0.4, -0.4, -0.1] as [number,number,number],
    floatSpeed: 0.9, rot: 0.6,
  },
  {
    geom: "torusKnot",
    color: CHARCOAL,
    spread: [-0.3,  1.5, -0.2] as [number,number,number],
    form:   [-0.2,  0.5, -0.1] as [number,number,number],
    floatSpeed: 1.6, rot: 0.4,
  },
  {
    geom: "box",
    color: INDIGO_LIGHT,
    spread: [ 1.2,  1.0,  0.1] as [number,number,number],
    form:   [ 0.5,  0.3,  0.05] as [number,number,number],
    floatSpeed: 1.2, rot: 0.7,
  },
]

function ShapeGeom({ geom }: { geom: string }) {
  switch (geom) {
    case "torus":     return <torusGeometry     args={[0.9,  0.32, 12, 40]} />
    case "sphere":    return <sphereGeometry     args={[0.6,  20,   20]}     />
    case "ico":       return <icosahedronGeometry args={[0.55, 0]}            />
    case "torusKnot": return <torusKnotGeometry  args={[0.45, 0.15, 80, 10]} />
    case "box":       return <boxGeometry        args={[0.75, 0.75, 0.75]}   />
    default: return null
  }
}

// ease-in-out quadratic
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function AssemblyScene({
  scrollRef,
  isMobile,
}: {
  scrollRef: React.RefObject<number>
  isMobile: boolean
}) {
  const groupRef  = useRef<THREE.Group>(null)
  const slotRefs  = useRef<(THREE.Group | null)[]>(SHAPES.map(() => null))

  const baseX     = isMobile ? 1   : 4
  const baseY     = isMobile ? -2  : 0
  const baseScale = isMobile ? 0.5 : 1

  useFrame(({ clock }) => {
    const scroll = scrollRef.current ?? 0
    const t      = clock.elapsedTime

    // 0 → shapes spread/wobbling; 1 → tight formation (reached at scroll=0.3)
    const raw      = THREE.MathUtils.clamp(scroll / 0.3, 0, 1)
    const assembly = easeInOut(raw)

    // Once assembled, the whole group slowly rotates as a unit
    const rotProgress = THREE.MathUtils.clamp((scroll - 0.3) / 0.7, 0, 1)
    if (groupRef.current) {
      groupRef.current.rotation.y = rotProgress * t * 0.25
    }

    // Per-shape: lerp between spread ↔ formation + fade out wobble as assembled
    SHAPES.forEach((shape, i) => {
      const slot = slotRefs.current[i]
      if (!slot) return

      const wobbleAmt = (1 - assembly) * 0.09
      const wx = Math.sin(t * 0.6 + i * 1.2) * wobbleAmt
      const wy = Math.sin(t * 0.4 + i * 0.9) * wobbleAmt

      slot.position.x = THREE.MathUtils.lerp(shape.spread[0], shape.form[0], assembly) + wx
      slot.position.y = THREE.MathUtils.lerp(shape.spread[1], shape.form[1], assembly) + wy
      slot.position.z = THREE.MathUtils.lerp(shape.spread[2], shape.form[2], assembly)
    })
  })

  return (
    <group ref={groupRef} position={[baseX, baseY, 0]} scale={baseScale}>
      {SHAPES.map((shape, i) => (
        <group
          key={i}
          ref={(el) => { slotRefs.current[i] = el }}
          position={shape.spread}
        >
          {/* Float handles micro organic motion; slot group handles assembly lerp */}
          <Float
            speed={shape.floatSpeed}
            rotationIntensity={shape.rot}
            floatIntensity={0.3}
            floatingRange={[-0.08, 0.08]}
          >
            <mesh>
              <ShapeGeom geom={shape.geom} />
              <meshStandardMaterial color={shape.color} roughness={0.2} metalness={0.15} />
              <Outlines thickness={0.05} color={CHARCOAL} opacity={0.8} transparent />
            </mesh>
          </Float>
        </group>
      ))}
    </group>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  )
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

export default function ArtisticCanvas() {
  const isMobile  = useIsMobile()
  // scrollRef: updated on scroll, read inside useFrame — no re-renders
  const scrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 52 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} />
      <directionalLight position={[-4, -2, -4]} intensity={0.45} color={INDIGO_LIGHT} />
      <Suspense fallback={null}>
        <AssemblyScene scrollRef={scrollRef} isMobile={isMobile} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
