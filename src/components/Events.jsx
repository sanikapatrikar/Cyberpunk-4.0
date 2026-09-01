import React, { useState } from 'react';
import { Terminal, Shield, Cpu, Zap, Trophy, Clock, ArrowRight, X } from 'lucide-react';
import { playHeistClickSound } from '../utils/audio';

const eventsData = [
  {
    id: 'cyber-hack',
    title: 'HACKERS HEIST',
    category: 'CTF Event',
    icon: Terminal,
    // Fixed extension to .png based on your terminal
    image: '/assets/hacker-heist.png', 
    date: '10 SEPT 2026 // TIME TBA',
    venue: 'BS-14',
    fee: 'Rs. 150 per team',
    prize: 'Rs. 2,000 + certificates',
    team: '2-4 Members',
    fullDesc: 'Put your cybersecurity skills to the ultimate test in Hacker\'s Heist, a competitive Capture The Flag challenge packed with puzzles, technical challenges, and problem-solving. Hosted on CTFd with infrastructure support from Azure/AWS EC2, participants will battle through progressively difficult challenges and climb the leaderboard.',
    highlights: [
      '3 levels of challenges: Intermediate, Hard, and Intense.',
      'Team-based CTF competition with 2-4 members.',
      'Challenges ranging from 100 to 600 points.',
    ],
  },
  {
    id: 'ai-arena',
    title: 'WEB-3 Hackathon',
    category: 'Hackathon',
    icon: Cpu,
    // Fixed extension to .jpeg
    image: '/assets/web3--.jpeg', 
    date: '10 SEPT 2026 // 6-HOUR CHALLENGE',
    venue: 'To Be Decided',
    fee: 'Rs. 250 per team',
    prize: 'Rs. 3,000 prize pool',
    team: 'Team event',
    fullDesc: 'Build the decentralized future at the Web3 Hackathon! Teams will tackle real-world problem statements, develop innovative decentralized solutions, receive industry mentorship, and pitch their projects to a judging panel. From idea to implementation, turn your Web3 vision into something that actually works.',
    highlights: [
      '6-hour Web3 innovation challenge.',
      'Build solutions for real-world problems.',
      'Industry mentorship and hands-on development.',
      'Final project demonstration and PPT pitch.',
    ],
  },
  {
    id: 'cyber-ctf',
    title: 'Detectyx',
    category: 'Coding & Hacking',
    icon: Shield,
    // Fixed extension to .jpeg
    image: '/assets/detectyx--.jpeg', 
    date: '10 SEPT 2026 // TIME TBA',
    venue: 'BS-08 / BS-09',
    fee: 'Rs. 140 per team',
    prize: 'Up to Rs. 1,500 prize pool',
    team: 'Team event',
    fullDesc: 'Step into the role of a cyber detective in DetectyX, an interactive digital crime investigation where every clue brings you closer to the culprit. Follow the trail through OSINT investigation, suspect interrogation, metadata analysis, and digital forensics to crack the case.',
    highlights: [
      '3 interconnected investigation rounds.',
      'OSINT and crime-scene investigation.',
      'Metadata analysis and suspect interrogation.',
      'Digital forensics and hidden-data recovery.',
    ],
  },
  {
    id: 'ui-cyberpunk',
    title: 'Campus Rush',
    category: 'Fun & Games',
    icon: Zap,
    // Fixed extension to .jpeg
    image: '/assets/campus-rush.jpeg', 
    date: '10 SEPT 2026 // TIME TBA',
    venue: 'College Campus / Open Area',
    fee: 'Rs. 150 per team',
    prize: 'Rs. 1,500 prize pool',
    team: 'Team event',
    fullDesc: 'Get ready for Campus Rush, a high-energy battle of speed, teamwork, strategy, and presence of mind! Race through a campus-wide treasure hunt, conquer a series of physical and mental challenges, and make it to the ultimate blindfolded RC-car finale. Only the fastest and smartest team will survive the rush.',
    highlights: [
      'Campus-wide treasure hunt with 8 clues.',
      'Challenge Arena: Cup Pyramid, Puzzle Challenge, and Balloon Burst.',
      'Guess the Word time-advantage challenge.',
      'Blindfolded RC Car Final Showdown.',
    ],
  },
];

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const categories = ['All', 'Coding & Hacking', 'Hackathon', 'Fun & Games'];
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
    const eventMap = {
      'cyber-hack': 'HEIST',
      'ai-arena': 'WEB3',
      'cyber-ctf': 'DETECTYX',
      'ui-cyberpunk': 'NGV',
    };
    const registrationEvent = eventMap[eventId];

    if (registrationEvent) {
      window.location.href = `/registration?event=${registrationEvent}`;
    } else {
      window.location.href = '/registration';
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

        {/* Events Grid (Poster Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredEvents.map((evt) => {
            return (
              <div
                key={evt.id}
                className="group relative h-[450px] rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-red-600/80 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(230,0,0,0.4)] hover:-translate-y-2 cursor-pointer"
                onClick={() => openModal(evt)}
              >
                {/* Poster Background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-50"
                  style={{ backgroundImage: `url(${evt.image})` }}
                />
                
                {/* Gradient Overlays for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/80 transition-opacity duration-300 group-hover:opacity-90" />

                {/* Content Container */}
                <div className="relative h-full p-8 flex flex-col items-center justify-center text-center">
                  
                  {/* Category Badge - Top Center */}
                  <span className="absolute top-6 font-mono-cyber text-xs text-red-400 bg-red-950/80 border border-red-900/80 px-4 py-1.5 rounded-md backdrop-blur-sm shadow-[0_0_10px_rgba(230,0,0,0.3)]">
                    {evt.category}
                  </span>

                  {/* Main Event Title - Centered */}
                  <h3 className="font-bebas text-5xl sm:text-6xl tracking-wider text-white mt-8 mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:text-red-500 transition-colors duration-300">
                    {evt.title}
                  </h3>

                  {/* Hover Reveal: Register Button */}
                  <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 mt-4">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        openModal(evt);
                      }}
                      className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bebas text-2xl tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(230,0,0,0.8)] flex items-center gap-2"
                    >
                      MISSION BRIEF & REGISTER <ArrowRight size={20} />
                    </button>
                  </div>

                  {/* Meta Details - Bottom fixed */}
                  <div className="absolute bottom-6 w-full px-8 flex items-center justify-between text-sm font-mono-cyber">
                    <span className="flex items-center gap-2 text-gray-300 bg-black/60 px-3 py-1.5 rounded-md backdrop-blur-sm border border-zinc-800">
                      <Clock size={16} className="text-red-500" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-2 text-red-400 font-bold bg-black/60 px-3 py-1.5 rounded-md backdrop-blur-sm border border-zinc-800">
                      <Trophy size={16} />
                      {evt.prize}
                    </span>
                  </div>

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

            <h4 className="font-bebas text-2xl tracking-wider text-red-500 mb-2">ABOUT THIS EVENT</h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {activeModalEvent.fullDesc}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 mb-6 font-mono-cyber text-xs">
              <div>
                <span className="text-gray-500 block mb-1">DATE / TIME</span>
                <span className="text-white font-bold">{activeModalEvent.date}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">VENUE</span>
                <span className="text-white font-bold">{activeModalEvent.venue}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">ENTRY FEE</span>
                <span className="text-red-400 font-bold">{activeModalEvent.fee}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">PRIZE</span>
                <span className="text-red-400 font-bold">{activeModalEvent.prize}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bebas text-2xl tracking-wider text-red-500 mb-2">EVENT HIGHLIGHTS</h4>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                {activeModalEvent.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={(event) => {
                event.stopPropagation();
                handleRegisterClick(activeModalEvent.id);
              }}
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