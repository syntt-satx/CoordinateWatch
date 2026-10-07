import React, { useState } from 'react';
import { Activity, Search, AlertTriangle, Info, CheckCircle2, Upload, FileText, Sparkles } from 'lucide-react';

const HighlightedText = ({ text, commonPhrases }) => {
  if (!commonPhrases || commonPhrases.length === 0) return <span>{text}</span>;

  let matches = [];
  commonPhrases.forEach(phrase => {
    const safePhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safePhrase})`, 'gi');
    if (regex.test(text)) {
      matches.push(phrase);
    }
  });

  if (matches.length === 0) return <span>{text}</span>;

  const phrase = matches[0];
  const parts = text.split(new RegExp(`(${phrase})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === phrase.toLowerCase() ? (
          <span key={i} className="group relative bg-butter bg-opacity-80 border-b-2 border-cherry cursor-help px-1 font-medium">
            {part}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-darkInk text-surface text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
              <span className="block font-bold text-cherry mb-1">WHY FLAGGED?</span>
              High textual similarity detected across the analyzed review set. This exact n-gram phrase appears with statistical frequency across multiple submissions.
            </span>
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function SignalScanner() {
  const [inputText, setInputText] = useState(
    "Absolutely amazing sound quality, best earbuds I have ever owned! Highly recommend to everyone.\n" +
    "Absolutely amazing sound quality, best earbuds I have ever owned! Great battery life too.\n" +
    "Sound quality is absolutely amazing, best earbuds I have ever owned! Super fast delivery.\n" +
    "Best earbuds I have ever owned, absolutely amazing sound quality! Must buy.\n" +
    "Decent pair of earbuds, battery lasts about 4 hours."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeInputTab, setActiveInputTab] = useState('text'); // 'text' | 'csv'

  const handleScanText = async () => {
    const reviews = inputText.split('\n').filter(r => r.trim().length > 0);
    if (reviews.length < 2) {
      setError("Please provide at least 2 reviews (one per line) for comparative analysis.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Analysis failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/scan/upload-csv', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error("CSV processing failed. Ensure file has 'review_text' column.");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type) => {
    if (type === 'bot_spam') {
      setInputText(
        "Mr. Harrison helped me recover my lost assets in less than 24 hours! Contact him on telegram @cryptofix_official\n" +
        "I was skeptical until Mr. Harrison recovered my assets in less than 24 hours! Contact telegram @cryptofix_official\n" +
        "Big thanks to Mr. Harrison for recovering my crypto investment in 24 hours! Reach out @cryptofix_official\n" +
        "Trustworthy recovery service by Mr. Harrison, helped me get my funds back within 24h via telegram @cryptofix_official\n" +
        "Great video on Web3 security, learned a lot from this channel."
      );
    } else if (type === 'organic') {
      setInputText(
        "Solid coffee maker for the price, brews quickly in the morning.\n" +
        "Timer function is convenient, but carafe doesn't keep coffee warm very long.\n" +
        "Takes up minimal counter space. Clean design.\n" +
        "Arrived with a slight dent on the box, but machine works fine.\n" +
        "Good value overall, would buy again for our office."
      );
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto flex gap-8 h-[calc(100vh-2rem)]">
      {/* Input Section */}
      <div className="w-1/2 flex flex-col">
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cherry block mb-1">Comparative Inference</span>
          <h1 className="text-3xl font-display font-black text-darkInk tracking-tight">Signal Scanner</h1>
          <p className="text-xs text-muted font-medium mt-1">Real-time cross-review pattern & syntactic analysis</p>
        </div>

        {/* Input Switcher Tabs */}
        <div className="flex gap-2 border-b-2 border-border mb-4">
          <button
            onClick={() => setActiveInputTab('text')}
            className={`pb-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 -mb-[2px] transition-all ${
              activeInputTab === 'text' ? 'border-cherry text-darkInk font-black' : 'border-transparent text-muted hover:text-darkInk'
            }`}
          >
            Paste Reviews
          </button>
          <button
            onClick={() => setActiveInputTab('csv')}
            className={`pb-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 -mb-[2px] transition-all ${
              activeInputTab === 'csv' ? 'border-cherry text-darkInk font-black' : 'border-transparent text-muted hover:text-darkInk'
            }`}
          >
            Upload CSV File
          </button>
        </div>

        <div className="card flex-1 flex flex-col p-6 bg-surface">
          {activeInputTab === 'text' ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-darkInk uppercase tracking-wide">
                  Review Text Stream (One per line)
                </label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => loadPreset('bot_spam')} 
                    className="text-[10px] font-bold uppercase tracking-wider bg-canvas border border-border px-2 py-0.5 hover:border-darkInk"
                  >
                    Bot Sample
                  </button>
                  <button 
                    onClick={() => loadPreset('organic')} 
                    className="text-[10px] font-bold uppercase tracking-wider bg-canvas border border-border px-2 py-0.5 hover:border-darkInk"
                  >
                    Organic Sample
                  </button>
                </div>
              </div>

              <textarea 
                className="flex-1 w-full border-2 border-border p-4 focus:outline-none focus:border-cherry bg-canvas text-text resize-none font-sans text-xs leading-relaxed"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Paste review batch here..."
              />

              {error && <p className="text-cherry text-xs font-bold mt-3">{error}</p>}

              <button 
                onClick={handleScanText}
                disabled={loading}
                className="w-full btn-primary mt-4 py-3.5 uppercase tracking-wider font-bold flex justify-center items-center gap-2"
              >
                {loading ? 'Processing Embeddings...' : <><Search size={16} /> Scan Review Set</>}
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-border p-8 text-center bg-canvas">
              <Upload size={36} className="text-muted mb-3" />
              <h4 className="font-bold text-sm text-darkInk uppercase tracking-wider mb-1">Drop Review CSV File Here</h4>
              <p className="text-xs text-muted mb-4">File should contain a column named <code>review_text</code></p>
              
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileUpload}
                className="text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:uppercase file:bg-darkInk file:text-white hover:file:bg-cherry file:cursor-pointer"
              />
              
              {error && <p className="text-cherry text-xs font-bold mt-4">{error}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="w-1/2 flex flex-col">
        {!result && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border text-muted p-12 text-center bg-surface">
            <Activity size={48} className="mb-4 opacity-20" />
            <h3 className="font-display font-bold text-lg mb-2 text-darkInk">Comparative Engine Ready</h3>
            <p className="text-xs leading-relaxed max-w-xs">
              Coordination detection requires comparative analysis. Input multiple submissions to calculate syntactic entropy and cluster density.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border bg-surface">
            <Activity size={48} className="mb-4 text-cherry animate-pulse" />
            <p className="font-bold text-xs text-darkInk uppercase tracking-widest animate-pulse">Running TF-IDF Cosine Clustered Scan...</p>
          </div>
        )}

        {result && !loading && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className={`card p-6 border-l-4 mb-4 ${result.riskClassification === 'HIGH' ? 'border-l-cherry bg-peach bg-opacity-10' : 'border-l-mint bg-surface'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted">Comparative Score</span>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                  result.riskClassification === 'HIGH' ? 'bg-cherry text-white' : 
                  result.riskClassification === 'MEDIUM' ? 'bg-peach text-darkInk' : 
                  'bg-mint text-darkInk'
                }`}>
                  {result.riskClassification} RISK LEVEL
                </span>
              </div>
              <div className="flex items-baseline">
                <span className="text-5xl font-display font-black text-darkInk">{result.overallRiskScore}</span>
                <span className="text-muted font-bold ml-2 text-xs uppercase tracking-widest">/ 100</span>
              </div>
            </div>

            {/* Explainable Highlighting Card */}
            <div className="flex-1 overflow-y-auto card p-0 bg-surface flex flex-col">
              <div className="p-4 bg-canvas border-b-2 border-border flex justify-between items-center sticky top-0 z-10">
                <h3 className="font-bold text-xs uppercase tracking-wider text-darkInk flex items-center gap-1.5">
                  <Info size={14} className="text-cherry"/> Explainable Phrase Cloning
                </h3>
                <span className="text-[10px] text-muted font-mono font-bold">{result.reviews.length} processed</span>
              </div>

              <div className="divide-y divide-border overflow-y-auto flex-1">
                {result.reviews.map((rev, idx) => (
                  <div key={idx} className={`p-4 transition-colors ${rev.signal_text_similarity > 0.5 ? 'bg-peach bg-opacity-10' : 'hover:bg-canvas'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-muted font-mono uppercase">Item #{idx + 1}</span>
                      {rev.signal_text_similarity > 0.5 && (
                        <span className="text-[9px] uppercase font-bold text-cherry border border-cherry px-1.5 py-0.5 bg-surface">
                          Cloned Phrasing Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-darkInk">
                      <HighlightedText text={rev.review_text_original} commonPhrases={result.commonPhrases} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
