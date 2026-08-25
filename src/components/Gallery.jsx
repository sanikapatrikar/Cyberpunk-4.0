import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { playHeistClickSound } from '../utils/audio';

const galleryImages = [
  {
    id: 1,
    title: 'OPERATIONAL COMMAND CENTER',
    subtitle: 'High Security Surveillance Terminal',
    url: '/assets/heist_vault_gate.jpg',
  },
  {
    id: 2,
    title: 'THE DALI MASK REVEAL',
    subtitle: 'Symbol of Resistance',
    url: '/assets/heist_dali_mask.jpg',
  },
  {
    id: 3,
    title: 'THE HEIST CREW FORMATION',
    subtitle: 'Vault Infiltration Team',
    url: '/assets/heist_crew_reveal.jpg',
  },
  {
    id: 4,
    title: 'QUANTUM CODE BREAKER',
    subtitle: 'Cryptographic Decryption Console',
    url: '/assets/heist_vault_gate.jpg',
  },
  {
    id: 5,
    title: 'RED TEAM DEPLOYMENT',
    subtitle: 'Tactical Reconnaissance',
    url: '/assets/heist_crew_reveal.jpg',
  },
  {
    id: 6,
    title: 'CYBERPUNK NEON SKYLINE',
    subtitle: 'Metropolis Command Network',
    url: '/assets/heist_dali_mask.jpg',
  },
];

const Gallery = () => {
  const [activeImage, setActiveImage] = useState(null);

  const openLightbox = (imgObj) => {
    playHeistClickSound();
    setActiveImage(imgObj);
  };

  return (
    <section id="gallery-section" className="relative py-24 bg-[#050505] text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <p className="font-mono-cyber text-red-500 text-sm tracking-widest uppercase mb-2">
            // CLASSIFIED ARCHIVES
          </p>
          <h2 className="font-bebas text-5xl sm:text-7xl tracking-widest">
            CINEMATIC <span className="text-red-600 text-glow-red">GALLERY</span>
          </h2>
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              onClick={() => openLightbox(img)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-red-600 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(230,0,0,0.3)]"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter contrast-125 brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Red Hover Overlay */}
              <div className="absolute inset-0 bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="font-bebas text-2xl tracking-wider text-white group-hover:text-red-400 transition-colors">
                    {img.title}
                  </h3>
                  <p className="font-mono-cyber text-xs text-gray-400">
                    {img.subtitle}
                  </p>
                </div>
                <div className="p-2.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <Maximize2 size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-zinc-950 border border-red-600 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(230,0,0,0.5)]"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/80 text-white hover:text-red-500 rounded-full cursor-pointer"
            >
              <X size={24} />
            </button>
            <img
              src={activeImage.url}
              alt={activeImage.title}
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            <div className="p-6 bg-zinc-950 border-t border-zinc-800">
              <h3 className="font-bebas text-3xl text-red-500 tracking-wider">
                {activeImage.title}
              </h3>
              <p className="font-mono-cyber text-xs text-gray-400">
                {activeImage.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
