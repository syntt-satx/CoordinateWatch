import React, { useState } from 'react';
import { BookOpen, ChevronRight, Shield, AlertTriangle, Info, Terminal, FileText, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
  {
    id: '01',
    title: '01 Getting Started',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          Welcome to <b>CoordinateWatch AI</b> — an explainable intelligence platform engineered to detect coordinated review manipulation campaigns across modern ecommerce and digital platforms.
        </p>
        <div className="p-4 bg-butter bg-opacity-30 border-l-4 border-darkInk">
          <p className="font-bold text-darkInk">Core Investigative Tenet</p>
          <p className="italic text-sm text-text">"Don't judge the review. Investigate the pattern."</p>
        </div>
        <p className="text-sm text-muted">
          Unlike legacy moderation tools that inspect single reviews in isolation, CoordinateWatch compares multi-agent clusters across text, time, and rating distributions.
        </p>
      </div>
    )
  },
  {
    id: '02',
    title: '02 Understanding The Watch',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          <b>The Watch</b> is the operational control center. It aggregates real-time signals into KPI cards and a prioritized product watchlist.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text">
          <li><b>Reviews Analysed:</b> Total raw records ingested and normalized by the pipeline.</li>
          <li><b>High-Risk Cases:</b> Products or targets whose aggregate coordination score surpasses the 70/100 threshold.</li>
          <li><b>Product Watchlist:</b> Ranked table of target entities displaying real-time risk indicators.</li>
        </ul>
      </div>
    )
  },
  {
    id: '03',
    title: '03 Running A Case',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          In <b>Case Files</b>, analysts inspect specific products. Opening a case reveals:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text">
          <li><b>Overall Risk Index:</b> Normalized 0–100 risk score based on weighted multi-signal aggregation.</li>
          <li><b>Radar Breakdown:</b> Individual scores for Text Similarity, Temporal Spikes, Rating Polarization, and Reviewer Velocity.</li>
          <li><b>Top Evidence Stream:</b> Specific review excerpts with corresponding risk contributions.</li>
        </ul>
      </div>
    )
  },
  {
    id: '04',
    title: '04 Reading Risk Scores',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">CoordinateWatch categorizes risk into three documented prototype bands:</p>
        <div className="grid grid-cols-3 gap-4 text-xs font-bold uppercase">
          <div className="p-4 bg-mint bg-opacity-20 border-2 border-mint text-darkInk">
            <span className="block text-lg font-black font-display">0 – 30</span>
            LOW RISK • Organic baseline pattern
          </div>
          <div className="p-4 bg-peach bg-opacity-20 border-2 border-peach text-darkInk">
            <span className="block text-lg font-black font-display">31 – 70</span>
            MEDIUM RISK • Anomalies detected
          </div>
          <div className="p-4 bg-cherry bg-opacity-10 border-2 border-cherry text-cherry">
            <span className="block text-lg font-black font-display">71 – 100</span>
            HIGH RISK • Coordinated activity likely
          </div>
        </div>
      </div>
    )
  },
  {
    id: '05',
    title: '05 Understanding Signals',
    content: (
      <div className="space-y-3 text-sm">
        <div className="card p-4">
          <h4 className="font-bold text-darkInk">1. Text Similarity (Weight: 35%)</h4>
          <p className="text-muted text-xs mt-1">Identifies identical phrasing and semantic cloning using TF-IDF and Cosine Similarity.</p>
        </div>
        <div className="card p-4">
          <h4 className="font-bold text-darkInk">2. Temporal Concentration (Weight: 30%)</h4>
          <p className="text-muted text-xs mt-1">Measures review velocity deviations across rolling 48-hour windows against standard deviation baselines.</p>
        </div>
        <div className="card p-4">
          <h4 className="font-bold text-darkInk">3. Rating Synchronization (Weight: 20%)</h4>
          <p className="text-muted text-xs mt-1">Detects polarized 1-star or 5-star concentration clusters indicative of boost or smear campaigns.</p>
        </div>
        <div className="card p-4">
          <h4 className="font-bold text-darkInk">4. Reviewer Behaviour (Weight: 15%)</h4>
          <p className="text-muted text-xs mt-1">Profiles multi-product frequency and extreme scoring tendencies.</p>
        </div>
      </div>
    )
  },
  {
    id: '06',
    title: '06 Using WatchLens',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          <b>WatchLens</b> is our Chrome Manifest V3 extension. It operates directly in the browser when viewing ecommerce review pages.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-text">
          <li>Open a supported Amazon product or review page.</li>
          <li>Click the WatchLens browser icon.</li>
          <li>Click <b>"Scan This Page"</b> to extract visible reviews and stream them into the local backend.</li>
          <li>Inspect instant risk scores and click <b>"View Full Analysis"</b> to open the local dossier.</li>
        </ol>
      </div>
    )
  },
  {
    id: '07',
    title: '07 Running Coordination Lab',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          <b>Coordination Lab</b> enables controlled stress-testing. Analysts synthesize benchmark campaigns (Rating Boosts, Negative Smear campaigns) at varying temporal intensities to observe how the detection pipeline catches and scores emerging threats.
        </p>
      </div>
    )
  },
  {
    id: '08',
    title: '08 Reading The Posture',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          <b>The Posture</b> offers an executive aggregate view:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-text">
          <li><b>30-Day Activity Curve:</b> Highlights divergence between organic reviews and coordinated spikes.</li>
          <li><b>Global Risk Distribution:</b> Proportional breakdown of catalog health.</li>
        </ul>
      </div>
    )
  },
  {
    id: '09',
    title: '09 Exporting Reports',
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          Generate formal PDF audit dossiers via the <b>Reports</b> view. All exported artifacts include methodology definitions, dataset timestamps, signal weights, and compliance disclaimers suitable for audit archives.
        </p>
      </div>
    )
  },
  {
    id: '10',
    title: '10 Methodology',
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Our analytical architecture follows a deterministic, modular pipeline:
        </p>
        <div className="p-4 bg-darkInk text-surface font-mono text-xs space-y-1">
          <p>Raw Data → Ingestion & Cleaning → Normalization → Feature Extraction</p>
          <p>→ Multi-Signal Analysis (Text, Time, Rating, Behavior)</p>
          <p>→ Weighted Aggregation → Band Classification → Explainable Evidence</p>
        </div>
      </div>
    )
  },
  {
    id: '11',
    title: '11 Limitations',
    content: (
      <div className="space-y-4">
        <div className="p-4 border-2 border-cherry bg-peach bg-opacity-10">
          <h4 className="font-bold text-cherry text-sm uppercase flex items-center gap-2">
            <AlertTriangle size={16} /> Non-Definitive Attribution Notice
          </h4>
          <p className="text-xs text-text mt-2 leading-relaxed">
            CoordinateWatch AI detects statistical and behavioral correlation. It does not possess direct knowledge of user identity or off-platform collusion. Scores represent probability indicators to guide human-in-the-loop Trust & Safety review.
          </p>
        </div>
      </div>
    )
  }
];

