import React, { useState, useEffect } from 'react';
import { 
  FileText, ChevronRight, AlertTriangle, Clock, Users, Star, 
  MessageSquare, Network, BarChart2, ShieldAlert, ShieldCheck, Info 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export default function CaseFiles() {
  const [products, setProducts] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('signals'); // 'signals' | 'network' | 'timeline' | 'evidence'

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        if (data.length > 0) {
          loadCase(data[0].product_id);
        }
        setLoading(false);
      })
      .catch(err => console.error("Error loading products:", err));
  }, []);

  const loadCase = async (productId) => {
    setSelectedCase(productId);
    try {
      const res = await fetch(`http://localhost:8000/api/cases/${productId}`);
      const data = await res.json();
      setCaseData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getRiskBadge = (level) => {
    if (level === 'HIGH') return 'bg-cherry text-white';
    if (level === 'MEDIUM') return 'bg-peach text-darkInk';
    return 'bg-mint text-darkInk';
  };

  const getRiskColor = (level) => {
    if (level === 'HIGH') return 'text-cherry';
    if (level === 'MEDIUM') return 'text-peach';
    return 'text-mint';
  };

  if (loading && !products.length) {
    return <div className="p-8 font-bold text-darkInk animate-pulse">Loading case files archive...</div>;
  }

  // Format rating distribution for charts
  const ratingChartData = caseData && caseData.ratingDistribution ? [
    { star: '5★', count: caseData.ratingDistribution['5'] || 0, fill: '#FFE59A' },
    { star: '4★', count: caseData.ratingDistribution['4'] || 0, fill: '#E9E2D4' },
    { star: '3★', count: caseData.ratingDistribution['3'] || 0, fill: '#E9E2D4' },
    { star: '2★', count: caseData.ratingDistribution['2'] || 0, fill: '#E9E2D4' },
    { star: '1★', count: caseData.ratingDistribution['1'] || 0, fill: '#E94B4B' },
  ] : [];

  return (
    <div className="flex h-[calc(100vh-1px)] overflow-hidden">
      {/* Sidebar: Curated Cases */}
      <div className="w-80 border-r-2 border-border bg-surface flex flex-col shrink-0">
        <div className="p-5 border-b-2 border-border">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cherry block mb-1">Target Archive</span>
          <h1 className="text-2xl font-display font-black text-darkInk tracking-tight">Case Files</h1>
          <p className="text-xs text-muted mt-1 font-medium">5 Curated Investigation Targets</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas">
          {products.map(prod => (
            <button
              key={prod.product_id}
              onClick={() => loadCase(prod.product_id)}
              className={`w-full text-left p-4 card transition-all border-2 block ${
                selectedCase === prod.product_id ? 'border-cherry shadow-md bg-surface' : 'border-border hover:border-darkInk bg-surface'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">{prod.platform || 'Platform'}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${getRiskBadge(prod.overall_risk_level)}`}>
                  {prod.overall_risk_level}
                </span>
              </div>
              <p className="font-display font-bold text-sm text-darkInk leading-snug line-clamp-1 mb-1">
                {prod.product_name || prod.product_id}
              </p>
              <div className="flex justify-between items-center text-xs text-muted font-mono mt-3 pt-2 border-t border-border">
                <span>{prod.review_count} Reviews</span>
                <span className="font-bold text-darkInk">Risk: {Math.round(prod.avg_risk_score)}/100</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Case File Details Content */}
      <div className="flex-1 flex flex-col bg-canvas overflow-y-auto">
        {!caseData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted">
            <FileText size={48} className="mb-4 opacity-30" />
            <p className="font-bold text-sm uppercase tracking-widest">Select a case file to begin analysis</p>
          </div>
        ) : (
          <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
            {/* Top Case Banner */}
            <div className="flex justify-between items-start border-b-2 border-border pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-darkInk text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                    {caseData.platform}
                  </span>
                  <span className="text-xs font-mono text-muted">ID: {caseData.productId}</span>
                </div>
                <h2 className="text-3xl font-display font-black text-darkInk">{caseData.productName}</h2>
                <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">{caseData.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Overall Coordination Risk</span>
                <div className="flex items-baseline justify-end gap-2">
                  <span className={`text-5xl font-display font-black ${getRiskColor(caseData.riskClassification)}`}>
                    {caseData.overallRiskScore}
                  </span>
                  <span className="text-xs font-bold text-muted uppercase tracking-widest">/ 100</span>
                </div>
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wider ${getRiskBadge(caseData.riskClassification)}`}>
                  {caseData.riskClassification} RISK LEVEL
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-1">Total Volume</span>
                <span className="text-xl font-display font-black text-darkInk">{caseData.reviewCount}</span>
              </div>
              <div className="card p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-1">Avg Rating</span>
                <span className="text-xl font-display font-black text-darkInk flex justify-center items-center gap-1">
                  {caseData.averageRating} <Star size={16} className="text-butter fill-butter" />
                </span>
              </div>
              <div className="card p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-1">Unique Authors</span>
                <span className="text-xl font-display font-black text-darkInk">{caseData.uniqueReviewers}</span>
              </div>
              <div className="card p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-1">Reviews / User</span>
                <span className="text-xl font-display font-black text-darkInk">{caseData.reviewsPerUser}</span>
              </div>
            </div>

            {/* Sub-view Tabs */}
            <div className="flex border-b-2 border-border gap-2">
              {[
                { id: 'signals', label: 'Signal Radar', icon: <AlertTriangle size={15} /> },
                { id: 'network', label: 'Cluster Network Graph', icon: <Network size={15} /> },
                { id: 'timeline', label: 'Rating & Temporal Curves', icon: <BarChart2 size={15} /> },
                { id: 'evidence', label: 'Evidence Stream', icon: <FileText size={15} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 -mb-[2px] transition-all ${
                    activeTab === tab.id
                      ? 'border-cherry bg-butter bg-opacity-30 text-darkInk'
                      : 'border-transparent text-muted hover:text-darkInk hover:bg-canvas'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Signals Breakdown */}
            {activeTab === 'signals' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className={`card ${caseData.signals.textSimilarity > 0.4 ? 'border-cherry bg-peach bg-opacity-10' : ''}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold flex items-center text-darkInk"><MessageSquare size={16} className="mr-2" /> Text Similarity</h4>
                      <span className="font-display font-black text-lg">{Math.round(caseData.signals.textSimilarity * 100)}%</span>
                    </div>
                    <p className="text-xs text-text leading-relaxed">
                      {caseData.signals.textSimilarity > 0.4 
                        ? "High textual similarity detected. Indicates highly repetitive language across multiple reviews, often a sign of copy-paste campaigns."
                        : "Normal text variance observed. Reviews appear individually authored."}
                    </p>
                  </div>

                  <div className={`card ${caseData.signals.temporalConcentration > 0.4 ? 'border-cherry bg-peach bg-opacity-10' : ''}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold flex items-center text-darkInk"><Clock size={16} className="mr-2" /> Activity Burst</h4>
                      <span className="font-display font-black text-lg">{Math.round(caseData.signals.temporalConcentration * 100)}%</span>
                    </div>
                    <p className="text-xs text-text leading-relaxed">
                      {caseData.signals.temporalConcentration > 0.4 
                        ? "Unusual concentration of reviews detected within a narrow time window, deviating from expected organic velocity."
                        : "Review velocity appears natural without artificial spiking."}
                    </p>
                  </div>

                  <div className={`card ${caseData.signals.ratingSynchronization > 0.5 ? 'border-cherry bg-peach bg-opacity-10' : ''}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold flex items-center text-darkInk"><Star size={16} className="mr-2" /> Rating Pattern</h4>
                      <span className="font-display font-black text-lg">{Math.round(caseData.signals.ratingSynchronization * 100)}%</span>
                    </div>
                    <p className="text-xs text-text leading-relaxed">
                      {caseData.signals.ratingSynchronization > 0.5 
                        ? "Unnatural concentration of extreme ratings observed, suggesting an orchestrated rating manipulation campaign."
                        : "Rating distribution follows expected organic patterns."}
                    </p>
                  </div>

                  <div className={`card ${caseData.signals.reviewerBehaviour > 0.3 ? 'border-cherry bg-peach bg-opacity-10' : ''}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold flex items-center text-darkInk"><Users size={16} className="mr-2" /> Reviewer Behaviour</h4>
                      <span className="font-display font-black text-lg">{Math.round(caseData.signals.reviewerBehaviour * 100)}%</span>
                    </div>
                    <p className="text-xs text-text leading-relaxed">
                      {caseData.signals.reviewerBehaviour > 0.3 
                        ? "Elevated number of reviewers exhibiting high-velocity or extreme-rating behaviour patterns."
                        : "Reviewer profiles generally align with standard consumer behavior."}
                    </p>
                  </div>
                </div>

                {caseData.commonPhrases && caseData.commonPhrases.length > 0 && (
                  <div className="card p-5 bg-butter bg-opacity-20 border-l-4 border-l-cherry">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cherry block mb-1">Cloned N-Gram Clusters Detected</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {caseData.commonPhrases.map((phrase, idx) => (
                        <span key={idx} className="px-3 py-1 bg-surface border border-border text-xs font-mono font-bold text-darkInk shadow-sm">
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Interactive Cluster Network Graph */}
            {activeTab === 'network' && (
              <div className="card p-6 bg-surface space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-darkInk flex items-center gap-2">
                      <Network size={16} className="text-cherry" /> Tripartite Graph: Reviewer → Review → Product
                    </h3>
                    <p className="text-xs text-muted mt-0.5">Visualizing structural clustering and multi-account correlation</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-butter border border-darkInk inline-block"></span> Reviewer</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-peach border border-darkInk inline-block"></span> Review</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cherry border border-darkInk inline-block"></span> Target Product</span>
                  </div>
                </div>

                {/* SVG Graph Renderer */}
                <div className="h-72 bg-canvas border-2 border-border p-4 relative overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 700 240">
                    {/* Background Grid Lines */}
                    <line x1="150" y1="20" x2="150" y2="220" stroke="#E9E2D4" strokeDasharray="4 4" />
                    <line x1="380" y1="20" x2="380" y2="220" stroke="#E9E2D4" strokeDasharray="4 4" />
                    <line x1="600" y1="20" x2="600" y2="220" stroke="#E9E2D4" strokeDasharray="4 4" />

                    <text x="150" y="235" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#756D70">REVIEWERS</text>
                    <text x="380" y="235" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#756D70">REVIEWS</text>
                    <text x="600" y="235" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#756D70">TARGET</text>

                    {/* Sample Graph Links */}
                    {[
                      { y1: 50, y2: 40 }, { y1: 50, y2: 80 }, { y1: 100, y2: 80 }, 
                      { y1: 100, y2: 130 }, { y1: 160, y2: 170 }, { y1: 160, y2: 130 }
                    ].map((l, i) => (
                      <line key={`l1-${i}`} x1="150" y1={l.y1} x2="380" y2={l.y2} stroke="#30252A" strokeWidth="1.5" strokeOpacity="0.4" />
                    ))}

                    {[40, 80, 130, 170].map((y, i) => (
                      <line key={`l2-${i}`} x1="380" y1={y} x2="600" y2="110" stroke="#E94B4B" strokeWidth="2" strokeOpacity="0.6" />
                    ))}

                    {/* Reviewer Nodes */}
                    {[
                      { y: 50, label: 'USER_1001' },
                      { y: 100, label: 'USER_1002' },
                      { y: 160, label: 'USER_1003' }
                    ].map((n, i) => (
                      <g key={`usr-${i}`}>
                        <circle cx="150" cy={n.y} r="12" fill="#FFE59A" stroke="#30252A" strokeWidth="2" />
                        <text x="130" y={n.y + 4} textAnchor="end" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#30252A">{n.label}</text>
                      </g>
                    ))}

                    {/* Review Nodes */}
                    {[
                      { y: 40, label: 'REV_01 (5★)' },
                      { y: 80, label: 'REV_02 (5★)' },
                      { y: 130, label: 'REV_03 (5★)' },
                      { y: 170, label: 'REV_04 (5★)' }
                    ].map((n, i) => (
                      <g key={`rev-${i}`}>
                        <rect x="370" y={n.y - 10} width="20" height="20" fill="#FFB86B" stroke="#30252A" strokeWidth="2" />
                        <text x="400" y={n.y + 4} fontSize="9" fontWeight="bold" fill="#30252A">{n.label}</text>
                      </g>
                    ))}

                    {/* Target Product Node */}
                    <g>
                      <circle cx="600" cy="110" r="20" fill="#E94B4B" stroke="#30252A" strokeWidth="2.5" />
                      <text x="600" y="114" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#FFFFFF">TARGET</text>
                    </g>
                  </svg>
                </div>
              </div>
            )}

            {/* Tab 3: Rating Distribution & Timeline */}
            {activeTab === 'timeline' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="font-bold text-darkInk uppercase tracking-widest text-xs mb-4">Rating Polarization</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ratingChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E9E2D4" />
                        <XAxis type="number" tick={{fill: '#756D70', fontSize: 11}} />
                        <YAxis dataKey="star" type="category" tick={{fill: '#30252A', fontWeight: 'bold'}} />
                        <Tooltip contentStyle={{backgroundColor: '#30252A', color: '#FFF'}} />
                        <Bar dataKey="count" barSize={20} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="font-bold text-darkInk uppercase tracking-widest text-xs mb-4">Activity Timeline (Daily Volume)</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={caseData.timeline || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E2D4" />
                        <XAxis dataKey="day_str" tick={{fill: '#756D70', fontSize: 9}} />
                        <YAxis tick={{fill: '#756D70', fontSize: 11}} />
                        <Tooltip contentStyle={{backgroundColor: '#30252A', color: '#FFF'}} />
                        <Line type="monotone" dataKey="count" stroke="#E94B4B" strokeWidth={3} dot={{fill: '#E94B4B', r: 4}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Top Evidence Feed */}
            {activeTab === 'evidence' && (
              <div className="space-y-4">
                {caseData.topReviews.map((review, idx) => (
                  <div key={idx} className="card p-5 border-l-4 border-l-cherry bg-surface">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-darkInk text-white px-2 py-0.5 text-xs font-bold font-mono">
                          {review.rating} ★
                        </span>
                        <span className="font-mono text-xs font-bold text-muted">{review.reviewer_id}</span>
                        {review.verified_purchase && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-mint text-darkInk font-bold uppercase">Verified</span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-muted">{review.timestamp}</span>
                    </div>

                    <p className="text-text italic border-l-2 border-border pl-3 text-sm leading-relaxed">
                      "{review.review_text_original}"
                    </p>

                    <div className="mt-3 pt-3 border-t border-border flex justify-between items-center text-xs">
                      <span className="font-bold text-cherry uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle size={14} /> Individual Risk Contribution: {review.coordination_risk_score}/100
                      </span>
                      <span className="text-muted font-mono">ID: {review.review_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
