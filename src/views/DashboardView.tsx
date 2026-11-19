import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Utensils, 
  ChevronDown, 
  Download, 
  RefreshCw, 
  ArrowUpRight, 
  Flame, 
  AlertTriangle, 
  CreditCard, 
  Star, 
  ChefHat
} from 'lucide-react';
import { ACTIVITY_FEED, STAFF_ASSIGNMENTS } from '../data/mockData';
import { NavView } from '../types/pos';
import { SafeImage } from '../components/SafeImage';

interface DashboardViewProps {
  onNavigate: (view: NavView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Banner / Shift Live Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-rose-400">
              Shift Live Telemetry
            </span>
            <span className="text-[11px] text-slate-500">• Updated 42s ago</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Good evening, Elena. Downtown Bistro is operating at peak efficiency.
          </h1>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131738] border border-white/[0.08] text-xs text-slate-200 hover:bg-[#181f4a] transition">
            <Clock className="w-3.5 h-3.5 text-coral-400" />
            <span>Today: Dinner Shift</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131738] border border-white/[0.08] text-xs text-slate-200 hover:bg-[#181f4a] transition">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>vs. Last Friday</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </button>

          <button className="p-2 rounded-xl bg-[#131738] border border-white/[0.08] text-slate-300 hover:text-white transition">
            <Download className="w-3.5 h-3.5" />
          </button>
          
          <button className="p-2 rounded-xl bg-[#131738] border border-white/[0.08] text-slate-300 hover:text-white transition">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-2xl bg-[#101432] border border-white/[0.07] shadow-xl relative overflow-hidden group hover:border-white/[0.14] transition">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider">
            <span>Gross Revenue Today</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-white tracking-tight font-sans">
            $8,429.50
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Target: $10,500.00</span>
              <span className="text-emerald-400 font-semibold">80.2% achieved</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1b224c] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" style={{ width: '80.2%' }}></div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
            <span>Est. Close: <strong className="text-white">$11,200</strong></span>
            <span className="text-emerald-400 font-semibold flex items-center">
              +$720 vs Pace
            </span>
          </div>
        </div>

        {/* Total Tickets */}
        <div className="p-5 rounded-2xl bg-[#101432] border border-white/[0.07] shadow-xl relative overflow-hidden group hover:border-white/[0.14] transition">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider">
            <span>Total Tickets</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
              Live
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">142</span>
            <span className="text-xs text-slate-400">orders</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-[#151c44] border border-white/[0.04]">
              <div className="text-sm font-bold text-emerald-400">118</div>
              <div className="text-[10px] text-slate-400">Served</div>
            </div>
            <div className="p-2 rounded-xl bg-[#151c44] border border-white/[0.04]">
              <div className="text-sm font-bold text-coral-400">14</div>
              <div className="text-[10px] text-slate-400">In Prep</div>
            </div>
            <div className="p-2 rounded-xl bg-[#151c44] border border-white/[0.04]">
              <div className="text-sm font-bold text-rose-400">10</div>
              <div className="text-[10px] text-slate-400">Void/Ret</div>
            </div>
          </div>
        </div>

        {/* Floor Occupancy */}
        <div className="p-5 rounded-2xl bg-[#101432] border border-white/[0.07] shadow-xl relative overflow-hidden group hover:border-white/[0.14] transition">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider">
            <span>Floor Occupancy</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
              Seated
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">84%</span>
            <span className="text-xs text-slate-400">(21/25 Tables)</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Average Table Turn</span>
              <span className="text-white font-semibold">48 mins</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1b224c] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-coral-400 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
            <span>Reservations remaining</span>
            <span className="text-white font-semibold">18 Parties</span>
          </div>
        </div>

        {/* Kitchen Velocity */}
        <div className="p-5 rounded-2xl bg-[#101432] border border-white/[0.07] shadow-xl relative overflow-hidden group hover:border-white/[0.14] transition">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider">
            <span>Kitchen Velocity</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              ⚡ Rapid
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">11.4</span>
            <span className="text-xs text-slate-400">mins avg</span>
          </div>
          <div className="mt-3 space-y-1 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>SLA Target: &lt; 14 mins</span>
              <span className="text-amber-400 font-medium">Peak wait: 18m</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1b224c] overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
            <span>KDS Active Rail</span>
            <span className="text-emerald-400 font-semibold">4 Expediting</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Hourly Chart & Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Revenue & Velocity Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#101432] border border-white/[0.07] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Hourly Revenue & Ticket Velocity</span>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Rush
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Service rush volume distribution (12:00 to 23:00)</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-coral-400"></span>
                  Revenue ($)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Order Count
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG / Bar Chart Representation */}
            <div className="relative pt-6 pb-2">
              {/* Peak window highlight pill */}
              <div className="absolute top-0 left-[48%] -translate-x-1/2 px-2.5 py-1 rounded-full bg-coral-500/20 text-coral-300 text-[10px] font-bold border border-coral-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-coral-400 fill-coral-400" />
                <span>PEAK DINNER WINDOW (17:00 - 21:00)</span>
              </div>

              <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
                {[
                  { hour: '12h', rev: 320, orders: 12, height: '22%' },
                  { hour: '13h', rev: 450, orders: 16, height: '30%' },
                  { hour: '14h', rev: 380, orders: 14, height: '26%' },
                  { hour: '15h', rev: 210, orders: 8, height: '18%' },
                  { hour: '16h', rev: 290, orders: 10, height: '20%' },
                  { hour: '17h', rev: 720, orders: 24, height: '52%', highlight: true },
                  { hour: '18h', rev: 1420, orders: 38, height: '92%', peak: true },
                  { hour: '19h', rev: 1280, orders: 34, height: '84%', peak: true },
                  { hour: '20h', rev: 980, orders: 28, height: '68%', highlight: true },
                  { hour: '21h', rev: 610, orders: 19, height: '42%' },
                  { hour: '22h', rev: 310, orders: 9, height: '24%' }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full max-w-[34px] rounded-t-lg transition-all duration-300 group-hover:brightness-125 relative flex items-end justify-center"
                         style={{ height: bar.height }}>
                      <div className={`w-full h-full rounded-t-lg ${
                        bar.peak 
                          ? 'bg-gradient-to-t from-coral-500 to-[#ffa59b] shadow-lg shadow-coral-500/30' 
                          : bar.highlight 
                            ? 'bg-gradient-to-t from-indigo-600 to-purple-400' 
                            : 'bg-[#1a214d] group-hover:bg-[#252f6d]'
                      }`}></div>
                      
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-10 bg-[#090b1c] text-white text-[10px] px-2 py-1 rounded shadow-xl border border-white/10 whitespace-nowrap z-20 transition">
                        ${bar.rev} • {bar.orders} ord
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono ${bar.peak ? 'text-coral-300 font-bold' : 'text-slate-400'}`}>
                      {bar.hour}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-coral-400" />
              Dinner ticket average: <strong className="text-white">$59.36</strong> (+$7.10 vs last week)
            </span>
            <span className="font-mono text-emerald-400">Pace: 18.2 tickets/hr</span>
          </div>
        </div>

        {/* Top Dishes Tonight */}
        <div className="p-5 rounded-2xl bg-[#101432] border border-white/[0.07] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Top Dishes Tonight</h3>
                <p className="text-xs text-slate-400">Ranked by revenue contribution & volume</p>
              </div>
              <Utensils className="w-4 h-4 text-coral-400" />
            </div>

            <div className="space-y-3">
              {[
                { rank: 1, name: 'Prime Dry-Aged Ribeye', sold: '38 sold tonight', rev: '$1,976', margin: '72% Margin', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80' },
                { rank: 2, name: 'Truffle Tagliolini', sold: '46 sold tonight', rev: '$1,196', margin: '81% Margin', img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=120&auto=format&fit=crop&q=80' },
                { rank: 3, name: 'Smoked Old Fashioned', sold: '64 sold tonight', rev: '$1,024', margin: '86% Margin', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=120&auto=format&fit=crop&q=80' },
                { rank: 4, name: 'Crispy Calamari Fritti', sold: '31 sold tonight', rev: '$589', margin: '74% Margin', img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=120&auto=format&fit=crop&q=80' }
              ].map((dish) => (
                <div key={dish.rank} className="flex items-center justify-between p-2 rounded-xl bg-[#141a3d] hover:bg-[#1a2350] border border-white/[0.04] transition group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-coral-500 to-rose-400 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                      {dish.rank}
                    </div>
                    <SafeImage 
                      src={dish.img} 
                      alt={dish.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/10" 
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate group-hover:text-coral-300 transition">{dish.name}</div>
                      <div className="text-[10px] text-slate-400">{dish.sold}</div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <div className="text-xs font-bold text-white">{dish.rev}</div>
                    <div className="text-[10px] text-emerald-400 font-medium">{dish.margin}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('menu-recipes')}
            className="w-full mt-4 py-2 text-center text-xs text-coral-400 hover:text-coral-300 font-medium hover:underline flex items-center justify-center gap-1"
          >
            <span>View Full Menu Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Lower Row: Live Service Activity Feed + Floor Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#101432] border border-white/[0.07] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Live Service Activity Feed</span>
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Real-time Sync
            </span>
          </div>

          <div className="space-y-3">
            {ACTIVITY_FEED.map((act) => (
              <div 
                key={act.id} 
                className="p-3 rounded-xl bg-[#131838] border border-white/[0.04] flex items-start justify-between gap-3 hover:border-white/[0.1] transition"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${
                    act.type === 'vip' ? 'bg-amber-500/15 text-amber-400' :
                    act.type === 'inventory' ? 'bg-emerald-500/15 text-emerald-400' :
                    act.type === 'settled' ? 'bg-blue-500/15 text-blue-400' :
                    'bg-rose-500/15 text-rose-400'
                  }`}>
                    {act.type === 'vip' && <Star className="w-4 h-4 fill-amber-400/40" />}
                    {act.type === 'inventory' && <AlertTriangle className="w-4 h-4" />}
                    {act.type === 'settled' && <CreditCard className="w-4 h-4" />}
                    {act.type === 'delay' && <Clock className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{act.title}</span>
                      {act.badge && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {act.badge}
                        </span>
                      )}
                      {act.tag && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                          {act.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{act.subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{act.time}</span>
                  {act.hasPing && (
                    <button className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold border border-rose-500/40 transition">
                      Ping Station
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floor Snapshot */}
        <div className="p-5 rounded-2xl bg-[#101432] border border-white/[0.07] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Floor Snapshot</h3>
                <p className="text-xs text-slate-400">Live physical table load across sectors</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400">21 / 25</span>
                <div className="text-[10px] text-slate-400">Tables</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Main Dining Room</span>
                  <span className="text-white font-bold">14/16 Seated (88%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1b224c] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-coral-400 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Patio & Garden Terrace</span>
                  <span className="text-white font-bold">5/6 Seated (83%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1b224c] overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Bar & High Top Counters</span>
                  <span className="text-white font-bold">8/10 Seated (80%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1b224c] overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('floor-tables')}
            className="w-full mt-6 py-2.5 rounded-xl bg-[#161c40] hover:bg-[#1d2557] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center gap-2 group"
          >
            <span>Jump to Interactive Floor Plan</span>
            <ArrowUpRight className="w-4 h-4 text-coral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Floor Staff Performance & Active Station Assignments */}
      <div className="p-5 rounded-2xl bg-[#101432] border border-white/[0.07] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-coral-400" />
            <span>Floor Staff Performance & Active Station Assignments</span>
          </h3>
          <span className="text-xs text-slate-400">4 Key Stations Tracked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAFF_ASSIGNMENTS.map((staff, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#14193b] border border-white/[0.04] flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${staff.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-md flex-shrink-0`}>
                {staff.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{staff.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{staff.section}</div>
                <div className="mt-1 flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.04]">
                  {staff.status === 'expediter' ? (
                    <>
                      <span className="text-slate-400">KDS Station</span>
                      <span className="text-emerald-400 font-semibold">{staff.outputRate}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-400">{staff.tables} Tables</span>
                      <span className="text-white font-semibold">${staff.sales?.toFixed(2)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

