'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingGeometries() {
  const meshGroup = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const octaRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshGroup.current) {
      meshGroup.current.rotation.y += delta * 0.12;
      meshGroup.current.rotation.x += delta * 0.05;
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.4;
    }
    if (octaRef.current) {
      octaRef.current.rotation.z += delta * 0.25;
      octaRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.6) * 0.5;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += delta * 0.2;
      torusRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={meshGroup}>
      {/* Central Wireframe Icosahedron */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color="#6366F1" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Floating Soft Sphere */}
      <mesh ref={sphereRef} position={[-3.2, 1.5, -2]}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshStandardMaterial color="#06B6D4" transparent opacity={0.25} roughness={0.3} />
      </mesh>

      {/* Floating Octahedron */}
      <mesh ref={octaRef} position={[3.5, -1.2, -1.5]}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#8B5CF6" transparent opacity={0.2} roughness={0.4} />
      </mesh>

      {/* Floating Torus */}
      <mesh ref={torusRef} position={[-2, -2, -3]}>
        <torusGeometry args={[1.2, 0.25, 16, 50]} />
        <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function Background3D() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ pointerEvents: 'none' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <FloatingGeometries />
      </Canvas>
    </div>
  );
}
