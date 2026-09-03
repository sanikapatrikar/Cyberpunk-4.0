import React, { useState } from 'react';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const crewMembers = [
  {

    

    name: 'VEDANT GHUBADE',
    role: 'Mentor',
    
    image: '/assets/vedant.jpg', 
    
    socials: { 
      linkedin: 'https://www.linkedin.com/in/vedant-ghubade-96b734273?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
      instagram: 'https://www.instagram.com/vedant11054?igsi=aWx1ZnJ1OGg0dGI3' 
    },

  },
  {
    name: 'WANSH KUMBHALKAR',
    role: 'Mentor',
    image: '/assets/wansh.jpg',
    
    socials: { 
      linkedin: 'https://www.linkedin.com/in/wansh-kumbhalkar-85b97b280?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
      instagram: 'https://www.instagram.com/wansh_kumbhalkar?igsi=MWIyMjY5Mjg1MG5zcw==' 
    },
  },
  {
    name: 'ANSHUL VAIRAGADE',
    role: 'Mentor',
    
    image: '/assets/anshul.jpg',
    

    socials: { linkedin: '#', insta: '#',  },

    socials: { 
      linkedin: 'https://www.linkedin.com/in/anshul-vairagade-15582b201?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
      instagram: 'https://www.instagram.com/anshull.dev?igsi=MTJ5djR5ejh0MXVtag==' 
    },

  },
  {
    name: 'TANUSH BAMNOTE',
    role: 'Mentor',
    
    image: '/assets/tanush.jpg',

    socials: { linkedin: '#', insta: '#',  },

    socials: { 
      linkedin: 'https://www.linkedin.com/in/tanush-bamnote?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
      instagram: 'https://www.instagram.com/thenooshyyyt?igsi=d3BjN2M5a21rbGx2' 
    },
  },
  {
    name: 'TEJAS DONGRE',
    role: 'Mentor',
    
    image: '/assets/tejas.jpg',

    socials: { linkedin: '#', insta: '#',  },

    socials: { 
      linkedin: 'https://www.linkedin.com/in/tejas-dongre-0830b5322?utm_source=share_via&utm_content=profile&utm_medium=member_android', 
      instagram: 'https://www.instagram.com/tejas_dongre_09?igsi=MTY4cHJ6NTFkbms4bg==' 
    },
  },
  {
    name: 'VEDANT SAYARE',
    role: 'Mentor',
    
    image: '/assets/VedantS.jpg',
    

    socials: { linkedin: '#', insta: '#',  },

    socials: { 
      linkedin: 'https://www.linkedin.com/in/vedantsayare/', 
      instagram: 'https://www.instagram.com/sayare_vedant?igsi=MTBpa3llaW84bTJvNA==' 
    },

  },
  
];


// nweeww
// =====================================================
// NEW CORE CREW FROM DEVELOPMENT BRANCH
// =====================================================

