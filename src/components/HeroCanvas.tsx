import { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CRYSTAL_COLOR = '#0A2463';
const HIGHLIGHT_COLOR = '#E5B80B';

function CrystalGeometry({ position, rotation, scale, hovered }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  hovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const baseColor = useMemo(() => new THREE.Color(CRYSTAL_COLOR), []);
  const targetColor = useMemo(() => new THREE.Color(HIGHLIGHT_COLOR), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004;
      meshRef.current.rotation.y += 0.006;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.3;
    }
    if (materialRef.current) {
      materialRef.current.color.lerp(hovered ? targetColor : baseColor, 0.06);
      materialRef.current.emissive = hovered
        ? targetColor.clone().multiplyScalar(0.18)
        : new THREE.Color(0, 0, 0);
    }
  });

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} scale={hovered ? scale * 1.2 : scale} geometry={geometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          color={CRYSTAL_COLOR}
          metalness={0.5}
          roughness={0.35}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          envMapIntensity={1.0}
          transparent
          opacity={0.55}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial
          color={hovered ? HIGHLIGHT_COLOR : '#3B5EB8'}
          transparent
          opacity={hovered ? 0.7 : 0.25}
        />
      </lineSegments>
    </group>
  );
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 60;

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.012;
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.6) * 0.0004;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#1E40AF"
        transparent
        opacity={0.2}
        sizeAttenuation
      />
    </points>
  );
}

function CrystalScene() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 晶体分散铺满整个视口区域，不扎堆
  const crystals = useMemo(() => [
    // 右上区域
    { position: [5, 3, -1] as [number, number, number], rotation: [0.5, 0.8, 0] as [number, number, number], scale: 0.6 },
    { position: [8, 1, -2] as [number, number, number], rotation: [1.2, 0.3, 0.6] as [number, number, number], scale: 0.4 },
    { position: [7, -2, 0] as [number, number, number], rotation: [0.2, 1.5, 0.4] as [number, number, number], scale: 0.5 },
    // 右中
    { position: [9, 4, -3] as [number, number, number], rotation: [0.8, 0.6, 1.1] as [number, number, number], scale: 0.35 },
    { position: [6, -4, -1.5] as [number, number, number], rotation: [0.4, 0.9, 0.3] as [number, number, number], scale: 0.45 },
    // 左中（较小，作为远景装饰）
    { position: [-6, 2, -4] as [number, number, number], rotation: [1.0, 0.5, 0.7] as [number, number, number], scale: 0.3 },
    { position: [-8, -1, -3] as [number, number, number], rotation: [0.6, 1.1, 0.2] as [number, number, number], scale: 0.25 },
    { position: [-5, -3, -2] as [number, number, number], rotation: [0.3, 0.7, 1.0] as [number, number, number], scale: 0.35 },
    // 中上
    { position: [1, 5, -5] as [number, number, number], rotation: [0.9, 0.4, 0.8] as [number, number, number], scale: 0.3 },
    { position: [-3, 4, -4] as [number, number, number], rotation: [0.7, 1.0, 0.5] as [number, number, number], scale: 0.28 },
    // 中下
    { position: [3, -4, -2] as [number, number, number], rotation: [1.1, 0.8, 0.4] as [number, number, number], scale: 0.32 },
    { position: [-2, -5, -3] as [number, number, number], rotation: [0.5, 1.3, 0.6] as [number, number, number], scale: 0.26 },
    // 远处小晶体
    { position: [10, 0, -6] as [number, number, number], rotation: [0.3, 0.5, 0.9] as [number, number, number], scale: 0.2 },
    { position: [-9, 5, -5] as [number, number, number], rotation: [0.8, 0.2, 1.1] as [number, number, number], scale: 0.22 },
  ], []);

  const handlePointerEnter = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-3, -3, 2]} intensity={0.3} color="#1E40AF" />
      <pointLight position={[4, 3, 2]} intensity={0.5} color="#E5B80B" distance={15} />
      {crystals.map((crystal, i) => (
        <group
          key={i}
          onPointerEnter={() => handlePointerEnter(i)}
          onPointerLeave={handlePointerLeave}
        >
          <CrystalGeometry
            position={crystal.position}
            rotation={crystal.rotation}
            scale={crystal.scale}
            hovered={hoveredIndex === i}
          />
        </group>
      ))}
      <FloatingParticles />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <CrystalScene />
      </Canvas>
    </div>
  );
}
