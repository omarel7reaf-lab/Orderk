import React, { useState } from 'react';
import { ArrowLeftRight, X, Check, Users, AlertCircle } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { playChime } from '../utils/sound';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const { tables, activeTableId, setActiveTableId, orders } = usePOS();
  
  const [sourceTableId, setSourceTableId] = useState(activeTableId || 't-07');
  const [destinationTableId, setDestinationTableId] = useState('t-03');
  const [reason, setReason] = useState('Guest requested window seat');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const occupiedTables = tables.filter(t => t.status === 'occupied' || t.status === 'selected' || t.status === 'bill-requested');
  const availableTables = tables.filter(t => t.id !== sourceTableId);

  const handleConfirmTransfer = () => {
    playChime('success');
    setShowSuccessToast(true);
    
    // Transfer logic: set new active table
    setActiveTableId(destinationTableId);

    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0e122f] border border-white/10 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Transfer Table & Ticket</h3>
              <p className="text-xs text-slate-400">Move active order, guest seats, and chit to another station</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transfer Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Source Table */}
          <div className="p-3.5 rounded-xl bg-[#13183b] border border-white/[0.06] space-y-2">
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
              1. Source Table (From)
            </label>
            <select
              value={sourceTableId}
              onChange={(e) => setSourceTableId(e.target.value)}
              className="w-full bg-[#181f4a] text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:outline-none focus:border-blue-400"
            >
              {occupiedTables.map(t => (
                <option key={t.id} value={t.id}>
                  {t.number} ({t.type} • {t.server || 'Server Assigned'})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 pt-1">
              Active ticket: <strong className="text-coral-300">#ORD-1048 ($223.30)</strong>
            </div>
          </div>

          {/* Destination Table */}
          <div className="p-3.5 rounded-xl bg-[#13183b] border border-white/[0.06] space-y-2">
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
              2. Destination Table (To)
            </label>
            <select
              value={destinationTableId}
              onChange={(e) => setDestinationTableId(e.target.value)}
              className="w-full bg-[#181f4a] text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:outline-none focus:border-emerald-400"
            >
              {availableTables.map(t => (
                <option key={t.id} value={t.id}>
                  {t.number} — {t.status === 'available' ? '🟢 Available' : `Occupied (${t.specialNote || ''})`}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-emerald-400 pt-1 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Ready for immediate occupancy</span>
            </div>
          </div>
        </div>

        {/* Transfer Reason */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Reason for Transfer</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              'Guest requested window seat',
              'Moving to outdoor patio',
              'Table merge / Larger party',
              'Server zone re-assignment'
            ].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`p-2 rounded-xl text-left truncate border transition text-[11px] ${
                  reason === r
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300 font-semibold'
                    : 'bg-[#14193d] border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Toast */}
        {showSuccessToast && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Successfully transferred table & ticket to <strong>{tables.find(t=>t.id===destinationTableId)?.number}</strong>. Kitchen notified.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#151a3d] hover:bg-[#1a2350] text-xs font-semibold text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmTransfer}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Confirm Transfer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

