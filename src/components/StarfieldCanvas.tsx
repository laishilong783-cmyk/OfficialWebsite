import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

// ==================== 星星着色器 ====================
const starVertexShader = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;
  attribute float aSpeed;
  varying float vOpacity;
  varying float vPhase;
  varying float vSpeed;

  void main() {
    vOpacity = aOpacity;
    vPhase = aPhase;
    vSpeed = aSpeed;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (350.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  uniform float uTime;
  varying float vOpacity;
  varying float vPhase;
  varying float vSpeed;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float core = smoothstep(0.5, 0.0, dist);
    float glow = smoothstep(0.5, 0.15, dist);

    float twinkle = sin(uTime * vSpeed + vPhase * 6.28318);
    twinkle = 0.6 + 0.4 * (twinkle * 0.5 + 0.5);

    float pulse = sin(uTime * vSpeed * 0.2 + vPhase * 8.0);
    pulse = pow(pulse * 0.5 + 0.5, 6.0);
    float brightness = twinkle + pulse * 0.15;

    vec3 color = vec3(1.0, 1.0, 1.0);
    float alpha = (core * 0.6 + glow * 0.2) * vOpacity * brightness;
    gl_FragColor = vec4(color, alpha);
  }
`;

function TwinklingStars() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 2500;

  const { positions, sizes, opacities, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const op = new Float32Array(count);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 25 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      sz[i] = Math.random() < 0.05
        ? 1.5 + Math.random() * 1.5
        : 0.3 + Math.random() * 0.8;

      op[i] = 0.4 + Math.random() * 0.6;
      ph[i] = Math.random();
      sp[i] = 0.4 + Math.random() * 2.5;
    }

    return { positions: pos, sizes: sz, opacities: op, phases: ph, speeds: sp };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, [positions, sizes, opacities, phases, speeds]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.003;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.001;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function MilkyWay() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 500;

  const { positions, opacities, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const op = new Float32Array(count);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 50;
      const height = (Math.random() - 0.5) * 3;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      op[i] = 0.15 + Math.random() * 0.25;
      ph[i] = Math.random();
      sp[i] = 0.15 + Math.random() * 0.4;
    }

    return { positions: pos, opacities: op, phases: ph, speeds: sp };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    return geo;
  }, [positions, opacities, phases, speeds]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.002;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -60]}>
      <planeGeometry args={[140, 100]} />
      <meshBasicMaterial
        color="#162d52"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ==================== 流星（稀疏、高起始、轨迹分散）====================
import { useState, useEffect, useCallback } from 'react';

interface MeteorInfo {
  id: number;
  top: string;
  left: string;
  dx: string;
  dy: string;
}

function CSSMeteors() {
  const [meteor, setMeteor] = useState<MeteorInfo | null>(null);
  const counterRef = useRef(0);
  const spawningRef = useRef(false);

  // 更高起始位置、轨迹分散、各不相同
  const positions = useMemo(() => [
    // 最高右侧外 → 远左下（最长轨迹）
    { top: '-32%', left: '110%', dx: '-65vw', dy: '75vh' },
    // 很高右上 → 左下偏外
    { top: '-28%', left: '82%', dx: '-38vw', dy: '68vh' },
    // 高右侧 → 左下
    { top: '-15%', left: '98%', dx: '-52vw', dy: '55vh' },
    // 高中央偏右 → 远左下
    { top: '-22%', left: '65%', dx: '-42vw', dy: '72vh' },
    // 最高右边缘 → 左下偏内
    { top: '-30%', left: '92%', dx: '-35vw', dy: '80vh' },
    // 高右侧远角 → 左下
    { top: '-18%', left: '120%', dx: '-60vw', dy: '50vh' },
    // 较高中央 → 左下偏外
    { top: '-25%', left: '72%', dx: '-48vw', dy: '62vh' },
    // 高最右 → 左下偏内
    { top: '-20%', left: '108%', dx: '-30vw', dy: '70vh' },
  ], []);

  const spawnMeteor = useCallback(() => {
    if (spawningRef.current) return;
    spawningRef.current = true;

    const pos = positions[Math.floor(Math.random() * positions.length)];
    counterRef.current += 1;
    setMeteor({ id: counterRef.current, ...pos });

    setTimeout(() => {
      setMeteor(null);
      spawningRef.current = false;
    }, 3500);
  }, [positions]);

  useEffect(() => {
    // 首次 6 秒后出现
    const firstTimer = setTimeout(() => {
      spawnMeteor();
    }, 6000);
    return () => clearTimeout(firstTimer);
  }, [spawnMeteor]);

  useEffect(() => {
    if (meteor !== null) return;
    // 间隔 60~90 秒
    const nextDelay = 60000 + Math.random() * 30000;
    const timer = setTimeout(() => {
      spawnMeteor();
    }, nextDelay);
    return () => clearTimeout(timer);
  }, [meteor, spawnMeteor]);

  if (!meteor) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      <div
        key={meteor.id}
        className="meteor"
        style={{
          top: meteor.top,
          left: meteor.left,
          '--dx': meteor.dx,
          '--dy': meteor.dy,
        } as React.CSSProperties}
      />
      <style>{`
        @keyframes meteor-fall {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          6% {
            opacity: 1;
          }
          94% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy));
            opacity: 0;
          }
        }
        .meteor {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #FFFFFF;
          box-shadow: 0 0 8px 2px rgba(200, 230, 255, 0.7);
          opacity: 0;
          animation: meteor-fall 3.5s linear forwards;
        }
        .meteor::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50px;
          height: 1.5px;
          background: linear-gradient(to right, rgba(200, 230, 255, 0.6), transparent);
          transform-origin: left center;
          transform: translate(0, -50%) rotate(-45deg);
          border-radius: 1px;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

function Scene() {
  return (
    <>
      <TwinklingStars />
      <MilkyWay />
    </>
  );
}

export default function StarfieldCanvas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 w-full h-full" style={{ background: '#080f1e' }}>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#080f1e' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
      {isDark && <CSSMeteors />}
    </div>
  );
}
