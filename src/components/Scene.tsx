"use client"

import React, { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import DataGrid from './DataGrid'

function CameraController() {
  const { camera } = useThree()
  
  useFrame(() => {
    // Smoothly interpolate camera position based on scroll
    const scrollY = window.scrollY
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const scrollProgress = scrollY / Math.max(1, maxScroll)

    // Move camera down and forward as user scrolls
    const targetZ = 5 - scrollProgress * 15
    const targetY = scrollProgress * 5

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
  })

  return null
}

export default function Scene() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#0e0d0b"]} />
        <ambientLight intensity={0.5} />
        <CameraController />
        <DataGrid />
        <fog attach="fog" args={["#0e0d0b", 5, 20]} />
      </Canvas>
    </div>
  )
}
