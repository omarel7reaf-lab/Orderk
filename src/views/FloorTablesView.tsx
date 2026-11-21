import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeftRight, 
  ExternalLink, 
  Plus, 
  Maximize2, 
  Layers, 
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { INITIAL_TABLES } from '../data/mockData';
import { TableItem, NavView } from '../types/pos';

interface FloorTablesViewProps {
  onNavigateToPOS?: () => void;
}

export const FloorTablesView: React.FC<FloorTablesViewProps> = ({ onNavigateToPOS }) => {
  const [tables, setTables] = useState<TableItem[]>(INITIAL_TABLES);
  const [selectedTable, setSelectedTable] = useState<TableItem>(
    INITIAL_TABLES.find(t => t.id === 't-07') || INITIAL_TABLES[0]
  );
  const [activeSector, setActiveSector] = useState<'main' | 'patio' | 'bar' | 'private'>('main');
  const [showMobileInspector, setShowMobileInspector] = useState(false);

  const occupiedCount = tables.filter(t => t.status === 'occupied' || t.status === 'selected' || t.status === 'bill-requested' || t.status === 'held').length;
  const availableCount = tables.filter(t => t.status === 'available').length;
  const reservedCount = tables.filter(t => t.status === 'reserved').length;
  const cleaningCount = tables.filter(t => t.status === 'cleaning').length;

  const handleSelectTable = (table: TableItem) => {
    setSelectedTable(table);
    setShowMobileInspector(true);
  };

  const markTableClean = (tableId: string) => {
    setTables(tables.map(t => t.id === tableId ? { ...t, status: 'available', specialNote: 'Clean & Available' } : t));
    if (selectedTable?.id === tableId) {
      setSelectedTable({ ...selectedTable, status: 'available', specialNote: 'Clean & Available' });
    }
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-[#070a1f]">
      {/* Main Floor Area */}
      <div className="flex-1 flex flex-col overflow-y-auto border-r border-white/[0.06] p-5 space-y-4">
        {/* Top Controls & Sector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
          {/* Sector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0f1433] border border-white/[0.06]">
            {[
              { id: 'main', label: '🍽 Main Dining Room 16' },
              { id: 'patio', label: '🌿 Outdoor Heated Patio 8' },
              { id: 'bar', label: '🍸 Bar & High Tops 10' },
              { id: 'private', label: '👑 Private Dining Room 2' },
            ].map((sector) => (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeSector === sector.id
                    ? 'bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1b0808] shadow-md shadow-coral-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {sector.label}
              </button>
            ))}
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono px-2 py-1 rounded bg-[#121636] border border-white/[0.06]">
              🔍 100%
            </span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121636] hover:bg-[#181f4a] border border-white/[0.06] text-xs font-semibold text-slate-300">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Floor Layout Editor</span>
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1b0808] font-bold text-xs shadow-md shadow-coral-500/20">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>New Seating / Walk-in</span>
            </button>
          </div>
        </div>

        {/* Floor KPI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#101538] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Occupied Tables</span>
              <div className="text-lg font-extrabold text-white">14/16 <span className="text-xs text-coral-400">(88%)</span></div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-coral-400"></div>
          </div>

          <div className="p-3 rounded-xl bg-[#101538] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Available Immediately</span>
              <div className="text-lg font-extrabold text-emerald-400">2 Tables</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>

          <div className="p-3 rounded-xl bg-[#101538] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Reserved Next 30m</span>
              <div className="text-lg font-extrabold text-blue-400">3 Bookings</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
          </div>

          <div className="p-3 rounded-xl bg-[#101538] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Cleaning / Turnover</span>
              <div className="text-lg font-extrabold text-amber-400">1 Pending</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          </div>
        </div>

        {/* Interactive Floor Blueprint Canvas */}
        <div className="rounded-2xl bg-[#0b0f2d] border border-white/[0.08] p-5 relative min-h-[460px] shadow-2xl flex flex-col justify-between">
          {/* Blueprint Perimeter Landmarks */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pb-3 border-b border-white/[0.04]">
            <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
              ☀️ Floor-to-Ceiling Windows (Ocean View Promenade)
            </span>
            <div className="flex items-center gap-4">
              <span className="text-purple-400">• Server Marcus</span>
              <span className="text-pink-400">• Server Sarah</span>
              <span className="text-blue-400">• Server David</span>
            </div>
          </div>

          <div className="py-2 flex items-center justify-center gap-6 text-[11px] text-slate-400">
            <span className="px-3 py-1 rounded-full bg-[#141b44] border border-white/[0.06]">
              🍳 Main Kitchen Pass & Pickup Counter (Station B)
            </span>
            <span className="px-3 py-1 rounded-full bg-[#141b44] border border-white/[0.06]">
              🚻 Restrooms
            </span>
          </div>

          {/* Table Cards Grid (4x4 layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
            {tables.map((table) => {
              const isSelected = selectedTable?.id === table.id;
              
              let cardBg = 'bg-[#12173a]';
              let badgeColor = 'bg-blue-500/20 text-blue-300';
              let borderColor = 'border-white/[0.06]';

              if (table.status === 'available') {
                cardBg = 'bg-[#0f1d35]';
                badgeColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
              } else if (table.status === 'held') {
                badgeColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
              } else if (table.status === 'cleaning') {
                cardBg = 'bg-[#1e172a]';
                badgeColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
              } else if (table.status === 'bill-requested') {
                badgeColor = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
              }

              if (isSelected) {
                borderColor = 'border-coral-400 ring-2 ring-coral-400/50 shadow-lg shadow-coral-500/20';
              }

              return (
                <div
                  key={table.id}
                  onClick={() => handleSelectTable(table)}
                  className={`p-3.5 rounded-2xl ${cardBg} ${borderColor} border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:scale-[1.02] shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-base text-white tracking-tight">{table.number}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300">
                          {table.type}
                        </span>
                      </div>
                      {table.server && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {table.server}
                        </div>
                      )}
                    </div>

                    {table.status === 'available' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ) : table.status === 'cleaning' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-coral-400"></span>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/[0.04] text-[11px] space-y-1">
                    <p className="text-slate-300 font-medium truncate">{table.specialNote}</p>
                    
                    <div className="flex items-center justify-between text-slate-400">
                      {table.orderTotal ? (
                        <span className="font-bold text-white font-mono">${table.orderTotal.toFixed(2)}</span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">Available</span>
                      )}
                      {table.elapsedMinutes && (
                        <span className="font-mono text-[10px]">{table.elapsedMinutes}m</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floor Map Footer */}
          <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Floor layout synched with Host POS Station #1</span>
            </span>
            <span className="font-mono text-[11px]">Last table reset 4m ago</span>
          </div>
        </div>

        {/* Tonight's Seating Timeline & Dinner Turns */}
        <div className="p-5 rounded-2xl bg-[#0f1435] border border-white/[0.07] shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-coral-400" />
              <span>Tonight's Seating Timeline & Dinner Turns</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Dinner Shift • Oct 24</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#141b44] border border-white/[0.04]">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>18:00</span>
                <span className="text-emerald-400">100% On-time</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Actual Seated: 12 Parties</div>
              <div className="text-[10px] text-slate-500 mt-2">Completed turnover for 4 two-tops</div>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-[#1a2358] to-[#252046] border border-coral-400/30 ring-1 ring-coral-400/20">
              <div className="flex justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1">
                  <span>19:00</span>
                  <span className="px-1.5 py-0.2 rounded bg-coral-500/20 text-coral-300 text-[10px] font-bold">CURRENT PEAK</span>
                </span>
                <span className="text-coral-400 font-bold">14 Seated</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1">3 Upcoming reservations • Avg Prep 12m</div>
              <div className="text-[10px] text-coral-300/80 mt-2">Dr. Aris Thorne (4P @ T-05) arriving in 18m</div>
            </div>

            <div className="p-3 rounded-xl bg-[#141b44] border border-white/[0.04]">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>20:00</span>
                <span className="text-blue-400">Second Turn</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Expected Turns: 11 Parties • 6 Reserved</div>
              <div className="text-[10px] text-slate-500 mt-2">Includes 2 VIP large celebrations (T-04)</div>
            </div>

            <div className="p-3 rounded-xl bg-[#141b44] border border-white/[0.04]">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>21:00+</span>
                <span className="text-slate-400">Late Dining</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">5 Bookings • Walk-ins Open</div>
              <div className="text-[10px] text-slate-500 mt-2">Kitchen Last Call scheduled for 22:15</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Table Inspector Panel (Permanent on xl, slide-up sheet on mobile/tablet) */}
      {selectedTable && (
        <div className={`
          ${showMobileInspector ? 'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4' : 'hidden xl:flex'}
          xl:static xl:w-96 xl:bg-[#090d24] xl:border-l xl:border-white/[0.06] xl:p-0 xl:backdrop-blur-none
        `}>
          <div className="w-full sm:max-w-md xl:max-w-none h-[85vh] sm:h-auto sm:max-h-[90vh] xl:h-full rounded-t-3xl sm:rounded-3xl xl:rounded-none bg-[#090d24] border-t sm:border border-white/10 xl:border-none flex flex-col justify-between overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-[#0c112d] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-lg font-extrabold text-white">Table {selectedTable.number}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedTable.status === 'available' ? 'bg-emerald-500/20 text-emerald-300' :
                    selectedTable.status === 'cleaning' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-coral-500/20 text-coral-300'
                  }`}>
                    {selectedTable.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Section 2 • Center Floor</p>
              </div>

              {/* Close button for mobile/tablet */}
              <button
                onClick={() => setShowMobileInspector(false)}
                className="xl:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          {/* Details & Specs */}
          <div className="p-5 space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#12173a] border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedTable.elapsedMinutes || 0} min</div>
                <span className="text-[10px] text-slate-500">Target: 19:45</span>
              </div>

              <div className="p-3 rounded-xl bg-[#12173a] border border-white/[0.04]">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Guest Count</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedTable.guestCount || 2} <span className="text-slate-400 font-normal">(Cap: {selectedTable.capacity})</span></div>
                <span className="text-[10px] text-slate-500">Server: {selectedTable.server || 'Unassigned'}</span>
              </div>
            </div>

            {/* Active Ticket Card */}
            {selectedTable.orderTotal ? (
              <div className="p-4 rounded-xl bg-[#111638] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Ticket</span>
                    <div className="text-sm font-bold text-white font-mono">#ORD-1048</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">POS Terminal 2</span>
                    <div className="text-base font-extrabold text-white">${selectedTable.orderTotal.toFixed(2)}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0b0f2a] border border-white/[0.04] text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>2× Prime Dry-Aged Ribeye 14oz</span>
                    <span className="font-mono">$116.00</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>1× Pan-Seared Chilean Sea Bass</span>
                    <span className="font-mono">$48.00</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>1× Wild Mushroom Pappardelle</span>
                    <span className="font-mono">$34.50</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-coral-400 font-semibold pt-1">
                  <span>Kitchen: In Prep (8m elapsed)</span>
                  <span className="text-[10px] text-slate-400">Pace: On Track</span>
                </div>
              </div>
            ) : null}

            {/* Notification alert box */}
            <div className="p-3 rounded-xl bg-[#13193c] border border-white/[0.06] flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-coral-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block font-semibold">High Turnover Expected (20:00)</strong>
                6 dinner parties projected to close within 25 minutes.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-5 bg-[#0a0e28] border-t border-white/[0.06] space-y-2.5">
            <button
              onClick={onNavigateToPOS}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 text-[#1a0808] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-coral-500/25 transition active:scale-95"
            >
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              <span>Open in POS Terminal</span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button className="py-2.5 rounded-xl bg-[#141a3d] hover:bg-[#1a2350] border border-white/[0.06] text-slate-300 font-medium flex items-center justify-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
                <span>Transfer Table</span>
              </button>
              <button className="py-2.5 rounded-xl bg-[#141a3d] hover:bg-[#1a2350] border border-white/[0.06] text-slate-300 font-medium flex items-center justify-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Merge Tables</span>
              </button>
            </div>

            {selectedTable.status === 'cleaning' && (
              <button
                onClick={() => markTableClean(selectedTable.id)}
                className="w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition"
              >
                ✓ Mark Clean & Free
              </button>
            )}
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

