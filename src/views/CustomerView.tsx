import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  LogOut, 
  Utensils, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Coffee,
  X,
  CreditCard
} from 'lucide-react';
import { MENU_ITEMS } from '../data/mockData';
import { MenuItem, CartItem } from '../types/pos';
import { SafeImage } from '../components/SafeImage';
import { playChime } from '../utils/sound';

interface CustomerViewProps {
  userName: string;
  onOpenTerminal: () => void;
  onLogOut: () => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  userName,
  onOpenTerminal,
  onLogOut
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('طاولة 04 (داخل الصالة)');
  const [orderSent, setOrderSent] = useState(false);

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

  const filteredDishes = MENU_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
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

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const tax = subtotal * 0.08875;
  const total = subtotal + tax;
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    playChime('success');
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
      setCart([]);
      setIsCartOpen(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen w-full bg-[#070919] text-slate-100 flex flex-col select-none overflow-x-hidden">
      
      {/* ── Customer Top Header (Clean & Uncluttered) ── */}
      <header className="h-16 bg-[#0a0d24] border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-coral-500 to-rose-400 flex items-center justify-center font-bold text-white shadow-md shadow-coral-500/30">
            <span className="text-base font-black">K</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">OrderK Bistro</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                قائمة الزبائن 🍽️
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">أهلاً بك يا {userName} • تجربة طعام راقية</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ask AI Waiter */}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141b42] hover:bg-[#1b255e] border border-coral-400/40 text-coral-300 text-xs font-bold transition shadow-sm"
            title="مساعد الشيف الذكي للزبائن"
          >
            <Sparkles className="w-4 h-4 text-coral-400" />
            <span className="hidden sm:inline">اسأل الشيف الذكي</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-coral-500 to-[#ff7b72] text-[#190808] font-extrabold text-xs shadow-md shadow-coral-500/25 transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>السلة</span>
            {totalCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#190808] text-coral-300 flex items-center justify-center text-[10px] font-bold">
                {totalCount}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogOut}
            title="تسجيل الخروج"
            className="p-2 rounded-xl bg-[#121634] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/[0.06] transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Main Customer Content Area ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-5">
        
        {/* Banner with Greeting & Table Selector */}
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#12183c] via-[#0f1433] to-[#141b44] border border-white/[0.08] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-coral-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              قائمة الطعام والعشاء الفاخر
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              مرحباً يا {userName}، ماذا تحب أن تتناول اليوم؟
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              تصفح أشهى أطباق اللحوم المعتقة، المأكولات البحرية الطازجة، الباستا الإيطالية، والحلويات. اختر أطباقك وسيتولى طهاتنا تحضيرها فوراً.
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#090c22] border border-white/[0.08] flex-shrink-0">
            <span className="text-xs text-slate-400">موقع الجلوس:</span>
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="bg-[#141a3d] text-white text-xs font-bold rounded-xl px-2.5 py-1.5 border border-white/10 outline-none"
            >
              <option value="طاولة 04 (داخل الصالة)">طاولة 04 (داخل الصالة)</option>
              <option value="طاولة 07 (الشرفة الخارجية)">طاولة 07 (الشرفة الخارجية)</option>
              <option value="طاولة 12 (الحديقة)">طاولة 12 (الحديقة)</option>
              <option value="طلب استلام خارجي (Takeout)">طلب استلام خارجي (Takeout)</option>
            </select>
          </div>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-coral-500 to-[#ff7b72] text-[#190808] font-bold shadow-md shadow-coral-500/25'
                    : 'bg-[#121634] text-slate-300 hover:text-white border border-white/[0.06]'
                }`}
              >
                {cat === 'All Items' ? `كل الأطباق (${MENU_ITEMS.length})` : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن طبق أو مأكولات..."
              className="w-full bg-[#121634] text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 text-xs border border-white/[0.08] focus:outline-none focus:border-coral-400"
            />
          </div>
        </div>

        {/* Food Dishes Grid (Airy & Uncluttered) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
          {filteredDishes.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#0f1433] border border-white/[0.07] overflow-hidden flex flex-col justify-between group hover:border-coral-400/40 hover:shadow-[0_0_25px_rgba(255,126,112,0.15)] transition-all duration-200"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  fallbackText={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.tag && (
                  <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md ${
                    item.tag.type === 'special' ? 'bg-emerald-500 text-slate-950' :
                    item.tag.type === 'warning' ? 'bg-rose-500 text-white' :
                    item.tag.type === 'popular' ? 'bg-amber-400 text-slate-950' :
                    item.tag.type === 'vegetarian' ? 'bg-purple-500 text-white' :
                    'bg-cyan-400 text-slate-950'
                  }`}>
                    {item.tag.label}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-coral-300 transition line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-lg font-black text-white font-mono">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-coral-500 to-[#ff7b72] hover:brightness-110 active:scale-95 text-[#190808] font-bold text-xs shadow-md shadow-coral-500/25 transition"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>إضافة</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Floating Mobile Cart Bar when items exist ── */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto animate-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-coral-500 to-[#ff7b72] text-[#190808] font-extrabold text-sm shadow-2xl shadow-coral-500/40 flex items-center justify-between active:scale-98 transition"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>عرض طلبك ({totalCount} أطباق)</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-sm">
              <span>${total.toFixed(2)}</span>
              <span>➔</span>
            </div>
          </button>
        </div>
      )}

      {/* ── Slide-over Cart Drawer ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsCartOpen(false)} 
          />
          <div className="w-full sm:w-[420px] bg-[#0a0d24] border-l border-white/[0.08] h-full flex flex-col justify-between relative z-10 shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0e1333] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-coral-400" />
                <h2 className="text-base font-bold text-white">سلة طلبك (My Order)</h2>
                <span className="text-xs text-slate-400">({totalCount})</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#12173a] flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-slate-400 stroke-[1.5]" />
                  </div>
                  <p className="text-sm font-bold text-white">سلتك فارغة حالياً</p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    اختر أي وجبة شهية من القائمة للبدء في طلبك.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#111738] border border-white/[0.06] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <span className="text-xs font-mono font-bold text-coral-300">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-[#161d48] hover:bg-white/10 text-white flex items-center justify-center font-bold text-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold text-white w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-[#161d48] hover:bg-white/10 text-white flex items-center justify-center font-bold text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Place Order */}
            <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0c102a] space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة (8.875%)</span>
                  <span className="font-mono text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">المجموع الإجمالي</span>
                  <span className="font-mono font-black text-coral-400 text-xl">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Location / Table */}
              <div className="p-2.5 rounded-xl bg-[#12173a] border border-white/[0.06] text-xs flex items-center justify-between">
                <span className="text-slate-400">سيتم التوصيل إلى:</span>
                <span className="font-bold text-white">{tableNumber}</span>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-coral-500 to-[#ff7b72] hover:brightness-110 disabled:opacity-40 text-[#190808] font-extrabold text-sm shadow-xl shadow-coral-500/30 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Flame className="w-4 h-4 stroke-[2.5]" />
                <span>إرسال الطلب للمطبخ الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Sent Confirmation Modal ── */}
      {orderSent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#0f1435] border border-emerald-500/40 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">تم إرسال طلبك بنجاح!</h3>
              <p className="text-xs text-slate-300 mt-1">
                رقم الطلب: <strong className="font-mono text-coral-400">#ORD-1058</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                طهاة المطعم بدأوا في تحضير أطباقك الطازجة الآن، وسيتم إحضارها إلى {tableNumber} في أقرب وقت. بالعافية عليك!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
