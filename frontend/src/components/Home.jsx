import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, AlertTriangle, ArrowRight, ChevronDown, KeyRound, Lock, UserCheck 
} from 'lucide-react';

export default function Home({ isAuthenticated, userContext, onLogout }) {
  const navigate = useNavigate();
  const howItWorksRef = useRef(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const steps = [
    {
      num: '01',
      tag: 'INGESTION & PARSING',
      title: 'Marketplace Adaptation',
      desc: 'Real-time review stream extraction from marketplace adaptors (Amazon, YouTube, Myntra, Google Play) with strict metadata and timestamp validation.',
      detail: 'Parses raw HTML/JSON, extracts reviewer identifiers, timestamps, verified purchase flags, and ratings.'
    },
    {
      num: '02',
      tag: 'LINGUISTIC NORMALIZATION',
      title: 'Syntax & Tokenization',
      desc: 'Text sanitization, n-gram extraction, punctuation stripping, and multi-lingual structure alignment while preserving original surface text for evidence audits.',
      detail: 'Computes character and word-level entropy metrics to separate natural variance from programmatic templates.'
    },
    {
      num: '03',
      tag: 'VECTOR COORDINATION LAB',
      title: 'Clustering & Burst Detection',
      desc: 'High-dimensional TF-IDF vectorization coupled with pairwise Cosine Similarity clustering and rolling z-score velocity deviation detection across 48-hour windows.',
      detail: 'Detects synchronized clone rings and abnormal submission rate surges that elude single-review spam filters.'
    },
    {
      num: '04',
      tag: 'THREAT DOSSIER GENERATION',
      title: 'Risk Posture Attribution',
      desc: 'Automated synthesis into a 0–100 Coordination Risk Index with transparent, non-accusatory evidence highlighting and audit-ready PDF reporting.',
      detail: 'Maps tripartite network graphs (Reviewer ➔ Review ➔ Product) to visualize collusive rings without black-box bias.'
    }
  ];

  return (
    <div className="bg-[#FFFDF4] min-h-screen text-[#242024] selection:bg-[#FFE59A] selection:text-[#30252A]">
      {/* Editorial Top Ticker */}
      <div className="border-b-2 border-[#30252A] bg-[#FAF6EC] px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono font-bold tracking-wider text-[#756D70]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#E94B4B] inline-block animate-ping"></span>
          <span className="text-[#30252A]">COORDINATEWATCH INTELLIGENCE DISPATCH</span>
          <span className="hidden md:inline text-[#E9E2D4]">|</span>
          <span className="hidden md:inline">INVESTIGATING SYNCHRONIZED DIGITAL CAMPAIGNS</span>
        </div>

        {/* Clearance Gate Status Link at Top */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/clearance')}
              className="px-2.5 py-1 bg-[#FFE59A] border border-[#30252A] text-[#30252A] text-[10px] font-mono font-black uppercase hover:bg-[#FFB86B] transition-colors flex items-center gap-1.5 shadow-[1px_1px_0px_#30252A]"
            >
              <UserCheck size={12} className="text-[#30252A]" />
              <span>CLEARANCE: {userContext?.identity || 'OP-7049'}</span>
              <span className="text-[#E94B4B] font-bold">({userContext?.clearanceLevel ? userContext.clearanceLevel.split(' ')[0] : 'ANALYST'})</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/clearance')}
              className="px-3 py-1 bg-[#E94B4B] text-white border border-[#30252A] text-[10px] font-mono font-black uppercase hover:bg-[#30252A] transition-colors flex items-center gap-1.5 shadow-[1px_1px_0px_#30252A]"
            >
              <KeyRound size={12} />
              <span>CLEARANCE GATE // AUTHENTICATE</span>
            </button>
          )}
          <span className="hidden sm:inline font-mono">SOC 2–ALIGNED ARCHITECTURE</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE59A] border-2 border-[#30252A] text-xs font-mono font-bold text-[#30252A] uppercase shadow-[2px_2px_0px_#30252A]">
                <span>EDITION 2026 // VOL. IV</span>
              </div>
              <span className="text-xs font-mono text-[#756D70] font-bold uppercase tracking-wider">
                SURVEILLANCE DOSSIER
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-display font-black text-[#30252A] leading-[1.08] tracking-tight">
              Not every crowd <br />
              <span className="text-[#E94B4B] italic">is organic.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#242024] font-medium leading-relaxed max-w-xl">
              CoordinateWatch AI uncovers the multi-agent patterns, phrase cloning, and temporal bursts hiding inside modern review campaigns.
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button 
                onClick={() => navigate(isAuthenticated ? '/scanner' : '/clearance')}
                className="btn-primary text-sm px-7 py-3.5 flex items-center gap-2"
              >
                <span>Explore the Signals</span>
                <ArrowRight size={16} />
              </button>

              <button 
                onClick={scrollToHowItWorks}
                className="btn-secondary text-sm px-7 py-3.5 flex items-center gap-2"
              >
                <span>See How It Works</span>
                <ChevronDown size={16} />
              </button>

              <button 
                onClick={() => navigate('/clearance')}
                className="px-6 py-3.5 bg-white border-2 border-[#30252A] text-[#30252A] font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_#30252A] hover:bg-[#FFE59A] transition-all"
              >
                <KeyRound size={16} className="text-[#E94B4B]" />
                <span>Clearance Gate</span>
              </button>
            </div>

            {/* In-Page Clearance Status Card */}
            <div className="p-4 bg-white border-2 border-[#30252A] shadow-[3px_3px_0px_#30252A] mt-6">
              <div className="flex items-center justify-between border-b border-[#E9E2D4] pb-2 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#756D70] flex items-center gap-1.5">
                  <Lock size={12} className="text-[#E94B4B]" /> SECURITY CLEARANCE STATUS
                </span>
                <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 border border-[#30252A] ${
                  isAuthenticated ? 'bg-[#79C99A] text-[#30252A]' : 'bg-[#FFE59A] text-[#30252A]'
                }`}>
                  {isAuthenticated ? 'AUTHENTICATED' : 'UNVERIFIED GUEST'}
                </span>
              </div>

              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[#756D70] block">Operator ID: <b className="text-[#30252A]">{userContext?.identity}</b></span>
                    <span className="text-[#756D70]">Assignment: <b className="text-[#E94B4B]">{userContext?.clearanceLevel}</b></span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/clearance')}
                      className="px-3 py-1.5 bg-[#FAF6EC] border border-[#30252A] text-[#30252A] text-[10px] font-bold uppercase hover:bg-[#FFE59A] transition-colors"
                    >
                      Update Clearance
                    </button>
                    <button
                      onClick={onLogout}
                      className="px-3 py-1.5 bg-white border border-[#30252A] text-[#E94B4B] text-[10px] font-bold uppercase hover:bg-[#E94B4B] hover:text-white transition-colors"
                    >
                      Exit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <p className="text-[#756D70] leading-snug">
                    Authentication is required to access live surveillance telemetry, case files, and coordination models.
                  </p>
                  <button
                    onClick={() => navigate('/clearance')}
                    className="btn-primary text-[10px] py-1.5 px-3 shrink-0"
                  >
                    Authenticate At Clearance Gate ➔
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hero Visual Dossier Stamp */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-[#FFE59A] border-2 border-[#30252A] transform rotate-3 translate-x-2 translate-y-2"></div>
            <div className="relative z-10 bg-white border-2 border-[#30252A] p-7 shadow-[4px_4px_0px_#30252A]">
              <div className="flex items-center justify-between border-b-2 border-[#30252A] pb-3 mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#756D70]">
                  ACTIVE SIGNAL DOSSIER
                </span>
                <span className="px-2 py-0.5 bg-[#E94B4B] text-white text-[9px] font-mono font-black uppercase">
                  HIGH CORRELATION
                </span>
              </div>

              <p className="text-xl font-display italic text-[#30252A] leading-snug mb-5">
                "Absolutely amazing sound quality, best earbuds I have ever owned! Highly recommend to everyone."
              </p>

              <div className="bg-[#FAF6EC] border-2 border-[#30252A] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#E94B4B] flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Cloned N-Gram Cluster
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#FFE59A] px-2 py-0.5 border border-[#30252A]">
                    SIM: 94.2%
                  </span>
                </div>
                <p className="text-xs text-[#242024] leading-relaxed">
                  Identical syntactic template replicated across 80 unique submissions in a 36-hour burst window on Amazon.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E9E2D4] flex items-center justify-between text-[10px] font-mono text-[#756D70]">
                <span>EVIDENCE REF // AMZ-089</span>
                <span className="font-bold text-[#30252A]">ATTRIBUTION: COLLUSIVE RING</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why CoordinateWatch Section: Comparison Matrix */}
      <section className="py-20 px-8 bg-white border-y-2 border-[#30252A]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E94B4B] block mb-2">
              METHODOLOGICAL ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#30252A]">
              Why Single-Review Moderation Fails
            </h2>
            <p className="text-sm text-[#756D70] mt-3 font-medium">
              Individual reviews in a coordinated campaign are often grammatically flawless and appear benign in isolation. Detection requires cross-review comparative topology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Traditional Moderation Card */}
            <div className="bg-[#FAF6EC] border-2 border-[#E9E2D4] p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-[#E9E2D4] pb-3 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#756D70]">
                    LEGACY PARADIGM
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#756D70]">ISOLATED SCOPE</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-[#756D70] mb-4">
                  Traditional Review Moderation
                </h3>
                <ul className="space-y-3.5 text-sm text-[#756D70] font-medium">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#756D70]"></span>
                    <span>Basic keyword and profanity spam filters</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#756D70]"></span>
                    <span>Single-review rating validation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#756D70]"></span>
                    <span>Superficial account age checks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#756D70]"></span>
                    <span>Black-box sentiment scoring</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E9E2D4] text-xs font-mono italic text-[#756D70]">
                Blind to distributed, syndicated multi-account review rings.
              </div>
            </div>

            {/* CoordinateWatch Intelligence Card */}
            <div className="bg-white border-2 border-[#30252A] p-8 flex flex-col justify-between shadow-[4px_4px_0px_#30252A] relative">
              <div className="absolute -top-3 right-6 bg-[#E94B4B] text-white text-[10px] font-mono font-bold px-3 py-1 uppercase tracking-wider border border-[#30252A]">
                THE COORDINATEWATCH STANDARD
              </div>
              <div>
                <div className="flex justify-between items-center border-b border-[#30252A] pb-3 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E94B4B]">
                    MULTI-AGENT ENGINE
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#30252A]">TOPOLOGICAL SCOPE</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-[#30252A] mb-4">
                  CoordinateWatch AI
                </h3>
                <ul className="space-y-3.5 text-sm text-[#30252A] font-bold">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#E94B4B] shrink-0"></span>
                    <span>High-Dimensional Cross-Review Similarity Matrix</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#E94B4B] shrink-0"></span>
                    <span>Rolling Temporal Concentration & Velocity Bursts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#E94B4B] shrink-0"></span>
                    <span>Reviewer Velocity & Rating Polarization Profiling</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#E94B4B] shrink-0"></span>
                    <span>Tripartite Entity Attribution (Reviewer ➔ Review ➔ Target)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#E94B4B] shrink-0"></span>
                    <span>Explainable Phrase Highlighting (Zero Black-Box Bias)</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-[#30252A] text-xs font-mono font-bold text-[#E94B4B]">
                Investigates the collective pattern, not just the isolated review.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Editorial Walkthrough ("See How It Works") */}
      <section ref={howItWorksRef} className="py-24 px-8 max-w-6xl mx-auto scroll-mt-6">
        <div className="border-b-2 border-[#30252A] pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E94B4B] block mb-2">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-4xl font-display font-black text-[#30252A]">
              How CoordinateWatch Works
            </h2>
            <p className="text-sm text-[#756D70] font-medium mt-1">
              A 4-stage deterministic pipeline from raw marketplace ingestion to transparent threat attribution.
            </p>
          </div>
          <button 
            onClick={() => navigate(isAuthenticated ? '/scanner' : '/clearance')}
            className="btn-primary text-xs py-2.5 px-5 self-start md:self-auto flex items-center gap-1.5"
          >
            <span>Launch Live Scanner</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 4 Multi-Column Editorial Walkthrough Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((st) => (
            <div 
              key={st.num}
              className="bg-white border-2 border-[#30252A] p-8 shadow-[3px_3px_0px_#30252A] flex flex-col justify-between transition-transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between border-b-2 border-[#30252A] pb-3 mb-5">
                  <span className="inline-block px-2.5 py-0.5 bg-[#FFE59A] border border-[#30252A] font-mono font-black text-sm text-[#30252A]">
                    CARD {st.num}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#756D70]">
                    {st.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-[#30252A] mb-3">
                  {st.title}
                </h3>

                <p className="text-sm text-[#242024] font-medium leading-relaxed mb-6">
                  {st.desc}
                </p>
              </div>

              <div className="p-3.5 bg-[#FAF6EC] border border-[#30252A] text-xs font-mono text-[#756D70] leading-normal">
                <span className="font-bold text-[#30252A] block mb-1">TECHNICAL SPECIFICATION:</span>
                {st.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Editorial Callout */}
      <section className="pb-24 px-8 max-w-6xl mx-auto">
        <div className="bg-[#FFE59A] border-2 border-[#30252A] p-8 sm:p-12 shadow-[4px_4px_0px_#30252A] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#30252A]">
              INTERACTION DISPATCH
            </span>
            <h3 className="text-3xl font-display font-black text-[#30252A]">
              Ready to authenticate or investigate a dataset?
            </h3>
            <p className="text-sm text-[#30252A] font-medium">
              Open the Clearance Gate to authenticate analyst credentials or test adversarial review batches in the Signal Scanner.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button 
              onClick={() => navigate('/clearance')}
              className="btn-primary text-xs px-6 py-3.5"
            >
              Clearance Gate
            </button>
            <button 
              onClick={() => navigate(isAuthenticated ? '/scanner' : '/clearance')}
              className="btn-secondary text-xs px-6 py-3.5"
            >
              Scan Review Set
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
