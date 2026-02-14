"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float ribbon(vec2 uv, float center, float width, float tilt, float speed, float wave) {
    float time = uTime * speed;
    float oscillation = sin((uv.y + center * 0.15) * wave + time) * 0.22;
    float x = (uv.x - center - oscillation);
    float yTilt = (uv.y - 0.5) * tilt;
    float dist = x + yTilt;
    return exp(-pow(dist / width, 2.0));
  }

  void main() {
    vec2 uv = vec2(vUv.x * 2.2 - 1.1, vUv.y);
    float time = uTime * 0.12;

    float baseWaves = noise(vec2(uv.x * 1.4 + time * 0.5, uv.y * 2.5 - time * 0.8));
    float shimmer = noise(vec2(uv.x * 4.5 - time * 1.2, uv.y * 6.0 + time * 0.9));

    float line1 = ribbon(uv, -0.85 + sin(time * 0.4) * 0.12, 0.26, -0.5, 0.8, 4.5);
    float line2 = ribbon(uv, -0.35 + sin(time * 0.32 + 1.5) * 0.18, 0.19, 0.75, 0.6, 5.4);
    float line3 = ribbon(uv, 0.15 + sin(time * 0.45 + 3.2) * 0.22, 0.2, -0.35, 0.72, 6.0);
    float line4 = ribbon(uv, 0.6 + sin(time * 0.28 + 2.0) * 0.24, 0.24, 0.55, 0.58, 4.4);
    float line5 = ribbon(uv, 1.05 + sin(time * 0.36 + 4.1) * 0.2, 0.28, -0.45, 0.65, 4.9);

    float blendWaves = baseWaves * 0.45 + shimmer * 0.35;
    float intensity = line1 + line2 + line3 * 0.9 + line4 * 0.8 + line5 * 0.7;
    intensity *= smoothstep(-0.1, 0.85, uv.y + blendWaves * 0.35);

    vec3 deepNight = vec3(0.015, 0.01, 0.05);
    vec3 emerald = vec3(0.1, 0.85, 0.62);
    vec3 mint = vec3(0.32, 0.95, 0.78);
    vec3 violet = vec3(0.55, 0.25, 0.95);
    vec3 blush = vec3(0.95, 0.45, 0.8);

    vec3 ribbonColor = vec3(0.0);
    ribbonColor += mix(emerald, mint, 0.35) * line1;
    ribbonColor += mix(emerald, mint, 0.6) * line2;
    ribbonColor += mix(violet, blush, 0.65) * line3;
    ribbonColor += mix(blush, mint, 0.5) * line4;
    ribbonColor += mix(violet, emerald, 0.45) * line5;

    float colorPulse = sin(time * 0.7) * 0.5 + 0.5;
    ribbonColor = mix(ribbonColor, mix(emerald, blush, colorPulse), 0.25 + shimmer * 0.15);
    ribbonColor += vec3(0.06, 0.12, 0.2) * blendWaves;

    float glow = smoothstep(0.0, 0.75, intensity) * 0.95;
    glow += baseWaves * 0.15;
    glow *= smoothstep(-0.15, 0.9, uv.y);

    float alpha = glow;
    alpha *= smoothstep(-0.2, 0.25, uv.y + shimmer * 0.25);
    alpha *= smoothstep(-0.2, 1.25, uv.y + baseWaves * 0.3);

    if (alpha < 0.01) {
      discard;
    }

    vec3 color = mix(deepNight, ribbonColor, glow);
    color = mix(color, vec3(0.035, 0.02, 0.12), pow(1.0 - clamp(uv.y, 0.0, 1.0), 3.5));

    gl_FragColor = vec4(color, alpha);
  }
`;

export function AuroraCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2, 64, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let animationId: number;

    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientHeight === 0) {
        return;
      }

      renderer.setSize(clientWidth, clientHeight, false);

      const aspect = clientWidth / clientHeight;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();

      mesh.scale.set(aspect, 1, 1);
    };

    handleResize();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}

export default AuroraCanvas;
