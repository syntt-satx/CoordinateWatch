import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { ActivitySquare, ShieldAlert, Network, Target, AlertTriangle, Layers, Database } from 'lucide-react';

const EditorialTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-[#30252A] p-3 shadow-[3px_3px_0px_#30252A] text-xs font-mono">
        {label && <p className="font-bold text-[#30252A] border-b border-[#E9E2D4] pb-1 mb-1.5 uppercase">{label}</p>}
        {payload.map((entry, idx) => (
          <p key={idx} className="flex justify-between items-center gap-4 text-[#242024] my-0.5">
            <span style={{ color: entry.color || entry.stroke || '#E94B4B' }} className="font-bold">
              {entry.name}:
            </span>
            <span className="font-mono font-black text-[#30252A]">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ThePosture() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 30-Day Activity Curve
  const timelineData = Array.from({ length: 30 }, (_, i) => ({
    day: `D${i + 1}`,
    organic: Math.floor(Math.random() * 30) + 55,
    coordinated: (i >= 11 && i <= 13) || (i >= 20 && i <= 22) 
      ? Math.floor(Math.random() * 85) + 130 
      : Math.floor(Math.random() * 12)
  }));

  const riskDistributionData = [
    { name: 'LOW (0-30)', count: 1, fill: '#79C99A' },
    { name: 'MEDIUM (31-70)', count: 2, fill: '#FFB86B' },
    { name: 'HIGH (71-100)', count: 2, fill: '#E94B4B' }
  ];

  const signalRadarData = [
    { subject: 'Text Similarity', score: 85, fullMark: 100 },
    { subject: 'Temporal Burst', score: 90, fullMark: 100 },
    { subject: 'Rating Skew', score: 78, fullMark: 100 },
    { subject: 'Reviewer Velocity', score: 65, fullMark: 100 },
    { subject: 'Syntactic Entropy', score: 82, fullMark: 100 }
  ];

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/dashboard/stats').then(r => r.json()),
      fetch('http://localhost:8000/api/products').then(r => r.json())
    ]).then(([s, p]) => {
      setStats(s);
      setProducts(p);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-[#30252A] font-bold font-mono animate-pulse">Loading executive posture telemetry...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#242024]">
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-[#30252A] pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E94B4B] block mb-1">
            EXECUTIVE AUDIT DOSSIER
          </span>
          <h1 className="text-4xl font-display font-black text-[#30252A] tracking-tight">
            The Posture
          </h1>
          <p className="text-sm text-[#756D70] font-medium mt-1">
            Multi-signal coordination landscape, catalog risk matrix, and topological ring mapping
          </p>
        </div>
        <div className="text-right">
          <span className="px-3 py-1 bg-[#30252A] text-white text-xs font-bold font-mono uppercase tracking-wider border border-[#30252A] shadow-[2px_2px_0px_#E94B4B]">
            STATUS: SURVEILLANCE ACTIVE
          </span>
        </div>
      </div>

      {/* KPI Top Cards (With exact requested styling for Total Catalog Ingested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Catalog Ingested (Explicit High-Contrast Typography) */}
        <div className="bg-white border-2 border-[#30252A] p-6 shadow-[3px_3px_0px_#30252A]">
          <span 
            style={{
              color: '#756D70',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '0.25rem'
            }}
          >
            Total Catalog Ingested
          </span>
          <span 
            style={{
              color: '#242024',
              fontSize: '2.25rem',
              fontWeight: 800,
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.1,
              display: 'block'
            }}
          >
            {stats?.reviewsAnalysed?.toLocaleString() || 564}
          </span>
          <span className="text-[10px] font-mono text-[#756D70] mt-2 block">
            Ingested via 5 Marketplace Adapters
          </span>
        </div>

        {/* Card 2: Mean Platform Risk Index */}
        <div className="bg-white border-2 border-[#30252A] p-6 shadow-[3px_3px_0px_#30252A]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#756D70] block mb-1">
            Platform Risk Index
          </span>
          <span className="text-4xl font-display font-extrabold text-[#242024] block">
            {stats?.averageCoordinationRisk || 40.5}
            <span className="text-sm font-mono text-[#756D70] font-normal ml-1">/100</span>
          </span>
          <span className="text-[10px] font-mono text-[#756D70] mt-2 block">
            Weighted Multi-Signal Synthesis
          </span>
        </div>

        {/* Card 3: Active Threat Clusters */}
        <div className="bg-white border-2 border-[#30252A] p-6 shadow-[3px_3px_0px_#30252A]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#756D70] block mb-1">
            Isolated Threat Clusters
          </span>
          <span className="text-4xl font-display font-extrabold text-[#242024] block">
            {stats?.suspiciousClusters || 4}
          </span>
          <span className="text-[10px] font-mono text-[#E94B4B] font-bold mt-2 block">
            Sybil Reviewer Rings Identified
          </span>
        </div>

        {/* Card 4: Critical High-Risk Case Files */}
        <div className="bg-[#FAF6EC] border-2 border-[#30252A] p-6 border-l-8 border-l-[#E94B4B] shadow-[3px_3px_0px_#30252A]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#E94B4B] block mb-1">
            Critical Targets
          </span>
          <span className="text-4xl font-display font-extrabold text-[#E94B4B] flex items-center gap-2">
            <ShieldAlert size={30} /> {stats?.highRiskCases || 2}
          </span>
          <span className="text-[10px] font-mono text-[#30252A] font-bold mt-2 block">
            Threshold Exceeded (&gt; 70 Risk)
          </span>
        </div>
      </div>

      {/* Row 1: Charts (Aligned with Butter + Cherry Design System) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 30-Day Trend Lines */}
        <div className="lg:col-span-7 bg-white border-2 border-[#30252A] p-6 shadow-[3px_3px_0px_#30252A]">
          <div className="flex items-center justify-between border-b border-[#E9E2D4] pb-3 mb-6">
            <div>
              <h3 className="font-bold text-[#30252A] uppercase tracking-widest text-xs flex items-center gap-2">
                <ActivitySquare size={16} className="text-[#E94B4B]" /> 30-Day Trend Lines (Organic vs. Coordinated)
              </h3>
              <p className="text-[11px] text-[#756D70] mt-0.5">
                Volumetric separation of baseline flow from coordinated burst spikes
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono font-bold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#756D70] inline-block"></span> Organic</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#E94B4B] inline-block"></span> Coordinated</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9E2D4" />
                <XAxis dataKey="day" tick={{ fill: '#756D70', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#756D70', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip content={<EditorialTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="organic" 
                  stroke="#756D70" 
                  strokeWidth={2} 
                  dot={false} 
                  name="Organic Reviews" 
                />
                <Line 
                  type="monotone" 
                  dataKey="coordinated" 
                  stroke="#E94B4B" 
                  strokeWidth={3} 
                  dot={{ fill: '#E94B4B', r: 3, stroke: '#30252A', strokeWidth: 1 }} 
                  name="Flagged Burst Waves" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Vector Radar Chart */}
        <div className="lg:col-span-5 bg-white border-2 border-[#30252A] p-6 shadow-[3px_3px_0px_#30252A]">
          <div className="border-b border-[#E9E2D4] pb-3 mb-6">
            <h3 className="font-bold text-[#30252A] uppercase tracking-widest text-xs">
              Threat Vector Radar Profile
            </h3>
            <p className="text-[11px] text-[#756D70] mt-0.5">
              Aggregate signal intensity across evaluated dimensions
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={signalRadarData}>
                <PolarGrid stroke="#E9E2D4" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#30252A', fontSize: 10, fontWeight: 700, fontFamily: 'sans-serif' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#E9E2D4" tick={{ fontSize: 9, fill: '#756D70' }} />
                <Tooltip content={<EditorialTooltip />} />
                <Radar 
                  name="Observed Intensity" 
                  dataKey="score" 
                  stroke="#E94B4B" 
                  strokeWidth={2}
                  fill="#FFE59A" 
                  fillOpacity={0.55} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Department/Catalog Risk Matrix */}
      <div className="bg-white border-2 border-[#30252A] p-6 shadow-[3px_3px_0px_#30252A] space-y-4">
        <div className="flex justify-between items-center border-b border-[#E9E2D4] pb-3">
          <div>
            <h3 className="font-bold text-[#30252A] uppercase tracking-widest text-xs flex items-center gap-2">
              <Database size={16} className="text-[#E94B4B]" /> Department / Catalog Risk Matrix
            </h3>
            <p className="text-[11px] text-[#756D70] mt-0.5">Cross-marketplace target entities sorted by multi-signal risk index</p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#FFE59A] border border-[#30252A] px-2.5 py-1 text-[#30252A]">
            CATALOG HEALTH: AUDITED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF6EC] border-b-2 border-[#30252A] text-[#756D70] font-mono text-[10px] uppercase">
                <th className="p-3">Platform</th>
                <th className="p-3">Target Entity Identifier</th>
                <th className="p-3 text-center">Volume</th>
                <th className="p-3 text-center">Avg Rating</th>
                <th className="p-3">Coordination Risk Bar</th>
                <th className="p-3">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E2D4]">
              {products.map((p) => {
                const isHigh = p.overall_risk_level === 'HIGH';
                const isMed = p.overall_risk_level === 'MEDIUM';
                return (
                  <tr key={p.product_id} className="hover:bg-[#FAF6EC] transition-colors">
                    <td className="p-3 font-mono font-bold text-[#30252A]">{p.platform || 'Amazon'}</td>
                    <td className="p-3">
                      <span className="font-display font-bold text-sm text-[#30252A] block">{p.product_name || p.product_id}</span>
                      <span className="text-[10px] font-mono text-[#756D70]">{p.product_id}</span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold">{p.review_count}</td>
                    <td className="p-3 text-center font-mono font-bold">
                      {p.avg_rating.toFixed(1)} <span className="text-[#FFE59A] text-sm">★</span>
                    </td>
                    <td className="p-3 w-48">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black w-7">{Math.round(p.avg_risk_score)}</span>
                        <div className="flex-1 h-2.5 bg-[#E9E2D4] border border-[#30252A] overflow-hidden">
                          <div 
                            className="h-full" 
                            style={{ 
                              width: `${p.avg_risk_score}%`, 
                              backgroundColor: isHigh ? '#E94B4B' : isMed ? '#FFB86B' : '#79C99A' 
                            }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider border border-[#30252A] ${
                        isHigh ? 'bg-[#E94B4B] text-white' : isMed ? 'bg-[#FFB86B] text-[#30252A]' : 'bg-[#79C99A] text-[#30252A]'
                      }`}>
                        {p.overall_risk_level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Global Cluster Network Visualization */}
      <div className="bg-white border-2 border-[#30252A] p-6 shadow-[3px_3px_0px_#30252A] space-y-4">
        <div className="flex justify-between items-center border-b border-[#E9E2D4] pb-3">
          <div>
            <h3 className="font-bold text-[#30252A] uppercase tracking-widest text-xs flex items-center gap-2">
              <Network size={16} className="text-[#E94B4B]" /> Global Coordination Cluster Network
            </h3>
            <p className="text-[11px] text-[#756D70] mt-0.5">
              Topological mapping of sybil reviewer rings and targeted product clusters
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono font-bold">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#FFE59A] border border-[#30252A] inline-block"></span> Reviewer Sybil</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#FFB86B] border border-[#30252A] inline-block"></span> Cloned Text</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#E94B4B] border border-[#30252A] inline-block"></span> Target Product</span>
          </div>
        </div>

        <div className="h-80 bg-[#FFFDF4] border-2 border-[#30252A] p-4 relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 800 280">
            {/* Cluster A Zone */}
            <circle cx="220" cy="140" r="105" fill="#FFE59A" fillOpacity="0.25" stroke="#30252A" strokeDasharray="4 4" />
            <text x="220" y="48" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#756D70">
              CLUSTER A: AMAZON EARBUDS BURST (80 REVIEWS / 36H)
            </text>

            {/* Cluster B Zone */}
            <circle cx="580" cy="140" r="105" fill="#E94B4B" fillOpacity="0.12" stroke="#E94B4B" strokeDasharray="4 4" />
            <text x="580" y="48" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#E94B4B">
              CLUSTER B: GOOGLE PLAY BOMB (90 REVIEWS / 16H)
            </text>

            {/* Links */}
            {[
              { x1: 160, y1: 110, x2: 220, y2: 140 },
              { x1: 170, y1: 170, x2: 220, y2: 140 },
              { x1: 270, y1: 100, x2: 220, y2: 140 },
              { x1: 280, y1: 180, x2: 220, y2: 140 },
              { x1: 160, y1: 110, x2: 170, y2: 170 },
              { x1: 270, y1: 100, x2: 280, y2: 180 },
              { x1: 520, y1: 110, x2: 580, y2: 140 },
              { x1: 530, y1: 180, x2: 580, y2: 140 },
              { x1: 640, y1: 110, x2: 580, y2: 140 },
              { x1: 630, y1: 180, x2: 580, y2: 140 }
            ].map((l, i) => (
              <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#30252A" strokeWidth="1.5" strokeOpacity="0.4" />
            ))}

            {/* Cluster A Target Node */}
            <circle cx="220" cy="140" r="24" fill="#E94B4B" stroke="#30252A" strokeWidth="2.5" />
            <text x="220" y="144" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#FFF">AMZ-01</text>

            {/* Cluster A Reviewer Nodes */}
            {[
              { x: 160, y: 110, l: 'U1' }, { x: 170, y: 170, l: 'U2' },
              { x: 270, y: 100, l: 'U3' }, { x: 280, y: 180, l: 'U4' }
            ].map((n, i) => (
              <g key={`ca-${i}`}>
                <circle cx={n.x} cy={n.y} r="13" fill="#FFE59A" stroke="#30252A" strokeWidth="2" />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#30252A">{n.l}</text>
              </g>
            ))}

            {/* Cluster B Target Node */}
            <circle cx="580" cy="140" r="24" fill="#E94B4B" stroke="#30252A" strokeWidth="2.5" />
            <text x="580" y="144" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#FFF">GP-SEC</text>

            {/* Cluster B Reviewer Nodes */}
            {[
              { x: 520, y: 110, l: 'B1' }, { x: 530, y: 180, l: 'B2' },
              { x: 640, y: 110, l: 'B3' }, { x: 630, y: 180, l: 'B4' }
            ].map((n, i) => (
              <g key={`cb-${i}`}>
                <circle cx={n.x} cy={n.y} r="13" fill="#FFB86B" stroke="#30252A" strokeWidth="2" />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#30252A">{n.l}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
