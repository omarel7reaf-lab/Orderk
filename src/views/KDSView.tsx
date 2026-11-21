import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Volume2, 
  RotateCcw, 
  Clock, 
  AlertTriangle, 
  UtensilsCrossed, 
  Check, 
  CheckSquare, 
  Square, 
  BellRing,
  Sparkles
} from 'lucide-react';
import { INITIAL_KDS_TICKETS } from '../data/mockData';
import { KDSTicket } from '../types/pos';

export const KDSView: React.FC = () => {
  const [tickets, setTickets] = useState<KDSTicket[]>(INITIAL_KDS_TICKETS);
  const [selectedStation, setSelectedStation] = useState<string>('All Stations');
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [bumpedHistory, setBumpedHistory] = useState<KDSTicket[]>([]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        bumpFirstTicket();
      } else if (e.key.toLowerCase() === 'r') {
        recallLastTicket();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tickets, bumpedHistory]);

  const toggleItemCheck = (ticketId: string, itemId: string) => {
    setTickets(tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          items: t.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
        };
      }
      return t;
    }));
  };

  const bumpTicket = (ticketId: string) => {
    const target = tickets.find(t => t.id === ticketId);
    if (target) {
      setBumpedHistory([target, ...bumpedHistory]);
      setTickets(tickets.filter(t => t.id !== ticketId));
    }
  };

  const bumpFirstTicket = () => {
    if (tickets.length > 0) {
      bumpTicket(tickets[0].id);
    }
  };

  const recallLastTicket = () => {
    if (bumpedHistory.length > 0) {
      const [last, ...rest] = bumpedHistory;
      setTickets([last, ...tickets]);
      setBumpedHistory(rest);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-[#070a1e] overflow-hidden select-none">
      {/* Top Expediter Bar */}
      <div className="p-4 bg-[#0a0e28] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141b44] border border-white/[0.08]">
            <UtensilsCrossed className="w-4 h-4 text-coral-400" />
            <span className="font-extrabold text-sm text-white tracking-wider">KDS EXPEDITER</span>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            RUSH: HEAVY DINNER SERVICE
          </span>
        </div>

        {/* Stations Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'All Stations', label: 'All Stations 6' },
            { id: 'Grill', label: 'Grill Station 2' },
            { id: 'Sauté', label: 'Sauté & Pasta 3' },
            { id: 'Salad', label: 'Salad & Cold Larder 1' },
            { id: 'Expo', label: 'Expo / Pastry 2' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedStation(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedStation === st.id
                  ? 'bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1a0808] font-bold shadow-md shadow-coral-500/20'
                  : 'bg-[#121736] text-slate-300 hover:text-white border border-white/[0.04]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Chime & Recall */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setChimeEnabled(!chimeEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              chimeEnabled
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-[#121633] text-slate-400 border-white/[0.06]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Chime on New Order [{chimeEnabled ? 'ON' : 'OFF'}]</span>
          </button>

          <button 
            onClick={recallLastTicket}
            disabled={bumpedHistory.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141a3d] hover:bg-[#1a2350] disabled:opacity-40 border border-white/[0.06] text-xs font-semibold text-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-coral-400" />
            <span>Recall Bumped (R)</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 py-2.5 bg-[#080c24] border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Avg Ticket Turnaround</span>
          <strong className="text-white font-mono text-sm ml-auto">11.2 min</strong>
        </div>

        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-blue-400" />
          <span className="text-slate-400">Active Queue Count</span>
          <strong className="text-blue-400 font-mono text-sm ml-auto">{tickets.length} tickets</strong>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Overdue / Warning</span>
          <strong className="text-amber-400 font-mono text-sm ml-auto">2 tickets</strong>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Total Plated Tonight</span>
          <strong className="text-emerald-400 font-mono text-sm ml-auto">148 dishes</strong>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl bg-[#0f1433] border border-white/[0.08] flex flex-col justify-between overflow-hidden shadow-xl hover:border-white/[0.18] transition-all"
            >
              {/* Ticket Header */}
              <div 
                className="p-3 border-b border-white/[0.08] text-white flex items-center justify-between"
                style={{ 
                  background: ticket.statusBadge === 'LATE +4M' 
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(15, 20, 51, 1) 100%)' 
                    : ticket.statusBadge === 'GRILL IN PROGRESS'
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(15, 20, 51, 1) 100%)'
                    : ticket.statusBadge === 'NEW ORDER'
                    ? 'linear-gradient(135deg, rgba(255, 138, 122, 0.3) 0%, rgba(15, 20, 51, 1) 100%)'
                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(15, 20, 51, 1) 100%)'
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight font-mono">{ticket.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      ticket.statusBadge === 'LATE +4M' ? 'bg-rose-500 text-white animate-pulse' :
                      ticket.statusBadge === 'GRILL IN PROGRESS' ? 'bg-emerald-500 text-slate-950' :
                      ticket.statusBadge === 'NEW ORDER' ? 'bg-coral-500 text-slate-950' :
                      'bg-purple-500 text-white'
                    }`}>
                      {ticket.statusBadge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                    {ticket.tableOrType}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-base font-extrabold flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ticket.timeString}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
                {ticket.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItemCheck(ticket.id, item.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer select-none ${
                      item.completed 
                        ? 'bg-[#13193a]/50 border-white/[0.04] opacity-50' 
                        : 'bg-[#131a42] border-white/[0.06] hover:border-white/[0.14]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button className="mt-0.5 flex-shrink-0 text-slate-400">
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-1">
                          <span className={`text-xs font-bold leading-tight ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                            {item.quantity}× {item.name}
                          </span>
                        </div>

                        {item.station && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            {item.station}
                          </div>
                        )}

                        {item.mods && item.mods.map((m, idx) => (
                          <div key={idx} className="text-[10px] text-slate-300 italic mt-0.5 pl-2 border-l border-indigo-400/30">
                            {m}
                          </div>
                        ))}

                        {item.allergy && (
                          <div className="mt-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40 inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {item.allergy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons & Bump */}
              <div className="p-3 bg-[#0a0e28] border-t border-white/[0.06] space-y-2">
                <div className="flex gap-2 text-[11px]">
                  <button className="flex-1 py-1.5 rounded-xl bg-[#141b44] hover:bg-[#1b245a] text-slate-300 font-semibold border border-white/[0.06]">
                    Start Station
                  </button>
                  <button className="flex-1 py-1.5 rounded-xl bg-[#141b44] hover:bg-[#1b245a] text-slate-300 font-semibold border border-white/[0.06]">
                    Mark Ready
                  </button>
                </div>

                <button
                  onClick={() => bumpTicket(ticket.id)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 text-[#1b0808] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-coral-500/20 active:scale-95 transition"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Bump Ticket (Space)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low stock alert bar */}
      <div className="px-4 py-2 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-t border-white/[0.08] flex items-center justify-between text-xs text-white">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-semibold text-cyan-300">86 Chilean Sea Bass</span>
          <span className="text-slate-300">after current active tickets! (Only 1 portion remaining).</span>
        </div>
      </div>

      {/* Keyboard shortcuts footer */}
      <div className="px-4 py-2 bg-[#050818] border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[#131737] text-slate-200 font-mono text-[10px] border border-white/10">SPACE</kbd>
          <span>Bump Top Ticket</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[#131737] text-slate-200 font-mono text-[10px] border border-white/10">ENTER</kbd>
          <span>Claim Station</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[#131737] text-slate-200 font-mono text-[10px] border border-white/10">R</kbd>
          <span>Recall Last</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[#131737] text-slate-200 font-mono text-[10px] border border-white/10">1-5</kbd>
          <span>Switch Station Filter</span>
        </div>
      </div>
    </div>
  );
};