export default function FieldGuide() {
  const [activeSection, setActiveSection] = useState('01');

  const current = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];

  return (
    <div className="p-8 max-w-6xl mx-auto flex gap-8 h-[calc(100vh-2rem)]">
      {/* Sidebar Navigation */}
      <div className="w-1/3 flex flex-col border-r-2 border-border pr-6">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-cherry">Official Documentation</span>
          <h1 className="text-3xl font-display font-black text-darkInk mt-1">Field Guide</h1>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left p-3 text-xs font-bold uppercase tracking-wider transition-all flex justify-between items-center border-l-4 ${
                activeSection === sec.id
                  ? 'bg-butter bg-opacity-30 border-cherry text-darkInk'
                  : 'border-transparent text-muted hover:bg-canvas hover:text-darkInk'
              }`}
            >
              <span>{sec.title}</span>
              <ChevronRight size={14} className={activeSection === sec.id ? 'text-cherry' : 'opacity-0'} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Pane */}
      <div className="w-2/3 flex flex-col pl-2 overflow-y-auto">
        <div className="card p-8 bg-surface border-2 border-border flex-1">
          <h2 className="text-2xl font-display font-black text-darkInk border-b-2 border-border pb-4 mb-6">
            {current.title}
          </h2>
          <div className="text-darkInk leading-relaxed font-sans">
            {current.content}
          </div>
        </div>
      </div>
    </div>
  );
}
