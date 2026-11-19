import React, { useState } from 'react';
import { LogOut, Lock, Clock, Check, X, ShieldAlert, Award } from 'lucide-react';
import { playChime } from '../utils/sound';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLockTerminal: () => void;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onLockTerminal
}) => {
  const [clockedOut, setClockedOut] = useState(false);

  if (!isOpen) return null;

  const handleClockOut = () => {
    playChime('success');
    setClockedOut(true);
    setTimeout(() => {
      setClockedOut(false);
      onClose();
      onLockTerminal();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0e122e] border border-white/10 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <LogOut className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sign Out / Lock Terminal</h3>
              <p className="text-xs text-slate-400">Elena Vance • General Manager & Shift Lead</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shift Summary Card */}
        <div className="p-4 rounded-xl bg-[#13183b] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Shift Duration:</span>
            <span className="font-mono text-emerald-400">5h 42m (Active)</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Shift Sales Volume:</span>
            <strong className="text-white font-mono">$8,429.50 (142 Tickets)</strong>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cash Drawer Balance:</span>
            <strong className="text-white font-mono">$650.00 Float OK</strong>
          </div>
        </div>

        {/* Action Choice Buttons */}
        <div className="space-y-2.5">
          {/* Quick Lock Button */}
          <button
            onClick={() => {
              playChime('bump');
              onClose();
              onLockTerminal();
            }}
            className="w-full p-3.5 rounded-xl bg-[#141b44] hover:bg-[#1b255e] border border-coral-400/30 text-coral-300 text-xs font-bold flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-coral-400" />
              <div className="text-left">
                <div className="text-white font-bold">Lock Terminal (Quick PIN Lock)</div>
                <div className="text-[10px] text-slate-400">Keep session active, require PIN to resume</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-coral-500/20 text-coral-300 font-sans">
              Recommended
            </span>
          </button>

          {/* Clock Out Button */}
          <button
            onClick={handleClockOut}
            className="w-full p-3.5 rounded-xl bg-[#141b44] hover:bg-[#1b255e] border border-white/[0.06] text-slate-300 text-xs font-semibold flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-400" />
              <div className="text-left">
                <div className="text-white font-bold">Clock Out & End Shift</div>
                <div className="text-[10px] text-slate-400">Print shift checkout report & clock out</div>
              </div>
            </div>
          </button>
        </div>

        {clockedOut && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Shift successfully closed & checkout chit printed. Locking station...</span>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#161a38] hover:bg-[#1c224a] text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel & Return to POS
          </button>
        </div>
      </div>
    </div>
  );
};

