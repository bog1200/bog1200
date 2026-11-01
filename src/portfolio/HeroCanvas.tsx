"use client";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { motionPaused, subscribeMotion } from "./motion";

// Shared by ribbons and particles so the particles ride the same light currents.
const WAVE = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;      // world-space cursor position
uniform float uMouseAmt;  // 0..1, eased in/out as the cursor enters/leaves

float wave(float x, float seed) {
    float t = uTime;
    return sin(x * 0.32 + t * 0.22 + seed * 1.7) * 0.85
         + sin(x * 0.85 - t * 0.37 + seed * 3.1) * 0.32
         + sin(x * 2.30 + t * 0.61 + seed * 5.3) * 0.07;
}

// Vertical pull towards the cursor, falling off with horizontal distance.
float pull(float x, float y) {
    float d = (x - uMouse.x) / 2.2;
    return exp(-d * d) * (uMouse.y - y) * 0.35 * uMouseAmt;
}
`;

const RIBBON_VERT = /* glsl */ `
${WAVE}
uniform float uSeed;
uniform float uBaseY;
uniform float uHeight;
varying vec2 vUv;
varying float vDepth;

void main() {
    vUv = uv;
    float x = position.x;
    float base = uBaseY + wave(x, uSeed);
    float h = uHeight * (0.75 + 0.35 * sin(x * 0.45 + uTime * 0.18 + uSeed));
    float y = base + uv.y * h;
    y += pull(x, y) * (0.4 + 0.6 * uv.y);
    // Curtain fold: the top edge leans back and sways.
    float z = sin(x * 0.38 + uTime * 0.15 + uSeed * 2.0) * 1.1 - uv.y * 0.9;
    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
}
`;

const RIBBON_FRAG = /* glsl */ `
uniform float uTime;
uniform float uSeed;
uniform float uIntensity;
uniform float uCamZ;
uniform vec3 uColorLow;
uniform vec3 uColorMid;
uniform vec3 uColorHigh;
varying vec2 vUv;
varying float vDepth;

void main() {
    float v = vUv.y;
    float u = vUv.x;
    // Bright lower hem fading upwards, like an auroral curtain.
    float hem = smoothstep(0.0, 0.06, v) * pow(1.0 - v, 1.8);
    // Vertical rays drifting sideways.
    float rays = 0.55 + 0.45 * sin(u * 220.0 + sin(u * 14.0 + uTime * 0.5 + uSeed) * 5.0 + uTime * 0.8);
    rays = mix(1.0, rays, 0.55 + 0.45 * v);
    float sides = smoothstep(0.0, 0.18, u) * smoothstep(1.0, 0.82, u);
    vec3 col = mix(uColorLow, uColorMid, smoothstep(0.0, 0.45, v));
    col = mix(col, uColorHigh, smoothstep(0.45, 1.0, v));
    float a = hem * rays * sides * uIntensity * smoothstep(uCamZ + 7.0, uCamZ - 3.0, vDepth);
    gl_FragColor = vec4(col * a, a);
}
`;

const NODE_VERT = /* glsl */ `
${WAVE}
attribute vec4 aData;   // x: start x, y: ribbon seed, z: offset above the ribbon base, w: speed
attribute float aShape; // 0 = square, 1 = diamond
uniform float uPixelRatio;
varying float vShape;
varying float vBlink;

void main() {
    float span = 18.0;
    float x = mod(aData.x + uTime * aData.w + span * 0.5, span) - span * 0.5;
    float y = -0.9 + aData.y * 0.25 + wave(x, aData.y) + aData.z;
    y += pull(x, y);
    float z = sin(x * 0.38 + uTime * 0.15 + aData.y * 2.0) * 1.1 + 0.4;
    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (7.0 + 5.0 * fract(aData.x * 7.13)) * uPixelRatio * (9.0 / -mv.z);
    vShape = aShape;
    vBlink = 0.5 + 0.5 * sin(uTime * (0.6 + aData.w * 3.0) + aData.x * 11.0);
    // Fade out towards the horizontal ends so wrapping is invisible.
    vBlink *= smoothstep(span * 0.5, span * 0.3, abs(x));
}
`;

const NODE_FRAG = /* glsl */ `
varying float vShape;
varying float vBlink;

