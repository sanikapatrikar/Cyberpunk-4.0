import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Cpu, 
  Shield, 
  Terminal, 
  Layers, 
  Award, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  UploadCloud,
  Clock,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { WEB3_CONFIG } from '../config/web3Config';
import { playHeistClickSound } from '../utils/audio';

const tracks = [
  {
    code: 'TRACK-01',
    title: 'DEFI RESILIENCE & SMART CONTRACT SECURITY',
    icon: Shield,
    tagline: 'Fortifying decentralized economies against economic and flash-loan exploits',
    description: 'Design and deploy automated smart-contract guardians, decentralized circuit breakers, or novel algorithmic liquidity pools that mitigate sandwich attacks, slippage manipulation, and protocol reentrancy vulnerabilities.',
    deliverables: [
      'Solidity/Rust smart contracts with test coverage',
      'Threat model analysis & mitigation breakdown',
      'Testnet deployment proof or local Hardhat/Foundry simulation'
    ]
  },
  {
    code: 'TRACK-02',
    title: 'ZERO-KNOWLEDGE PRIVACY & DIGITAL ATTESTATION',
    icon: Terminal,
    tagline: 'Tamper-proof verifiable computation without revealing sensitive payload',
    description: 'Build privacy-preserving systems using ZK-SNARKs or ZK-STARKs for sovereign credential verification, private voting ballots, or confidential transactions on public ledgers.',
    deliverables: [
      'Circuit implementation (Circom, Noir, or Halo2)',
      'Verifier contract & frontend proving interface',
      'Demonstration of zero data leakage'
    ]
  },
  {
    code: 'TRACK-03',
    title: 'CROSS-CHAIN INTEROPERABILITY & INFRASTRUCTURE',
    icon: Layers,
    tagline: 'Bridging fragmented blockchain states with trust-minimized relayer architecture',
    description: 'Construct seamless cross-chain messaging mechanisms, state synchronizers, or multi-chain governance bridges that operate without centralized oracle single points of failure.',
    deliverables: [
      'Multi-chain orchestration contracts',
      'Relayer / listener architecture diagram',
      'Working cross-chain state proof or token bridge demo'
    ]
  },
  {
    code: 'TRACK-04',
    title: 'PUBLIC GOODS & DECENTRALIZED IDENTITY (DID)',
    icon: Cpu,
    tagline: 'Empowering open-access community governance and sybil-resistant networks',
    description: 'Engineer decentralized identity protocols, soulbound token attestation frameworks, or quadratic funding mechanisms designed to power transparent, censorship-resistant public systems.',
    deliverables: [
      'Decentralized identity resolver or SBT contract',
      'Integration sample or verifiable credential issuer',
      'Impact metrics and sustainability roadmap'
    ]
  }
];

const evaluationCriteria = [
  { metric: 'TECHNICAL ARCHITECTURE', weight: '30%', desc: 'Code quality, smart contract optimization, gas efficiency, and modular system design.' },
  { metric: 'SECURITY & RESILIENCE', weight: '25%', desc: 'Resistance to common smart contract vectors (reentrancy, access control, front-running).' },
  { metric: 'INNOVATION & NOVELTY', weight: '25%', desc: 'Originality of the decentralized mechanism and real-world Web3 problem framing.' },
  { metric: 'EXECUTION & PPT PITCH', weight: '20%', desc: 'Quality of the working prototype, demo readiness, and presentation pitch clarity.' },
];

