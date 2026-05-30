"use client"

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'

const GRID_SIZE = 40
const SPACING = 1.2

const seededHeight = (x: number, z: number) => {
  const value = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453
  const normalized = value - Math.floor(value)
  return normalized > 0.8 ? normalized * 0.5 : 0
}

export default function IsometricBoard() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  const isAuditMode = useAppStore((state) => state.isAuditMode)
  const shouldReduceMotion = useReducedMotion()
  
  // We'll store the base Y position to animate a wave effect
  const basePositions = useMemo(() => {
    const pos = new Float32Array(GRID_SIZE * GRID_SIZE)
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        // Deterministic variation keeps the board stable across renders.
        pos[i * GRID_SIZE + j] = seededHeight(i, j)
      }
    }
    return pos
  }, [])

  // Initialize the instanced mesh
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const activeColor = useMemo(() => new THREE.Color(), [])
  
  useFrame((state) => {
    if (!meshRef.current) return

    // Get the global state without triggering a re-render every frame
    const activeProject = useAppStore.getState().activeProject
    const isAuditMode = useAppStore.getState().isAuditMode

    let i = 0
    const time = state.clock.elapsedTime

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const posX = (x - GRID_SIZE / 2) * SPACING
        const posZ = (z - GRID_SIZE / 2) * SPACING

        let projectWave = 0
        let highlight = false
        let projectScale = 1
        let highlightColor = '#c9a96e'

        // Narrative Project Reactions
        if (activeProject === 'opsflow') {
          // A central operational lane with signals branching into side workflows.
          const isCoreLane = Math.abs(posX) < 1.8
          const isBranch = Math.abs(posZ % 7) < 0.8 && Math.abs(posX) < 8
          if (isCoreLane || isBranch) {
            projectWave += shouldReduceMotion ? 0.22 : Math.sin(posZ * 0.8 - time * 2.6) * 0.45 + 0.22
            projectScale = isCoreLane ? 1.32 : 1.12
            highlight = true
          }
        } else if (activeProject === 'mina-games') {
          // An arena ring with pulsing match sessions around the perimeter.
          const distToCenter = Math.sqrt(posX * posX + posZ * posZ)
          const isArenaRing = Math.abs(distToCenter - 6.5) < 1.1
          const isSessionNode = Math.sin(posX * 1.45) * Math.cos(posZ * 1.45) > 0.72
          if (isArenaRing || isSessionNode) {
            projectWave += shouldReduceMotion ? 0.32 : Math.sin(distToCenter * 2.4 - time * 3.2) * 0.38 + 0.32
            projectScale = isArenaRing ? 1.3 : 1.18
            highlightColor = '#6ee7b7'
            highlight = true
          }
        } else if (activeProject === 'reactor') {
          // A diagonal compilation path moving through framework stages.
          const distanceToCompilePath = Math.abs(posZ - posX * 0.48)
          const isCompilePath = distanceToCompilePath < 1.35
          const isStageNode = isCompilePath && Math.abs(posX % 5) < 1
          if (isCompilePath) {
            projectWave += shouldReduceMotion ? 0.24 : Math.sin(posX * 1.2 - time * 3) * 0.42 + 0.24
            projectScale = isStageNode ? 1.45 : 1.16
            highlightColor = '#d4b896'
            highlight = true
          }
        }

        const posY = basePositions[i] + projectWave

        dummy.position.set(posX, posY, posZ)
        
        // Scale logic
        const scale = projectScale
        dummy.scale.set(scale, scale, scale)
        dummy.updateMatrix()
        
        meshRef.current.setMatrixAt(i, dummy.matrix)

        // Color interpolation
        if (isAuditMode) {
          // Pure wireframe color
          color.set('#ffffff')
        } else if (highlight) {
          // Lerp towards active system color
          activeColor.set(highlightColor).lerp(color.set('#ffffff'), shouldReduceMotion ? 0 : (Math.sin(time * 5) + 1) * 0.1)
          color.set(activeColor)
        } else {
          // Muted base color
          color.set('#1a1917')
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
          roughness={0.8}
          metalness={0.2}
          wireframe={isAuditMode}
        />
      </instancedMesh>
    </group>
  )
}
