import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MarsSphere = ({ textureBlendFactors, atmosphereGlowIntensity, cloudOpacity }) => {
  const meshRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();

  const marsTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(0.3, '#CD853F');
    gradient.addColorStop(0.5, '#A0522D');
    gradient.addColorStop(0.7, '#8B4513');
    gradient.addColorStop(1, '#654321');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 30 + 10;
      const brightness = Math.random() * 50 + 30;

      ctx.fillStyle = `rgba(${139 - brightness}, ${69 - brightness}, ${19 - brightness}, 0.6)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  const oceanTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(0.5, '#2563eb');
    gradient.addColorStop(1, '#1e40af');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * canvas.width;
      const y = (Math.random() * 0.3 + 0.35) * canvas.height;
      const size = Math.random() * 80 + 40;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  const terraformedTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * canvas.width;
      const y = (Math.random() * 0.3 + 0.35) * canvas.height;
      const size = Math.random() * 100 + 50;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#228B22';
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * canvas.width;
      const y = (Math.random() * 0.4 + 0.3) * canvas.height;
      const size = Math.random() * 40 + 10;

      ctx.globalAlpha = Math.random() * 0.5 + 0.3;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  const bumpTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 20 + 5;
      const brightness = Math.random() * 100 + 100;

      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  const combinedTexture = useMemo(() => {
    const { marsToWarming, warmingToAtmosphere, atmosphereToOcean, oceanToTerraformed } = textureBlendFactors;

    if (atmosphereToOcean > 0.5) {
      return oceanToTerraformed > 0.3 ? terraformedTexture : oceanTexture;
    } else if (marsToWarming > 0.5) {
      return oceanTexture;
    }

    return marsTexture;
  }, [textureBlendFactors, marsTexture, oceanTexture, terraformedTexture]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={combinedTexture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
        />
      </mesh>

      {cloudOpacity > 0 && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.02, 64, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={cloudOpacity}
            depthWrite={false}
          />
        </mesh>
      )}

      <mesh ref={atmosphereRef} scale={1.1}>
        <sphereGeometry args={[2.15, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(0x00d9ff)}
          transparent
          opacity={atmosphereGlowIntensity * 0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
};

const MarsVisualization = ({ physicsState }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ background: 'radial-gradient(circle, #1a1f3a 0%, #0a0e27 100%)' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#ff6b35" />

      <MarsSphere
        textureBlendFactors={physicsState.textureBlendFactors}
        atmosphereGlowIntensity={physicsState.atmosphereGlowIntensity}
        cloudOpacity={physicsState.cloudOpacity}
      />

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={3}
        maxDistance={10}
        zoomSpeed={0.5}
      />
    </Canvas>
  );
};

export default React.memo(MarsVisualization);
