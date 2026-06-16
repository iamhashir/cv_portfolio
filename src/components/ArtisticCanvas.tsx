"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Float, Outlines, Environment } from "@react-three/drei"

const INDIGO       = "#4F46E5"
const INDIGO_LIGHT = "#818CF8"
const CHARCOAL     = "#18181B"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

// Desktop: group sits on the right (x=4), text zone left is clear.
// Mobile:  scale 50%, shift down-right so it frames the bottom of the screen.
function ShapeGroup({ isMobile }: { isMobile: boolean }) {
  const px = isMobile ? 1   : 4
  const py = isMobile ? -2  : 0
  const sc = isMobile ? 0.5 : 1

  return (
    <group position={[px, py, 0]} scale={sc}>
      <Float speed={1.4} rotationIntensity={0.8} floatIntensity={0.5} floatingRange={[-0.15, 0.15]}>
        <mesh position={[0, 0.6, 0]}>
          <torusGeometry args={[0.9, 0.32, 12, 40]} />
          <meshStandardMaterial color={INDIGO} roughness={0.2} metalness={0.15} />
          <Outlines thickness={0.05} color={CHARCOAL} opacity={0.8} transparent />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.5} floatingRange={[-0.15, 0.15]}>
        <mesh position={[-0.8, -0.8, 0.2]}>
          <sphereGeometry args={[0.6, 20, 20]} />
          <meshStandardMaterial color={INDIGO_LIGHT} roughness={0.25} metalness={0.1} />
          <Outlines thickness={0.05} color={CHARCOAL} opacity={0.8} transparent />
        </mesh>
      </Float>

      <Float speed={0.9} rotationIntensity={0.6} floatIntensity={0.4} floatingRange={[-0.12, 0.12]}>
        <mesh position={[0.9, -1.2, -0.3]}>
          <icosahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color={INDIGO} roughness={0.18} metalness={0.2} />
          <Outlines thickness={0.05} color={CHARCOAL} opacity={0.8} transparent />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.55} floatingRange={[-0.18, 0.18]}>
        <mesh position={[-0.3, 1.5, -0.2]}>
          <torusKnotGeometry args={[0.45, 0.15, 80, 10]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.22} metalness={0.12} />
          <Outlines thickness={0.05} color={INDIGO} opacity={0.5} transparent />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.7} floatIntensity={0.45} floatingRange={[-0.14, 0.14]}>
        <mesh position={[1.2, 1.0, 0.1]}>
          <boxGeometry args={[0.75, 0.75, 0.75]} />
          <meshStandardMaterial color={INDIGO_LIGHT} roughness={0.3} metalness={0.08} />
          <Outlines thickness={0.05} color={CHARCOAL} opacity={0.8} transparent />
        </mesh>
      </Float>
    </group>
  )
}

export default function ArtisticCanvas() {
  const isMobile = useIsMobile()

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
        <ShapeGroup isMobile={isMobile} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
