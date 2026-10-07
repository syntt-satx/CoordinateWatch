import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, KeyRound, ArrowRight } from 'lucide-react';

export default function ClearanceGate({ onAuthenticate, currentContext }) {
  const [identity, setIdentity] = useState(currentContext?.identity || 'ANALYST-7049');
  const [accessKey, setAccessKey] = useState('ALPHA-OMEGA-SECURE');
  const [clearanceLevel, setClearanceLevel] = useState(currentContext?.clearanceLevel || 'Trust & Safety Analyst');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (identity && accessKey) {
      onAuthenticate({ identity, clearanceLevel });
      navigate('/'); // Moves directly to The Dispatch
    }
  };

  const handleQuickDemo = () => {
    onAuthenticate({ identity: 'ANALYST-7049', clearanceLevel: 'Trust & Safety Analyst' });
    navigate('/'); // Moves directly to The Dispatch
  };

  return (
    <div className="min-h-screen bg-[#FFFDF4] flex flex-col items-center justify-center p-6 text-[#242024] selection:bg-[#FFE59A] selection:text-[#30252A]">
      <div className="max-w-md w-full space-y-6">
        {/* Editorial Top Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE59A] border-2 border-[#30252A] text-xs font-mono font-bold text-[#30252A] uppercase shadow-[2px_2px_0px_#30252A]">
            <Shield size={14} className="text-[#E94B4B]" />
            <span>RESTRICTED ANALYTICS ACCESS</span>
          </div>
          <h1 className="text-4xl font-display font-black text-[#30252A] tracking-tight uppercase">
            Clearance Gate
          </h1>
          <p className="text-[#756D70] text-xs font-mono font-bold tracking-widest uppercase">
            COORDINATEWATCH AI // SECURITY PERIMETER
          </p>
        </div>

        {/* Security Dossier Card */}
        <div className="bg-white border-2 border-[#30252A] p-8 shadow-[6px_6px_0px_#30252A]">
          <div className="flex items-center justify-between border-b-2 border-[#30252A] pb-3 mb-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#756D70]">
              CREDENTIAL VERIFICATION
            </span>
            <span className="text-[9px] font-mono font-black px-2 py-0.5 bg-[#E94B4B] text-white uppercase">
              LEVEL 3 AUTH
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono font-bold text-[#30252A] mb-1.5 uppercase tracking-wider">
                Operator Identifier
              </label>
              <input 
                type="text" 
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="w-full border-2 border-[#30252A] p-3 text-sm font-mono focus:outline-none focus:bg-[#FFFDF4] bg-white text-[#242024]"
                placeholder="e.g. ANALYST-7049"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono font-bold text-[#30252A] mb-1.5 uppercase tracking-wider">
                Access Token / Passkey
              </label>
              <input 
                type="password" 
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full border-2 border-[#30252A] p-3 text-sm font-mono focus:outline-none focus:bg-[#FFFDF4] bg-white text-[#242024]"
                placeholder="Enter access key"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#30252A] mb-1.5 uppercase tracking-wider">
                Clearance Assignment
              </label>
              <select 
                value={clearanceLevel}
                onChange={(e) => setClearanceLevel(e.target.value)}
                className="w-full border-2 border-[#30252A] p-3 text-xs font-mono font-bold focus:outline-none bg-white text-[#30252A] appearance-none"
              >
                <option value="Research Analyst">Research Analyst (Read-Only Telemetry)</option>
                <option value="Trust & Safety Analyst">Trust & Safety Analyst (Full Dossier Investigation)</option>
                <option value="Security Analyst">Security Analyst (Audit & Attribution)</option>
                <option value="Administrator">Administrator (Global Simulation & Calibration)</option>
              </select>
            </div>

            <div className="pt-2 space-y-3">
              <button 
                type="submit" 
                className="w-full btn-primary py-3.5 text-xs font-mono uppercase tracking-wider font-black flex items-center justify-center gap-2"
              >
                <KeyRound size={15} />
                <span>Verify Credentials & Enter</span>
                <ArrowRight size={14} />
              </button>

              <button 
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 bg-[#FAF6EC] border border-[#30252A] text-[10px] font-mono font-bold uppercase tracking-wider text-[#30252A] hover:bg-[#FFE59A] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>⚡ Instant Access (Demo Pass)</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-[10px] font-mono text-[#756D70] uppercase tracking-widest">
          Restricted to authorized Trust & Safety teams. Activity logged under SOC 2 principles.
        </p>
      </div>
    </div>
  );
}
