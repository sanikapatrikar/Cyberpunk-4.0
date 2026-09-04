import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, ChevronDown, MessageSquare } from 'lucide-react';

const faqList = [
  {
    q: 'WHEN AND WHERE IS CYBERPUNK 2026 HELD?',
    a: 'The operation commences live on 10 SEPTEMBER 2026 at the Main Campus Auditorium and Computer Science Complex.',
  },
  {
    q: 'IS THERE AN ENTRY FEE FOR OPERATIVES?',
    a: 'Registration for CYBERPUNK 2026 is completely free for all verified college students.',
  },
  {
    q: 'CAN STUDENTS FROM OTHER COLLEGES PARTICIPATE?',
    a: 'Affirmative. Inter-college teams and individual operatives are actively encouraged to join.',
  },
  {
    q: 'WHAT SHOULD OPERATIVES BRING ON EVENT DAY?',
    a: 'Bring your student college ID card, your registration QR code pass, and a laptop with required software installed.',
  },
];

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <footer id="contact-section" className="relative py-24 bg-[#030303] text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Left Column: Contact Details & Location */}
          <div>
            <p className="font-mono-cyber text-red-500 text-sm tracking-widest uppercase mb-2">
              // OPERATION HEADQUARTERS
            </p>
            <h2 className="font-bebas text-5xl sm:text-6xl tracking-widest mb-6">
              REACH THE <span className="text-red-600 text-glow-red">PROFESSOR</span>
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Have questions regarding event protocols, team allocations, or sponsorship opportunities? Connect with our tactical dispatch team.
            </p>

            <div className="space-y-6 font-mono-cyber text-sm">
              <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="p-3 bg-red-600/20 text-red-500 rounded-lg">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">ENCRYPTED EMAIL</span>
                  <a href="mailto:operation@cyberpunk2026.io" className="text-white hover:text-red-400 font-bold">
                    operation@cyberpunk2026.io
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="p-3 bg-red-600/20 text-red-500 rounded-lg">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">DISPATCH HOTLINE</span>
                  <a href="tel:+15550192834" className="text-white hover:text-red-400 font-bold">
                    +1 (555) 019-HEIST (43478)
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="p-3 bg-red-600/20 text-red-500 rounded-lg">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">EVENT LOCATION</span>
                  <span className="text-white font-bold">Main Campus Auditorium, Sector 7, Tech District</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div>
            <h3 className="font-bebas text-3xl tracking-wider text-white mb-6 flex items-center gap-2">
              <MessageSquare size={24} className="text-red-500" />
              FREQUENTLY ASKED PROTOCOLS
            </h3>

            <div className="space-y-4">
              {faqList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950 border border-zinc-800/80 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left font-bebas text-xl tracking-wider text-gray-200 hover:text-red-400 flex items-center justify-between cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-red-500 transition-transform duration-300 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 font-mono-cyber text-xs text-gray-400 border-t border-zinc-900 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-cyber text-xs text-gray-500">
          <div>
            © 2026 CYBERPUNK COLLEGE EVENT. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-red-600 font-bold">CYBER | PUNK</span>
            <span>BELLA CIAO PROTOCOL</span>
            <span>10 SEPTEMBER</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
