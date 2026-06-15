/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Snowflake, Sparkles, Timer, RefreshCw, Eye, EyeOff } from 'lucide-react';
import SnowEffect from './components/SnowEffect.tsx';
import BalloonEffect from './components/BalloonEffect.tsx';

interface EffectState {
  active: boolean;
  timeLeft: number; // in seconds (from 5.0 down to 0)
}

export default function App() {
  const [snowStatus, setSnowStatus] = useState<EffectState>({ active: false, timeLeft: 0 });
  const [balloonStatus, setBalloonStatus] = useState<EffectState>({ active: false, timeLeft: 0 });
  
  // High accuracy ticker for Snowflakes (every 100ms reduces timeLeft by 0.1s)
  useEffect(() => {
    let interval: any;
    if (snowStatus.active && snowStatus.timeLeft > 0) {
      interval = setInterval(() => {
        setSnowStatus((prev) => {
          if (prev.timeLeft <= 0.1) {
            clearInterval(interval);
            return { active: false, timeLeft: 0 };
          }
          return { ...prev, timeLeft: Number((prev.timeLeft - 0.1).toFixed(1)) };
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [snowStatus.active, snowStatus.timeLeft]);

  // High accuracy ticker for Balloons (every 100ms reduces timeLeft by 0.1s)
  useEffect(() => {
    let interval: any;
    if (balloonStatus.active && balloonStatus.timeLeft > 0) {
      interval = setInterval(() => {
        setBalloonStatus((prev) => {
          if (prev.timeLeft <= 0.1) {
            clearInterval(interval);
            return { active: false, timeLeft: 0 };
          }
          return { ...prev, timeLeft: Number((prev.timeLeft - 0.1).toFixed(1)) };
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [balloonStatus.active, balloonStatus.timeLeft]);

  const triggerSnow = () => {
    setSnowStatus({ active: true, timeLeft: 5.0 });
  };

  const triggerBalloons = () => {
    setBalloonStatus({ active: true, timeLeft: 5.0 });
  };

  const stopAll = () => {
    setSnowStatus({ active: false, timeLeft: 0 });
    setBalloonStatus({ active: false, timeLeft: 0 });
  };

  // Helper percentages for animated status meters
  const snowPercent = (snowStatus.timeLeft / 5.0) * 100;
  const balloonPercent = (balloonStatus.timeLeft / 5.0) * 100;

  return (
    <div 
      id="app-root" 
      className="relative min-h-screen w-full text-[#D1D5DB] font-sans antialiased overflow-x-hidden selection:bg-stone-800 selection:text-white"
      style={{ background: 'radial-gradient(circle at center, #1C1F26 0%, #0F1113 100%)' }}
    >
      
      {/* Real-time Atmospheric Render Canvas */}
      <SnowEffect active={snowStatus.active} />
      <BalloonEffect active={balloonStatus.active} />

      {/* Primary Header/Bar matching the design spec */}
      <header id="app-header" className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 md:px-12 flex justify-between items-center border-b border-[#2D3139] bg-[#0F1113]/80 backdrop-blur-md">
        <div className="brand text-xs sm:text-sm tracking-[4px] uppercase font-bold text-[#9CA3AF]">
          Atmospheric Control System
        </div>
        <div className="status-badge text-[10px] uppercase tracking-[1px] px-3 py-1 border border-[#4B5563] rounded-sm text-[#9CA3AF] font-mono">
          System Ready // 100%
        </div>
      </header>

      {/* Main Structural Layout */}
      <main id="app-main" className="relative z-10 flex flex-col items-center justify-center py-20 px-4 md:px-8 max-w-4xl mx-auto min-h-[calc(100vh-160px)]">
        
        {/* Central Formal Card Block */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#131518]/90 border border-[#2D3139] shadow-[0_24px_60px_rgba(0,0,0,0.6)] rounded-lg p-8 md:p-12 mb-6"
          id="main-control-card"
        >
          <div className="text-center max-w-xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-light text-[#F3F4F6] tracking-tight leading-tight">
              Formal Environment Simulation
            </h1>
            <p className="mt-4 text-[#9CA3AF] text-sm leading-relaxed">
              Select an atmospheric protocol below to initiate the particle synchronization. Each sequence maintains medium density for a 5-second duration.
            </p>
          </div>

          {/* Trigger Workspace Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            
            {/* 1. SNOWFLAKES CONTROL MODULE */}
            <div id="card-snowflakes" className="relative flex flex-col justify-between bg-[#181B1F] border border-[#2D3139] rounded-sm p-6 group transition-all duration-300 hover:border-[#4B5563]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2.5 bg-sky-950/40 text-sky-400 rounded-sm border border-sky-850/30">
                    <Snowflake className="h-4.5 w-4.5" />
                  </div>
                  <AnimatePresence>
                    {snowStatus.active && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="px-2 py-0.5 rounded-sm text-[9px] font-mono font-medium bg-sky-950/80 text-sky-300 border border-sky-800/40"
                      >
                        SYNCHRONIZING
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <h2 className="text-lg font-normal text-[#F3F4F6] tracking-tight">Snowflakes</h2>
                <p className="mt-2 text-xs text-[#9CA3AF] font-light leading-relaxed">
                  Medium-sized crystal geoms dropping through high-precision wind vectors.
                </p>
              </div>

              {/* Activation and Timer state */}
              <div className="mt-8">
                {/* Live linear progress track */}
                <div className="h-1 w-full bg-[#2a2e35] rounded-full overflow-hidden mb-3.5">
                  <motion.div 
                    className="h-full bg-sky-450"
                    animate={{ width: `${snowPercent}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                    style={{ backgroundColor: '#2563EB' }}
                  />
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono text-[#9CA3AF]/60 tracking-wider">PROTOCOL DURATION</span>
                  <span className="text-xs font-mono text-sky-400">
                    {snowStatus.active ? `${snowStatus.timeLeft.toFixed(1)}s` : '0.0s'}
                  </span>
                </div>

                <button 
                  id="btn-trigger-snowflakes"
                  onClick={triggerSnow}
                  className={`w-full py-3 px-4 rounded-none font-sans font-medium text-xs uppercase tracking-[2px] transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                    snowStatus.active 
                      ? 'bg-[#F3F4F6] text-[#0F1113] border-[#F3F4F6] shadow-sm' 
                      : 'bg-transparent border-[#4B5563] text-[#F3F4F6] hover:bg-[#F3F4F6] hover:text-[#0F1113] hover:border-[#F3F4F6]'
                  }`}
                >
                  <Snowflake className={`h-3.5 w-3.5 ${snowStatus.active ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                  {snowStatus.active ? 'Restart sequence' : 'Snowflakes'}
                </button>
              </div>
            </div>

            {/* 2. BALLOONS CONTROL MODULE */}
            <div id="card-balloons" className="relative flex flex-col justify-between bg-[#181B1F] border border-[#2D3139] rounded-sm p-6 group transition-all duration-300 hover:border-[#4B5563]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2.5 bg-rose-950/40 text-rose-400 rounded-sm border border-rose-850/30">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <AnimatePresence>
                    {balloonStatus.active && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="px-2 py-0.5 rounded-sm text-[9px] font-mono font-medium bg-rose-950/80 text-rose-300 border border-rose-800/40"
                      >
                        UPWARDS FLOATING
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <h2 className="text-lg font-normal text-[#F3F4F6] tracking-tight">Balloons</h2>
                <p className="mt-2 text-xs text-[#9CA3AF] font-light leading-relaxed">
                  Medium-sized glossy balloons elevating cleanly with micro-gravity.
                </p>
              </div>

              {/* Activation and Timer state */}
              <div className="mt-8">
                {/* Live linear progress track */}
                <div className="h-1 w-full bg-[#2a2e35] rounded-full overflow-hidden mb-3.5">
                  <motion.div 
                    className="h-full bg-rose-450"
                    animate={{ width: `${balloonPercent}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                    style={{ backgroundColor: '#E11D48' }}
                  />
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono text-[#9CA3AF]/60 tracking-wider">PROTOCOL DURATION</span>
                  <span className="text-xs font-mono text-rose-400">
                    {balloonStatus.active ? `${balloonStatus.timeLeft.toFixed(1)}s` : '0.0s'}
                  </span>
                </div>

                <button 
                  id="btn-trigger-balloons"
                  onClick={triggerBalloons}
                  className={`w-full py-3 px-4 rounded-none font-sans font-medium text-xs uppercase tracking-[2px] transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                    balloonStatus.active 
                      ? 'bg-[#F3F4F6] text-[#0F1113] border-[#F3F4F6] shadow-sm' 
                      : 'bg-transparent border-[#4B5563] text-[#F3F4F6] hover:bg-[#F3F4F6] hover:text-[#0F1113] hover:border-[#F3F4F6]'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {balloonStatus.active ? 'Restart sequence' : 'Balloons'}
                </button>
              </div>
            </div>

          </div>

          {/* Master Clean Reset / Halt Button (Formal utility) */}
          <div className="mt-12 flex justify-center border-t border-[#2D3139] pt-8">
            <button
              id="btn-clear-effects"
              disabled={!snowStatus.active && !balloonStatus.active}
              onClick={stopAll}
              className={`px-5 py-2 rounded-none font-mono text-xs uppercase tracking-wider border flex items-center gap-2 transition-all duration-200 ${
                snowStatus.active || balloonStatus.active 
                  ? 'bg-transparent border-[#4B5563] text-[#D1D5DB] hover:bg-[#F3F4F6] hover:text-[#0F1113] hover:border-[#F3F4F6] cursor-pointer' 
                  : 'bg-transparent border-[#2D3139]/20 text-stone-600 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`h-3 w-3 ${snowStatus.active || balloonStatus.active ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '4s' }} />
              Halt simulation
            </button>
          </div>
        </motion.div>

        {/* Informative Formal Meta Info Pane */}
        <div id="ambient-note" className="mt-4 text-center text-[10px] font-mono text-[#9CA3AF]/45 tracking-widest">
          <span>// CONTINUAL PARTICLE LIFE CYCLES RESOLVING GRADUALLY</span>
        </div>

      </main>

      {/* Primary Footer */}
      <footer id="app-footer" className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#2D3139] text-center text-[10px] text-[#9CA3AF]/60 font-mono flex flex-col md:flex-row justify-between items-center gap-3">
        <span>© 2026 METEOROLOGICAL SYSTEM INC. OPERATION STATUS NOMINAL.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#F3F4F6] transition-colors">SPECIFICATION</a>
          <span>·</span>
          <a href="#" className="hover:text-[#F3F4F6] transition-colors">FEEDBACK</a>
        </div>
      </footer>

    </div>
  );
}
