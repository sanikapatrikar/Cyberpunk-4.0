import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SmokeCanvas from './components/SmokeCanvas';
import CinematicSequence from './components/CinematicSequence';
import Navbar from './components/Navbar';
import Events from './components/Events';
import Crew from './components/Crew';
import Gallery from "./Gallery";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user accessibility setting for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Initialize Lenis smooth scroll engine
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
    });

    // Synchronize Lenis smooth scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      lenis.destroy();
    };
  }, []);

  const handleSequenceComplete = () => {
    setIsNavVisible(true);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-100 overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Background Film Grain Smoke System */}
      <SmokeCanvas />

      {/* Floating Cyberpunk Navbar */}
      <Navbar visible={isNavVisible} />

      {/* Main Cinematic Scroll Intro Experience */}
      {!prefersReducedMotion ? (
        <CinematicSequence onSequenceComplete={handleSequenceComplete} />
      ) : (
        /* Reduced motion accessible static header fallback */
        <div className="py-24 text-center px-4 bg-black border-b border-red-900">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="font-compacta text-7xl text-white">CYBER</span>
            <span className="font-compacta text-6xl text-red-600">|</span>
            <div className="bg-red-600 px-6 py-1 rounded">
              <span className="font-compacta text-7xl text-white">PUNK</span>
            </div>
          </div>
          <p className="font-compacta text-3xl text-red-500 tracking-widest">
            10 SEPTEMBER 2026 // REDUCED MOTION MODE
          </p>
        </div>
      )}

      {/* Event Website Sections (Revealed after or below intro) */}
      <main className="relative z-20">
        <Events />
        <Crew />
      </main>

      {/* Footer & Contact */}

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
