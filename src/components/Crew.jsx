import React, { useState } from 'react';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const crewMembers = [
  {
<<<<<<< HEAD
    
=======
    name: 'VEDANT GHUBADE',
    role: 'TECHNICAL HEAD',
    codename: 'CORE TEAM',
    image: '/assets/vedant.jpg', 
    bio: 'Commanding tactical defense networks and physical vault entry protocols.',
    socials: { 
      linkedin: 'https://www.linkedin.com/in/vedant-ghubade-96b734273?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
      instagram: 'https://www.instagram.com/vedant11054?igsi=aWx1ZnJ1OGg0dGI3' 
    },
>>>>>>> origin/core-team-update
  },
  {
    name: 'WANSH KUMBHALKAR',
    role: 'TECHNICAL TEAM',
    codename: 'CORE TEAM',
    image: '/assets/wansh.jpg',
    bio: 'Architect behind the CYBERPUNK 2026 operation blueprint and system architecture.',
    socials: { 
      linkedin: 'https://www.linkedin.com/in/wansh-kumbhalkar-85b97b280?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
      instagram: 'https://www.instagram.com/wansh_kumbhalkar?igsi=MWIyMjY5Mjg1MG5zcw==' 
    },
  },
  {
    name: 'ANSHUL VAIRAGADE',
    role: 'TECHNICAL TEAM',
    codename: 'CORE TEAM',
    image: '/assets/anshul.jpg',
    bio: 'Leading the front-end visual storytelling and immersive scroll animations.',
<<<<<<< HEAD
    socials: { linkedin: '#', insta: '#',  },
=======
    socials: { 
      linkedin: 'https://www.linkedin.com/in/anshul-vairagade-15582b201?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
      instagram: 'https://www.instagram.com/anshull.dev?igsi=MTJ5djR5ejh0MXVtag==' 
    },
>>>>>>> origin/core-team-update
  },
  {
    name: 'TANUSH BAMNOTE',
    role: 'TECHNICAL TEAM',
    codename: 'CORE TEAM',
    image: '/assets/tanush.jpg',
    bio: 'Managing event allocations, prize distribution, and multi-venue coordination.',
<<<<<<< HEAD
    socials: { linkedin: '#', insta: '#',  },
  },
   {
    name: 'Aditya Jadhav',
    role: 'Coordinator',
    image: '/assets/heist_dali_mask.jpg',
    bio: 'Architect behind the CYBERPUNK 2026 operation blueprint and system architecture.',
    socials: { linkedin: '#', insta: '#',  },
  },
   {
    name: 'Aditya Jadhav',
    role: 'Coordinator',
    image: '/assets/heist_dali_mask.jpg',
    bio: 'Architect behind the CYBERPUNK 2026 operation blueprint and system architecture.',
    socials: { linkedin: '#', insta: '#',  },
=======
    socials: { 
      linkedin: 'https://www.linkedin.com/in/tanush-bamnote?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
      instagram: 'https://www.instagram.com/thenooshyyyt?igsi=d3BjN2M5a21rbGx2' 
    },
>>>>>>> origin/core-team-update
  },
];

const Crew = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? crewMembers.length - 1 : prevIndex - 1));
  };

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex === crewMembers.length - 1 ? 0 : prevIndex + 1));
  };

  const member = crewMembers[currentIndex];

  return (
    <section id="crew-section" className="relative py-24 bg-[#050505] text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-mono-cyber text-red-500 text-sm tracking-widest uppercase mb-2">
            // MASTERMINDS BEHIND THE OPERATION
          </p>
          <h2 className="font-bebas text-5xl sm:text-7xl tracking-widest">
            THE <span className="text-red-600 text-glow-red">HEIST CREW</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          
          <button 
            onClick={prevCard} 
            className="p-3 bg-zinc-900 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(230,0,0,0.2)] hover:shadow-[0_0_20px_rgba(230,0,0,0.6)]"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="w-full max-w-sm group relative bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(230,0,0,0.3)] flex flex-col justify-between">
            
            {/* Image / Avatar Container */}
            <div className="relative h-72 w-full bg-zinc-900 overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 filter contrast-125 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <span className="absolute top-3 right-3 bg-red-950/80 border border-red-600/60 text-red-400 font-mono-cyber text-[10px] px-2.5 py-1 rounded-md tracking-widest flex items-center gap-1">
                <ShieldCheck size={12} />
                VERIFIED CREW
              </span>
            </div>

            {/* Info Container */}
            <div className="p-6">
              <p className="font-mono-cyber text-xs text-red-500 font-bold mb-1 text-center">
                {member.codename}
              </p>
              <h3 className="font-bebas text-3xl tracking-wider text-white group-hover:text-red-500 transition-colors mb-1 text-center">
                {member.name}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-3 mb-6 min-h-[60px] text-center">
                {member.bio}
              </p>

              {/* Glowing Social Links & Role Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-zinc-800">
                <a
                  href={member.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
                  title="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                
                <span className="font-mono-cyber text-sm text-gray-300 font-semibold tracking-wider">
                  {member.role}
                </span>

                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#0077b5] text-white rounded-xl shadow-[0_0_15px_rgba(0,119,181,0.5)] hover:shadow-[0_0_25px_rgba(0,119,181,0.8)] hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
                  title="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <button 
            onClick={nextCard} 
            className="p-3 bg-zinc-900 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(230,0,0,0.2)] hover:shadow-[0_0_20px_rgba(230,0,0,0.6)]"
          >
            <ChevronRight size={32} />
          </button>

        </div>
      </div>
    </section>
  );
};

export default Crew;