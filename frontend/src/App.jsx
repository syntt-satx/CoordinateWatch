import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import ClearanceGate from './components/ClearanceGate';
import Home from './components/Home';

import TheWatch from './components/TheWatch';
import CaseFiles from './components/CaseFiles';
import SignalScanner from './components/SignalScanner';
import CoordinationLab from './components/CoordinationLab';
import ThePosture from './components/ThePosture';
import Reports from './components/Reports';
import FieldGuide from './components/FieldGuide';
import SettingsMethodology from './components/SettingsMethodology';

// Protected Route Wrapper - Strictly redirects to Clearance Gate if unauthenticated
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/clearance" replace />;
  }
  return children;
};

const Navigation = ({ userContext, isAuthenticated, onLogout }) => {
  const location = useLocation();
  const navItems = [
    { num: '00', path: '/clearance', label: 'Clearance Gate', isPublic: true },
    { num: '01', path: '/', label: 'The Dispatch', isPublic: true },
    { num: '02', path: '/watch', label: 'The Watch' },
    { num: '03', path: '/cases', label: 'Case Files' },
    { num: '04', path: '/scanner', label: 'Signal Scanner' },
    { num: '05', path: '/lab', label: 'Coordination Lab' },
    { num: '06', path: '/posture', label: 'The Posture' },
    { num: '07', path: '/reports', label: 'Reports & Audits' },
    { num: '08', path: '/guide', label: 'Field Guide' },
    { num: '09', path: '/settings', label: 'Methodology' },
  ];

  return (
    <nav className="w-72 bg-[#FAF6EC] border-r-2 border-[#30252A] h-screen sticky top-0 flex flex-col shrink-0 select-none z-30 overflow-hidden">
      {/* Editorial Masthead (Pinned at Top) */}
      <div className="p-5 border-b-2 border-[#30252A] bg-[#FFFDF4] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2 py-0.5 bg-[#FFE59A] border border-[#30252A] text-[9px] font-mono font-bold tracking-wider text-[#30252A] uppercase">
            EDITION 2026 // LIVE INTELLIGENCE
          </span>
          <span 
            className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-[#79C99A]' : 'bg-[#E94B4B]'} animate-pulse`} 
            title={isAuthenticated ? "Authenticated" : "Unverified"}
          ></span>
        </div>
        <h1 className="font-display font-black text-2xl text-[#30252A] leading-tight tracking-tight">
          COORDINATE<span className="text-[#E94B4B]">WATCH</span>
        </h1>
        <p className="text-[10px] uppercase font-mono tracking-widest text-[#756D70] mt-0.5 font-bold">
          Restricted Analytical Environment
        </p>
      </div>

      {/* Scrollable Navigation Index (Middle Section with Scrollbar) */}
      <div className="flex-1 sidebar-scroll py-2 min-h-0">
        <div className="px-5 pt-1 pb-2 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-[#756D70]">
          <span>THE DOSSIER INDEX</span>
          <span>VOL. IV</span>
        </div>

        <div className="px-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const isClearance = item.path === '/clearance';
            const isLocked = !isAuthenticated && !item.isPublic;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`dossier-nav-item flex items-center justify-between px-3.5 py-2 text-xs tracking-wider transition-all border ${
                  isActive 
                    ? 'active-tab border-[#30252A]' 
                    : isClearance && !isAuthenticated
                    ? 'bg-[#E94B4B] bg-opacity-10 border-[#E94B4B] text-[#E94B4B] font-bold'
                    : 'border-transparent text-[#242024] hover:text-[#30252A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-[#E94B4B]' : 'text-[#756D70]'}`}>
                    {item.num}
                  </span>
                  <span className={`font-display text-sm tracking-normal ${isActive ? 'font-bold text-[#30252A]' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </div>

                {isActive ? (
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-[#E94B4B] text-white px-1.5 py-0.2">
                    ACTIVE
                  </span>
                ) : isClearance && !isAuthenticated ? (
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-[#E94B4B] text-white px-1">
                    AUTH
                  </span>
                ) : isLocked ? (
                  <Lock size={12} className="text-[#756D70] opacity-60" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Security Dossier Credential Footer (Pinned at Bottom) */}
      <div className="p-3 border-t-2 border-[#30252A] bg-[#FFFDF4] shrink-0">
        <div className="card-subtle bg-white border border-[#30252A] p-2.5 shadow-[2px_2px_0px_#30252A]">
          <div className="flex items-center justify-between border-b border-[#E9E2D4] pb-1.5 mb-1.5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#756D70]">
              CLEARANCE BADGE
            </span>
            <span className={`w-1.5 h-1.5 ${isAuthenticated ? 'bg-[#79C99A]' : 'bg-[#E94B4B]'} inline-block`}></span>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <span className="font-mono font-black text-[#30252A] text-xs truncate max-w-[130px]">
              {isAuthenticated ? (userContext?.identity || 'OP-7049') : 'GUEST VISITOR'}
            </span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider ${
              isAuthenticated ? 'bg-[#E94B4B] text-white' : 'bg-[#FFE59A] text-[#30252A]'
            }`}>
              {isAuthenticated 
                ? (userContext?.clearanceLevel ? userContext.clearanceLevel.split(' ')[0] : 'ANALYST')
                : 'UNVERIFIED'}
            </span>
          </div>

          <p className="text-[10px] font-mono text-[#756D70] mb-2 truncate">
            {isAuthenticated ? (userContext?.clearanceLevel || 'Trust & Safety Analyst') : 'Authentication Required'}
          </p>

          {isAuthenticated ? (
            <button 
              onClick={onLogout}
              className="w-full text-center py-1.5 bg-[#FAF6EC] border border-[#30252A] text-[9px] font-mono font-bold uppercase tracking-wider text-[#30252A] hover:bg-[#E94B4B] hover:text-white transition-colors"
            >
              Relinquish Clearance ➔
            </button>
          ) : (
            <Link
              to="/clearance"
              className="w-full block text-center py-1.5 bg-[#E94B4B] text-white text-[9px] font-mono font-bold uppercase tracking-wider hover:bg-[#30252A] transition-colors"
            >
              Enter Clearance Gate ➔
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('cw_authenticated') === 'true';
  });
  const [userContext, setUserContext] = useState(() => {
    const saved = localStorage.getItem('cw_user');
    return saved ? JSON.parse(saved) : { identity: 'ANALYST-7049', clearanceLevel: 'Trust & Safety Analyst' };
  });

  const handleAuthenticate = (context) => {
    setUserContext(context);
    setIsAuthenticated(true);
    localStorage.setItem('cw_authenticated', 'true');
    localStorage.setItem('cw_user', JSON.stringify(context));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cw_authenticated');
    localStorage.removeItem('cw_user');
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-[#FFFDF4] text-[#242024] font-sans">
        <Navigation userContext={userContext} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            {/* The Dispatch (Home) */}
            <Route 
              path="/" 
              element={
                <Home 
                  isAuthenticated={isAuthenticated} 
                  userContext={userContext} 
                  onLogout={handleLogout} 
                />
              } 
            />

            {/* Clearance Gate */}
            <Route 
              path="/clearance" 
              element={
                <ClearanceGate 
                  onAuthenticate={handleAuthenticate} 
                  currentContext={userContext} 
                />
              } 
            />

            {/* All Analytical Features - Strictly Protected */}
            <Route 
              path="/watch" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TheWatch />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cases" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CaseFiles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/scanner" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <SignalScanner />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lab" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CoordinationLab />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/posture" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ThePosture />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/guide" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <FieldGuide />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <SettingsMethodology />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
