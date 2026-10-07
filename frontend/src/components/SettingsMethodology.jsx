import React, { useState } from 'react';
import { Settings, Sliders, Shield, Database, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SettingsMethodology() {
  const [weights, setWeights] = useState({
    textSimilarity: 35,
    temporalBurst: 30,
    ratingConcentration: 20,
    reviewerBehavior: 15
  });

  const [thresholds, setThresholds] = useState({
    similarityThreshold: 0.85,
    timeWindowHours: 48,
    highRiskCutoff: 70,
    mediumRiskCutoff: 30
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="border-b-2 border-border pb-6">
        <h1 className="text-4xl font-display font-black text-darkInk tracking-tight">Settings & Methodology</h1>
        <p className="text-muted font-medium mt-1">Configure coordination detection weights, thresholds, and environment adapters</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Signal Weights */}
        <div className="card border-2 border-border p-6 bg-surface">
          <h3 className="text-lg font-display font-bold text-darkInk mb-4 flex items-center gap-2">
            <Sliders size={18} className="text-cherry" /> Signal Contribution Weights (%)
          </h3>
          <p className="text-xs text-muted mb-6">Must sum to 100%. Adjust how much each dimension contributes to the Coordination Risk Score.</p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkInk mb-1">
                Text Similarity ({weights.textSimilarity}%)
              </label>
              <input 
                type="range" min="0" max="100" 
                value={weights.textSimilarity}
                onChange={e => setWeights({...weights, textSimilarity: parseInt(e.target.value)})}
                className="w-full accent-cherry"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkInk mb-1">
                Temporal Concentration ({weights.temporalBurst}%)
              </label>
              <input 
                type="range" min="0" max="100" 
                value={weights.temporalBurst}
                onChange={e => setWeights({...weights, temporalBurst: parseInt(e.target.value)})}
                className="w-full accent-cherry"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkInk mb-1">
                Rating Synchronization ({weights.ratingConcentration}%)
              </label>
              <input 
                type="range" min="0" max="100" 
                value={weights.ratingConcentration}
                onChange={e => setWeights({...weights, ratingConcentration: parseInt(e.target.value)})}
                className="w-full accent-cherry"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkInk mb-1">
                Reviewer Behaviour ({weights.reviewerBehavior}%)
              </label>
              <input 
                type="range" min="0" max="100" 
                value={weights.reviewerBehavior}
                onChange={e => setWeights({...weights, reviewerBehavior: parseInt(e.target.value)})}
                className="w-full accent-cherry"
              />
            </div>
          </div>
        </div>

        {/* Thresholds */}
        <div className="card border-2 border-border p-6 bg-surface">
          <h3 className="text-lg font-display font-bold text-darkInk mb-4 flex items-center gap-2">
            <Shield size={18} className="text-cherry" /> Analytical Cutoffs & Risk Bands
          </h3>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkInk mb-2">
                TF-IDF Cosine Similarity Cutoff: {thresholds.similarityThreshold}
              </label>
              <input 
                type="number" step="0.05" min="0.5" max="1.0"
                value={thresholds.similarityThreshold}
                onChange={e => setThresholds({...thresholds, similarityThreshold: parseFloat(e.target.value)})}
                className="w-full border-2 border-border p-2 bg-canvas font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkInk mb-2">
                Rolling Burst Window (Hours)
              </label>
              <input 
                type="number" min="6" max="168"
                value={thresholds.timeWindowHours}
                onChange={e => setThresholds({...thresholds, timeWindowHours: parseInt(e.target.value)})}
                className="w-full border-2 border-border p-2 bg-canvas font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkInk mb-2">
                Medium Risk Threshold (Default 31)
              </label>
              <input 
                type="number" min="1" max="50"
                value={thresholds.mediumRiskCutoff}
                onChange={e => setThresholds({...thresholds, mediumRiskCutoff: parseInt(e.target.value)})}
                className="w-full border-2 border-border p-2 bg-canvas font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkInk mb-2">
                High Risk Threshold (Default 71)
              </label>
              <input 
                type="number" min="51" max="99"
                value={thresholds.highRiskCutoff}
                onChange={e => setThresholds({...thresholds, highRiskCutoff: parseInt(e.target.value)})}
                className="w-full border-2 border-border p-2 bg-canvas font-mono"
              />
            </div>
          </div>
        </div>

        {/* Database & Adapter Config */}
        <div className="card border-2 border-border p-6 bg-surface">
          <h3 className="text-lg font-display font-bold text-darkInk mb-3 flex items-center gap-2">
            <Database size={18} className="text-muted" /> Active Storage Adapter
          </h3>
          <div className="p-4 bg-canvas border border-border flex justify-between items-center text-xs">
            <div>
              <span className="font-bold block text-darkInk">Adapter: Local Flatfile & In-Memory Analytical Storage</span>
              <span className="text-muted">Target Path: data/amazon_reviews_synthetic.csv (Modular schema ready for Postgres/MongoDB)</span>
            </div>
            <span className="px-2 py-1 bg-mint text-darkInk font-bold uppercase tracking-wider">Active</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary uppercase tracking-wider text-sm font-bold py-3 px-8">
            Save Configuration
          </button>
          {saved && (
            <span className="text-xs font-bold text-mint flex items-center gap-1">
              <CheckCircle2 size={16} /> Parameters saved for active session
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
