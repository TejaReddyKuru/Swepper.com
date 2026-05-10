import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';

const Bubble = ({ position, scale, speed, floatIntensity }) => {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(t * speed) * 0.002;
      meshRef.current.rotation.x = t * 0.1 * speed;
      meshRef.current.rotation.y = t * 0.1 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={floatIntensity}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          transmission={0.8}
          opacity={1}
          metalness={0.1}
          roughness={0.1}
          ior={1.3}
          thickness={0.5}
          color="#bae6fd"
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
};

const MainScene = () => {
  const bubbles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 20; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10 - 5 // Spread across the background
        ],
        scale: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 2 + 0.5,
        floatIntensity: Math.random() * 2 + 1
      });
    }
    return temp;
  }, []);

  return (
    <>
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={1} color="#e0f2fe" />
      
      {/* Render Only Bubbles in Background */}
      {bubbles.map((b, i) => (
        <Bubble key={i} {...b} />
      ))}

      <Environment preset="city" />
    </>
  );
};

const ThreeCanvas = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 45 }} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <MainScene />
      </Canvas>
    </div>
  );
};

export default ThreeCanvas;
