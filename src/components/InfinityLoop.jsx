import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InfinityLoop = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x1a202c); // Background color (dark theme)
    mountRef.current.appendChild(renderer.domElement);

    // Geometry and material for the infinity loop
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0a4d92,   // Technology-inspired dark blue
      metalness: 0.8,    // Increased shine
      roughness: 0.4,    // Smoother surface
      emissive: 0x000000 // No glowing effect
    });

    const infinityLoop = new THREE.Mesh(geometry, material);
    infinityLoop.scale.set(0.5, 0.5, 0.5); // Adjusted size
    scene.add(infinityLoop);

    // Lighting for the shiny effect
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft ambient light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5); // Strong point light
    pointLight.position.set(2, 5, 5); // Adjust position for highlights
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-5, 5, 5).normalize();
    scene.add(directionalLight);

    // Position the camera
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotation for animation
      infinityLoop.rotation.x += 0.005;
      infinityLoop.rotation.y += 0.005;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default InfinityLoop;
