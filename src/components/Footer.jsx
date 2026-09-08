import React from 'react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <footer className="relative bg-[#050505] text-white border-t border-red-900/50 overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-red-600/10 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.5) 1px, transparent 1px)',
            backgroundSize: '45px 45px',
          }}
        />

      </div>


      {/* Top red line */}
      <div className="relative h-[2px] bg-red-600 shadow-[0_0_15px_rgba(230,0,0,0.8)]" />


      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-14">


        {/* =====================================================
            MAIN FOOTER GRID
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">


          {/* =================================================
              BRAND
          ================================================= */}

          <div>

            <div className="flex items-center gap-2 mb-5">

              <span className="font-bebas text-3xl tracking-wider text-white">
                CYBER
              </span>

              <span className="text-red-600 text-3xl font-bold">
                |
              </span>

              <span className="bg-red-600 px-2 py-1 rounded-sm font-bebas text-3xl tracking-wider text-white shadow-[0_0_20px_rgba(230,0,0,0.4)]">
                PUNK
              </span>

            </div>


            <p className="font-mono-cyber text-xs text-gray-500 leading-relaxed">
              • CLASSIFIED EVENT NETWORK
              <br />
              • CYBERPUNK 2K26
              <br />
              • ACCESS GRANTED
            </p>


            <div className="mt-6 flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(230,0,0,0.9)]" />

              <span className="font-mono-cyber text-[10px] tracking-widest text-red-500">
                SYSTEM ONLINE
              </span>

            </div>

          </div>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div>

            <h3 className="font-bebas text-2xl tracking-widest text-white mb-6">
              NAVIGATION
            </h3>


            <div className="space-y-3">

              <button
                type="button"
                onClick={() => scrollToTop()}
                className="block font-mono-cyber text-sm text-gray-500 hover:text-red-500 hover:translate-x-1 transition-all duration-200"
              >
                HOME
              </button>


              <button
                type="button"
                onClick={() => scrollToSection('events-section')}
                className="block font-mono-cyber text-sm text-gray-500 hover:text-red-500 hover:translate-x-1 transition-all duration-200"
              >
                EVENTS
              </button>


              <button
                type="button"
                onClick={() => scrollToSection('crew')}
                className="block font-mono-cyber text-sm text-gray-500 hover:text-red-500 hover:translate-x-1 transition-all duration-200"
              >
                CREW
              </button>


              <button
                type="button"
                onClick={() => {
                  window.location.href = '/gallery';
                }}
                className="block font-mono-cyber text-sm text-gray-500 hover:text-red-500 hover:translate-x-1 transition-all duration-200"
              >
                GALLERY
              </button>


              <button
                type="button"
                onClick={() => {
                  window.location.href = '/registration';
                }}
                className="block font-mono-cyber text-sm text-gray-500 hover:text-red-500 hover:translate-x-1 transition-all duration-200"
              >
                REGISTER
              </button>

            </div>

          </div>


          {/* =================================================
              EVENT INFORMATION
          ================================================= */}

          <div>

            <h3 className="font-bebas text-2xl tracking-widest text-white mb-6">
              EVENT INTEL
            </h3>


            <div className="space-y-4">

              <div>

                <p className="font-mono-cyber text-[10px] text-red-500 tracking-widest">
                  EVENT
                </p>

                <p className="font-mono-cyber text-sm text-gray-400 mt-1">
                  CYBERPUNK 2k26
                </p>

              </div>


              <div>

                <p className="font-mono-cyber text-[10px] text-red-500 tracking-widest">
                  DATE
                </p>

                <p className="font-mono-cyber text-sm text-gray-400 mt-1">
                  10 SEPTEMBER 2k26
                </p>

              </div>


              <div>

                <p className="font-mono-cyber text-[10px] text-red-500 tracking-widest">
                  ORGANIZED BY
                </p>

                <p className="font-mono-cyber text-sm text-gray-400 mt-1">
                  COMPUTER SCIENCE ENGINEERING ( CYBER SECURITY )
                </p>

              </div>


              <div>

                <p className="font-mono-cyber text-[10px] text-red-500 tracking-widest">
                  LOCATION
                </p>

                <p className="font-mono-cyber text-sm text-gray-400 mt-1">
                  ST.VINCENT PALLOTTI COLLEGE OF ENGINEERING AND TECHNOLOGY
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              CONTACT
          ================================================= */}

          <div>

            <h3 className="font-bebas text-2xl tracking-widest text-white mb-6">
              CONTACT HQ
            </h3>


            <p className="font-mono-cyber text-xs text-gray-500 leading-relaxed mb-5">
              Need assistance with registration,
              events or the operation?
              Contact the event command center.
            </p>


            <div className="mt-7">

  <p className="font-mono-cyber text-[10px] text-red-500 tracking-widest mb-3">
    SOCIAL NETWORK
  </p>

  <a
    href="https://www.instagram.com/cyberpunk_2k26?stkn=MWV2YzRkejB4NWJ2cw=="
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Cyberpunk Instagram"
    className="
      group
      relative
      inline-flex
      items-center
      justify-center
      w-12
      h-12
      rounded-xl
      border
      border-zinc-800
      bg-black
      transition-all
      duration-300
      hover:border-red-500
      hover:scale-110
      hover:shadow-[0_0_25px_rgba(230,0,0,0.5)]
    "
  >

    {/* Instagram Logo */}

    <svg
      viewBox="0 0 24 24"
      className="
        w-7
        h-7
        transition-all
        duration-300
        group-hover:scale-110
      "
      aria-hidden="true"
    >

      <defs>

        <linearGradient
          id="instagramGradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#ffdc80" />
          <stop offset="25%" stopColor="#fcaf45" />
          <stop offset="50%" stopColor="#f77737" />
          <stop offset="75%" stopColor="#e1306c" />
          <stop offset="100%" stopColor="#833ab4" />
        </linearGradient>

      </defs>


      {/* Instagram outer body */}

      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="url(#instagramGradient)"
      />


      {/* Camera outline */}

      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        rx="3"
        fill="none"
        stroke="white"
        strokeWidth="1.6"
      />


      {/* Camera lens */}

      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="none"
        stroke="white"
        strokeWidth="1.6"
      />


      {/* Camera flash */}

      <circle
        cx="16.5"
        cy="7.5"
        r="1"
        fill="white"
      />

    </svg>


    {/* Red hover glow */}

    <span
      className="
        absolute
        inset-0
        rounded-xl
        bg-red-600/0
        group-hover:bg-red-600/5
        transition-all
        duration-300
      "
    />

  </a>

