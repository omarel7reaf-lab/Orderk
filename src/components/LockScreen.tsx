import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Clock, KeyRound, Check, ShieldCheck, ChevronRight, X, Sparkles } from 'lucide-react';
import { playChime } from '../utils/sound';
import { SafeImage } from './SafeImage';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ isLocked, onUnlock }) => {
  const [pin, setPin] = useState('');
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (num: string) => {
    playChime('bump');
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    playChime('bump');
    setPin(prev => prev.slice(0, -1));
    setErrorMsg(false);
  };

  const verifyPin = (code: string) => {
    // Default PIN: 1234 or any 4 digits for convenience
    if (code === '1234' || code.length === 4) {
      playChime('success');
      setTimeout(() => {
        setPin('');
        onUnlock();
      }, 250);
    } else {
      setErrorMsg(true);
      setTimeout(() => {
        setPin('');
        setErrorMsg(false);
      }, 1000);
    }
  };

  const handleQuickUnlock = () => {
    playChime('success');
    setPin('');
    onUnlock();
  };

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060817] flex flex-col items-center justify-between p-6 select-none animate-in fade-in duration-300">
      {/* Top Bar with Status */}
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-semibold text-slate-300">Station Terminal #POS-01 • Downtown Bistro</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-coral-400" />
          <span>PCI-DSS Secured Terminal Session</span>
        </div>
      </div>

      {/* Center Keypad & Lock Content */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-sm w-full my-auto">
        {/* Time display */}
        <div className="space-y-1">
          <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-wider">
            {time || '19:42:10'}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {dateStr || 'Friday, October 24, 2026'}
          </div>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-[#0e1335] border border-white/10 shadow-lg">
          <SafeImage
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
            alt="Elena Vance"
            fallbackText="EV"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-coral-400"
          />
          <div className="text-left">
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>Elena Vance</span>
              <Sparkles className="w-3 h-3 text-coral-400" />
            </div>
            <div className="text-[10px] text-slate-400">General Manager / Shift Lead</div>
          </div>
        </div>

        {/* PIN Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  pin.length > idx
                    ? 'bg-coral-400 scale-110 shadow-md shadow-coral-400/50'
                    : 'bg-[#181f4a] border border-white/20'
                }`}
              ></div>
            ))}
          </div>
          <div className="text-[11px] text-slate-400">
            {errorMsg ? (
              <span className="text-rose-400 font-bold">Incorrect PIN. Try again.</span>
            ) : (
              <span>Enter 4-Digit Manager PIN (Default: 1234)</span>
            )}
          </div>
        </div>

        {/* Numeric Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 w-64">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleKeyPress(n)}
              className="w-16 h-14 rounded-2xl bg-[#11173d] hover:bg-[#1a235c] active:scale-95 text-white font-mono text-lg font-bold border border-white/[0.08] shadow-md transition flex items-center justify-center mx-auto"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="w-16 h-14 rounded-2xl bg-[#161a38] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 font-medium text-xs border border-white/[0.06] transition flex items-center justify-center mx-auto"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="w-16 h-14 rounded-2xl bg-[#11173d] hover:bg-[#1a235c] active:scale-95 text-white font-mono text-lg font-bold border border-white/[0.08] shadow-md transition flex items-center justify-center mx-auto"
          >
            0
          </button>
          <button
            onClick={handleQuickUnlock}
            title="Fast Card Unlock"
            className="w-16 h-14 rounded-2xl bg-gradient-to-tr from-coral-500 to-[#ff9e93] text-[#190808] font-bold text-xs hover:brightness-110 active:scale-95 shadow-md shadow-coral-500/25 transition flex items-center justify-center mx-auto"
          >
            <Check className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* 1-Click Fast Unlock Keycard Button */}
        <button
          onClick={handleQuickUnlock}
          className="w-full py-3 rounded-xl bg-[#13193e] hover:bg-[#1a2354] border border-coral-400/30 text-coral-300 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
        >
          <KeyRound className="w-4 h-4 text-coral-400" />
          <span>Tap to Unlock with Manager RFID Keycard</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-4xl flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-white/[0.05]">
        <span>OrderK Operations Suite v2.4</span>
        <span>Current Shift: Dinner (16:00 - 23:00)</span>
      </div>
    </div>
  );
};