const coreCrewMembers = [
  {
    name: 'Aditya Jadhav',
    role: 'Coordinator',
    image: '/core_team_images/Aditya Jadhav (Coordinator).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/aditya-jadhav-b7463030b',
      instagram: 'https://www.instagram.com/aditya_jadhav15',
    },
  },

  {
    name: 'Sana Sheware',
    role: 'Co-Coordinator',
    image: '/core_team_images/Sana Sheware (Co-Coordinator).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/sana-sheware-4561ba332',
      instagram: 'https://www.instagram.com/sana_r_sheware',
    },
  },

  {
    name: 'Ketan Mahant',
    role: 'Co-Coordinator',
    image: '/core_team_images/Ketan Mahant (Co-Coordinator).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ketan-mahant-50a029386/',
      instagram: 'https://www.instagram.com/ketan_mahant/',
    },
  },

  {
    name: 'Sanika Patrikar',
    role: 'Technical Head',
    image: '/core_team_images/Sanika Patrikar (Technical Head).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/sanika-patrikar-4a3456331',
      instagram: 'https://www.instagram.com/patrikar.sanikaa',
    },
  },

  {
    name: 'Ved Korde',
    role: 'Technical Co-Head',
    image: '/core_team_images/Ved Korde (Technical Co-Head).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/vedkorde19',
      instagram: 'https://www.instagram.com/ved_korde',
    },
  },

  {
    name: 'Harsha Rokade',
    role: 'Finance Head',
    image: '/core_team_images/Harsha Rokade (Finance Head).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/harsha-rokade-41b477339',
      instagram: 'https://www.instagram.com/harshaa_rokade',
    },
  },

  {
    name: 'Harshada Thakre',
    role: 'Registration Head',
    image: '/core_team_images/Harshada Thakre (Registration Head).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/harshada-thakre-8b4273322',
      instagram: 'https://www.instagram.com/ha_rshada016',
    },
  },

  {
    name: 'Lokeshni Burde',
    role: 'Registration Co-Head',
    image: '/core_team_images/Lokeshni Burde (Registration Co_Head).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/lokeshni-burde-33a6792b4',
      instagram: 'https://www.instagram.com/_lokeshni.burde_',
    },
  },
  {
    name: 'Vidhi Ayalwar',
    role: 'Documentation Head',
    image: '/core_team_images/Vidhi Ayalwar (Documentation Head).jpeg',
    socials: {
      linkedin: 'https://www.linkedin.com/in/vidhi-ayalwar-491470330',
      instagram: 'https://www.instagram.com/vidhi_2803',
    },
  },

  {
    name: 'Ayush Malvi',
    role: 'Management Head',
    image: '/core_team_images/Ayush Malvi (Management Head).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ayush-malvi-54647636a',
      instagram: 'https://www.instagram.com/ayushhm_01',
    },
  },

  {
    name: 'Anushka Waldekar',
    role: 'Media Head',
    image: '/core_team_images/Anushka Waldekar (Media Head).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/anushka-waldekar-036a8a399',
      instagram: 'https://www.instagram.com/_anu.shkaaa',
    },
  },

  {
    name: 'Trishti More',
    role: 'Promotion Head',
    image: '/core_team_images/Trishti More (Promotion Head).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/trishti-more-50a483331',
      instagram: 'https://www.instagram.com/thatthickchick.__',
    },
  },

  {
    name: 'Jagruti Chore',
    role: 'Promotion Co-Head',
    image: '/core_team_images/Jagruti Chore (Promotion Co-Head).png',
    socials: {
      linkedin: 'https://www.linkedin.com/in/jagruti-chore-895839360/',
      instagram: 'https://www.instagram.com/jagrutiiiii25/',
    },
  },

  
];


//end

const Crew = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeMember, setActiveMember] = useState(null);

const toggleMemberActive = (name) => {
  setActiveMember((prev) =>
    prev === name ? null : name
  );
};



 const prevCard = () => {
  setActiveMember(null);
  setCurrentIndex((prevIndex) =>
    prevIndex === 0 ? crewMembers.length - 1 : prevIndex - 1
  );
};

const nextCard = () => {
  setActiveMember(null);
  setCurrentIndex((prevIndex) =>
    prevIndex === crewMembers.length - 1 ? 0 : prevIndex + 1
  );
};

  const member = crewMembers[currentIndex];
  const isActive = activeMember === member.name;

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

          <div
  onClick={() => toggleMemberActive(member.name)}
  className={`w-full max-w-sm group relative bg-zinc-950 border rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col justify-between cursor-pointer ${
    activeMember === member.name
      ? 'border-red-600 shadow-[0_0_30px_rgba(230,0,0,0.3)] -translate-y-2'
      : 'border-zinc-800 hover:border-red-600 hover:shadow-[0_0_30px_rgba(230,0,0,0.3)]'
  }`}
>
            
          {/* Image / Avatar Container */}
