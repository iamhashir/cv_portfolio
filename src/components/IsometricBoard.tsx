"use client"

import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const GRID_SIZE = 40
const SPACING = 1.2

export default function IsometricBoard() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  // Create an invisible plane to raycast against for mouse tracking
  const planeRef = useRef<THREE.Mesh>(null)
  
  const { camera, raycaster } = useThree()
  const mouse = useRef(new THREE.Vector2(-10, -10)) // start off-screen
  
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to +1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // We'll store the base Y position to animate a wave effect
  const basePositions = useMemo(() => {
    const pos = new Float32Array(GRID_SIZE * GRID_SIZE)
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        // Some nodes are naturally higher/lower like a city/motherboard
        pos[i * GRID_SIZE + j] = Math.random() > 0.8 ? Math.random() * 0.5 : 0
      }
    }
    return pos
  }, [])

  // Initialize the instanced mesh
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  
  const targetPoint = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state) => {
    if (!meshRef.current || !planeRef.current) return

    // Raycast to find mouse position on the invisible plane
    raycaster.setFromCamera(mouse.current, camera)
    const intersects = raycaster.intersectObject(planeRef.current)
    if (intersects.length > 0) {
      // smooth interpolation towards mouse
      targetPoint.current.lerp(intersects[0].point, 0.1)
    }

    let i = 0
    const time = state.clock.elapsedTime

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const posX = (x - GRID_SIZE / 2) * SPACING
        const posZ = (z - GRID_SIZE / 2) * SPACING
        
        // Calculate distance from mouse
        const distToMouse = Math.sqrt(
          Math.pow(posX - targetPoint.current.x, 2) + 
          Math.pow(posZ - targetPoint.current.z, 2)
        )

        // The wave effect from mouse proximity
        const wave = Math.max(0, 3 - distToMouse) * 0.5
        
        // Base elevation + slow ambient wave + mouse wave
        const ambientWave = Math.sin(posX * 0.5 + time) * Math.cos(posZ * 0.5 + time) * 0.2
        const posY = basePositions[i] + ambientWave + wave

        dummy.position.set(posX, posY, posZ)
        
        // If close to mouse, make it scale up slightly
        const scale = 1 + wave * 0.5
        dummy.scale.set(scale, scale, scale)
        dummy.updateMatrix()
        
        meshRef.current.setMatrixAt(i, dummy.matrix)

        // Color interpolation based on mouse proximity
        if (distToMouse < 4) {
          color.set('#c9a96e') // Highlight color (amber/gold)
        } else {
          color.set('#2a2825') // Base dark color
        }
        meshRef.current.setColorAt(i, color)

        i++
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Invisible plane for raycasting mouse coordinates accurately */}
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>

      {/* The instanced nodes */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, GRID_SIZE * GRID_SIZE]}
      >
        {/* Flat, chip-like geometry for motherboard aesthetic */}
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        {/* We use MeshStandardMaterial so it reacts to ambient/point lights */}
        <meshStandardMaterial 
          toneMapped={false} 
          roughness={0.2}
          metalness={0.8}
        />
      </instancedMesh>
    </group>
  )
}
