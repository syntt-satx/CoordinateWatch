import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldAlert, BarChart3, Target, AlertTriangle, ShieldCheck, ExternalLink, TrendingUp, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

export default function TheWatch() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 30-Day Coordination Landscape Data
  const landscapeData = [
    { day: 'Day 1', total: 18, flagged: 0 },
    { day: 'Day 4', total: 22, flagged: 0 },
    { day: 'Day 6', total: 45, flagged: 32 }, // Myntra burst
    { day: 'Day 8', total: 19, flagged: 1 },
    { day: 'Day 12', total: 85, flagged: 78 }, // Amazon burst
    { day: 'Day 15', total: 24, flagged: 2 },
    { day: 'Day 18', total: 68, flagged: 60 }, // YouTube campaign
    { day: 'Day 22', total: 95, flagged: 88 }, // Google Play bomb
    { day: 'Day 26', total: 28, flagged: 4 },
    { day: 'Day 30', total: 20, flagged: 1 },
  ];

  const riskDistribution = [
    { band: 'LOW (0-30)', count: 1, percent: 20, color: '#79C99A' },
    { band: 'MEDIUM (31-70)', count: 2, percent: 40, color: '#FFB86B' },
    { band: 'HIGH (71-100)', count: 2, percent: 40, color: '#E94B4B' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, prodRes] = await Promise.all([
          fetch('http://localhost:8000/api/dashboard/stats'),
          fetch('http://localhost:8000/api/products')
        ]);
        
        if (!statsRes.ok || !prodRes.ok) throw new Error('API request failed');
        
        setStats(await statsRes.json());
        setProducts(await prodRes.json());
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics telemetry. Ensure backend is active.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-darkInk font-bold animate-pulse">Loading intelligence telemetry...</div>;
  if (error) return <div className="p-8 text-cherry font-bold">{error}</div>;

  const getPrimarySignals = (prodId) => {
    switch (prodId) {
      case 'AMZ-EARBUDS-PRO-X': return 'Text Similarity, 36h Burst';
      case 'YT-VIDEO-CRYPTO-SCAN': return 'Bot Syntax, Off-Platform Promo';
      case 'MYN-DENIM-JACKET-99': return '5★ Rating Boost, Phrase Sync';
      case 'GP-FINTECH-APP-SEC': return '1★ Review Bomb, Polarized Smear';
      default: return 'Organic Variance (Normal)';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-border pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cherry block mb-1">Operational Telemetry</span>
          <h1 className="text-4xl font-display font-black text-darkInk tracking-tight">The Watch</h1>
          <p className="text-muted font-medium mt-1">Active coordinated review surveillance, landscape curves, and target watchlist</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">System Surveillance</p>
          <p className="flex items-center text-mint font-bold text-xs"><ShieldCheck size={16} className="mr-1.5" /> ACTIVE & SCANNING</p>
        </div>
      </div>

      {/* KPI Cards (6 Key Indicators) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="card border-t-4 border-t-darkInk p-4">
          <p className="text-[9px] uppercase tracking-widest font-bold text-muted mb-1">Reviews Analysed</p>
          <p className="text-2xl font-display font-black text-darkInk">{stats.reviewsAnalysed.toLocaleString()}</p>
        </div>
        <div className="card border-t-4 border-t-darkInk p-4">
          <p className="text-[9px] uppercase tracking-widest font-bold text-muted mb-1">Products Observed</p>
          <p className="text-2xl font-display font-black text-darkInk">{stats.productsObserved}</p>
        </div>
        <div className="card border-t-4 border-t-cherry bg-peach bg-opacity-10 p-4">
          <p className="text-[9px] uppercase tracking-widest font-bold text-cherry mb-1">High-Risk Cases</p>
          <p className="text-2xl font-display font-black text-cherry flex items-center gap-1">
            <ShieldAlert size={20} /> {stats.highRiskCases || 2}
          </p>
        </div>
        <div className="card border-t-4 border-t-butter p-4">
          <p className="text-[9px] uppercase tracking-widest font-bold text-darkInk mb-1">Suspicious Clusters</p>
          <p className="text-2xl font-display font-black text-darkInk">{stats.suspiciousClusters || 4}</p>
        </div>
        <div className="card border-t-4 border-t-peach p-4">
          <p className="text-[9px] uppercase tracking-widest font-bold text-darkInk mb-1">Active Signals</p>
          <p className="text-2xl font-display font-black text-darkInk">{stats.activeSignals || 248}</p>
        </div>
        <div className="card border-t-4 border-t-darkInk p-4">
          <p className="text-[9px] uppercase tracking-widest font-bold text-darkInk mb-1">Avg Risk Index</p>
          <p className="text-2xl font-display font-black text-darkInk">{stats.averageCoordinationRisk}/100</p>
        </div>
      </div>

      {/* Row 2: Coordination Landscape & Risk Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coordination Landscape (30-day activity) */}
        <div className="md:col-span-2 card p-6 bg-surface">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-darkInk uppercase tracking-widest text-xs flex items-center gap-2">
                <TrendingUp size={16} className="text-cherry" /> Coordination Landscape (30-Day Activity Waves)
              </h3>
              <p className="text-xs text-muted mt-0.5">Contrasting baseline organic submission with detected coordinated burst clusters</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-muted inline-block"></span> Baseline Volume</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-cherry inline-block"></span> Coordinated Activity</span>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={landscapeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E2D4" />
                <XAxis dataKey="day" tick={{fill: '#756D70', fontSize: 10}} />
                <YAxis tick={{fill: '#756D70', fontSize: 10}} />
                <Tooltip contentStyle={{backgroundColor: '#30252A', color: '#FFF'}} />
                <Line type="monotone" dataKey="total" stroke="#756D70" strokeWidth={2} dot={false} name="Total Reviews" />
                <Line type="monotone" dataKey="flagged" stroke="#E94B4B" strokeWidth={3} dot={{fill: '#E94B4B', r: 4}} name="Coordinated Spikes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="card p-6 bg-surface flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-darkInk uppercase tracking-widest text-xs flex items-center gap-2 mb-2">
              <Layers size={16} className="text-cherry" /> Risk Distribution
            </h3>
            <p className="text-xs text-muted mb-4">Catalog distribution across prototype risk classification bands</p>

            <div className="space-y-4">
              {riskDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-darkInk">{item.band}</span>
                    <span className="font-mono">{item.percent}% ({item.count} items)</span>
                  </div>
                  <div className="w-full h-3 bg-canvas border border-border overflow-hidden">
                    <div className="h-full" style={{width: `${item.percent}%`, backgroundColor: item.color}} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-canvas border border-border text-[11px] text-muted leading-relaxed mt-4">
            <b>Prototype Thresholds:</b> 0–30 (Low), 31–70 (Medium), 71–100 (High). Configurable in Settings.
          </div>
        </div>
      </div>

      {/* Target Watchlist Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-display font-bold text-darkInk flex items-center gap-2">
              <Target className="text-cherry" size={22} /> Monitored Product Watchlist
            </h2>
            <p className="text-xs text-muted">Continuous comparative analysis across multi-channel review feeds</p>
          </div>
          <span className="text-xs text-muted font-bold font-mono">Ranked by Coordination Risk</span>
        </div>

        <div className="card p-0 overflow-hidden bg-surface">
          <table className="w-full text-left">
            <thead className="bg-canvas border-b-2 border-border">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Platform</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Product Identifier</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-center">Reviews</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-center">Rating</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Coordination Risk</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Risk Level</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted">Primary Signals Observed</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted text-right">Case Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {products.sort((a, b) => b.avg_risk_score - a.avg_risk_score).map((prod) => (
                <tr key={prod.product_id} className="hover:bg-canvas transition-colors">
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-darkInk text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                      {prod.platform || 'Amazon'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-darkInk">{prod.product_name || prod.product_id}</div>
                    <div className="text-[11px] font-mono text-muted">{prod.product_id}</div>
                  </td>
                  <td className="p-4 text-center font-mono font-medium">{prod.review_count}</td>
                  <td className="p-4 text-center font-medium">
                    {prod.avg_rating.toFixed(1)} <span className="text-butter text-base">★</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 font-bold font-mono">{Math.round(prod.avg_risk_score)}</span>
                      <div className="w-24 h-2.5 bg-border overflow-hidden">
                        <div 
                          className={`h-full ${prod.overall_risk_level === 'HIGH' ? 'bg-cherry' : prod.overall_risk_level === 'MEDIUM' ? 'bg-peach' : 'bg-mint'}`} 
                          style={{width: `${prod.avg_risk_score}%`}}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      prod.overall_risk_level === 'HIGH' ? 'bg-cherry text-white' : 
                      prod.overall_risk_level === 'MEDIUM' ? 'bg-peach text-darkInk' : 
                      'bg-mint text-darkInk'
                    }`}>
                      {prod.overall_risk_level}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-darkInk">
                    <span className="px-2 py-1 bg-canvas border border-border font-mono text-[11px]">
                      {getPrimarySignals(prod.product_id)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => navigate('/cases')}
                      className="text-xs font-bold text-darkInk hover:text-cherry flex items-center gap-1 ml-auto uppercase tracking-wider border-b border-darkInk pb-0.5 hover:border-cherry"
                    >
                      Inspect <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Signals Alert Feed */}
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold text-darkInk flex items-center gap-2">
          <Activity className="text-cherry" size={22} /> Recently Detected Anomalous Signals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card border-l-4 border-l-cherry p-5 space-y-2 bg-surface">
            <div className="flex justify-between items-start">
              <span className="font-bold text-cherry uppercase tracking-widest text-[10px] flex items-center gap-1">
                <AlertTriangle size={12} /> Cloned Praise Wave
              </span>
              <span className="text-[10px] text-muted font-mono font-bold">14m ago</span>
            </div>
            <p className="text-sm font-bold text-darkInk">AeroSound Pro Wireless Earbuds</p>
            <p className="text-xs text-muted leading-relaxed">
              80 identical reviews cloned across a 36-hour burst window on Amazon. Elevated coordination score: 45/100.
            </p>
          </div>

          <div className="card border-l-4 border-l-cherry p-5 space-y-2 bg-surface">
            <div className="flex justify-between items-start">
              <span className="font-bold text-cherry uppercase tracking-widest text-[10px] flex items-center gap-1">
                <AlertTriangle size={12} /> Polarized Review Bomb
              </span>
              <span className="text-[10px] text-muted font-mono font-bold">42m ago</span>
            </div>
            <p className="text-sm font-bold text-darkInk">SwiftPay Digital Wallet & Vault</p>
            <p className="text-xs text-muted leading-relaxed">
              Synchronized 1-star accusations flooded Google Play across a 16-hour window. Risk score: 68/100.
            </p>
          </div>

          <div className="card border-l-4 border-l-peach p-5 space-y-2 bg-surface">
            <div className="flex justify-between items-start">
              <span className="font-bold text-peach uppercase tracking-widest text-[10px] flex items-center gap-1">
                <AlertTriangle size={12} /> Sybil Recovery Handle Spam
              </span>
              <span className="text-[10px] text-muted font-mono font-bold">1h ago</span>
            </div>
            <p className="text-sm font-bold text-darkInk">Web3 Security Deep Dive #42</p>
            <p className="text-xs text-muted leading-relaxed">
              65 automated bot comments promoting an external recovery contact on YouTube.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
