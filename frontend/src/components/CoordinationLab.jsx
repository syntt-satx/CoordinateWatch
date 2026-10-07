import React, { useState } from 'react';
import { Layers, Play, Settings2, ShieldCheck, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

const DEFENSE_TRACE_STEPS = [
  "INPUT: Streaming review ingestion payload",
  "Text Analysis: Tokenizing & normalizing corpus",
  "Similarity Detection: Calculating TF-IDF Cosine matrix",
  "Temporal Analysis: Measuring rolling z-score velocity",
  "Reviewer Behaviour: Profiling multi-item velocity",
  "Rating Analysis: Evaluating 1★/5★ polarization index",
  "Correlation Engine: Synthesizing multi-signal weights",
  "Risk Score: Normalizing 0-100 Coordination Index",
  "Alert: Generating Explainable Defense Artifact"
];

export default function CoordinationLab() {
  const [scenario, setScenario] = useState('Rating Boost');
  const [reviewCount, setReviewCount] = useState(60);
  const [intensity, setIntensity] = useState('High');
  const [loading, setLoading] = useState(false);
  const [traceStep, setTraceStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    setResult(null);
    setTraceStep(0);

    // Step-by-step trace animation timer
    const interval = setInterval(() => {
      setTraceStep(prev => {
        if (prev < DEFENSE_TRACE_STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 200);

    try {
      const res = await fetch('http://localhost:8000/api/lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, reviewCount: parseInt(reviewCount), intensity })
      });
      const data = await res.json();
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 1800);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-cherry block mb-1">Controlled Stress-Test</span>
        <h1 className="text-3xl font-display font-black text-darkInk tracking-tight">Coordination Lab</h1>
        <p className="text-xs text-muted font-medium mt-1">Simulate adversarial coordination attacks & inspect live Defense Trace sequences</p>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Controls Column */}
        <div className="w-1/3 flex flex-col">
          <div className="card flex-1 p-6 bg-surface flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-darkInk mb-6 flex items-center border-b-2 border-border pb-3">
                <Settings2 size={16} className="mr-2 text-cherry" /> Simulation Parameters
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-darkInk mb-2 uppercase tracking-wide">Attack Scenario</label>
                  <select 
                    className="w-full border-2 border-border p-3 focus:outline-none focus:border-cherry bg-canvas text-darkInk font-medium text-xs appearance-none"
                    value={scenario} onChange={e => setScenario(e.target.value)}
                  >
                    <option value="Rating Boost">Rating Boost (Syndicated 5★)</option>
                    <option value="Coordinated Negative Campaign">Coordinated Negative Campaign (1★ Bomb)</option>
                    <option value="Promotional Campaign">Promotional Campaign (Affiliate Flooding)</option>
                    <option value="Product Launch">Product Launch (Seeded Astroturfing)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-bold text-darkInk uppercase tracking-wide">Synthetic Attack Volume</label>
                    <span className="text-xs font-mono font-bold text-cherry">{reviewCount} reviews</span>
                  </div>
                  <input 
                    type="range" min="10" max="150" step="10"
                    className="w-full accent-cherry"
                    value={reviewCount} onChange={e => setReviewCount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-darkInk mb-2 uppercase tracking-wide">Temporal Concentration Window</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map(lvl => (
                      <button 
                        key={lvl}
                        onClick={() => setIntensity(lvl)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                          intensity === lvl ? 'bg-darkInk text-white border-darkInk' : 'border-border text-muted hover:border-darkInk bg-canvas'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted mt-2 italic">
                    {intensity === 'Low' && 'Spread across a standard 48h baseline.'}
                    {intensity === 'Medium' && 'Concentrated into a 12h spike.'}
                    {intensity === 'High' && 'Flooded within a compressed 2h window.'}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSimulate} disabled={loading}
              className="w-full btn-primary py-4 uppercase tracking-wider font-bold flex justify-center items-center gap-2 text-xs"
            >
              {loading ? 'Synthesizing Adversarial Trace...' : <><Play size={16} className="fill-current" /> Trigger Simulation</>}
            </button>
          </div>
        </div>

        {/* Defense Trace Output Column */}
        <div className="w-2/3 flex flex-col bg-surface border-2 border-border relative overflow-hidden">
          <div className="p-4 bg-darkInk text-white flex justify-between items-center">
            <h3 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <Zap size={15} className="text-butter" /> Defense Trace Sequential Pipeline
            </h3>
            <span className="text-[10px] font-mono text-butter">MOCK_SANDBOX_ENV</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-canvas flex flex-col justify-between">
            {/* Sequential Steps Indicator */}
            <div className="mb-6 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-3">Live Execution Trace</span>
              <div className="grid grid-cols-3 gap-2">
                {DEFENSE_TRACE_STEPS.map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2.5 text-[10px] font-mono border ${
                      loading && traceStep === idx 
                        ? 'border-cherry bg-peach bg-opacity-20 text-cherry font-bold animate-pulse'
                        : traceStep > idx || result
                        ? 'border-mint bg-surface text-darkInk font-bold'
                        : 'border-border bg-canvas text-muted opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {traceStep > idx || result ? <CheckCircle2 size={12} className="text-mint shrink-0" /> : <span className="w-3 text-muted">0{idx+1}</span>}
                      <span className="truncate">{step.split(':')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Display */}
            {result && !loading && (
              <div className="card p-6 bg-surface border-2 border-border space-y-6">
                <div className="flex items-center justify-between border-b-2 border-border pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Defense Interception Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-display font-black ${result.overallRiskScore > 70 ? 'text-cherry' : 'text-peach'}`}>
                        {result.overallRiskScore}
                      </span>
                      <span className="text-xs font-bold text-muted uppercase">/ 100</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-mint text-darkInk text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={16} /> Intercepted & Scored
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-darkInk mb-3 uppercase tracking-widest text-xs">Flagged Synthetic Injections</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {result.simulatedReviews.slice(0, 5).map((rev, i) => (
                      <div key={i} className="p-3 border-l-4 border-l-cherry bg-peach bg-opacity-10 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono font-bold text-darkInk">{rev.review_id} ({rev.rating}★)</span>
                          <span className="font-bold text-cherry">{rev.coordination_risk_score}/100 Risk</span>
                        </div>
                        <p className="text-text italic">"{rev.review_text_original}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div className="h-48 flex flex-col items-center justify-center text-muted border-2 border-dashed border-border">
                <Layers size={36} className="mb-2 opacity-30" />
                <p className="font-bold text-xs uppercase tracking-widest">Select scenario parameters and run trace</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