void main() {
    vec2 p = abs(gl_PointCoord - 0.5);
    float d = vShape > 0.5 ? (p.x + p.y) * 0.75 : max(p.x, p.y);
    // Hollow outline plus a pinpoint core: a node, not a glowing orb.
    float ring = step(0.36, d) * step(d, 0.5);
    float core = step(d, 0.07);
    float a = (ring * 0.55 + core) * (0.25 + 0.75 * vBlink);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vec3(0.78, 0.96, 1.0) * a, a);
}
`;

const RIBBONS = [
    { seed: 0.0, baseY: -1.6, height: 2.6, low: "#34d399", mid: "#22d3ee", high: "#6d28d9", intensity: 0.9 },
    { seed: 1.3, baseY: -1.0, height: 2.2, low: "#10b981", mid: "#2dd4bf", high: "#a855f7", intensity: 0.65 },
    { seed: 2.9, baseY: -0.3, height: 1.8, low: "#4ade80", mid: "#38bdf8", high: "#c026d3", intensity: 0.45 },
    { seed: 4.4, baseY: -2.2, height: 3.0, low: "#059669", mid: "#0ea5e9", high: "#7c3aed", intensity: 0.5 },
];

export default function HeroCanvas({ label }: { label: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const host = ref.current;
        if (!host) return;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        } catch {
            return; // No WebGL: the CSS aurora behind stays visible.
        }
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        renderer.setPixelRatio(pixelRatio);
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
        camera.position.set(0, 0.2, 9);

        const shared = {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uMouseAmt: { value: 0 },
            uCamZ: { value: 9 },
        };

        const disposables: { dispose(): void }[] = [];
        const ribbonGeometry = new THREE.PlaneGeometry(18, 1, 260, 28);
        ribbonGeometry.translate(0, 0.5, 0); // y from 0 to 1, matching uv.y
        disposables.push(ribbonGeometry);
        for (const r of RIBBONS) {
            const material = new THREE.ShaderMaterial({
                vertexShader: RIBBON_VERT,
                fragmentShader: RIBBON_FRAG,
                uniforms: {
                    ...shared,
                    uSeed: { value: r.seed },
                    uBaseY: { value: r.baseY },
                    uHeight: { value: r.height },
                    uIntensity: { value: r.intensity },
                    uColorLow: { value: new THREE.Color(r.low) },
                    uColorMid: { value: new THREE.Color(r.mid) },
                    uColorHigh: { value: new THREE.Color(r.high) },
                },
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            });
            disposables.push(material);
            scene.add(new THREE.Mesh(ribbonGeometry, material));
        }

        const count = window.innerWidth < 640 ? 140 : 280;
        const data = new Float32Array(count * 4);
        const shape = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const ribbon = RIBBONS[i % RIBBONS.length];
            data.set([Math.random() * 18 - 9, ribbon.seed, Math.random() * 2.4 - 0.2, 0.05 + Math.random() * 0.25], i * 4);
            shape[i] = Math.random() < 0.35 ? 1 : 0;
        }
        const nodeGeometry = new THREE.BufferGeometry();
        nodeGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
        nodeGeometry.setAttribute("aData", new THREE.BufferAttribute(data, 4));
        nodeGeometry.setAttribute("aShape", new THREE.BufferAttribute(shape, 1));
        // Positions are computed in the shader, so the bounds can't be derived from the attribute.
        nodeGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
        const nodeMaterial = new THREE.ShaderMaterial({
            vertexShader: NODE_VERT,
            fragmentShader: NODE_FRAG,
            uniforms: { ...shared, uPixelRatio: { value: pixelRatio } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        disposables.push(nodeGeometry, nodeMaterial);
        scene.add(new THREE.Points(nodeGeometry, nodeMaterial));


        const resize = () => {
            const { clientWidth: w, clientHeight: h } = host;
            if (!w || !h) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            // Keep the ribbons spanning the width on narrow screens.
            camera.position.z = w / h < 1 ? 9 / Math.max(w / h, 0.55) : 9;
            shared.uCamZ.value = camera.position.z;
            camera.updateProjectionMatrix();
            // Resizing clears the canvas; redraw the frozen frame while paused.
            if (!frame) renderer.render(scene, camera);
        };
        let frame = 0;
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        resize();

        // Cursor in world space on the z = 0 plane.
        const target = new THREE.Vector2();
        let hovering = false;
        const onPointerMove = (e: PointerEvent) => {
            const rect = host.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            hovering = ny >= -1 && ny <= 1;
            const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
            target.set(nx * halfH * camera.aspect, ny * halfH + camera.position.y);
        };
        const onPointerLeave = () => (hovering = false);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.addEventListener("pointerleave", onPointerLeave);

        const timer = new THREE.Timer();
        let visible = true;

        const render = () => {
            const dt = Math.min(timer.update().getDelta(), 0.1);
            shared.uTime.value += dt;
            shared.uMouse.value.lerp(target, 1 - Math.exp(-dt * 4));
            shared.uMouseAmt.value += ((hovering ? 1 : 0) - shared.uMouseAmt.value) * (1 - Math.exp(-dt * 2));
            camera.position.x += (shared.uMouse.value.x * 0.04 - camera.position.x) * (1 - Math.exp(-dt * 2));
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        };
        const loop = () => {
            frame = 0;
            render();
            schedule();
        };
        const schedule = () => {
            if (!frame && visible && !motionPaused() && !document.hidden) frame = requestAnimationFrame(loop);
        };
        const stop = () => {
            cancelAnimationFrame(frame);
            frame = 0;
        };

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) {
                timer.update();
                schedule();
            } else stop();
        });
        io.observe(host);
        const onVisibility = () => {
            timer.update();
            if (document.hidden) stop();
            else schedule();
        };
        document.addEventListener("visibilitychange", onVisibility);
        // The pause toggle and the OS reduced-motion setting both land here (see motion.ts).
        const unsubscribeMotion = subscribeMotion(() => {
            if (motionPaused()) stop();
            else {
                timer.update();
                schedule();
            }
        });

        // When starting paused, this is the still frame that stays on screen: a pleasant moment mid-flight.
        shared.uTime.value = 12;
        render();
        schedule();

        return () => {
            stop();
            io.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerleave", onPointerLeave);
            document.removeEventListener("visibilitychange", onVisibility);
            unsubscribeMotion();
            timer.dispose();
            disposables.forEach((d) => d.dispose());
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return <div ref={ref} role="img" aria-label={label} className="absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full" />;
}
