import React, { useState } from 'react';
import { Terminal, Shield, Cpu, Zap, Trophy, Clock, Users, ArrowRight, X } from 'lucide-react';
import { playHeistClickSound } from '../utils/audio';

const eventsData = [
  {
    id: 'cyber-hack',
    title: 'CODE HEIST: ALGORITHM VAULT',
    category: 'Coding & Hacking',
    icon: Terminal,
    date: '10 SEPT // 10:00 AM',
    prize: '$2,500 PRIZE POOL',
    team: '1-3 Members',
    shortDesc: 'Crack high-security algorithmic encrypted vaults under extreme timed pressure.',
    fullDesc: 'Participants act as elite heist programmers tasked with bypassing multi-layer cybersecurity firewalls, decrypting quantum ciphers, and retrieving master cryptographic keys.',
    rules: [
      'Bring your own development machine.',
      'Languages permitted: C++, Python, JavaScript, Rust, Go.',
      'Plagiarism or automated AI code generation bots will cause immediate lockdown.',
    ],
  },
  {
    id: 'ai-arena',
    title: 'THE PROFESSOR’S AI NEURAL ARENA',
    category: 'AI & Gaming',
    icon: Cpu,
    date: '10 SEPT // 01:30 PM',
    prize: '$3,000 PRIZE POOL',
    team: '1-4 Members',
    shortDesc: 'Deploy autonomous LLM agents to orchestrate or defend against simulated high-stakes bank heists.',
    fullDesc: 'Build, fine-tune, and prompt-engineer AI neural network agents competing head-to-head in real-time strategic heist scenario simulations.',
    rules: [
      'API access keys provided at commencement.',
      'Agents evaluated on latency, decision accuracy, and stealth evasion score.',
    ],
  },
  {
    id: 'cyber-ctf',
    title: 'RED TEAM CYBER CAPTURE THE FLAG',
    category: 'Coding & Hacking',
    icon: Shield,
    date: '10 SEPT // 03:00 PM',
    prize: '$2,000 PRIZE POOL',
    team: '2-4 Members',
    shortDesc: 'Penetrate fortified corporate servers, exploit zero-days, and capture hidden digital flags.',
    fullDesc: 'A 4-hour offensive security competition testing web penetration, binary exploitation, reverse engineering, and forensic memory analysis.',
    rules: [
      'No denial-of-service attacks on competition infrastructure.',
      'Writeups required for top 3 flag submissions.',
    ],
  },
  {
    id: 'ui-cyberpunk',
    title: 'DALI VISION: CYBERPUNK UI/UX',
    category: 'Design & Media',
    icon: Zap,
    date: '10 SEPT // 11:30 AM',
    prize: '$1,500 PRIZE POOL',
    team: '1-2 Members',
    shortDesc: 'Design futuristic dystopian heist interfaces, HUDs, and interactive WebGL experiences.',
    fullDesc: 'Craft high-fidelity dark neon UI designs for heist tactical consoles, biometric scanners, and futuristic bank security dashboards.',
    rules: [
      'Design software allowed: Figma, Adobe XD, Blender, WebGL/Spline.',
      'Assets generated must be original or open-source vector graphics.',
    ],
  },
  {
    id: 'heist-simulation',
    title: 'OPERATION GOLDEN VAULT: HEIST SIM',
    category: 'Heist Special',
    icon: Trophy,
    date: '10 SEPT // 05:00 PM',
    prize: '$4,000 PRIZE POOL',
    team: '3-5 Members',
    shortDesc: 'The flagship physical + digital hybrid mystery maze & escape room challenge.',
    fullDesc: 'Combine physical hardware IoT hack, laser evasion, logic puzzle solving, and rapid tactical coordination to escape with the gold bullion before SWAT entry.',
    rules: [
      'Strictest timed event of CYBERPUNK 2026.',
      'All team members must wear red heist bandanas (provided on-site).',
    ],
  },
];

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const categories = ['All', 'Coding & Hacking', 'AI & Gaming', 'Design & Media', 'Heist Special'];

  const filteredEvents =
    selectedCategory === 'All'
      ? eventsData
      : eventsData.filter((e) => e.category === selectedCategory);

  const openModal = (eventObj) => {
    playHeistClickSound();
    setActiveModalEvent(eventObj);
  };

  const closeModal = () => {
    setActiveModalEvent(null);
  };

  const handleRegisterClick = (eventId) => {
    closeModal();
    const regSection = document.getElementById('registration-section');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="events-section" className="relative py-24 bg-[#050505] text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <p className="font-mono-cyber text-red-500 text-sm tracking-widest uppercase mb-2">
            // CLASSIFIED MISSIONS
          </p>
          <h2 className="font-bebas text-5xl sm:text-7xl tracking-widest">
            OPERATION <span className="text-red-600 text-glow-red">EVENTS</span>
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playHeistClickSound();
                setSelectedCategory(cat);
              }}
              className={`px-5 py-2.5 rounded-full font-bebas text-lg tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(230,0,0,0.6)] border border-red-500'
                  : 'bg-zinc-900/80 border border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const IconComp = evt.icon;
            return (
              <div
                key={evt.id}
                className="group relative bg-zinc-950/90 border border-zinc-800/80 hover:border-red-600/80 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(230,0,0,0.25)] hover:-translate-y-1.5"
              >
                <div>
                  {/* Category & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono-cyber text-xs text-red-400 bg-red-950/60 border border-red-900/60 px-3 py-1 rounded-md">
                      {evt.category}
                    </span>
                    <div className="p-2 bg-red-600/10 border border-red-600/30 rounded-lg text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                      <IconComp size={22} />
                    </div>
                  </div>

                  <h3 className="font-bebas text-3xl tracking-wider text-white mb-2 group-hover:text-red-500 transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                    {evt.shortDesc}
                  </p>
                </div>

                <div>
                  {/* Meta Details */}
                  <div className="flex items-center justify-between text-xs font-mono-cyber text-gray-400 border-t border-zinc-800 pt-4 mb-4">
                    <span className="flex items-center gap-1.5 text-gray-300">
                      <Clock size={14} className="text-red-500" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-red-400 font-bold">
                      <Trophy size={14} />
                      {evt.prize}
                    </span>
                  </div>

                  {/* Card Action Button */}
                  <button
                    onClick={() => openModal(evt)}
                    className="w-full py-3 bg-zinc-900 group-hover:bg-red-600 text-gray-200 group-hover:text-white font-bebas text-xl tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-zinc-700 group-hover:border-red-500 cursor-pointer"
                  >
                    MISSION BRIEF & REGISTER
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-red-600/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(230,0,0,0.4)] text-white max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-zinc-900 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <span className="font-mono-cyber text-xs text-red-500 uppercase tracking-widest block mb-2">
              // CLASSIFIED DOSSIER
            </span>
            <h3 className="font-bebas text-4xl sm:text-5xl tracking-wider mb-4 text-glow-red">
              {activeModalEvent.title}
            </h3>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {activeModalEvent.fullDesc}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 mb-6 font-mono-cyber text-xs">
              <div>
                <span className="text-gray-500 block mb-1">DATE & TIME</span>
                <span className="text-white font-bold">{activeModalEvent.date}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">PRIZE POOL</span>
                <span className="text-red-400 font-bold">{activeModalEvent.prize}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bebas text-2xl tracking-wider text-red-500 mb-2">RULES & PROTOCOLS</h4>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                {activeModalEvent.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleRegisterClick(activeModalEvent.id)}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bebas text-2xl tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(230,0,0,0.6)] cursor-pointer"
            >
              REGISTER FOR THIS EVENT NOW
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Events;
