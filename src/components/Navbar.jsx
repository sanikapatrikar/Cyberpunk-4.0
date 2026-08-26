import React, { useState, useEffect } from 'react';
import { Menu, X, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { toggleCyberpunkAudio } from '../utils/audio';

const Navbar = ({ visible = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const active = toggleCyberpunkAudio();
    setIsAudioActive(active);
  };

  const navLinks = [
    { name: 'HOME', href: '#countdown-section' },
    { name: 'EVENTS', href: '#events-section' },
    { name: 'CREW', href: '#crew-section' },
    { name: 'GALLERY', href: '/gallery' },
    { name: 'REGISTER', href: '#registration-section' },
    { name: 'CONTACT', href: '#contact-section' },
  ];

  const isShown = visible || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-500 ${
        isShown ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-red-900/40 rounded-full px-6 py-3 shadow-[0_0_25px_rgba(230,0,0,0.15)]">

        
        {/* Brand Logo: CYBER | PUNK */}
        <a href="#countdown-section" className="flex items-center gap-2 group">
          <span className="font-bebas text-2xl tracking-wider text-white">CYBER</span>
          <span className="font-bebas text-xl text-red-600">|</span>
          <span className="font-bebas text-2xl tracking-wider text-white bg-red-600 px-2 py-0.5 rounded-sm">
            PUNK
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-bebas text-lg tracking-widest text-gray-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative hover:text-red-500 transition-colors duration-200 py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleAudioToggle}
            className={`p-2.5 rounded-full border transition-all duration-300 flex items-center gap-2 font-mono-cyber text-xs cursor-pointer ${
              isAudioActive
                ? 'bg-red-600/20 border-red-600 text-red-400 shadow-[0_0_15px_rgba(230,0,0,0.4)] animate-pulse'
                : 'bg-zinc-900/60 border-zinc-700/60 text-gray-400 hover:text-white'
            }`}
            title="Toggle Atmospheric Synth Audio"
          >
            {isAudioActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span className="hidden sm:inline">
              {isAudioActive ? 'AUDIO: ON' : 'AUDIO: OFF'}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-red-500 cursor-pointer"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 bg-black/95 border border-red-600/40 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl flex flex-col gap-5 font-bebas text-2xl tracking-widest z-50">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-200 hover:text-red-500 py-2 border-b border-zinc-800 flex items-center justify-between"
            >
              <span>{link.name}</span>
              <ShieldAlert size={20} className="text-red-600" />
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
