import React, { useState, useEffect } from 'react';
import { FileText, Download, ShieldCheck, AlertTriangle, CheckCircle2, Lock, FileSpreadsheet } from 'lucide-react';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const [statsRes, prodRes] = await Promise.all([
          fetch('http://localhost:8000/api/dashboard/stats'),
          fetch('http://localhost:8000/api/products')
        ]);
        setStats(await statsRes.json());
        setProducts(await prodRes.json());
      } catch (err) {
        console.error("Failed to load report metadata:", err);
      } finally {
        setLoading(false);
      }
    };
    loadReportData();
  }, []);

  const handleExportPDF = async () => {
    setDownloading(true);
    try {
      const response = await fetch('http://localhost:8000/api/reports/export-pdf');
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coordinatewatch_intelligence_report_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error generating PDF report. Please ensure the backend is active.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-darkInk font-bold animate-pulse">Assembling analytical audit records...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-butter text-darkInk text-xs font-bold uppercase tracking-wider mb-2">
            <Lock size={12} /> Compliance & Trust & Safety Artifact
          </div>
          <h1 className="text-4xl font-display font-black text-darkInk tracking-tight">Reports & Compliance</h1>
          <p className="text-muted font-medium mt-1">SOC 2–aligned analytical export & documentation pack</p>
        </div>
        <button 
          onClick={handleExportPDF}
          disabled={downloading}
          className="btn-primary flex items-center gap-2 py-3 px-6 uppercase tracking-wider text-sm font-bold shadow-md"
        >
          <Download size={18} />
          {downloading ? "Generating PDF..." : "Export Analytical PDF"}
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-5 border-2 border-darkInk bg-canvas">
        <h4 className="font-bold text-darkInk text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
          <ShieldCheck size={16} className="text-mint" /> SOC 2–Aligned Analytical Report
        </h4>
        <p className="text-xs text-muted leading-relaxed">
          This report format conforms to internal Trust & Safety audit standards for explainable multi-signal review pattern detection. 
          CoordinateWatch AI scores coordination probability and documents statistical evidence without issuing definitive fraud classifications against individual accounts.
        </p>
      </div>

      {/* Report Preview Document */}
      <div className="card border-2 border-border p-8 bg-surface space-y-8 shadow-sm">
        <div className="flex justify-between items-start border-b-2 border-border pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cherry">CoordinateWatch Intelligence Dossier</span>
            <h2 className="text-2xl font-display font-black text-darkInk mt-1">Executive Coordination Summary</h2>
            <p className="text-xs text-muted mt-1">Report Version: 1.0-PROTOTYPE • Environment: Local Analytics</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-muted block">TIMESTAMP</span>
            <span className="text-xs font-bold text-darkInk">{new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-canvas border border-border">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted block mb-1">Total Reviews</span>
            <span className="text-2xl font-display font-black text-darkInk">{stats?.reviewsAnalysed?.toLocaleString() || 0}</span>
          </div>
          <div className="p-4 bg-canvas border border-border">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted block mb-1">Products Observed</span>
            <span className="text-2xl font-display font-black text-darkInk">{stats?.productsObserved || 0}</span>
          </div>
          <div className="p-4 bg-peach bg-opacity-20 border border-cherry">
            <span className="text-[11px] font-bold uppercase tracking-widest text-cherry block mb-1">High-Risk Targets</span>
            <span className="text-2xl font-display font-black text-cherry">{stats?.highRiskCases || 0}</span>
          </div>
          <div className="p-4 bg-canvas border border-border">
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted block mb-1">Platform Risk Index</span>
            <span className="text-2xl font-display font-black text-darkInk">{stats?.averageCoordinationRisk || 0}/100</span>
          </div>
        </div>

        {/* Signal Definitions Table */}
        <div className="space-y-3">
          <h3 className="text-lg font-display font-bold text-darkInk">1. Evaluated Signal Matrix</h3>
          <table className="w-full text-left text-xs border border-border">
            <thead className="bg-butter bg-opacity-40 border-b border-border">
              <tr>
                <th className="p-3 font-bold uppercase text-darkInk">Signal Dimension</th>
                <th className="p-3 font-bold uppercase text-darkInk">Detection Methodology</th>
                <th className="p-3 font-bold uppercase text-darkInk text-right">Scoring Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-bold">Textual Similarity</td>
                <td className="p-3 text-muted">TF-IDF Vectorization with Cosine Similarity threshold analysis to detect phrase cloning.</td>
                <td className="p-3 font-bold text-right">35%</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Temporal Concentration</td>
                <td className="p-3 text-muted">Rolling-window z-score burst velocity calculation across 48-hour activity periods.</td>
                <td className="p-3 font-bold text-right">30%</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Rating Synchronization</td>
                <td className="p-3 text-muted">Extreme polarization scoring across 1-star / 5-star distributions against product baseline.</td>
                <td className="p-3 font-bold text-right">20%</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Reviewer Behaviour</td>
                <td className="p-3 text-muted">Multi-product review velocity and historical rating extremity correlation.</td>
                <td className="p-3 font-bold text-right">15%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Product Targets */}
        <div className="space-y-3">
          <h3 className="text-lg font-display font-bold text-darkInk">2. Active Case File Findings</h3>
          <table className="w-full text-left text-xs border border-border">
            <thead className="bg-canvas border-b border-border">
              <tr>
                <th className="p-3 font-bold uppercase text-darkInk">Product Identifier</th>
                <th className="p-3 font-bold uppercase text-darkInk">Volume</th>
                <th className="p-3 font-bold uppercase text-darkInk">Avg Rating</th>
                <th className="p-3 font-bold uppercase text-darkInk">Risk Score</th>
                <th className="p-3 font-bold uppercase text-darkInk">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.product_id} className="hover:bg-canvas">
                  <td className="p-3 font-mono font-bold">{p.product_id}</td>
                  <td className="p-3">{p.review_count}</td>
                  <td className="p-3">{p.avg_rating.toFixed(1)} ★</td>
                  <td className="p-3 font-bold">{Math.round(p.avg_risk_score)}/100</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] ${
                      p.overall_risk_level === 'HIGH' ? 'bg-cherry text-white' : 
                      p.overall_risk_level === 'MEDIUM' ? 'bg-peach text-darkInk' : 
                      'bg-mint text-darkInk'
                    }`}>
                      {p.overall_risk_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
