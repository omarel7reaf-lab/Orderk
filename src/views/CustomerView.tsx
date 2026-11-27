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
  CreditCard,
  Crown,
  LogIn,
  UserPlus,
  AlertCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { MENU_ITEMS } from '../data/mockData';
import { MenuItem, CartItem } from '../types/pos';
import { SafeImage } from '../components/SafeImage';
import { playChime } from '../utils/sound';

interface CustomerViewProps {
  userName?: string;
  userRole?: string;
  isAuthenticated: boolean;
  onOpenTerminal: () => void;
  onLogOut: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onSwitchToOwner?: () => void;
}

interface AlertModalState {
  isOpen: boolean;
  type: 'need_signup' | 'already_signed_up' | 'need_auth_to_buy';
  title: string;
  message: string;
  subtitle: string;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  userName = 'زائر المطعم',
  userRole = 'زبون',
  isAuthenticated,
  onOpenTerminal,
  onLogOut,
  onOpenLogin,
  onOpenSignup,
  onSwitchToOwner
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('طاولة 04 (داخل الصالة)');
  const [orderSent, setOrderSent] = useState(false);

  // Stylish Centered Alert Modal State
  const [alertModal, setAlertModal] = useState<AlertModalState>({
    isOpen: false,
    type: 'need_signup',
    title: '',
    message: '',
    subtitle: ''
  });

  const isStaffOrOwner = userRole !== 'زبون' && userRole !== 'Customer' && userRole !== 'زائر';

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

  // Check if an account already exists in localStorage
  const hasExistingAccount = () => {
    try {
      const list = localStorage.getItem('orderk_accounts_list');
      if (list && JSON.parse(list).length > 0) return true;
    } catch (e) {}
    return Boolean(
      localStorage.getItem('orderk_user_registered') === 'true' || 
      localStorage.getItem('orderk_6digit_pin')
    );
  };

  // Handle Navbar Log In click
  const handleNavLogInClick = () => {
    playChime('bump');
    if (!hasExistingAccount()) {
      // User hasn't signed up before!
      setAlertModal({
        isOpen: true,
        type: 'need_signup',
        title: 'تنبيه تسجيل الدخول / Account Notice',
        message: "You haven't signed up before. You need to sign up.",
        subtitle: 'لم تقم بإنشاء حساب من قبل على هذا الجهاز. يجب عليك إنشاء حساب جديد أولاً للتمكن من تسجيل الدخول.'
      });
    } else {
      onOpenLogin();
    }
  };

  // Handle Navbar Sign Up click
  const handleNavSignUpClick = () => {
    playChime('bump');
    if (hasExistingAccount()) {
      // User has already signed up!
      setAlertModal({
        isOpen: true,
        type: 'already_signed_up',
        title: 'حساب مسجل بالفعل / Existing Account',
        message: 'You have already signed up; if you want to access a new account, click "log in."',
        subtitle: 'لديك حساب مسجل مسبقاً بالفعل! إذا كنت ترغب في الدخول لحسابك اضغط على "تسجيل الدخول".'
      });
    } else {
      onOpenSignup();
    }
  };

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
        category: item.category,
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

  // ─────────────────────────────────────────────────────────────
  // Free Starters Calculation:
  // For Truffle Mushroom Arancini: ONLY 1 unit is FREE!
  // For all other Starters: the first 3 units are 100% FREE!
  // Any quantity > freeQuota is charged at regular unit price.
  // ─────────────────────────────────────────────────────────────
  const calculateCartItemFinancials = (item: CartItem) => {
    const isStarter = item.category === 'Starters';
    if (isStarter) {
      const isArancini = item.name.toLowerCase().includes('arancini') || item.menuItemId === 'm20';
      const freeQuota = isArancini ? 1 : 3;
      const freeCount = Math.min(item.quantity, freeQuota);
      const paidCount = Math.max(0, item.quantity - freeQuota);
      const payableAmount = paidCount * item.unitPrice;
      const discountAmount = freeCount * item.unitPrice;
      return { freeCount, paidCount, payableAmount, discountAmount, isStarter: true, freeQuota, isArancini };
    }
    return {
      freeCount: 0,
      paidCount: item.quantity,
      payableAmount: item.quantity * item.unitPrice,
      discountAmount: 0,
      isStarter: false,
      freeQuota: 0,
      isArancini: false
    };
  };

