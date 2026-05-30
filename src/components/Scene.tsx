"use client"

import React, { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import IsometricBoard from './IsometricBoard'

function CameraController() {
  const { camera } = useThree()
  
  useFrame(() => {
    const scrollY = window.scrollY
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight)
    const p = scrollY / maxScroll // progress 0 to 1

    // Keyframes
    // 0.0 : Hero - Looking slightly down at the board from high up
    // 0.5 : Featured - Panned low, sweeping across the board
    // 1.0 : Footer - Pulling back up

    let targetX = 0
    let targetY = 0
    let targetZ = 0
    let targetRotX = 0

    if (p < 0.3) {
      // Hero (0 to 0.3)
      const localP = p / 0.3
      targetX = THREE.MathUtils.lerp(0, 5, localP)
      targetY = THREE.MathUtils.lerp(15, 8, localP)
      targetZ = THREE.MathUtils.lerp(15, 10, localP)
      targetRotX = THREE.MathUtils.lerp(-Math.PI / 4, -Math.PI / 6, localP)
    } else if (p < 0.7) {
      // Featured Systems (0.3 to 0.7)
      const localP = (p - 0.3) / 0.4
      targetX = THREE.MathUtils.lerp(5, -5, localP)
      targetY = THREE.MathUtils.lerp(8, 4, localP)
      targetZ = THREE.MathUtils.lerp(10, 12, localP)
      targetRotX = THREE.MathUtils.lerp(-Math.PI / 6, -Math.PI / 8, localP)
    } else {
      // Footer (0.7 to 1.0)
      const localP = (p - 0.7) / 0.3
      targetX = THREE.MathUtils.lerp(-5, 0, localP)
      targetY = THREE.MathUtils.lerp(4, 20, localP)
      targetZ = THREE.MathUtils.lerp(12, 5, localP)
      targetRotX = THREE.MathUtils.lerp(-Math.PI / 8, -Math.PI / 2, localP) // Looking straight down
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    
    // Lerp rotation manually or lookAt
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotX, 0.05)
  })

  return null
}

export default function Scene() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 15, 15], rotation: [-Math.PI / 4, 0, 0], fov: 45 }}>
        <color attach="background" args={["#0a0908"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 5]} intensity={1.5} color="#c9a96e" />
        <CameraController />
        <IsometricBoard />
        <fog attach="fog" args={["#0a0908", 15, 40]} />
      </Canvas>
    </div>
  )
}
