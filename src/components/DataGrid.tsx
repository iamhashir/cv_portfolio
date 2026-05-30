"use client"

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface Node {
  position: [number, number, number]
  connections: number[]
}

// Generate a structured grid of nodes
function generateGrid(width: number, height: number, spacing: number): Node[] {
  const nodes: Node[] = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Add some noise to the grid for a more organic data-structure feel
      const xPos = (x - width / 2) * spacing + (Math.random() - 0.5) * spacing * 0.5
      const yPos = (y - height / 2) * spacing + (Math.random() - 0.5) * spacing * 0.5
      const zPos = (Math.random() - 0.5) * spacing * 2

      nodes.push({
        position: [xPos, yPos, zPos],
        connections: []
      })
    }
  }

  // Connect adjacent nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].position[0] - nodes[j].position[0]
      const dy = nodes[i].position[1] - nodes[j].position[1]
      const dz = nodes[i].position[2] - nodes[j].position[2]
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)

      // Connect if close enough
      if (dist < spacing * 1.5) {
        // limit connections to prevent visual clutter
        if (nodes[i].connections.length < 3 && nodes[j].connections.length < 3) {
           nodes[i].connections.push(j)
        }
      }
    }
  }
  return nodes
}

export default function DataGrid() {
  const groupRef = useRef<THREE.Group>(null)
  
  // Create static grid once
  const nodes = React.useMemo(() => generateGrid(6, 6, 4), [])

  // Animate the entire structure slowly
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5
    }
  })

  return (
    <group ref={groupRef} rotation={[0.4, -0.2, 0]}>
      {/* Render Nodes */}
      {nodes.map((node, i) => (
        <Sphere key={`node-${i}`} position={node.position} args={[0.08, 16, 16]}>
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.8} />
        </Sphere>
      ))}

      {/* Render Connections */}
      {nodes.map((node, i) => 
        node.connections.map((connIdx, j) => {
          const target = nodes[connIdx]
          return (
            <Line
              key={`line-${i}-${j}`}
              points={[node.position, target.position]}
              color="#544c41"
              lineWidth={1}
              transparent
              opacity={0.3}
            />
          )
        })
      )}
    </group>
  )
}
