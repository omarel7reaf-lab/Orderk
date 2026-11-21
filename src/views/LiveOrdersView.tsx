import React, { useState } from 'react';
import { 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ChevronRight, 
  User, 
  Printer, 
  ArrowLeftRight, 
  Trash2, 
  Plus, 
  Send,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { Order } from '../types/pos';
import { INITIAL_ORDERS } from '../data/mockData';

export const LiveOrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order>(INITIAL_ORDERS[0]);
  const [filterType, setFilterType] = useState<'all' | 'dine-in' | 'takeout'>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const incomingOrders = orders.filter(o => o.status === 'new');
  const inPrepOrders = orders.filter(o => o.status === 'prep');

  const confirmIncoming = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'prep', elapsedMinutes: 0 } : o));
  };

  const markFinished = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'ready' } : o));
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Kanban Area */}
      <div className="flex-1 flex flex-col bg-[#0b0e24] overflow-y-auto border-r border-white/[0.06] p-5 space-y-5">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white tracking-tight">Live Orders Lifecycle</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                Peak Dinner Rush
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time throughput management across Kitchen, Floor & Delivery
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            <button
              onClick={() => {
                setIsDrawerOpen(!isDrawerOpen);
                if (isMinimized) setIsMinimized(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                isDrawerOpen 
                  ? 'bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1a0808] border-coral-400 font-bold shadow-md shadow-coral-500/20' 
                  : 'bg-[#121634] hover:bg-[#181f4a] border-white/[0.06] text-slate-300'
              }`}
              title="إظهار أو إخفاء لوحة تفاصيل الطلب الجانبية"
            >
              <span>📋 تفاصيل الطلب ({selectedOrder?.ticketNumber || '1048'})</span>
              <span className="text-[10px] opacity-75 font-mono">
                {isDrawerOpen ? '◀ إخفاء' : '▶ إظهار'}
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121634] border border-white/[0.06]">
              <Clock className="w-3.5 h-3.5 text-coral-400" />
              <span className="text-slate-400">Avg Ticket Time:</span>
              <strong className="text-white font-mono">13m 40s</strong>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121634] border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">KDS SLA Pace:</span>
              <strong className="text-emerald-400 font-mono">94.2%</strong>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'all'
                ? 'bg-[#18214f] text-coral-300 border border-coral-400/30'
                : 'bg-[#111533] text-slate-400 hover:text-white border border-white/[0.04]'
            }`}
          >
            All Active Orders (14)
          </button>
          <button 
            onClick={() => setFilterType('dine-in')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'dine-in'
                ? 'bg-[#18214f] text-coral-300 border border-coral-400/30'
                : 'bg-[#111533] text-slate-400 hover:text-white border border-white/[0.04]'
            }`}
          >
            🍽 Dine-In (12)
          </button>
          <button 
            onClick={() => setFilterType('takeout')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterType === 'takeout'
                ? 'bg-[#18214f] text-coral-300 border border-coral-400/30'
                : 'bg-[#111533] text-slate-400 hover:text-white border border-white/[0.04]'
            }`}
          >
            🥡 Takeout & Curbside (4)
          </button>
        </div>

        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          {/* Column 1: New / Incoming */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-white">New / Incoming</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-white text-xs font-bold">
                {incomingOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto">
              {incomingOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => { setSelectedOrder(order); setIsDrawerOpen(true); setIsMinimized(false); }}
                  className={`p-4 rounded-2xl bg-[#111636] border transition-all cursor-pointer shadow-lg hover:border-white/[0.18] ${
                    selectedOrder?.id === order.id ? 'border-coral-400/60 ring-1 ring-coral-400/30' : 'border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono">{order.ticketNumber}</span>
                      {order.tableLabel && (
                        <span className="px-2 py-0.5 rounded-md bg-[#18204b] text-[11px] font-semibold text-slate-300">
                          {order.tableLabel}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-extrabold text-white font-sans">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {order.guestCount ? `${order.guestCount} Guests • ` : ''}Server: {order.server}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Clock className="w-3 h-3 text-coral-400" />
                      {order.elapsedMinutes}m ago
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0d112b] border border-white/[0.04] text-xs text-slate-300 space-y-1 mb-3">
                    {order.items.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="truncate">{item.quantity}× {item.name}</span>
                        <span className="text-slate-500 font-mono">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-[10px] text-slate-500 pt-0.5">
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmIncoming(order.id);
                      }}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 text-[#1b0808] font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-coral-500/20"
                    >
                      <Send className="w-3 h-3" />
                      <span>Confirm & Send to Kitchen</span>
                    </button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-[#161c42] hover:bg-[#1f2860] text-slate-300 border border-white/[0.06]"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: In Kitchen (Prep) */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-white">In Kitchen (Prep)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                {inPrepOrders.length}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto">
              {inPrepOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => { setSelectedOrder(order); setIsDrawerOpen(true); setIsMinimized(false); }}
                  className={`p-4 rounded-2xl bg-[#111636] border transition-all cursor-pointer shadow-lg hover:border-white/[0.18] ${
                    selectedOrder?.id === order.id ? 'border-coral-400/60 ring-1 ring-coral-400/30' : 'border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono">{order.ticketNumber}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#18204b] text-[11px] font-semibold text-slate-300">
                        {order.tableLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.isDelayed && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                          <AlertCircle className="w-3 h-3" />
                          DELAY 18m
                        </span>
                      )}
                      <span className="text-sm font-extrabold text-white font-sans">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span>{order.guestCount} Guests • Server: {order.server}</span>
                    <span className="font-mono text-emerald-400 font-bold">{order.items.length} items</span>
                  </div>

                  {/* Cook timer bar */}
                  <div className="p-3 rounded-xl bg-[#0d112b] border border-white/[0.04] space-y-2 mb-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Elapsed Cook Time</span>
                      <span className={`font-mono font-bold ${order.isDelayed ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {order.elapsedMinutes}m / {order.targetMinutes}m Target
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#1b224c] overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${order.isDelayed ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-coral-400'}`} 
                        style={{ width: `${Math.min(100, (order.elapsedMinutes / order.targetMinutes) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                      <span className="truncate">Station: {order.station}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-coral-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      Entrees Fired
                    </span>
                    <button className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Minimized Dock Bar */}
      {isDrawerOpen && isMinimized && selectedOrder && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0d1233]/95 border border-coral-500/40 shadow-2xl rounded-2xl px-4 py-2.5 flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white font-mono">Order {selectedOrder.ticketNumber}</span>
            <span className="text-[10px] text-slate-300">({selectedOrder.tableLabel})</span>
            <span className="text-[10px] text-coral-300 font-bold">${selectedOrder.total.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              title="تكبير / استعادة اللوحة"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setIsMinimized(false);
              }}
              className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
              title="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Right Drawer: Order Inspector (Collapsible, Minimizable & Maximizable) */}
      {isDrawerOpen && !isMinimized && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop on click to close */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer content sliding in from right */}
          <div 
            className={`relative z-10 h-full bg-[#090c21] border-l border-white/10 flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out ${
              isExpanded ? 'w-full sm:w-[560px] md:w-[680px]' : 'w-full sm:w-[460px]'
            }`}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-[#0c102a] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-base font-mono">Order {selectedOrder.ticketNumber} Details</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    In Prep ({selectedOrder.elapsedMinutes}m)
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {selectedOrder.tableLabel} • {selectedOrder.guestCount} Guests • Server: {selectedOrder.server}
                </div>
              </div>

              {/* Action buttons: Minimize, Maximize, Close */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition"
                  title="تصغير للأسفل"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition"
                  title={isExpanded ? "استعادة الحجم" : "تكبير اللوحة"}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                  title="إغلاق اللوحة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SLA Progress Bar */}
            <div className="p-5 border-b border-white/[0.06] bg-[#0e1333] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">Kitchen Fulfillment SLA</span>
                <span className="font-extrabold text-white font-mono">{selectedOrder.elapsedMinutes} min elapsed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1b224c] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff9e93] to-rose-500 rounded-full" 
                  style={{ width: `${Math.min(100, (selectedOrder.elapsedMinutes / selectedOrder.targetMinutes) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Target Dispatch: 14m (18:57)</span>
                <span className="text-emerald-400 font-semibold">Pace: On Track</span>
              </div>
            </div>

            {/* Items List */}
            <div className="p-5 border-b border-white/[0.06] space-y-3 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                <span>Order Items ({selectedOrder.items.length} items)</span>
                <button className="text-[11px] text-coral-400 hover:text-coral-300 font-semibold flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  <span>Add Item</span>
                </button>
              </div>

              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#111636] border border-white/[0.04] space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-white">
                      <strong className="text-coral-400 font-mono mr-1.5">{item.quantity}×</strong>
                      {item.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {item.modifiers && item.modifiers.map((m, i) => (
                    <div key={i} className="text-[11px] text-slate-400 pl-4 border-l border-indigo-500/30">
                      {m}
                    </div>
                  ))}

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Station: Grill 1 (Antonio)</span>
                    <button className="text-rose-400/80 hover:text-rose-400">Void Item</button>
                  </div>
                </div>
              ))}

              {/* Lifecycle Timestamp Log */}
              <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Lifecycle Timestamp Log</span>
                
                <div className="space-y-3 pl-2 border-l-2 border-coral-500/30">
                  <div className="text-xs space-y-0.5">
                    <div className="flex justify-between text-white font-semibold">
                      <span>Order Received & Digitized</span>
                      <span className="font-mono text-slate-400">18:42:10</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Table terminal session initiated by Marcus G.</div>
                  </div>

                  <div className="text-xs space-y-0.5">
                    <div className="flex justify-between text-white font-semibold">
                      <span>Sent to Kitchen Displays (KDS)</span>
                      <span className="font-mono text-slate-400">18:43:05</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Routed to Grill Station, Sauté & Fryer lines</div>
                  </div>

                  <div className="text-xs space-y-0.5">
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Line Cook Claimed Ticket</span>
                      <span className="font-mono text-slate-400">18:45:22</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Chef Antonio accepted ticket on KDS #2</div>
                  </div>

                  <div className="text-xs space-y-0.5 opacity-60">
                    <div className="flex justify-between text-slate-400 font-semibold">
                      <span>Ready at Pass / Expediter Check</span>
                      <span className="font-mono">Est. 18:57</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Waiting on Sauté Station</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Financial & Action Buttons */}
            <div className="p-5 bg-[#0b0f2c] border-t border-white/[0.06] space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sales Tax (8.25%)</span>
                  <span className="text-white font-mono">${selectedOrder.tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => markFinished(selectedOrder.id)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 text-[#1a0808] font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-coral-500/25"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Station Finished</span>
                </button>
                <button className="py-2.5 px-3 rounded-xl bg-[#151b40] hover:bg-[#1c2454] border border-white/[0.08] text-slate-300 text-xs font-medium flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Re-print Chit</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <button className="py-2 rounded-lg bg-[#14193b] hover:bg-[#1a2350] border border-white/[0.06] text-slate-300">
                  + Add Modifiers
                </button>
                <button className="py-2 rounded-lg bg-[#14193b] hover:bg-[#1a2350] border border-white/[0.06] text-slate-300">
                  ⇄ Transfer Table
                </button>
                <button className="py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold">
                  Void Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

