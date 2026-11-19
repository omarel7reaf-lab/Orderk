import React, { useState } from 'react';
import { Bell, X, Star, AlertTriangle, Clock, Check, ChevronRight } from 'lucide-react';
import { ACTIVITY_FEED } from '../data/mockData';
import { playChime } from '../utils/sound';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFloor?: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onNavigateToFloor
}) => {
  const [notifications, setNotifications] = useState(ACTIVITY_FEED);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    playChime('bump');
    setNotifications([]);
  };

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playChime('bump');
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="absolute top-16 right-16 z-50 w-80 sm:w-96 rounded-2xl bg-[#0d122e] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="p-3.5 bg-[#101639] border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-coral-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Service Notifications</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
            {notifications.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] text-slate-400 hover:text-white transition"
            >
              Clear All
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-2 space-y-2 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            <Check className="w-8 h-8 text-emerald-400 mx-auto mb-1 stroke-[1.5]" />
            <p className="font-semibold text-slate-300">All caught up!</p>
            <p className="text-[11px] text-slate-500">No active alerts at this moment.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onClose();
                onNavigateToFloor?.();
              }}
              className="p-2.5 rounded-xl bg-[#141a3d] hover:bg-[#1b2352] border border-white/[0.04] transition cursor-pointer flex items-start gap-2.5 group"
            >
              <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 flex-shrink-0">
                {n.type === 'vip' && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />}
                {n.type === 'inventory' && <AlertTriangle className="w-3.5 h-3.5 text-emerald-400" />}
                {n.type === 'delay' && <Clock className="w-3.5 h-3.5 text-rose-400" />}
                {n.type === 'settled' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-coral-300 transition truncate">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-500">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {n.subtitle}
                </p>
              </div>

              <button
                onClick={(e) => handleDismiss(n.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-white transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-[#0b0f28] border-t border-white/[0.05] text-center">
        <button
          onClick={() => {
            onClose();
            onNavigateToFloor?.();
          }}
          className="text-[11px] text-coral-400 hover:text-coral-300 font-semibold flex items-center justify-center gap-1 mx-auto"
        >
          <span>View Live Activity on Floor</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

