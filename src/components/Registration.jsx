import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playHeistClickSound } from '../utils/audio';

const availableEvents = [
  'CODE HEIST: ALGORITHM VAULT',
  'THE PROFESSOR’S AI NEURAL ARENA',
  'RED TEAM CYBER CAPTURE THE FLAG',
  'DALI VISION: CYBERPUNK UI/UX',
  'OPERATION GOLDEN VAULT: HEIST SIM',
];

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '2nd Year',
    selectedEvents: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (eventName) => {
    playHeistClickSound();
    let updated = [...formData.selectedEvents];
    if (updated.includes(eventName)) {
      updated = updated.filter((item) => item !== eventName);
    } else {
      updated.push(eventName);
    }
    setFormData({ ...formData, selectedEvents: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.email || !formData.phone || !formData.college) {
      setErrorMessage('Please complete all operative credentials.');
      return;
    }
    if (formData.selectedEvents.length === 0) {
      setErrorMessage('Please select at least one mission event.');
      return;
    }

    setIsSubmitting(true);
    playHeistClickSound();

    // Simulate Google Apps Script / Google Sheets POST API payload
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger Cyberpunk Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e60000', '#ffffff', '#800000'],
      });
    }, 1200);
  };

  return (
    <section id="registration-section" className="relative py-24 bg-[#050505] text-white border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-mono-cyber text-red-500 text-sm tracking-widest uppercase mb-2">
            // JOIN THE HEIST CREW
          </p>
          <h2 className="font-bebas text-5xl sm:text-7xl tracking-widest">
            OPERATIVE <span className="text-red-600 text-glow-red">REGISTRATION</span>
          </h2>
          <p className="font-mono-cyber text-gray-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            SUBMIT CREDENTIALS TO GAIN CLEARANCE FOR CYBERPUNK 2026 // 10 SEPTEMBER
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-zinc-950 border border-red-600/80 rounded-2xl p-8 sm:p-12 text-center shadow-[0_0_50px_rgba(230,0,0,0.4)]">
            <div className="inline-flex items-center justify-center p-4 bg-red-600/20 text-red-500 border border-red-600 rounded-full mb-6 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="font-bebas text-4xl sm:text-5xl tracking-wider text-white mb-4">
              CLEARANCE GRANTED, OPERATIVE {formData.name.toUpperCase()}!
            </h3>
            <p className="font-mono-cyber text-gray-300 text-sm max-w-lg mx-auto mb-8">
              Your registration payload has been recorded in the central database. Check your email (<span className="text-red-400">{formData.email}</span>) for your mission pass QR code.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  college: '',
                  year: '2nd Year',
                  selectedEvents: [],
                });
              }}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 font-bebas text-2xl tracking-widest rounded-xl transition-all shadow-lg cursor-pointer"
            >
              REGISTER ANOTHER OPERATIVE
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.9)] relative"
          >
            {/* Top Red Glow Accent */}
            <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-950/80 border border-red-600 rounded-xl text-red-400 font-mono-cyber text-xs flex items-center gap-3">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div>
                <label className="block font-mono-cyber text-xs text-gray-300 uppercase mb-2">
                  Operative Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sergio Marquina"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl px-4 py-3 text-white font-mono-cyber text-sm outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-mono-cyber text-xs text-gray-300 uppercase mb-2">
                  Encrypted Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. professor@cyberpunk.io"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl px-4 py-3 text-white font-mono-cyber text-sm outline-none transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-mono-cyber text-xs text-gray-300 uppercase mb-2">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl px-4 py-3 text-white font-mono-cyber text-sm outline-none transition-colors"
                />
              </div>

              {/* College / Institution */}
              <div>
                <label className="block font-mono-cyber text-xs text-gray-300 uppercase mb-2">
                  College / Institution *
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  placeholder="e.g. Institute of Technology"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl px-4 py-3 text-white font-mono-cyber text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Academic Year */}
            <div className="mb-6">
              <label className="block font-mono-cyber text-xs text-gray-300 uppercase mb-2">
                Year of Study
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 rounded-xl px-4 py-3 text-white font-mono-cyber text-sm outline-none transition-colors cursor-pointer"
              >
                <option value="1st Year">1st Year / Freshman</option>
                <option value="2nd Year">2nd Year / Sophomore</option>
                <option value="3rd Year">3rd Year / Junior</option>
                <option value="4th Year">4th Year / Senior</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            {/* Event Selection Multiselect */}
            <div className="mb-8">
              <label className="block font-mono-cyber text-xs text-gray-300 uppercase mb-3">
                Select Operation Missions (Select at least 1) *
              </label>
              <div className="space-y-3">
                {availableEvents.map((evt) => (
                  <label
                    key={evt}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      formData.selectedEvents.includes(evt)
                        ? 'bg-red-950/40 border-red-600 text-white shadow-[0_0_15px_rgba(230,0,0,0.2)]'
                        : 'bg-zinc-900/60 border-zinc-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedEvents.includes(evt)}
                      onChange={() => handleCheckboxChange(evt)}
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                    <span className="font-bebas text-xl tracking-wider">{evt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bebas text-3xl tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(230,0,0,0.6)] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>TRANSMITTING CREDENTIALS...</span>
              ) : (
                <>
                  <span>CONFIRM OPERATION CLEARANCE</span>
                  <Send size={24} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Registration;
