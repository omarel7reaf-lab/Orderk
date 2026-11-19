import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Receipt, 
  UtensilsCrossed, 
  Grid2x2, 
  BookOpen, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronDown, 
  Headphones, 
  Lock
} from 'lucide-react';
import { NavView } from '../types/pos';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  orderCount?: number;
  kdsActiveCount?: number;
  onLockClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  orderCount = 14,
  kdsActiveCount = 6,
  onLockClick
}) => {
  const navItems = [
    { id: 'dashboard' as NavView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos' as NavView, label: 'POS / New Order', icon: ShoppingCart },
    { id: 'live-orders' as NavView, label: 'Live Orders', icon: Receipt, badge: orderCount, badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
    { id: 'kds' as NavView, label: 'Kitchen Display / KDS', icon: UtensilsCrossed, badge: `${kdsActiveCount} Active`, badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
    { id: 'floor-tables' as NavView, label: 'Floor & Tables', icon: Grid2x2, subtext: 'Fl/Patio' },
    { id: 'menu-recipes' as NavView, label: 'Menu & Recipes', icon: BookOpen },
    { id: 'reports' as NavView, label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'staff' as NavView, label: 'Staff & Roles', icon: Users },
    { id: 'settings' as NavView, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between bg-[#0b0e22] border-r border-white/[0.06] min-h-screen text-slate-300 select-none">
      {/* Brand & Location */}
      <div>
        <div className="p-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-coral-500 to-rose-400 flex items-center justify-center font-bold text-white shadow-md shadow-coral-500/20">
              <span className="text-base font-extrabold tracking-tight">K</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-lg tracking-tight">OrderK</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                POS v2.4
              </span>
            </div>
          </div>
        </div>

        {/* Location Dropdown selector */}
        <div className="px-3 mb-3">
          <button className="w-full text-left px-3 py-2 rounded-xl bg-[#121735] hover:bg-[#161c40] border border-white/[0.06] transition flex items-center justify-between group">
            <div className="truncate">
              <div className="text-xs font-semibold text-white group-hover:text-coral-400 transition truncate">
                Downtown Bistro
              </div>
              <div className="text-[10px] text-slate-400 truncate">Main Location</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition flex-shrink-0 ml-1" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1c0808] font-bold shadow-lg shadow-coral-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-[#141a3c]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#1c0808]' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {item.subtext && !isActive && (
                    <span className="text-[10px] text-slate-500">{item.subtext}</span>
                  )}
                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-black/20 text-[#1c0808]' 
                        : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Shift status & Bottom actions */}
      <div className="p-3 border-t border-white/[0.06] space-y-2">
        <div className="p-3 rounded-xl bg-[#101431] border border-white/[0.06] text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Current Shift</span>
            <span className="text-white font-medium">Dinner</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono">16:00 - 23:00</div>
          <div className="mt-2 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Floor Staff</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              8 Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 py-2 px-3 rounded-xl bg-[#141a3d] hover:bg-[#1a2350] border border-white/[0.06] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition">
            <Headphones className="w-3.5 h-3.5 text-coral-400" />
            <span>Support</span>
          </button>
          <button 
            onClick={onLockClick}
            title="Lock Terminal (PIN Lock)" 
            className="p-2 rounded-xl bg-[#141a3d] hover:bg-[#1a2350] border border-white/[0.06] text-slate-400 hover:text-white transition active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