  const totalRawPrice = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalStarterSavings = cart.reduce((sum, item) => sum + calculateCartItemFinancials(item).discountAmount, 0);
  const subtotal = cart.reduce((sum, item) => sum + calculateCartItemFinancials(item).payableAmount, 0);
  const tax = subtotal * 0.14; // 14% VAT
  const total = subtotal + tax;
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle Place Order
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    // Requirement: "و لو مش عامل sign up دلوقتي او قبل كدا مينفعش يشتري"
    if (!isAuthenticated) {
      playChime('bump');
      setAlertModal({
        isOpen: true,
        type: 'need_auth_to_buy',
        title: 'تسجيل الحساب مطلوب لإتمام الشراء',
        message: "You haven't signed up before. You need to sign up to complete your purchase.",
        subtitle: 'أنت تتصفح كزائر حالياً. لإرسال الطلب إلى طهاة المطبخ وتجهيزه، يجب تسجيل الدخول أو إنشاء حساب أولاً.'
      });
      return;
    }

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
      
      {/* ── Customer Top Header / Navbar ── */}
      <header className="h-16 bg-[#0a0d24] border-b border-white/[0.08] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-coral-500 to-rose-400 flex items-center justify-center font-bold text-white shadow-md shadow-coral-500/30">
            <span className="text-base font-black">K</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm sm:text-lg tracking-tight">OrderK Bistro</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                قائمة الطعام 🍽️
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {isAuthenticated ? `أهلاً بك يا ${userName} • تجربة طعام راقية` : 'تصفح قائمة الطعام الفاخرة • أسعار منطقية'}
            </p>
          </div>
        </div>

