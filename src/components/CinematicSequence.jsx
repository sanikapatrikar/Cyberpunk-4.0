import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playVaultGateSound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

const CinematicSequence = ({ onSequenceComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const gateLeftRef = useRef(null);
  const gateRightRef = useRef(null);
  const crewRef = useRef(null);
  const titleRevealRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Load Dali Mask Image for 3D/Pseudo-3D Rotation Render
    const maskImg = new Image();
    maskImg.src = '/assets/heist_dali_mask.jpg';

    let maskLoaded = false;
    maskImg.onload = () => {
      maskLoaded = true;
      drawMask(0, 0); // initial render: 0 scale, 0 rotation
    };

    let canvasWidth = (canvas.width = window.innerWidth);
    let canvasHeight = (canvas.height = window.innerHeight);

    const handleResize = () => {
      canvasWidth = canvas.width = window.innerWidth;
      canvasHeight = canvas.height = window.innerHeight;
      drawMask(currentAngleRef.current, currentScaleRef.current);
    };
    window.addEventListener('resize', handleResize);

    const currentAngleRef = { current: 0 };
    const currentScaleRef = { current: 0 };
    const currentOpacityRef = { current: 0 };

    function drawMask(angleDeg, scaleVal, opacityVal = 1) {
      if (!maskLoaded || !ctx) return;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, opacityVal));
      ctx.translate(canvasWidth / 2, canvasHeight / 2);

      // Convert angle to radians
      const rad = (angleDeg * Math.PI) / 180;
      ctx.rotate(rad);

      // Perspective scale trick for 3D feel
      const maxDim = Math.min(canvasWidth * 0.7, canvasHeight * 0.7, 450);
      const drawWidth = maxDim * scaleVal;
      const drawHeight = maxDim * scaleVal;

      // Subtle 3D perspective squish during rotation
      const cosVal = Math.abs(Math.cos(rad));
      const scaleX = 0.4 + 0.6 * cosVal;

      ctx.scale(scaleX, 1);

      // Subtle drop shadow & red glow under mask
      ctx.shadowColor = 'rgba(230, 0, 0, 0.8)';
      ctx.shadowBlur = 40;

      ctx.drawImage(
        maskImg,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();
    }

    // GSAP ScrollTrigger Master Timeline
    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=450%', // 4.5x viewport scroll height for smooth, rich scrubbing
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const prog = self.progress;
            setScrollProgress(prog);

            // Trigger audio cue when gate opens (around 60% progress)
            if (prog > 0.55 && prog < 0.6) {
              playVaultGateSound();
            }

            if (prog >= 0.95 && onSequenceComplete) {
              onSequenceComplete();
            }
          },
        },
      });

      // Phase 1: Darkness -> Mask Emerges (0.0 to 0.15)
      tl.to(currentOpacityRef, {
        current: 1,
        duration: 0.15,
        onUpdate: () => drawMask(currentAngleRef.current, currentScaleRef.current, currentOpacityRef.current),
      }, 0);

      tl.to(currentScaleRef, {
        current: 1,
        duration: 0.15,
        ease: 'power2.out',
        onUpdate: () => drawMask(currentAngleRef.current, currentScaleRef.current, currentOpacityRef.current),
      }, 0);

      // Phase 2: 360° Mask Rotation (0.15 to 0.50)
      // 0% -> 0deg, 25% -> 90deg, 50% -> 180deg, 75% -> 270deg, 100% -> 360deg
      tl.to(currentAngleRef, {
        current: 360,
        duration: 0.35,
        ease: 'none',
        onUpdate: () => drawMask(currentAngleRef.current, currentScaleRef.current, currentOpacityRef.current),
      }, 0.15);

      // Phase 3: Mask Recedes into Darkness (0.50 to 0.60)
      tl.to(currentScaleRef, {
        current: 2.2,
        duration: 0.10,
        onUpdate: () => drawMask(currentAngleRef.current, currentScaleRef.current, currentOpacityRef.current),
      }, 0.50);

      tl.to(currentOpacityRef, {
        current: 0,
        duration: 0.10,
        onUpdate: () => drawMask(currentAngleRef.current, currentScaleRef.current, currentOpacityRef.current),
      }, 0.50);

      // Phase 4: Gate Emerges & Opens (0.55 to 0.78)
      tl.fromTo(
        [gateLeftRef.current, gateRightRef.current],
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.08 },
        0.55
      );

      // Left gate slides left, Right gate slides right
      tl.to(gateLeftRef.current, { xPercent: -100, duration: 0.18, ease: 'power1.inOut' }, 0.60);
      tl.to(gateRightRef.current, { xPercent: 100, duration: 0.18, ease: 'power1.inOut' }, 0.60);

      // Phase 5: Crew Reveal behind gate (0.65 to 0.85)
      // Progressive reveal: Silhouette -> Body -> Clothing -> Mask -> Full Crew
      tl.fromTo(
        crewRef.current,
        { opacity: 0, filter: 'blur(15px) brightness(0.1)', scale: 0.9 },
        { opacity: 1, filter: 'blur(0px) brightness(1)', scale: 1, duration: 0.20, ease: 'power2.out' },
        0.65
      );

      // Phase 6: CYBERPUNK Title Reveal (0.85 to 1.0)
      tl.fromTo(
        titleRevealRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: 'back.out(1.4)' },
        0.85
      );
    }, containerRef);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctxGsap.revert();
    };
  }, [onSequenceComplete]);

  const scrollToMain = () => {
    const mainSection = document.getElementById('countdown-section');
    if (mainSection) {
      mainSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center select-none"
    >
      {/* Ambient Vignette & Film Grain */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none z-20" />
      <div className="film-grain absolute inset-0 pointer-events-none z-20 opacity-40" />

      {/* Red Spotlight Glow Background */}
      <div
        className="absolute w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none transition-all duration-700 z-0"
        style={{
          opacity: scrollProgress > 0.1 ? Math.min(1, scrollProgress * 1.5) : 0,
        }}
      />

      {/* Scene 02 & 03: Canvas for 360° Mask Rotation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-20 pointer-events-none"
      />

      {/* Scene 04 & 05: Industrial Vault Gate Doors */}
      <div className="absolute inset-0 z-30 pointer-events-none flex overflow-hidden">
        {/* Left Gate Door */}
        <div
          ref={gateLeftRef}
          className="w-1/2 h-full bg-cover bg-left relative border-r-2 border-red-600/50 shadow-2xl opacity-0"
          style={{ backgroundImage: "url('/assets/heist_vault_gate.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-red-950/40" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span className="w-2 h-16 bg-red-600/80 rounded" />
          </div>
        </div>

        {/* Right Gate Door */}
        <div
          ref={gateRightRef}
          className="w-1/2 h-full bg-cover bg-right relative border-l-2 border-red-600/50 shadow-2xl opacity-0"
          style={{ backgroundImage: "url('/assets/heist_vault_gate.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-red-950/40" />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
            <span className="w-2 h-16 bg-red-600/80 rounded" />
          </div>
        </div>
      </div>

      {/* Scene 06: Heist Crew Reveal Layer */}
      <div
        ref={crewRef}
        className="absolute inset-0 z-10 opacity-0 flex items-center justify-center"
      >
        <img
          src="/assets/heist_crew_reveal.jpg"
          alt="CYBERPUNK Heist Crew"
          className="w-full h-full object-cover object-center filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* Scene 07: CYBERPUNK Movie Title Reveal */}
      <div
        ref={titleRevealRef}
        className="absolute z-40 flex flex-col items-center justify-center text-center px-4 max-w-4xl opacity-0"
      >
        {/* Logo Treatment: CYBER | PUNK */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4 flex-wrap">
          <span className="font-bebas text-6xl sm:text-8xl md:text-9xl text-white tracking-widest font-black drop-shadow-2xl">
            CYBER
          </span>
          <span className="font-bebas text-5xl sm:text-7xl md:text-8xl text-red-600 font-light">
            |
          </span>
          <div className="bg-red-600 px-4 sm:px-8 py-1 sm:py-2 rounded-sm shadow-[0_0_40px_rgba(230,0,0,0.8)] border border-red-500">
            <span className="font-bebas text-6xl sm:text-8xl md:text-9xl text-white tracking-widest font-black">
              PUNK
            </span>
          </div>
        </div>

        {/* Subtitle Event Date */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-red-600" />
          <p className="font-bebas text-2xl sm:text-4xl text-red-500 tracking-[0.3em] font-bold text-glow-red">
            10 SEPTEMBER
          </p>
          <div className="h-[2px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-red-600" />
        </div>

        {/* Enter Operation Button */}
        <button
          onClick={scrollToMain}
          className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-bebas text-2xl sm:text-3xl tracking-widest rounded-none border border-red-500 shadow-[0_0_30px_rgba(230,0,0,0.6)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer mt-4"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative flex items-center gap-3">
            ENTER THE OPERATION
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Scroll Guidance Indicator during initial rotation phase */}
      {scrollProgress < 0.85 && (
        <div className="absolute bottom-8 z-40 flex flex-col items-center text-gray-400 font-mono-cyber text-xs tracking-widest animate-pulse">
          <span className="text-red-500 font-bold mb-1">SCROLL TO UNLOCK THE HEIST</span>
          <div className="w-5 h-8 border-2 border-red-600/60 rounded-full flex items-start justify-center p-1">
            <div
              className="w-1.5 h-2 bg-red-600 rounded-full transition-all duration-200"
              style={{ transform: `translateY(${Math.min(16, scrollProgress * 20)}px)` }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CinematicSequence;
