import React from 'react';
import { Globe, Code2, Share2, ShieldCheck } from 'lucide-react';


const crewMembers = [
  {
    name: 'Aditya Jadhav',
    codename: 'Coordinator',
    image: '/assets/crew/Aditya.jpg',
    bio: 'Architect behind the CYBERPUNK 2026 operation blueprint and system architecture.',
    socials: { linkedin: '#', insta: '#',  },
  },
  {
    name: 'BERLIN',
    role: 'HEAD OF SECURITY & INFRA',
    codename: 'RED TEAM LEAD',
    image: '/assets/heist_dali_mask.jpg',
    bio: 'Commanding tactical defense networks and physical vault entry protocols.',
    socials: { linkedin: '#', insta: '#',  },
  },
  {
    name: 'TOKYO',
    role: 'CREATIVE & EXPERIENCE LEAD',
    codename: 'CINEMATIC DIRECTOR',
    image: '/assets/heist_dali_mask.jpg',
    bio: 'Leading the front-end visual storytelling and immersive scroll animations.',
    socials: { linkedin: '#', insta: '#',  },
  },
  {
    name: 'NAIROBI',
    role: 'LOGISTICS & OPERATIONS',
    codename: 'RESOURCE CONTROLLER',
    image: '/assets/heist_dali_mask.jpg',
    bio: 'Managing event allocations, prize distribution, and multi-venue coordination.',
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
  },
];

const Crew = () => {
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

        {/* Crew Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {crewMembers.map((member) => (
            <div
              key={member.name}
              className="group relative bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(230,0,0,0.3)] hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Image / Avatar Container */}
              <div className="relative h-64 w-full bg-zinc-900 overflow-hidden">
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
                <p className="font-mono-cyber text-xs text-red-500 font-bold mb-1">
                  {member.codename}
                </p>
                <h3 className="font-bebas text-3xl tracking-wider text-white group-hover:text-red-500 transition-colors mb-1">
                  {member.name}
                </h3>
                <p className="font-mono-cyber text-xs text-gray-400 mb-3">
                  {member.role}
                </p>
                <p className="text-gray-400 text-xs line-clamp-2 mb-6">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                  <a
                    href={member.socials.linkedin}
                    className="p-2 bg-zinc-900 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Operative Profile"
                  >
                    <Globe size={16} />
                  </a>
                  <a
                    href={member.socials.github}
                    className="p-2 bg-zinc-900 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Code Repository"
                  >
                    <Code2 size={16} />
                  </a>
                  <a
                    href={member.socials.twitter}
                    className="p-2 bg-zinc-900 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Dispatch Channel"
                  >
                    <Share2 size={16} />
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Crew;
