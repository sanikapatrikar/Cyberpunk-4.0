import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { WEB3_CONFIG } from '../config/web3Config';
import { playHeistClickSound } from '../utils/audio';

const slideGuidelines = [
  { step: '01', title: 'PROBLEM & VECTOR', desc: 'Identify the exact vulnerability, inefficiency, or Web3 use-case tackled.' },
  { step: '02', title: 'ARCHITECTURE & TECH STACK', desc: 'Detail smart contracts, oracles, blockchain networks, and frontend layers.' },
  { step: '03', title: 'SECURITY & PROTOCOL FLOW', desc: 'Highlight threat mitigation, access control, and smart contract audit rigor.' },
  { step: '04', title: 'DEMO & WORKING PROOF', desc: 'Provide screenshots, contract test outputs, or live testnet transaction links.' },
  { step: '05', title: 'IMPACT & FUTURE ROADMAP', desc: 'Explain real-world utility, scalability, and long-term decentralized roadmap.' },
  { step: '06', title: 'SQUAD & CONTRIBUTIONS', desc: 'List all 3-5 team members, individual roles, and GitHub handles.' },
];

const Web3Submission = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReturnToDossier = () => {
    playHeistClickSound();
    navigate('/#events-section?event=web3');
  };

  const handleViewProblemStatement = () => {
    playHeistClickSound();
    navigate('/web3-problem-statement');
  };

  const handleSubmitPortalClick = () => {
    playHeistClickSound();
    if (WEB3_CONFIG.pptSubmissionUrl && WEB3_CONFIG.pptSubmissionUrl.trim() !== '') {
      window.open(WEB3_CONFIG.pptSubmissionUrl, '_blank', 'noopener,noreferrer');
    } else {
      setNotification('SUBMISSION PORTAL LINK PENDING: The organizing team will link the official Google Form / Drive submission portal prior to the evaluation round. Please ensure your presentation deck satisfies the guidelines below.');
      setTimeout(() => {
        setNotification('');
      }, 7000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-100 overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar visible={true} />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-red-950/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-red-900/15 rounded-full blur-[160px]" />
        <div 
          className="w-full h-full opacity-5"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        
        {/* Navigation Breadcrumb / Back Button */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleReturnToDossier}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-gray-300 hover:text-white hover:border-red-600 hover:bg-zinc-800/90 transition-all duration-200 font-mono-cyber text-xs tracking-wider cursor-pointer group shadow-sm hover:shadow-[0_0_15px_rgba(230,0,0,0.3)]"
          >
            <ArrowLeft size={16} className="text-red-500 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO WEB3 DOSSIER</span>
          </button>

          <button
            onClick={handleViewProblemStatement}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-700 transition-all duration-200 font-mono-cyber text-xs tracking-wider cursor-pointer"
          >
            <FileText size={14} className="text-red-500" />
            <span>VIEW PROBLEM STATEMENT</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="border-b border-zinc-800/80 pb-8 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="font-mono-cyber text-xs text-red-500 bg-red-950/70 border border-red-900/70 px-3 py-1 rounded tracking-widest uppercase">
              // CLASSIFIED DOSSIER
            </span>
            <span className="font-mono-cyber text-xs text-gray-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded tracking-wider uppercase">
              WEB3 HACKATHON
            </span>
            <span className="font-mono-cyber text-xs text-red-400 bg-red-950/40 border border-red-900/40 px-3 py-1 rounded tracking-wider uppercase">
              DELIVERABLE SUBMISSION
            </span>
          </div>

          <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-wider text-white uppercase mt-2 drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]">
            PPT <span className="text-red-600 text-glow-red">SUBMISSION</span>
          </h1>

          <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans font-normal">
            Squads must submit their official slide presentation deck summarizing their decentralized project, architecture, code verification, and live demo proof before the judging evaluation begins.
          </p>
        </div>

        {/* Temporary Notification Banner */}
        {notification && (
          <div className="mb-8 p-4 bg-zinc-900 border border-yellow-600/70 rounded-xl text-yellow-300 text-xs font-mono-cyber flex items-start gap-3 shadow-[0_0_20px_rgba(202,138,4,0.2)] animate-fade-in">
            <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{notification}</div>
          </div>
        )}

        {/* Main Submission Interface Card */}
        <div className="bg-zinc-950 border border-red-600/60 rounded-2xl p-6 sm:p-10 mb-12 shadow-[0_0_40px_rgba(230,0,0,0.25)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <UploadCloud size={28} className="text-red-500" />
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white">
                SUBMIT YOUR TEAM PRESENTATION
              </h2>
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              Only one submission is required per squad. Ensure that your deck is exported in PDF or PPTX format and includes all team member credentials and working repository references.
            </p>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 mb-8 font-mono-cyber text-xs space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span>FORMAT SPECIFICATION:</span>
                <span className="text-white font-bold">PDF / PPTX (MAX 25MB)</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>SLIDE COUNT:</span>
                <span className="text-white font-bold">8 – 12 SLIDES RECOMMENDED</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>PERMISSIBLE RE-SUBMISSION:</span>
                <span className="text-white font-bold">UNTIL FINAL SPRINT DEADLINE</span>
              </div>
            </div>

            {/* Main Action Button */}
            {WEB3_CONFIG.pptSubmissionUrl && WEB3_CONFIG.pptSubmissionUrl.trim() !== '' ? (
              <a
                href={WEB3_CONFIG.pptSubmissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bebas text-2xl tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(230,0,0,0.7)] cursor-pointer"
              >
                <span>OPEN OFFICIAL SUBMISSION PORTAL</span>
                <ExternalLink size={20} />
              </a>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={handleSubmitPortalClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bebas text-2xl tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(230,0,0,0.7)] cursor-pointer"
                >
                  <UploadCloud size={22} />
                  <span>SUBMIT YOUR PPT NOW</span>
                </button>
                <p className="font-mono-cyber text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-red-500" />
                  Submission portal is linked directly via central Web3 configuration.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Slide Structure */}
        <div className="mb-14">
          <div className="mb-6">
            <span className="font-mono-cyber text-xs text-red-500 uppercase tracking-widest block mb-1">
              // PRESENTATION BLUEPRINT
            </span>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white">
              RECOMMENDED SLIDE STRUCTURE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slideGuidelines.map((slide) => (
              <div
                key={slide.step}
                className="bg-zinc-950/70 border border-zinc-800/80 hover:border-red-600/50 p-5 rounded-xl transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-cyber text-xs text-red-500 bg-red-950/60 border border-red-900/60 px-2 py-0.5 rounded">
                    SLIDE {slide.step}
                  </span>
                  <FileCheck size={16} className="text-gray-500" />
                </div>
                <h3 className="font-bebas text-xl tracking-wide text-white mb-1">
                  {slide.title}
                </h3>
                <p className="font-mono-cyber text-xs text-gray-400 leading-relaxed">
                  {slide.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Checklist */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={20} className="text-red-500" />
            <h3 className="font-bebas text-2xl tracking-wider text-white">
              PRE-SUBMISSION VERIFICATION CHECKLIST
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-cyber text-xs text-gray-300">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/60">
              <span className="text-red-500 font-bold">✓</span>
              <span>Team Name & registered team leader match the CyberPunk registration database.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/60">
              <span className="text-red-500 font-bold">✓</span>
              <span>Public GitHub repository link included with an open-source license and README instructions.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/60">
              <span className="text-red-500 font-bold">✓</span>
              <span>Smart contract address or local simulation video link is clearly documented.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/60">
              <span className="text-red-500 font-bold">✓</span>
              <span>Deck permissions are set to public view if uploading via Google Drive link.</span>
            </div>
          </div>
        </div>

        {/* Bottom Return Bar */}
        <div className="text-center pt-4">
          <button
            onClick={handleReturnToDossier}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-mono-cyber text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="text-red-500" />
            <span>RETURN TO WEB3 HACKATHON MISSION BRIEF</span>
          </button>
        </div>

      </main>
    </div>
  );
};

export default Web3Submission;