<div className="relative h-72 w-full bg-zinc-900 overflow-hidden">

  <img
    src={member.image}
    alt={member.name}
    className={`w-full h-full object-cover object-center transition-all duration-500 filter contrast-125 ${
      activeMember === member.name
        ? "scale-105 grayscale-0"
        : "grayscale group-hover:grayscale-0 group-hover:scale-105"
    }`}
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
             <h3
  className={`font-bebas text-3xl tracking-wider transition-colors mb-1 text-center ${
    activeMember === member.name
      ? 'text-red-500'
      : 'text-white group-hover:text-red-500'
  }`}

>
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

{/* =====================================================
    NEW CORE CREW SECTION
    ADDED FROM DEVELOPMENT BRANCH
===================================================== */}

<div className="mt-32">

  {/* NEW CREW HEADING */}

  <div className="text-center mb-16">

    <p className="font-mono-cyber text-red-500 text-sm tracking-widest uppercase mb-2">
      // OPERATIVES BEHIND THE OPERATION
    </p>

    <h2 className="font-bebas text-5xl sm:text-7xl tracking-widest">
      CORE{' '}
      <span className="text-red-600 text-glow-red">
        CREW
      </span>
    </h2>

  </div>

  {/* NEW CREW CARDS */}

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

    {coreCrewMembers.map((member) => {

      const isActive = activeMember === member.name;

      return (
        <div
          key={member.name}
          onClick={() => toggleMemberActive(member.name)}
          className={`group relative bg-zinc-950 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer ${
            isActive
              ? 'border-red-600 shadow-[0_0_30px_rgba(230,0,0,0.3)] -translate-y-2'
              : 'border-zinc-800 hover:border-red-600 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(230,0,0,0.3)] hover:-translate-y-2'
          }`}
        >

          {/* MEMBER IMAGE */}

          <div className="relative h-72 w-full bg-zinc-900 overflow-hidden">

            <img
              src={member.image}
              alt={member.name}
              className={`w-full h-full object-cover object-top transition-transform duration-500 filter contrast-110 ${
                isActive
                  ? 'scale-105 grayscale-0'
                  : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

            {/* VERIFIED CREW */}

            <span className="absolute top-3 right-3 bg-red-950/80 border border-red-600/60 text-red-400 font-mono-cyber text-[10px] px-2.5 py-1 rounded-md tracking-widest flex items-center gap-1">

              <ShieldCheck size={12} />

              VERIFIED CREW

            </span>

          </div>

          {/* MEMBER INFORMATION */}

          <div className="p-6 flex flex-col justify-between flex-1">

            <div>

              <p className="font-mono-cyber text-xs text-red-500 font-bold mb-1 tracking-wider uppercase">
                // {member.role}
              </p>

              <h3
                className={`font-bebas text-3xl tracking-wider transition-colors mb-1 ${
                  isActive
                    ? 'text-red-500'
                    : 'text-white group-hover:text-red-500'
                }`}
              >
                {member.name}
              </h3>

              <p className="font-mono-cyber text-xs text-gray-400 mb-4">
                {member.role}
              </p>

            </div>

            {/* SOCIAL LINKS */}

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">

              {/* LINKEDIN */}

              {member.socials.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-zinc-900 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title={`${member.name} LinkedIn Profile`}
                  aria-label={`${member.name} LinkedIn Profile`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2v7h-4v-7a6 6 0 0 1 6-6z" />

                    <rect
                      width="4"
                      height="12"
                      x="2"
                      y="9"
                    />

                    <circle
                      cx="4"
                      cy="4"
                      r="2"
                    />
                  </svg>
                </a>
              )}

              {/* INSTAGRAM */}

              {member.socials.instagram && (
                <a
                  href={member.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-zinc-900 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title={`${member.name} Instagram Profile`}
                  aria-label={`${member.name} Instagram Profile`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      width="20"
                      height="20"
                      x="2"
                      y="2"
                      rx="5"
                      ry="5"
                    />

                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />

                    <line
                      x1="17.5"
                      x2="17.51"
                      y1="6.5"
                      y2="6.5"
                    />
                  </svg>
                </a>
              )}

            </div>

          </div>

        </div>
      );
    })}

  </div>

</div>

    </section>




  );
};

export default Crew;