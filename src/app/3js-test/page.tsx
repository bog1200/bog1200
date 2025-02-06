"use client";
import * as THREE from 'three';
import {useEffect, useRef} from "react";
export default function TestPage() {
    // Three.js Test Code
    const refContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // === THREE.JS CODE START ===
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        if (refContainer.current === null) {
            return;
        }
       refContainer.current.appendChild(renderer.domElement);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const materials = [
            new THREE.MeshBasicMaterial({color: 0xff0000}), // red
            new THREE.MeshBasicMaterial({color: 0x00ff00}), // green
            new THREE.MeshBasicMaterial({color: 0x0000ff}), // blue
            new THREE.MeshBasicMaterial({color: 0xffff00}), // yellow
            new THREE.MeshBasicMaterial({color: 0xff00ff}), // magenta
            new THREE.MeshBasicMaterial({color: 0x00ffff})  // cyan
        ];
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
        camera.position.z = 5;
        const animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }, []);
    return (
        <div ref={refContainer}></div>

    );
}
