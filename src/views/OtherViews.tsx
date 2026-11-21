import React from 'react';
import { BookOpen, BarChart3, Users, Settings, Plus, Sparkles, ChefHat, Check, Shield } from 'lucide-react';
import { MENU_ITEMS, STAFF_ASSIGNMENTS } from '../data/mockData';
import { SafeImage } from '../components/SafeImage';

export const MenuRecipesView: React.FC = () => {
  return (
    <div className="p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-coral-400" />
            <span>Menu & Recipes Master List</span>
          </h1>
          <p className="text-xs text-slate-400">Manage portions, food cost margins, allergens & 86 count</p>
        </div>
        <button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1b0808] font-bold text-xs shadow-md shadow-coral-500/25">
          <Plus className="w-4 h-4" />
          <span>New Recipe Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {MENU_ITEMS.map((item) => (
          <div key={item.id} className="p-3 sm:p-4 rounded-2xl bg-[#111535] border border-white/[0.06] flex gap-3 sm:gap-4 items-center">
            <SafeImage 
              src={item.image} 
              alt={item.name} 
              fallbackText={item.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">{item.name}</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">{item.category}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="font-extrabold text-coral-400 font-mono">${item.price.toFixed(2)}</span>
                <span className="text-emerald-400 font-semibold">{item.margin} Margin</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReportsView: React.FC = () => {
  return (
    <div className="p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto text-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-coral-400" />
            <span>Reports & Executive Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">Shift revenue, average ticket time, labor efficiency, food cost</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#101432] border border-white/[0.06] space-y-2">
          <span className="text-xs text-slate-400">Total Shift Revenue</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">$8,429.50</div>
          <span className="text-xs text-emerald-400">+14.2% vs previous Friday</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#101432] border border-white/[0.06] space-y-2">
          <span className="text-xs text-slate-400">Average Kitchen Turn</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">11.4 mins</div>
          <span className="text-xs text-emerald-400">-1.8 mins improvement</span>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl bg-[#101432] border border-white/[0.06] space-y-2">
          <span className="text-xs text-slate-400">Average Guest Check</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">$59.36</div>
          <span className="text-xs text-blue-400">Pace: 18.2 tickets/hr</span>
        </div>
      </div>
    </div>
  );
};

export const StaffView: React.FC = () => {
  return (
    <div className="p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto text-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-coral-400" />
            <span>Staff Roster & Station Roles</span>
          </h1>
          <p className="text-xs text-slate-400">8 staff members clocked in on Dinner Shift</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STAFF_ASSIGNMENTS.map((s, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[#111535] border border-white/[0.06] space-y-3">
            <div className={`w-12 h-12 rounded-xl ${s.avatarColor} text-white font-bold text-base flex items-center justify-center`}>
              {s.initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{s.name}</h3>
              <p className="text-xs text-slate-400">{s.section}</p>
            </div>
            <div className="pt-2 border-t border-white/[0.05] flex justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active Shift
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SettingsView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto text-slate-200">
      <div className="pb-3 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-coral-400" />
          <span>System & Terminal Settings</span>
        </h1>
        <p className="text-xs text-slate-400">OrderK POS v2.4 Terminal Configuration</p>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#101432] border border-white/[0.06] space-y-3">
          <h3 className="text-sm font-bold text-white">Kitchen Display Integration</h3>
          <p className="text-xs text-slate-400">Automatic ticket chime, auto-bump timeout, and color codes.</p>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Check className="w-4 h-4" /> Connected to Station A, B, and Expo Rail.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101432] border border-white/[0.06] space-y-3">
          <h3 className="text-sm font-bold text-white">Payment Gateway</h3>
          <p className="text-xs text-slate-400">Stripe Terminal / Contactless Reader #POS-02</p>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Shield className="w-4 h-4" /> Hardware encryption enabled (PCI-DSS compliant).
          </div>
        </div>
      </div>
    </div>
  );
};

