import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ArrowLeftRight, 
  Bell, 
  LogOut,
  Sparkles,
  Terminal as TerminalIcon
} from 'lucide-react';
import { SafeImage } from './SafeImage';

interface HeaderProps {
  onFastOrderClick: () => void;
  onSearch?: (query: string) => void;
  onOpenTerminal?: () => void;
  onTransferClick?: () => void;
  onLogOutClick?: () => void;
  onNotificationsClick?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onFastOrderClick, 
  onSearch, 
  onOpenTerminal,
  onTransferClick,
  onLogOutClick,
  onNotificationsClick,
  unreadNotificationsCount = 3
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 flex-shrink-0 bg-[#0a0d20] border-b border-white/[0.06] px-4 flex items-center justify-between text-xs select-none sticky top-0 z-40">
      {/* Left: Search input */}
      <div className="flex items-center gap-3 w-80">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Search tickets, tables, items (Press /)..."
            className="w-full bg-[#121633] text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 text-xs border border-white/[0.06] focus:outline-none focus:border-coral-400/50 focus:ring-1 focus:ring-coral-400/30 transition"
          />
        </div>
      </div>

      {/* Middle: Live telemetry indicators */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Kitchen telemetry */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121735] border border-white/[0.06] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-medium">Kitchen: Normal (12 min avg)</span>
        </div>

        {/* System online */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121735] border border-white/[0.06] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span className="text-[11px] font-medium">System Online 99.9%</span>
        </div>
      </div>

      {/* Right: Quick actions + clock + user profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Terminal / Assistant Button */}
        <button
          onClick={onOpenTerminal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#151b42] hover:bg-[#1b2354] border border-coral-400/30 text-coral-300 font-bold text-xs shadow-sm transition active:scale-95"
          title="افتح تيرمينال المساعد OrderK Terminal"
        >
          <TerminalIcon className="w-3.5 h-3.5 text-coral-400" />
          <span className="hidden sm:inline">Terminal</span>
        </button>

        {/* Fast order button */}
        <button
          onClick={onFastOrderClick}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 text-[#1b0808] font-bold text-xs shadow-md shadow-coral-500/25 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Fast Order</span>
        </button>

        {/* Transfer button */}
        <button 
          onClick={onTransferClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#131838] hover:bg-[#182046] border border-white/[0.06] hover:border-blue-400/40 text-slate-300 hover:text-white transition active:scale-95 shadow-sm"
          title="Transfer active order or guest table"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
          <span>Transfer</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={onNotificationsClick}
            className="p-2 rounded-full bg-[#131838] hover:bg-[#182046] border border-white/[0.06] text-slate-300 hover:text-white transition relative active:scale-95"
            title="Service alerts & telemetry notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>

        {/* Digital Clock */}
        <div className="hidden xl:flex flex-col items-end pl-2 pr-1 font-mono leading-tight">
          <span className="text-sm font-bold text-white tracking-wider">{time || '19:42:10'}</span>
          <span className="text-[10px] text-slate-400 font-sans">{dateStr || 'Fri, Oct 24'}</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="relative">
            <SafeImage
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
              alt="Elena Vance"
              fallbackText="EV"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-coral-400/40"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0a0d20]"></span>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-white flex items-center gap-1">
              <span>Elena Vance</span>
              <Sparkles className="w-3 h-3 text-coral-400" />
            </div>
            <div className="text-[10px] text-slate-400 leading-none">General Manager / Shift Lead</div>
          </div>
        </div>

        {/* Logout / Go Out */}
        <button 
          onClick={onLogOutClick}
          title="Sign Out / Lock Terminal"
          className="p-2 rounded-xl bg-[#131838] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/[0.06] hover:border-rose-500/30 transition active:scale-95"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

