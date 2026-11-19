import React from 'react';
import { Printer, X, Check } from 'lucide-react';
import { CartItem } from '../types/pos';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  tableLabel?: string;
  server?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  gratuity: number;
  total: number;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  tableLabel = 'Table 7 (T-07)',
  server = 'Marcus Cole #04',
  items,
  subtotal,
  tax,
  gratuity,
  total
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#0e122b] border border-white/10 p-5 shadow-2xl flex flex-col space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-coral-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Thermal Receipt Preview</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper receipt imitation */}
        <div className="p-5 rounded-xl bg-slate-100 text-slate-900 font-mono text-xs shadow-inner space-y-3 select-text">
          <div className="text-center space-y-0.5 border-b border-slate-300 pb-2">
            <h2 className="text-base font-extrabold tracking-tight font-sans">DOWNTOWN BISTRO</h2>
            <p className="text-[10px] text-slate-600">Main Location • 104 Ocean Promenade</p>
            <p className="text-[10px] text-slate-600">Tel: (555) 019-2834</p>
          </div>

          <div className="flex justify-between text-[11px] text-slate-700">
            <span>{tableLabel}</span>
            <span>{orderNumber}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Server: {server} • {new Date().toLocaleTimeString()}
          </div>

          <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-1.5">
            {items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between">
                  <span>{item.quantity}× {item.name}</span>
                  <span className="font-bold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
                {item.modifiers && item.modifiers.map((m, i) => (
                  <div key={i} className="text-[10px] text-slate-500 pl-3">
                    - {m}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="space-y-1 text-slate-700 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8.875%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-Gratuity (18%):</span>
              <span>${gratuity.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-950 pt-1 border-t border-slate-300">
              <span>TOTAL DUE:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
            <p>Thank you for dining with us!</p>
            <p className="font-mono mt-1">*** ORDERK POS v2.4 ***</p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-[#151a3d] hover:bg-[#1a2250] text-xs font-semibold text-slate-300"
          >
            Close
          </button>
          <button
            onClick={() => {
              window.print();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1b0808] text-xs font-bold hover:brightness-110 flex items-center justify-center gap-1.5 shadow-md shadow-coral-500/25"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Chit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

