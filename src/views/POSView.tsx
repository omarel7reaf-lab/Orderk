import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Edit2, 
  AlertCircle, 
  Check, 
  Utensils, 
  Flame, 
  CreditCard, 
  Printer, 
  Percent, 
  FileText,
  Clock,
  Sparkles,
  ShoppingBag,
  Coffee,
  Wine,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { MENU_ITEMS } from '../data/mockData';
import { CartItem, MenuItem, OrderType } from '../types/pos';
import { playChime } from '../utils/sound';
import { ReceiptModal } from '../components/ReceiptModal';
import { SafeImage } from '../components/SafeImage';

interface POSViewProps {
  onFireOrder?: (items: CartItem[], total: number) => void;
  initialTable?: string;
}

export const POSView: React.FC<POSViewProps> = ({ onFireOrder, initialTable = 'T-07' }) => {
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTable, setActiveTable] = useState(initialTable);
  
  // Cart starts completely fresh with 0 orders
  const [cart, setCart] = useState<CartItem[]>([]);

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'contactless'>('card');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showKitchenSentModal, setShowKitchenSentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Modifiers customizer modal state
  const [selectedDishForMods, setSelectedDishForMods] = useState<MenuItem | null>(null);
  const [customTemp, setCustomTemp] = useState('Medium-Rare');
  const [customSauce, setCustomSauce] = useState('Peppercorn Sauce');
  const [customAllergyNote, setCustomAllergyNote] = useState('');

  const categories = [
    'All Items',
    'Starters',
    'Steaks & Mains',
    'Pasta & Risotto',
    'Seafood',
    'Casual & Burgers',
    'Bar & Cocktails',
    'Desserts'
  ];

  const quickAdditions = [
    { name: 'Bread Basket', price: 4.00 },
    { name: 'Sparkling Water', price: 8.00 },
    { name: 'House Espresso', price: 4.50 },
    { name: 'Side Truffle Fries', price: 9.00 }
  ];

  const filteredDishes = MENU_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCartDirect = (item: MenuItem) => {
    playChime('bump');
    const existingIndex = cart.findIndex(c => c.menuItemId === item.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, {
        id: `cart-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        unitPrice: item.price,
        quantity: 1,
        modifiers: []
      }]);
    }
  };

  const handleOpenCustomize = (item: MenuItem) => {
    setSelectedDishForMods(item);
    setCustomTemp('Medium-Rare');
    setCustomSauce('Peppercorn Sauce');
    setCustomAllergyNote('');
  };

  const handleConfirmCustomize = () => {
    if (!selectedDishForMods) return;
    playChime('bump');
    const mods: string[] = [];
    if (selectedDishForMods.category === 'Steaks & Mains') {
      mods.push(`Cook: ${customTemp}`);
      if (customSauce) mods.push(`Sauce: ${customSauce}`);
    }

    setCart([...cart, {
      id: `cart-custom-${Date.now()}`,
      menuItemId: selectedDishForMods.id,
      name: selectedDishForMods.name,
      unitPrice: selectedDishForMods.price,
      quantity: 1,
      modifiers: mods,
      note: customAllergyNote.trim() ? customAllergyNote.trim() : undefined
    }]);

    setSelectedDishForMods(null);
  };

  const addQuickItem = (name: string, price: number) => {
    playChime('bump');
    setCart([...cart, {
      id: `cart-quick-${Date.now()}`,
      menuItemId: `quick-${Date.now()}`,
      name,
      unitPrice: price,
      quantity: 1,
      modifiers: []
    }]);
  };

  const updateQuantity = (id: string, delta: number) => {
    playChime('bump');
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeItem = (id: string) => {
    playChime('bump');
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const tax = subtotal * 0.08875; // 8.875% State Tax
  const gratuity = subtotal > 0 ? subtotal * 0.18 : 0; // 18% Auto-gratuity for 4+ covers
  const total = subtotal + tax + gratuity;
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePay = () => {
    setShowPayModal(false);
    playChime('success');
    setShowPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentSuccess(false);
      setCart([]);
    }, 2800);
  };

  const handleFireKitchen = () => {
    playChime('bell');
    setShowKitchenSentModal(true);
    onFireOrder?.(cart, total);
    setTimeout(() => {
      setShowKitchenSentModal(false);
    }, 2400);
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Menu Section */}
      <div className="flex-1 flex flex-col bg-[#0b0e24] overflow-y-auto border-r border-white/[0.06]">
        {/* Top Order Type Selector & Table Bar */}
        <div className="p-4 border-b border-white/[0.06] bg-[#0c102a] flex flex-wrap items-center justify-between gap-3">
          {/* Order Types */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#131737] border border-white/[0.06]">
            {[
              { id: 'dine-in', label: '🍽 Dine-In' },
              { id: 'takeout', label: '🥡 Takeout / Pickup' },
              { id: 'delivery', label: '🛵 Delivery (DD/UE)' },
              { id: 'bar', label: '🍸 Bar Tab' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setOrderType(type.id as OrderType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  orderType === type.id
                    ? 'bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1b0808] shadow-md shadow-coral-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Table & Server Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14193d] border border-white/[0.08]">
              <span className="text-xs font-bold text-white">{activeTable}</span>
              <span className="text-xs text-slate-400">Main Dining • 4 Covers</span>
              <button 
                onClick={() => setActiveTable(activeTable === 'T-07' ? 'T-04' : 'T-07')}
                className="text-[11px] font-semibold text-coral-400 hover:text-coral-300 ml-1"
              >
                Change Table
              </button>
            </div>

            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white">#ORD-1048 <span className="text-emerald-400 font-normal">• Draft</span></span>
              <span className="text-[10px] text-slate-400">Marcus Cole Server #04 • Zone: North Veranda</span>
            </div>
          </div>
        </div>

        {/* Categories Bar & Search */}
        <div className="p-4 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#1e275c] text-coral-300 border border-coral-400/40 shadow-sm'
                    : 'bg-[#121634] text-slate-300 hover:text-white hover:bg-[#161c40] border border-white/[0.04]'
                }`}
              >
                {cat === 'All Items' ? `All Items (${MENU_ITEMS.length})` : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter dishes (Press /)..."
              className="w-full bg-[#121634] text-slate-200 placeholder-slate-500 rounded-xl pl-8 pr-3 py-1.5 text-xs border border-white/[0.06] focus:outline-none focus:border-coral-400/50"
            />
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 flex-1">
          {filteredDishes.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#111533] border border-white/[0.07] overflow-hidden flex flex-col justify-between group hover:border-white/[0.18] transition-all duration-200 shadow-lg"
            >
              <div 
                onClick={() => handleOpenCustomize(item)}
                className="relative h-36 overflow-hidden bg-slate-900 cursor-pointer"
              >
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  fallbackText={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Tag Badge */}
                {item.tag && (
                  <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide shadow-md ${
                    item.tag.type === 'special' ? 'bg-emerald-500 text-slate-950' :
                    item.tag.type === 'warning' ? 'bg-rose-500 text-white' :
                    item.tag.type === 'popular' ? 'bg-amber-400 text-slate-950' :
                    item.tag.type === 'vegetarian' ? 'bg-purple-500 text-white' :
                    'bg-cyan-400 text-slate-950'
                  }`}>
                    {item.tag.label}
                  </span>
                )}

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-coral-400" />
                  <span>Customize</span>
                </div>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h4 
                    onClick={() => handleOpenCustomize(item)}
                    className="text-sm font-bold text-white group-hover:text-coral-300 transition truncate cursor-pointer"
                  >
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="text-base font-extrabold text-white font-sans">
                    ${item.price.toFixed(2)}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenCustomize(item)}
                      title="Customize Modifiers"
                      className="p-1.5 rounded-xl bg-[#141b44] hover:bg-[#1b255e] text-slate-300 hover:text-white transition"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => addToCartDirect(item)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#192254] hover:bg-coral-500 hover:text-slate-950 text-coral-300 font-bold text-xs border border-coral-400/20 hover:border-transparent transition shadow-sm active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Additions Footer Bar */}
        <div className="p-3 bg-[#0c102a] border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-medium">Quick Additions:</span>
            {quickAdditions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => addQuickItem(q.name, q.price)}
                className="px-2.5 py-1 rounded-lg bg-[#14193b] hover:bg-[#1a2350] border border-white/[0.06] text-slate-300 hover:text-white transition text-[11px]"
              >
                + {q.name} (${q.price.toFixed(2)})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">Floor Mode:</span>
            <span className="px-2 py-0.5 rounded bg-coral-500/20 text-coral-300 font-bold border border-coral-500/30">
              Rapid Touch v2.4
            </span>
          </div>
        </div>
      </div>

      {/* Right Cart / Order Summary Section */}
      <div className="w-full xl:w-96 bg-[#090c21] border-l border-white/[0.06] flex flex-col justify-between overflow-hidden">
        {/* Cart Header */}
        <div className="p-4 border-b border-white/[0.06] bg-[#0c102b]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-coral-400"></span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Order • {activeTable}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-medium">
                4 Covers
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">#ORD-1048</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button className="flex-1 py-1 rounded-lg bg-[#14193d] hover:bg-[#1a2350] text-[11px] font-medium text-slate-300 transition">
              Hold
            </button>
            <button 
              onClick={() => alert('Split Bill Wizard: Check split 50/50 ($' + (total/2).toFixed(2) + ' each) or by seats.')}
              className="flex-1 py-1 rounded-lg bg-[#14193d] hover:bg-[#1a2350] text-[11px] font-medium text-slate-300 transition"
            >
              Split Bill
            </button>
            <button 
              onClick={clearCart}
              className="py-1 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-[11px] font-medium text-rose-400 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[#12173a] border border-white/[0.06] flex items-center justify-center text-slate-500 shadow-inner">
                <ShoppingBag className="w-8 h-8 stroke-[1.5] text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">لا توجد أطباق بالسلة (0 Items)</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[220px]">
                  اختر أي طبق من القائمة على اليسار للبدء بإضافته إلى الفاتورة.
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#141b44] border border-white/[0.06] text-[10px] text-coral-300 font-medium">
                جاهز لإضافة الأصناف • Draft #ORD-1048
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id} 
                className="p-3 rounded-xl bg-[#111636] border border-white/[0.05] hover:border-white/[0.1] transition space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="font-bold text-coral-400 text-xs">{item.quantity}×</span>
                    <span className="text-xs font-bold text-white truncate">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white font-mono flex-shrink-0">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Modifiers */}
                {item.modifiers && item.modifiers.length > 0 && (
                  <div className="space-y-0.5 pl-5 border-l-2 border-indigo-500/30">
                    {item.modifiers.map((mod, i) => (
                      <div key={i} className="text-[11px] text-slate-400 leading-snug">
                        {mod}
                      </div>
                    ))}
                  </div>
                )}

                {/* Allergen note */}
                {item.note && (
                  <div className="p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/20 text-rose-300 text-[10px] flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3 h-3 text-rose-400 flex-shrink-0" />
                    <span>Note: {item.note}</span>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1 bg-[#161c42] rounded-lg p-0.5">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Totals & Checkout Actions */}
        <div className="p-4 bg-[#0a0e28] border-t border-white/[0.06] space-y-3">
          {/* Summary figures */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal ({totalCount} items)</span>
              <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>State Tax (8.875%)</span>
              <span className="text-white font-mono">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Auto-Gratuity (18% for 4+ Guests) <span className="text-slate-500">Rule #4</span></span>
              <span className="text-white font-mono">${gratuity.toFixed(2)}</span>
            </div>
            
            <div className="pt-2 border-t border-white/[0.06] flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">Total Due</span>
                <div className="text-[10px] text-slate-500">Includes taxes & service charge</div>
              </div>
              <span className="text-2xl font-extrabold text-white font-sans tracking-tight">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Quick Ticket Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button className="py-1.5 px-2 rounded-xl bg-[#13183a] hover:bg-[#182046] border border-white/[0.06] text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition">
              <Percent className="w-3 h-3 text-coral-400" />
              <span>% Discount</span>
            </button>
            <button 
              onClick={() => {
                const note = prompt('Enter kitchen memo / note for chef:');
                if (note && cart.length > 0) {
                  const updated = [...cart];
                  updated[0].note = note;
                  setCart(updated);
                }
              }}
              className="py-1.5 px-2 rounded-xl bg-[#13183a] hover:bg-[#182046] border border-white/[0.06] text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition"
            >
              <FileText className="w-3 h-3 text-blue-400" />
              <span>Kitchen Note</span>
            </button>
            <button 
              onClick={() => setShowReceiptModal(true)}
              className="py-1.5 px-2 rounded-xl bg-[#13183a] hover:bg-[#182046] border border-white/[0.06] text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition"
            >
              <Printer className="w-3 h-3 text-purple-400" />
              <span>Print Bill</span>
            </button>
          </div>

          {/* Send to Kitchen / FIRE NOW */}
          <button 
            disabled={cart.length === 0}
            onClick={handleFireKitchen}
            className="w-full py-2.5 rounded-xl bg-[#161c42] hover:bg-[#1f2861] disabled:opacity-50 border border-white/[0.08] text-slate-200 font-bold text-xs flex items-center justify-between px-4 transition group active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-coral-400 group-hover:scale-110 transition-transform" />
              <span>Send to Kitchen</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-coral-500/20 text-coral-300 font-mono text-[11px] font-bold">
              FIRE NOW ${total.toFixed(2)}
            </span>
          </button>

          {/* Pay Now Button */}
          <button 
            disabled={cart.length === 0}
            onClick={() => setShowPayModal(true)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 disabled:opacity-50 text-[#1b0808] font-extrabold text-sm shadow-lg shadow-coral-500/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <CreditCard className="w-4 h-4 stroke-[2.5]" />
            <span>Pay Now / Split (Card • Cash • Contactless)</span>
          </button>
        </div>
      </div>

      {/* Dish Customizer Modal */}
      {selectedDishForMods && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0f1430] border border-white/10 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white">{selectedDishForMods.name}</h3>
                <p className="text-xs text-slate-400">Configure meat prep, sauces & allergies</p>
              </div>
              <button onClick={() => setSelectedDishForMods(null)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedDishForMods.category === 'Steaks & Mains' && (
              <>
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Meat Temperature</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Rare', 'Medium-Rare', 'Medium', 'Medium-Well', 'Well-Done'].map(temp => (
                      <button
                        key={temp}
                        onClick={() => setCustomTemp(temp)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition ${
                          customTemp === temp
                            ? 'bg-coral-500/20 border-coral-400 text-coral-300'
                            : 'bg-[#141a3c] border-white/[0.06] text-slate-300'
                        }`}
                      >
                        {temp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Sauce Choice</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['Peppercorn Sauce', 'Chimichurri Sauce', 'Truffle Herb Butter', 'Bearnaise'].map(sauce => (
                      <button
                        key={sauce}
                        onClick={() => setCustomSauce(sauce)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition ${
                          customSauce === sauce
                            ? 'bg-coral-500/20 border-coral-400 text-coral-300'
                            : 'bg-[#141a3c] border-white/[0.06] text-slate-300'
                        }`}
                      >
                        {sauce}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">Allergy or Special Note</span>
              <input
                type="text"
                value={customAllergyNote}
                onChange={(e) => setCustomAllergyNote(e.target.value)}
                placeholder="e.g. Guest allergic to rosemary or garlic sensitivity"
                className="w-full bg-[#121634] text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-xs border border-white/[0.08] focus:outline-none focus:border-coral-400"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setSelectedDishForMods(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#161c42] text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCustomize}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1a0808] text-xs font-bold hover:brightness-110 shadow-lg shadow-coral-500/25"
              >
                Add Customized Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0f1430] border border-white/10 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white">Payment Terminal</h3>
                <p className="text-xs text-slate-400">Table 7 • #ORD-1048</p>
              </div>
              <button 
                onClick={() => setShowPayModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center p-4 rounded-xl bg-[#141a3d] border border-white/[0.06]">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Amount</span>
              <div className="text-3xl font-extrabold text-white mt-1">${total.toFixed(2)}</div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Select Tender</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'contactless', label: 'Apple / Google Pay', icon: Sparkles },
                  { id: 'cash', label: 'Cash Tender', icon: ShoppingBag }
                ].map(tender => (
                  <button
                    key={tender.id}
                    onClick={() => setPaymentMethod(tender.id as any)}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition ${
                      paymentMethod === tender.id
                        ? 'bg-coral-500/20 border-coral-400 text-coral-300'
                        : 'bg-[#141a3c] border-white/[0.06] text-slate-300 hover:bg-[#1a2350]'
                    }`}
                  >
                    <tender.icon className="w-5 h-5" />
                    <span className="text-[11px] font-semibold">{tender.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setShowPayModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#161c42] hover:bg-[#1d2557] text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#1a0808] text-xs font-bold hover:brightness-110 shadow-lg shadow-coral-500/25"
              >
                Authorize & Settle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Toast / Modal */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#0f1430] border border-emerald-500/30 p-8 shadow-2xl flex flex-col items-center text-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-white">Payment Authorized!</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Transaction of <strong className="text-white">${total.toFixed(2)}</strong> successfully captured. Receipt printed & digital chit updated.
            </p>
          </div>
        </div>
      )}

      {/* Kitchen Sent Modal */}
      {showKitchenSentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#0f1430] border border-coral-500/30 p-8 shadow-2xl flex flex-col items-center text-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-coral-500/20 border border-coral-500/40 text-coral-400 flex items-center justify-center shadow-lg shadow-coral-500/20">
              <Flame className="w-8 h-8 fill-coral-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Fired to Kitchen (KDS)!</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Ticket #ORD-1048 routed to Grill, Sauté, & Cold Larder stations. Timer started.
            </p>
          </div>
        </div>
      )}

      {/* Thermal Receipt Preview Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        orderNumber="#ORD-1048"
        tableLabel={`Table ${activeTable}`}
        items={cart}
        subtotal={subtotal}
        tax={tax}
        gratuity={gratuity}
        total={total}
      />
    </div>
  );
};