</div>

          </div>

        </div>


        {/* =====================================================
            DIVIDER
        ===================================================== */}

        <div className="border-t border-zinc-900 mt-12 pt-6">


          <div className="flex flex-col md:flex-row items-center justify-between gap-4">


            <p className="font-mono-cyber text-[10px] sm:text-xs text-zinc-600 tracking-wider text-center md:text-left">
              © 2k26 CYBERPUNK // CSE(CS) // All Fee paid are NON REFUNDABLE <br/>

              Showrunners-
              Technical head- Sanika Patrikar<br/>
              Technical Co-Head - Ved Korde
            </p>


            <div className="flex items-center gap-5">

                <span className="text-zinc-800">
                |
              </span>


              <button
                type="button"
                onClick={scrollToTop}
                className="ml-2 w-9 h-9 border border-zinc-800 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-600 transition-all"
              >
                ↑
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          TERMINAL FOOTER BAR
      ===================================================== */}

      <div className="border-t border-zinc-900 bg-black py-3">

        <p className="font-mono-cyber text-[9px] sm:text-[10px] text-zinc-700 tracking-[0.2em] text-center">
          [ CONNECTION SECURE // OPERATION CYBERPUNK COMPLETE ]
        </p>

      </div>

    </footer>
  );
};

export default Footer;