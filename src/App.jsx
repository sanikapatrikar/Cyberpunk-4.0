import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Web3ProblemStatement from "./Web3ProblemStatement";

import SmokeCanvas from './components/SmokeCanvas';
import CinematicSequence from './components/CinematicSequence';
import Navbar from './components/Navbar';
import Events from './components/Events';
import Crew from './components/Crew';
import Footer from './components/Footer';

import Gallery from "./Gallery";
import Registration from "./Registration";

gsap.registerPlugin(ScrollTrigger);


function Home() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);


  useEffect(() => {

    // Prevent mobile browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }


    // Check reduced motion preference
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    setPrefersReducedMotion(mediaQuery.matches);


    const handleMotionChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener(
      'change',
      handleMotionChange
    );


    // Initialize Lenis
    const isMobile = window.matchMedia(
      '(max-width: 768px)'
    ).matches;


    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.4,

      easing: (t) =>
        Math.min(
          1,
          1.001 - Math.pow(2, -10 * t)
        ),

      smoothWheel: true,

      smoothTouch: false,

      touchMultiplier: isMobile ? 1 : 1.5,
    });


    // Sync Lenis with ScrollTrigger
    lenis.on(
      'scroll',
      ScrollTrigger.update
    );


    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });


    gsap.ticker.lagSmoothing(0);


    return () => {

      mediaQuery.removeEventListener(
        'change',
        handleMotionChange
      );

      lenis.destroy();


      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }

    };

  }, []);


  const handleSequenceComplete = () => {
    setIsNavVisible(true);
  };


  return (

    <div
      className="
        relative
        min-h-screen
        bg-[#050505]
        text-gray-100
        overflow-x-hidden
        selection:bg-red-600
        selection:text-white
      "
    >

      {/* =====================================================
          BACKGROUND SMOKE / FILM GRAIN
      ===================================================== */}

      <SmokeCanvas />


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar visible={isNavVisible} />


      {/* =====================================================
          CINEMATIC INTRO
      ===================================================== */}

      {!prefersReducedMotion ? (

        <CinematicSequence
          onSequenceComplete={
            handleSequenceComplete
          }
        />

      ) : (

        /* Reduced motion fallback */

        <div
          className="
            py-24
            text-center
            px-4
            bg-black
            border-b
            border-red-900
          "
        >

          <div
            className="
              flex
              items-center
              justify-center
              gap-4
              mb-4
            "
          >

            <span
              className="
                font-compacta
                text-7xl
                text-white
              "
            >
              CYBER
            </span>


            <span
              className="
                font-compacta
                text-6xl
                text-red-600
              "
            >
              |
            </span>


            <div
              className="
                bg-red-600
                px-6
                py-1
                rounded
              "
            >

              <span
                className="
                  font-compacta
                  text-7xl
                  text-white
                "
              >
                PUNK
              </span>

            </div>

          </div>


          <p
            className="
              font-compacta
              text-3xl
              text-red-500
              tracking-widest
            "
          >
            10 SEPTEMBER 2026 //
            REDUCED MOTION MODE
          </p>

        </div>

      )}


      {/* =====================================================
          MAIN WEBSITE CONTENT
      ===================================================== */}

      <main className="relative z-20">

        <Events />

        <Crew />

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />


    </div>

  );
}


/* =============================================================
   GALLERY PAGE
============================================================= */

function GalleryPage() {

  return (

    <div
      className="
        relative
        min-h-screen
        bg-[#050505]
        text-gray-100
        overflow-x-hidden
      "
    >

      <Navbar visible={true} />


      <main className="relative z-20">

        <Gallery />

      </main>


      {/* Footer on Gallery page too */}

      <Footer />

    </div>

  );

}


/* =============================================================
   APP / ROUTES
============================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* REGISTRATION */}

        <Route
          path="/registration"
          element={<Registration />}
        />


        {/* GALLERY */}

        <Route
          path="/gallery"
          element={<GalleryPage />}
        />


        {/* WEB3 PROBLEM STATEMENT */}

        <Route
          path="/web3-problem-statement"
          element={<Web3ProblemStatement />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;