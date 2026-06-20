"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTMSStore } from "@/lib/store/tmsStore";
import { Compass, Globe, Map, Navigation, ShieldAlert } from "lucide-react";
import gsap from "gsap";

export default function LiveFleetMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<"3D" | "2D">("3D");
  const { vehicles } = useTMSStore();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const zoomTweenRef = useRef<gsap.core.Tween | null>(null);

  // 1. Initialize Three.js Globe
  useEffect(() => {
    if (viewMode !== "3D" || !canvasRef.current) return;

    const width = containerRef.current?.clientWidth || 800;
    const height = 400;

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // Create Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 150;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create Earth Globe
    const globeGeometry = new THREE.SphereGeometry(40, 64, 64);
    geometries.push(globeGeometry);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x1d1d1f,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    materials.push(globeMaterial);
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeRef.current = globe;
    scene.add(globe);

    // Add Saudi Arabia Highlight Ring (latitude: ~24, longitude: ~45)
    // Spherical coordinate math helper
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        -radius * Math.sin(phi) * Math.cos(theta)
      );
    };

    // Main KSA core highlight node
    const ksaPos = latLngToVector3(25.0, 45.0, 40);
    const ksaGeo = new THREE.SphereGeometry(1.5, 16, 16);
    geometries.push(ksaGeo);
    const ksaMat = new THREE.MeshBasicMaterial({ color: 0x006B6B }); // Teal
    materials.push(ksaMat);
    const ksaMarker = new THREE.Mesh(ksaGeo, ksaMat);
    ksaMarker.position.copy(ksaPos);
    globe.add(ksaMarker);

    // Add pins for active vehicles around KSA
    const pinsGroup = new THREE.Group();
    pinsGroupRef.current = pinsGroup;
    globe.add(pinsGroup);

    vehicles.slice(0, 20).forEach((vehicle, idx) => {
      const vLat = 24.5 + (idx % 3) * 0.5 + (Math.random() - 0.5) * 0.3;
      const vLng = 44.5 + (idx % 4) * 0.6 + (Math.random() - 0.5) * 0.3;
      const pinPos = latLngToVector3(vLat, vLng, 40);
      
      const pinGeo = new THREE.SphereGeometry(0.6, 8, 8);
      geometries.push(pinGeo);
      const pinMat = new THREE.MeshBasicMaterial({ 
        color: vehicle.status === 'Active' ? 0x34c759 : 0x0066cc 
      });
      materials.push(pinMat);
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pinPos);
      pinsGroup.add(pinMesh);
    });

    // Ambient Earth outline ring
    const ringGeo = new THREE.RingGeometry(41, 41.5, 64);
    geometries.push(ringGeo);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x006B6B, side: THREE.DoubleSide, transparent: true, opacity: 0.1 });
    materials.push(ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // Ambient rotation ticker
    let animationFrameId: number;
    let rotationActive = true;

    const animate = () => {
      if (rotationActive && globe) {
        globe.rotation.y += 0.002;
        globe.rotation.x = 0.2; // slight tilt
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Auto trigger 2D Map after 5 seconds of idle load
    let idleTimer: NodeJS.Timeout | null = null;
    
    const startIdleTimer = () => {
      idleTimer = setTimeout(() => {
        if (zoomTweenRef.current) zoomTweenRef.current.kill();
        zoomTweenRef.current = gsap.to(camera.position, {
          z: 60,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            setViewMode("2D");
          }
        });
      }, 5000);
    };

    startIdleTimer();

    // ---------------- Interactive Pointer Drag controls ----------------
    const canvas = canvasRef.current;
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let resumeRotationTimer: NodeJS.Timeout | null = null;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      rotationActive = false;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
      
      // Clear idle timer to prevent sudden switch to 2D view while dragging
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
      if (resumeRotationTimer) {
        clearTimeout(resumeRotationTimer);
        resumeRotationTimer = null;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !globe) return;
      
      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      globe.rotation.y += deltaX * 0.005;
      globe.rotation.x += deltaY * 0.005;

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUpOrLeave = () => {
      if (!isDragging) return;
      isDragging = false;

      // Resume auto-rotation after 2 seconds of inactivity
      if (resumeRotationTimer) clearTimeout(resumeRotationTimer);
      resumeRotationTimer = setTimeout(() => {
        rotationActive = true;
      }, 2000);
    };

    if (canvas) {
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", handlePointerUpOrLeave);
      canvas.addEventListener("pointerleave", handlePointerUpOrLeave);
    }

    // Cleanups on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (idleTimer) clearTimeout(idleTimer);
      if (resumeRotationTimer) clearTimeout(resumeRotationTimer);
      
      if (canvas) {
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerup", handlePointerUpOrLeave);
        canvas.removeEventListener("pointerleave", handlePointerUpOrLeave);
      }

      if (zoomTweenRef.current) {
        zoomTweenRef.current.kill();
      }

      // Dispose Three.js geometries and materials to completely prevent memory leaks
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      renderer.dispose();
    };
  }, [viewMode, vehicles]);

  // Handle manual coordinate zoom simulation
  const handlePinClick = (name: string, lat: number, lng: number) => {
    if (viewMode === "3D" && cameraRef.current && globeRef.current) {
      if (zoomTweenRef.current) zoomTweenRef.current.kill();
      zoomTweenRef.current = gsap.to(cameraRef.current.position, {
        z: 50,
        x: 5,
        y: 5,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => setViewMode("2D")
      });
    }
  };

  return (
    <div ref={containerRef} className="w-full bg-white border border-border-soft rounded-apple-lg overflow-hidden shadow-overlay relative mb-6">
      
      {/* Upper header section */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-3.5 py-2 border border-border-soft rounded-apple-pill shadow-overlay">
        <Compass className="h-4.5 w-4.5 text-brand-teal animate-spin" style={{ animationDuration: '8s' }} />
        <span className="text-xs font-semibold text-ink">Saudi Arabia Live Fleet Tracker</span>
        <span className="h-2 w-2 rounded-full bg-system-green animate-pulse" />
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setViewMode("3D")}
          className={`h-9 px-3.5 rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all shadow-overlay ${
            viewMode === "3D" 
              ? "bg-brand-teal text-white" 
              : "bg-white/95 text-ink hover:bg-background-secondary border border-border-soft"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>3D Globe</span>
        </button>
        <button
          onClick={() => setViewMode("2D")}
          className={`h-9 px-3.5 rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all shadow-overlay ${
            viewMode === "2D" 
              ? "bg-brand-teal text-white" 
              : "bg-white/95 text-ink hover:bg-background-secondary border border-border-soft"
          }`}
        >
          <Map className="h-3.5 w-3.5" />
          <span>2D Map View</span>
        </button>
      </div>

      {/* Render Canvas for 3D Globe, or Mock Mapbox interface for 2D */}
      <div className="h-[400px] w-full flex items-center justify-center bg-gradient-to-b from-background-secondary to-background relative overflow-hidden select-none">
        
        {viewMode === "3D" ? (
          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        ) : (
          <div className="absolute inset-0 bg-background-secondary p-6 flex flex-col justify-between">
            {/* Mock Vector Map Layout representing Jubail Highway Operations */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              {/* Draw road shapes, grid nodes, coordinates */}
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="200" x2="1000" y2="200" stroke="#000" strokeWidth="6" />
                <line x1="200" y1="0" x2="200" y2="400" stroke="#000" strokeWidth="4" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="200" cy="200" r="220" fill="none" stroke="#000" strokeWidth="1" />
              </svg>
            </div>

            {/* Simulated Live Vehicles on 2D Board */}
            <div className="relative z-10 flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 items-center">
              {vehicles.slice(0, 4).map((vehicle, idx) => (
                <div 
                  key={vehicle.id}
                  onClick={() => handlePinClick(vehicle.plateNumber, 27, 49)}
                  className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay hover:shadow-product cursor-pointer hover-apple-card transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-brand-teal">{vehicle.category}</span>
                    <span className="h-2 w-2 rounded-full bg-system-green animate-pulse" />
                  </div>
                  <h5 className="text-caption-strong font-semibold text-ink">{vehicle.plateNumber}</h5>
                  <p className="text-[10px] text-ink-muted mt-1 leading-none">Speed: {60 + idx * 8} km/h</p>
                  <div className="mt-2.5 flex items-center gap-1 text-[9px] text-brand-blue font-semibold">
                    <Navigation className="h-3 w-3 animate-pulse" />
                    <span>Jubail Industrial Highway</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 border-t border-border-soft pt-3 flex justify-between items-center text-[10px] text-ink-muted bg-white/50 backdrop-blur px-4 py-2 rounded-apple-sm">
              <span>Zoom Scale: Operational (Street Level)</span>
              <span>Latitude: 27.0112° N | Longitude: 49.6234° E (Jubail)</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