const Web3ProblemStatement = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReturnToDossier = () => {
    playHeistClickSound();
    navigate('/#events-section?event=web3');
  };

  const handleRegisterClick = () => {
    playHeistClickSound();
    window.location.href = '/registration?event=WEB3';
  };

  const handlePptClick = () => {
    playHeistClickSound();
    navigate('/web3-submission');
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-100 overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar visible={true} />

      {/* Cyberpunk Ambient Lights & Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-red-950/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-red-900/15 rounded-full blur-[160px]" />
        <div 
          className="w-full h-full opacity-5"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        
        {/* Navigation Breadcrumb / Back Action */}
        <div className="mb-8">
          <button
            onClick={handleReturnToDossier}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-gray-300 hover:text-white hover:border-red-600 hover:bg-zinc-800/90 transition-all duration-200 font-mono-cyber text-xs tracking-wider cursor-pointer group shadow-sm hover:shadow-[0_0_15px_rgba(230,0,0,0.3)]"
          >
            <ArrowLeft size={16} className="text-red-500 transition-transform group-hover:-translate-x-1" />
            <span>RETURN TO WEB3 DOSSIER</span>
          </button>
        </div>

        {/* Dossier Header */}
        <div className="border-b border-zinc-800/80 pb-8 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="font-mono-cyber text-xs text-red-500 bg-red-950/70 border border-red-900/70 px-3 py-1 rounded tracking-widest uppercase">
              // CLASSIFIED DOSSIER
            </span>
            <span className="font-mono-cyber text-xs text-gray-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded tracking-wider uppercase">
              OPERATION: WEB3 HACKATHON
            </span>
            <span className="font-mono-cyber text-xs text-yellow-500/90 bg-yellow-950/40 border border-yellow-800/50 px-3 py-1 rounded tracking-wider uppercase flex items-center gap-1.5">
              <Clock size={12} />
              6-HOUR BUILD SPRINT
            </span>
          </div>

          <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-wider text-white uppercase mt-2 drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]">
            PROBLEM <span className="text-red-600 text-glow-red">STATEMENT</span>
          </h1>

          <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-3xl leading-relaxed font-sans font-normal">
            Build the decentralized future at the Web3 Hackathon. Teams are tasked with selecting one operational track, architecting resilient smart contract primitives, and demonstrating a fully verifiable decentralized system under time pressure.
          </p>

          {/* External Document Button if configured */}
          {WEB3_CONFIG.problemStatementUrl && (
            <div className="mt-6">
              <a
                href={WEB3_CONFIG.problemStatementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500 text-red-400 hover:text-white rounded-xl font-bebas text-xl tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(230,0,0,0.2)]"
              >
                <FileText size={18} />
                <span>OPEN OFFICIAL DRIVE / EXTERNAL SPEC</span>
                <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>

        {/* Mission Brief Summary Card */}
        <div className="bg-zinc-950/80 border border-red-600/40 rounded-2xl p-6 sm:p-8 mb-12 shadow-[0_0_35px_rgba(230,0,0,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={22} className="text-red-500" />
            <h2 className="font-bebas text-2xl sm:text-3xl tracking-wider text-white">
              MISSION BRIEF & PROTOCOL GUIDELINES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <span className="font-mono-cyber text-xs text-red-400 block mb-1 uppercase tracking-wider">
                01 // FORMAT & DURATION
              </span>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                6 hours of continuous decentralized development. Teams may build on EVM (Ethereum, Polygon, Arbitrum, Base) or non-EVM ecosystems (Solana, Aptos, Sui).
              </p>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <span className="font-mono-cyber text-xs text-red-400 block mb-1 uppercase tracking-wider">
                02 // SQUAD SPECIFICATIONS
              </span>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Teams of 3 to 5 operatives. Interdisciplinary composition (smart contracts, frontend dApp integration, system architecture) is strongly encouraged.
              </p>
            </div>

            <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
              <span className="font-mono-cyber text-xs text-red-400 block mb-1 uppercase tracking-wider">
                03 // FINAL DEMONSTRATION
              </span>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Live code evaluation, functional dApp / contract test execution, and an authoritative PPT pitch deck delivered before the jury panel.
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Tracks */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-mono-cyber text-xs text-red-500 uppercase tracking-widest block">
                // SELECT AN ENGAGEMENT VECTOR
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white">
                OPERATIONAL TRACKS
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.code}
                  className="bg-zinc-950/70 border border-zinc-800/90 hover:border-red-600/70 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:shadow-[0_0_25px_rgba(230,0,0,0.2)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono-cyber text-xs text-red-400 bg-red-950/80 border border-red-900/60 px-3 py-1 rounded">
                        {track.code}
                      </span>
                      <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                        <Icon size={18} />
                      </div>
                    </div>

                    <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white mb-2 text-glow-red">
                      {track.title}
                    </h3>

                    <p className="font-mono-cyber text-xs text-gray-400 mb-4 tracking-tight">
                      // {track.tagline}
                    </p>

                    <p className="text-gray-300 text-sm leading-relaxed mb-5">
                      {track.description}
                    </p>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-4 mt-2">
                    <span className="font-mono-cyber text-xs text-gray-400 uppercase tracking-wider block mb-2">
                      Key Deliverables:
                    </span>
                    <ul className="space-y-1.5 font-mono-cyber text-xs text-gray-300">
                      {track.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-red-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evaluation Metrics */}
        <div className="mb-14 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <div className="mb-6">
            <span className="font-mono-cyber text-xs text-red-500 uppercase tracking-widest block mb-1">
              // JURY CRITERIA
            </span>
            <h2 className="font-bebas text-3xl tracking-wider text-white">
              EVALUATION FRAMEWORK
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {evaluationCriteria.map((crit, idx) => (
              <div key={idx} className="bg-zinc-900/70 border border-zinc-800/80 p-5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bebas text-2xl text-red-500 font-bold">
                    {crit.weight}
                  </span>
                  <Award size={18} className="text-gray-500" />
                </div>
                <h4 className="font-bebas text-lg tracking-wider text-white mb-1">
                  {crit.metric}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-mono-cyber">
                  {crit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-red-600/60 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(230,0,0,0.3)]">
          <div>
            <span className="font-mono-cyber text-xs text-red-400 uppercase tracking-wider block mb-1">
              READY FOR DEPLOYMENT?
            </span>
            <h3 className="font-bebas text-3xl sm:text-4xl tracking-wider text-white">
              PREPARE YOUR PPT & LOCK YOUR SQUAD
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-mono-cyber mt-1">
              Review presentation deck requirements or complete registration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Secondary Action: Submit PPT */}
            <button
              type="button"
              onClick={handlePptClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-red-600/50 hover:border-red-500 text-white font-bebas text-xl tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(230,0,0,0.2)]"
            >
              <UploadCloud size={18} className="text-red-500" />
              <span>SUBMIT YOUR PPT</span>
            </button>

            {/* Primary Action: Register */}
            <button
              type="button"
              onClick={handleRegisterClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bebas text-xl tracking-widest rounded-xl transition-all duration-200 shadow-[0_0_25px_rgba(230,0,0,0.6)] cursor-pointer"
            >
              REGISTER FOR THIS EVENT NOW
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Web3ProblemStatement;