        {/* Right Actions: Auth Buttons / Cart / Terminal */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Ask AI Waiter */}
          <button
            onClick={onOpenTerminal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141b42] hover:bg-[#1b255e] border border-coral-400/40 text-coral-300 text-xs font-bold transition shadow-sm active:scale-95"
            title="مساعد الشيف الذكي للزبائن"
          >
            <Sparkles className="w-4 h-4 text-coral-400" />
            <span>اسأل الشيف الذكي</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-coral-500 to-[#ff7b72] text-[#190808] font-extrabold text-xs shadow-md shadow-coral-500/25 transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">السلة</span>
            {totalCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#190808] text-coral-300 flex items-center justify-center text-[10px] font-bold">
                {totalCount}
              </span>
            )}
          </button>

          {/* ─────────────────────────────────────────────────────────────
              NAVBAR AUTH BUTTONS:
              If NOT logged in: Show "Log In" & "Sign Up" buttons!
              If logged in: Show User badge and Log Out!
             ───────────────────────────────────────────────────────────── */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 border-l border-white/10">
              {/* Log In Button */}
              <button
                onClick={handleNavLogInClick}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[#141b40] hover:bg-[#1c265e] border border-white/10 hover:border-coral-400/40 text-slate-200 hover:text-white text-xs font-bold transition shadow-sm active:scale-95"
                title="تسجيل الدخول لحساب مسجل مسبقاً"
              >
                <LogIn className="w-3.5 h-3.5 text-coral-400" />
                <span>Log In</span>
              </button>

              {/* Sign Up Button */}
              <button
                onClick={handleNavSignUpClick}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 text-xs font-black transition shadow-sm shadow-emerald-500/20 active:scale-95"
                title="إنشاء حساب جديد لأول مرة"
              >
                <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1 border-l border-white/10">
              {/* If Staff or Owner: Button to view management portal */}
              {isStaffOrOwner && onSwitchToOwner && (
                <button
                  onClick={onSwitchToOwner}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition"
                  title="العودة للوحة الإدارة وبيانات المطعم"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">لوحة الإدارة</span>
                </button>
              )}

              {/* User Name Badge */}
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-white leading-tight">{userName}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{userRole}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogOut}
                title="تسجيل الخروج"
                className="p-2 rounded-xl bg-[#121634] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/[0.06] transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Customer Content Area ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-5">
        
        {/* Banner with Greeting, 3 Free Starters promotion & Table Selector */}
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#12183c] via-[#0f1433] to-[#141b44] border border-white/[0.08] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-coral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                قائمة المأكولات والأسعار المنطقية
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] shadow-sm animate-pulse">
                🎁 عرض خاص: أول 3 قطع مقبلات مجاناً (وقطعة مجانية لـ Arancini)!
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {isAuthenticated ? `مرحباً يا ${userName}، ماذا تحب أن تتناول اليوم؟` : 'مرحباً بك! تصفح قائمة طعام OrderK بأفضل الأسعار'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              جميع الأسعار منطقية وبالجنيه المصري (ج.م). اطلب أي مقبلات وستحصل على أول 3 قطع مجاناً (وقطعة مجانية لـ Truffle Arancini).
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
              <option value="طلب استلام سفري (Takeout)">طلب استلام سفري (Takeout)</option>
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
                {cat === 'All Items' ? `كل الأطباق (${MENU_ITEMS.length})` : 
                 cat === 'Starters' ? `المقبلات (أول 3 مجاناً 🎁)` : cat}
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

        {/* Food Dishes Grid (Airy, Uncluttered, Clear Reasonable Prices) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
          {filteredDishes.map((item) => {
            const isStarter = item.category === 'Starters';
            return (
              <div
                key={item.id}
                className={`rounded-3xl bg-[#0f1433] border overflow-hidden flex flex-col justify-between group transition-all duration-200 ${
                  isStarter ? 'border-emerald-500/30 hover:border-emerald-400' : 'border-white/[0.07] hover:border-coral-400/40'
                } hover:shadow-[0_0_25px_rgba(255,126,112,0.15)]`}
              >
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    fallbackText={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Free Starter Promotional Badge */}
                  {isStarter && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg flex items-center gap-1">
                      <span>
                        {item.name.toLowerCase().includes('arancini') || item.id === 'm20'
                          ? '🎁 أول قطعة مجاناً!'
                          : '🎁 أول 3 قطع مجاناً!'}
                      </span>
                    </div>
                  )}

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
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-white font-mono">
                          {item.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">ج.م</span>
                      </div>
                      {isStarter && (
                        <span className="text-[10px] text-emerald-400 font-bold block -mt-1">
                          {item.name.toLowerCase().includes('arancini') || item.id === 'm20'
                            ? 'أول قطعة بـ 0 ج.م'
                            : 'أول 3 قطع بـ 0 ج.م'}
                        </span>
                      )}
                    </div>

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
            );
          })}
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
              <span>{total.toFixed(2)} ج.م</span>
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
          <div className="w-full sm:w-[440px] bg-[#0a0d24] border-l border-white/[0.08] h-full flex flex-col justify-between relative z-10 shadow-2xl animate-in slide-in-from-right duration-200">
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
                cart.map((item) => {
                  const fin = calculateCartItemFinancials(item);
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-[#111738] border border-white/[0.06] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        
                        {/* Price breakdown with Free Starters Logic */}
                        <div className="flex items-center gap-2 mt-0.5">
                          {fin.isStarter ? (
                            fin.payableAmount === 0 ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                  0.00 ج.م (مجاناً 🎁)
                                </span>
                                <span className="text-[10px] text-slate-500 line-through">
                                  {(item.unitPrice * item.quantity).toFixed(2)} ج.م
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-mono font-bold text-coral-300">
                                  {fin.payableAmount.toFixed(2)} ج.م
                                </span>
                                <span className="text-[10px] text-emerald-400 font-semibold">
                                  ({fin.freeQuota} مجاناً + {fin.paidCount} بالسعر الأصلي)
                                </span>
                              </div>
                            )
                          ) : (
                            <span className="text-xs font-mono font-bold text-coral-300">
                              {fin.payableAmount.toFixed(2)} ج.م
                            </span>
                          )}
                        </div>

                        {fin.isStarter && (
                          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                            🎁 تم استخدام {fin.freeCount} من {fin.freeQuota} {fin.freeQuota === 1 ? 'قطعة مجانية' : 'قطع مجانية'}
                          </span>
                        )}
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
                  );
                })
              )}
            </div>

            {/* Footer Summary & Place Order */}
            <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0c102a] space-y-3">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>المجموع الفرعي الأصلي</span>
                  <span className="font-mono text-white">{totalRawPrice.toFixed(2)} ج.م</span>
                </div>

                {/* Free Starters Discount Row */}
                {totalStarterSavings > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>خصم عرض المقبلات (أول 3 قطع مجاناً) 🎁</span>
                    <span className="font-mono">-{totalStarterSavings.toFixed(2)} ج.م</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (14%)</span>
                  <span className="font-mono text-white">{tax.toFixed(2)} ج.م</span>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">المجموع النهائي للدفع</span>
                  <span className="font-mono font-black text-coral-400 text-xl">
                    {total.toFixed(2)} ج.م
                  </span>
                </div>
              </div>

              {/* Order Location / Table */}
              <div className="p-2.5 rounded-xl bg-[#12173a] border border-white/[0.06] text-xs flex items-center justify-between">
                <span className="text-slate-400">سيتم التوصيل إلى:</span>
                <span className="font-bold text-white">{tableNumber}</span>
              </div>

              {/* If guest, display warning that sign-up/login is required to purchase */}
              {!isAuthenticated && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                  <span>تنويه: يلزم تسجيل الدخول أو إنشاء حساب لإتمام إرسال الطلب.</span>
                </div>
              )}

              {/* Place Order Button */}
              <button
                disabled={cart.length === 0}
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-coral-500 to-[#ff7b72] hover:brightness-110 disabled:opacity-40 text-[#190808] font-extrabold text-sm shadow-xl shadow-coral-500/30 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Flame className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {!isAuthenticated 
                    ? 'سجل حسابك لإرسال الطلب (Sign in to Order)' 
                    : 'إرسال الطلب للمطبخ الآن'}
                </span>
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

      {/* ─────────────────────────────────────────────────────────────
          STYLISH CENTERED ALERT MODAL
          Exact requested alerts for:
          1. "You haven't signed up before. You need to sign up."
          2. "You have already signed up; if you want to access a new account, click "log in.""
          3. Need to sign up before buying.
         ───────────────────────────────────────────────────────────── */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#0c102a] border border-coral-400/30 p-6 sm:p-7 text-center space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon */}
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
              alertModal.type === 'need_signup' 
                ? 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40' 
                : alertModal.type === 'already_signed_up'
                ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/40'
            }`}>
              {alertModal.type === 'need_signup' && <ShieldAlert className="w-8 h-8" />}
              {alertModal.type === 'already_signed_up' && <CheckCircle2 className="w-8 h-8" />}
              {alertModal.type === 'need_auth_to_buy' && <ShoppingBag className="w-8 h-8" />}
            </div>

            {/* Title & Message */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {alertModal.title}
              </span>
              
              {/* Exact user requested message */}
              <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug px-2">
                "{alertModal.message}"
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                {alertModal.subtitle}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              {alertModal.type === 'need_signup' && (
                <button
                  onClick={() => {
                    setAlertModal(prev => ({ ...prev, isOpen: false }));
                    onOpenSignup();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>إنشاء حساب الآن (Sign Up Now)</span>
                </button>
              )}

              {alertModal.type === 'already_signed_up' && (
                <button
                  onClick={() => {
                    setAlertModal(prev => ({ ...prev, isOpen: false }));
                    onOpenLogin();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-coral-500 to-[#ff7b72] text-[#190808] font-extrabold text-xs shadow-lg shadow-coral-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>تسجيل الدخول (Log In Now)</span>
                </button>
              )}

              {alertModal.type === 'need_auth_to_buy' && (
                <>
                  <button
                    onClick={() => {
                      setAlertModal(prev => ({ ...prev, isOpen: false }));
                      if (!hasExistingAccount()) {
                        onOpenSignup();
                      } else {
                        onOpenLogin();
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-coral-500 to-[#ff7b72] text-[#190808] font-extrabold text-xs shadow-lg shadow-coral-500/30 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <span>تسجيل الدخول أو الحساب</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
              >
                إغلاق (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};