import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playVaultGateSound } from '../utils/audio';
import Countdown from './Countdown';

gsap.registerPlugin(ScrollTrigger);

const CinematicSequence = ({ onSequenceComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const gateLeftRef = useRef(null);
  const gateRightRef = useRef(null);
  const crewRef = useRef(null);
  const titleRevealRef = useRef(null);
  const landingHeroRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [goldSheenX, setGoldSheenX] = useState(null);

  // IMPORTANT:
  // Prevent onSequenceComplete from firing repeatedly
  const sequenceCompletedRef = useRef(false);
  const gateSoundPlayedRef = useRef(false);

  // Keep latest callback without recreating ScrollTrigger
  const onSequenceCompleteRef = useRef(onSequenceComplete);

  useEffect(() => {
    onSequenceCompleteRef.current = onSequenceComplete;
  }, [onSequenceComplete]);

  /* ==========================================
     HERO MOUSE EFFECT
  ========================================== */

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    if (!rect.width) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;

    setGoldSheenX(
      Math.max(0, Math.min(100, x))
    );
  };

  const handleHeroMouseLeave = () => {
    setGoldSheenX(null);
  };

  /* ==========================================
     CINEMATIC ANIMATION
  ========================================== */

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    /* ------------------------------------------
       CANVAS STATE
    ------------------------------------------ */

    let canvasWidth = 0;
    let canvasHeight = 0;

    const currentAngleRef = {
      current: 0,
    };

    const currentScaleRef = {
      current: 0,
    };

    const currentOpacityRef = {
      current: 0,
    };

    /* ------------------------------------------
       DALI MASK IMAGE
    ------------------------------------------ */

    const maskImg = new Image();

    maskImg.src = '/assets/heist_dali_mask.jpg';

    let maskLoaded = false;

    /* ------------------------------------------
       DRAW MASK
    ------------------------------------------ */

    const drawMask = (
      angleDeg,
      scaleVal,
      opacityVal = 1
    ) => {
      if (!maskLoaded || !ctx) return;

      ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      if (
        scaleVal <= 0 ||
        opacityVal <= 0
      ) {
        return;
      }

      ctx.save();

      ctx.globalAlpha = Math.max(
        0,
        Math.min(1, opacityVal)
      );

      ctx.translate(
        canvasWidth / 2,
        canvasHeight / 2
      );

      const rad =
        (angleDeg * Math.PI) / 180;

      ctx.rotate(rad);

      /*
       * Mobile-safe sizing.
       *
       * The previous calculation could become
       * visually unstable when the mobile browser
       * changes viewport height.
       */
      const maxDim = Math.min(
        canvasWidth * 0.7,
        canvasHeight * 0.7,
        450
      );

      const drawWidth =
        maxDim * scaleVal;

      const drawHeight =
        maxDim * scaleVal;

      /* ----------------------------------------
         RED GLOW
      ---------------------------------------- */

      ctx.shadowColor =
        'rgba(230, 0, 0, 0.8)';

      ctx.shadowBlur = 40;

      /* ----------------------------------------
         CIRCULAR CLIP
      ---------------------------------------- */

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        drawWidth * 0.45,
        0,
        Math.PI * 2
      );

      ctx.clip();

      /* ----------------------------------------
         DRAW IMAGE
      ---------------------------------------- */

      ctx.drawImage(
        maskImg,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();
    };

    /* ------------------------------------------
       SET CANVAS SIZE
    ------------------------------------------ */

    const resizeCanvas = () => {
      const rect =
        container.getBoundingClientRect();

      canvasWidth =
        Math.max(
          1,
          Math.round(
            rect.width ||
              window.innerWidth
          )
        );

      canvasHeight =
        Math.max(
          1,
          Math.round(
            rect.height ||
              window.innerHeight
          )
        );

      /*
       * Use devicePixelRatio for sharper
       * rendering on mobile screens.
       */
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        canvasWidth * dpr;

      canvas.height =
        canvasHeight * dpr;

      canvas.style.width =
        `${canvasWidth}px`;

      canvas.style.height =
        `${canvasHeight}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      drawMask(
        currentAngleRef.current,
        currentScaleRef.current,
        currentOpacityRef.current
      );
    };

    /* ------------------------------------------
       IMAGE LOADED
    ------------------------------------------ */

    maskImg.onload = () => {
      maskLoaded = true;

      resizeCanvas();

      drawMask(
        currentAngleRef.current,
        currentScaleRef.current,
        currentOpacityRef.current
      );
    };

    /* ------------------------------------------
       INITIAL CANVAS
    ------------------------------------------ */

    resizeCanvas();

    /* ------------------------------------------
       RESIZE HANDLER
    ------------------------------------------ */

    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        resizeCanvas();

        /*
         * Important for mobile browsers:
         * refresh ScrollTrigger after the browser
         * changes viewport dimensions.
         */
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    /*
     * Mobile browser viewport can also change
     * through orientation / visual viewport.
     */
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        'resize',
        handleResize
      );
    }

    /* ==========================================
       GSAP CONTEXT
    ========================================== */

    const ctxGsap = gsap.context(() => {

      /* ----------------------------------------
         MASTER TIMELINE
      ---------------------------------------- */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,

          start: 'top top',

          /*
           * Keep your original long cinematic
           * scrolling sequence.
           */
          end: '+=450%',

          pin: true,

          scrub: 0.6,

          /*
           * Helps when mobile browser viewport
           * dimensions change.
           */
          invalidateOnRefresh: true,

          anticipatePin: 1,

          onUpdate: (self) => {
            const prog =
              self.progress;

            setScrollProgress(prog);

            /* ----------------------------------
               VAULT SOUND
            ---------------------------------- */

            if (
              prog >= 0.55 &&
              !gateSoundPlayedRef.current
            ) {
              gateSoundPlayedRef.current = true;

              try {
                playVaultGateSound();
              } catch (error) {
                console.warn(
                  'Vault sound could not play:',
                  error
                );
              }
            }

            /* ----------------------------------
               SEQUENCE COMPLETE
            ---------------------------------- */

            if (
              prog >= 0.95 &&
              !sequenceCompletedRef.current
            ) {
              sequenceCompletedRef.current =
                true;

              /*
               * IMPORTANT:
               * Fire this only once.
               *
               * Previously this could execute
               * repeatedly on mobile.
               */
              if (
                onSequenceCompleteRef.current
              ) {
                onSequenceCompleteRef.current();
              }
            }
          },
        },
      });

      /* ========================================
         PHASE 0
         HERO LANDING
         0.00 → 0.20
      ======================================== */

      tl.fromTo(
        landingHeroRef.current,

        {
          opacity: 1,
          scale: 1,
          y: 0,
        },

        {
          opacity: 0,
          scale: 0.9,
          y: -40,
          duration: 0.20,
          ease: 'power2.out',
        },

        0
      );

      /* ========================================
         PHASE 1
         MASK APPEARS
         0.00 → 0.15
      ======================================== */

      tl.to(
        currentOpacityRef,
        {
          current: 1,
          duration: 0.15,

          onUpdate: () => {
            drawMask(
              currentAngleRef.current,
              currentScaleRef.current,
              currentOpacityRef.current
            );
          },
        },
        0
      );

      tl.to(
        currentScaleRef,
        {
          current: 1,
          duration: 0.15,

          ease: 'power2.out',

          onUpdate: () => {
            drawMask(
              currentAngleRef.current,
              currentScaleRef.current,
              currentOpacityRef.current
            );
          },
        },
        0
      );

      /* ========================================
         PHASE 2
         360° MASK ROTATION
         0.15 → 0.50
      ======================================== */

      tl.to(
        currentAngleRef,
        {
          current: 360,

          duration: 0.35,

          ease: 'none',

          onUpdate: () => {
            drawMask(
              currentAngleRef.current,
              currentScaleRef.current,
              currentOpacityRef.current
            );
          },
        },
        0.15
      );

      /* ========================================
         PHASE 3
         MASK RECEDES
         0.50 → 0.60
      ======================================== */

      tl.to(
        currentScaleRef,
        {
          current: 2.2,

          duration: 0.10,

          ease: 'power2.inOut',

          onUpdate: () => {
            drawMask(
              currentAngleRef.current,
              currentScaleRef.current,
              currentOpacityRef.current
            );
          },
        },
        0.50
      );

      tl.to(
        currentOpacityRef,
        {
          current: 0,

          duration: 0.10,

          ease: 'power2.in',

          onUpdate: () => {
            drawMask(
              currentAngleRef.current,
              currentScaleRef.current,
              currentOpacityRef.current
            );
          },
        },
        0.50
      );

      /* ========================================
         PHASE 4
         VAULT GATE APPEARS
         0.55 → 0.78
      ======================================== */

      tl.fromTo(
        [
          gateLeftRef.current,
          gateRightRef.current,
        ],

        {
          opacity: 0,
          scale: 1.1,
        },

        {
          opacity: 1,
          scale: 1,
          duration: 0.08,
          ease: 'power2.out',
        },

        0.55
      );

      /* ----------------------------------------
         LEFT DOOR
      ---------------------------------------- */

      tl.to(
        gateLeftRef.current,

        {
          xPercent: -100,
          duration: 0.18,
          ease: 'power1.inOut',
        },

        0.60
      );

      /* ----------------------------------------
         RIGHT DOOR
      ---------------------------------------- */

      tl.to(
        gateRightRef.current,

        {
          xPercent: 100,
          duration: 0.18,
          ease: 'power1.inOut',
        },

        0.60
      );

      /* ========================================
         PHASE 5
         CREW REVEAL
         0.65 → 0.85
      ======================================== */

      tl.fromTo(
        crewRef.current,

        {
          opacity: 0,

          filter:
            'blur(15px) brightness(0.1)',

          scale: 0.9,
        },

        {
          opacity: 1,

          filter:
            'blur(0px) brightness(1)',

          scale: 1,

          duration: 0.20,

          ease: 'power2.out',
        },

        0.65
      );

      /* ========================================
         PHASE 6
         FINAL TITLE / COUNTDOWN
         0.85 → 1.00
      ======================================== */

      tl.fromTo(
        titleRevealRef.current,

        {
          opacity: 0,

          y: 50,

          scale: 0.95,
        },

        {
          opacity: 1,

          y: 0,

          scale: 1,

          duration: 0.15,

          ease: 'back.out(1.4)',
        },

        0.85
      );

      /*
       * Refresh after timeline is created.
       * This is particularly useful on phones.
       */
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

    }, container);

    /* ==========================================
       CLEANUP
    ========================================== */

    return () => {
      clearTimeout(resizeTimer);

      window.removeEventListener(
        'resize',
        handleResize
      );

      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          'resize',
          handleResize
        );
      }

      ctxGsap.revert();
    };

  }, []);

  /* ==========================================
     ENTER OPERATION BUTTON
  ========================================== */

  const scrollToMain = () => {
    const mainSection =
      document.getElementById(
        'countdown-section'
      );

    if (!mainSection) return;

    /*
     * Stop the cinematic trigger from
     * interfering with the manual transition.
     */
    ScrollTrigger.getAll().forEach(
      (trigger) => {
        if (
          trigger.trigger ===
          containerRef.current
        ) {
          trigger.disable();
        }
      }
    );

    mainSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <section
      ref={containerRef}
      className="
        relative
        w-full
        h-screen
        bg-[#050505]
        overflow-hidden
        flex
        items-center
        justify-center
        select-none
      "
    >

      {/* ======================================
          AMBIENT VIGNETTE
      ====================================== */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]
          pointer-events-none
          z-20
        "
      />

      <div
        className="
          film-grain
          absolute
          inset-0
          pointer-events-none
          z-20
          opacity-40
        "
      />

      {/* ======================================
          RED SPOTLIGHT
      ====================================== */}

      <div
        className="
          absolute
          w-[500px]
          h-[500px]
          bg-red-600/20
          rounded-full
          blur-[140px]
          pointer-events-none
          transition-all
          duration-700
          z-0
        "
        style={{
          opacity:
            scrollProgress > 0.1
              ? Math.min(
                  1,
                  scrollProgress * 1.5
                )
              : 0,
        }}
      />

      {/* ======================================
          MASK CANVAS
      ====================================== */}

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          w-full
          h-full
          z-20
          pointer-events-none
        "
      />

      {/* ======================================
          VAULT GATES
      ====================================== */}

      <div
        className="
          absolute
          inset-0
          z-30
          pointer-events-none
          flex
          overflow-hidden
        "
      >

        {/* LEFT VAULT DOOR */}

        <div
          ref={gateLeftRef}
          className="
            relative
            w-1/2
            h-full
            overflow-hidden
            border-r-2
            border-red-600/50
            shadow-2xl
            opacity-0
          "
          style={{
            backgroundImage:
              "url('/assets/heist_vault_gate.jpg')",

            backgroundSize:
              '200% 100%',

            backgroundPosition:
              'left center',

            backgroundRepeat:
              'no-repeat',
          }}
        >

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/80
              via-transparent
              to-red-950/40
            "
          />

          <div
            className="
              absolute
              right-3
              sm:right-4
              top-1/2
              -translate-y-1/2
              flex
              flex-col
              gap-3
            "
          >
            <span
              className="
                w-2
                h-2
                bg-red-600
                rounded-full
                animate-ping
              "
            />

            <span
              className="
                w-2
                h-16
                bg-red-600/80
                rounded
              "
            />
          </div>
        </div>

        {/* RIGHT VAULT DOOR */}

        <div
          ref={gateRightRef}
          className="
            relative
            w-1/2
            h-full
            overflow-hidden
            border-l-2
            border-red-600/50
            shadow-2xl
            opacity-0
          "
          style={{
            backgroundImage:
              "url('/assets/heist_vault_gate.jpg')",

            backgroundSize:
              '200% 100%',

            backgroundPosition:
              'right center',

            backgroundRepeat:
              'no-repeat',
          }}
        >

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-l
              from-black/80
              via-transparent
              to-red-950/40
            "
          />

          <div
            className="
              absolute
              left-3
              sm:left-4
              top-1/2
              -translate-y-1/2
              flex
              flex-col
              gap-3
            "
          >
            <span
              className="
                w-2
                h-2
                bg-red-600
                rounded-full
                animate-ping
              "
            />

            <span
              className="
                w-2
                h-16
                bg-red-600/80
                rounded
              "
            />
          </div>
        </div>

      </div>

      {/* ======================================
          CREW REVEAL
      ====================================== */}

      <div
        ref={crewRef}
        className="
          absolute
          inset-0
          z-10
          opacity-0
          flex
          items-center
          justify-center
        "
      >

        <img
          src="/assets/heist_crew_reveal.jpg"
          alt="CYBERPUNK Heist Crew"
          className="
            w-full
            h-full
            object-cover
            object-center
            filter
            contrast-125
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#050505]
            via-transparent
            to-[#050505]/70
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#050505]
            via-transparent
            to-[#050505]
          "
        />

      </div>

      {/* ======================================
          OPENING HERO
      ====================================== */}

      <div
        ref={landingHeroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="
          absolute
          inset-0
          z-50
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-4
          pointer-events-auto
          cursor-pointer
          select-none
        "
      >

        {/* CYBER | PUNK */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-1
            sm:gap-2
            md:gap-3
            mb-3
            sm:mb-4
            relative
          "
        >

          {/* CYBER */}

          <span
            className="
              font-compacta
              text-[clamp(3.5rem,10vw,8.5rem)]
              tracking-wider
              uppercase
              leading-none
              font-bold
              drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]
            "
            style={
              goldSheenX !== null
                ? {
                    backgroundImage:
                      `linear-gradient(
                        90deg,
                        #ffffff 0%,
                        #ffffff ${Math.max(
                          0,
                          goldSheenX - 25
                        )}%,
                        #ffd700 ${Math.max(
                          0,
                          goldSheenX - 8
                        )}%,
                        #fff9b8 ${goldSheenX}%,
                        #d4af37 ${Math.min(
                          100,
                          goldSheenX + 8
                        )}%,
                        #ffffff ${Math.min(
                          100,
                          goldSheenX + 25
                        )}%,
                        #ffffff 100%
                      )`,

                    WebkitBackgroundClip:
                      'text',

                    WebkitTextFillColor:
                      'transparent',
                  }
                : {
                    color: '#ffffff',
                  }
            }
          >
            CYBER
          </span>

          {/* RED DIVIDER */}

          <div
            className="
              w-[4px]
              sm:w-[6px]
              md:w-[8px]
              h-[clamp(2.5rem,7.5vw,6.5rem)]
              bg-red-600
              rounded-sm
              relative
              -top-[2px]
              sm:-top-[4px]
            "
          />

          {/* PUNK */}

          <div
            className="
              bg-red-600
              px-3
              sm:px-6
              md:px-8
              py-0.5
              sm:py-1
              rounded-sm
              shadow-[0_0_35px_rgba(230,0,0,0.7)]
              border
              border-red-500
              flex
              items-center
              justify-center
            "
          >

            <span
              className="
                font-compacta
                text-[clamp(3.5rem,10vw,8.5rem)]
                tracking-wider
                uppercase
                leading-none
                font-bold
              "
              style={
                goldSheenX !== null
                  ? {
                      backgroundImage:
                        `linear-gradient(
                          90deg,
                          #ffffff 0%,
                          #ffffff ${Math.max(
                            0,
                            goldSheenX - 25
                          )}%,
                          #ffd700 ${Math.max(
                            0,
                            goldSheenX - 8
                          )}%,
                          #fff9b8 ${goldSheenX}%,
                          #d4af37 ${Math.min(
                            100,
                            goldSheenX + 8
                          )}%,
                          #ffffff ${Math.min(
                            100,
                            goldSheenX + 25
                          )}%,
                          #ffffff 100%
                        )`,

                      WebkitBackgroundClip:
                        'text',

                      WebkitTextFillColor:
                        'transparent',
                    }
                  : {
                      color: '#ffffff',
                    }
              }
            >
              PUNK
            </span>

          </div>

        </div>

        {/* DATE */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-3
            sm:gap-4
          "
        >

          <div
            className="
              h-[2px]
              w-8
              sm:w-16
              md:w-24
              bg-gradient-to-r
              from-transparent
              to-red-600
            "
          />

          <p
            className="
              font-compacta
              text-[clamp(1.2rem,3.5vw,2.5rem)]
              text-red-600
              tracking-[0.25em]
              sm:tracking-[0.35em]
              font-bold
              uppercase
              leading-none
              drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]
            "
          >
            10 SEPTEMBER
          </p>

          <div
            className="
              h-[2px]
              w-8
              sm:w-16
              md:w-24
              bg-gradient-to-l
              from-transparent
              to-red-600
            "
          />

        </div>

      </div>

      {/* ======================================
          FINAL OPERATION
      ====================================== */}

      <div
        ref={titleRevealRef}
        className="
          absolute
          inset-0
          z-40
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-4
          opacity-0
          pointer-events-auto
        "
      >

        <Countdown isEmbedded={true} />

        <button
          onClick={scrollToMain}
          className="
            group
            relative
            inline-flex
            items-center
            justify-center
            px-8
            sm:px-12
            py-4
            bg-red-600
            hover:bg-red-700
            text-white
            font-compacta
            text-2xl
            sm:text-3xl
            tracking-widest
            rounded-none
            border
            border-red-500
            shadow-[0_0_30px_rgba(230,0,0,0.6)]
            transition-all
            duration-300
            transform
            hover:scale-105
            active:scale-95
            cursor-pointer
          "
        >

          <span
            className="
              absolute
              inset-0
              w-full
              h-full
              bg-white/20
              transform
              -skew-x-12
              -translate-x-full
              group-hover:translate-x-full
              transition-transform
              duration-700
            "
          />

          <span
            className="
              relative
              flex
              items-center
              gap-3
            "
          >

            ENTER THE OPERATION

            <svg
              className="
                w-6
                h-6
                animate-bounce
              "
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

      {/* ======================================
          SCROLL GUIDANCE
      ====================================== */}

      {scrollProgress < 0.85 && (
        <div
          className="
            absolute
            bottom-8
            z-40
            flex
            flex-col
            items-center
            text-gray-400
            font-mono-cyber
            text-xs
            tracking-widest
            animate-pulse
          "
        >

          <span
            className="
              text-red-500
              font-bold
              mb-1
            "
          >
            SCROLL TO UNLOCK THE HEIST
          </span>

          <div
            className="
              w-5
              h-8
              border-2
              border-red-600/60
              rounded-full
              flex
              items-start
              justify-center
              p-1
            "
          >

            <div
              className="
                w-1.5
                h-2
                bg-red-600
                rounded
                transition-all
                duration-200
              "
              style={{
                transform:
                  `translateY(${Math.min(
                    16,
                    scrollProgress * 20
                  )}px)`,
              }}
            />

          </div>

        </div>
      )}

    </section>
  );
};

export default CinematicSequence;