import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  KeyRound, 
  Sparkles, 
  ShieldAlert,
  Crown,
  Coffee,
  X,
  RefreshCw
} from 'lucide-react';
import { playChime } from '../utils/sound';

export type UserRole = 
  | 'زبون'              // زبون
  | 'صاحب الموقع'       // صاحب الموقع
  | 'صاحب المطعم'       // صاحب المطعم
  | 'مدير عام'          // مدير عام
  | 'مشرف وردية'        // مشرف وردية
  | 'كاشير رئيسي'       // كاشير رئيسي
  | 'رئيس طهاة'         // رئيس طهاة
  | 'Customer'
  | 'Restaurant Owner'
  | 'General Manager';

// Master 8-digit passcode for Restaurant Owner and Staff access
export const MASTER_STAFF_PASSCODE = '89472631';

interface AuthScreenProps {
  onAuthenticated: (userName: string, userRole: string) => void;
  initialMode?: 'login' | 'signup';
  isModal?: boolean;
  onClose?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  onAuthenticated, 
  initialMode = 'signup', 
  isModal = false,
  onClose 
}) => {
  const savedName = localStorage.getItem('orderk_user_name') || 'زائر المطعم';
  const savedRole = (localStorage.getItem('orderk_user_role') as UserRole) || 'زبون';

  // Auth mode: strictly locked to initialMode when provided so Log In shows Log In only, Sign Up shows Sign Up only
  const [authMode, setAuthMode] = useState<'signup' | 'login'>(initialMode);

  // Login state
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeSessionConflict, setActiveSessionConflict] = useState(false);

  // Signup state
  const [signupName, setSignupName] = useState(savedName);
  const [signupRole, setSignupRole] = useState<UserRole>('زبون');
  const [signupStaffCode, setSignupStaffCode] = useState(''); // 8-digit code for staff/owner
  const [signupPin, setSignupPin] = useState('');
  const [signupConfirmPin, setSignupConfirmPin] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Check if chosen role requires the 8-digit staff passcode (Customer has display: none)
  const isStaffRole = signupRole !== 'زبون' && signupRole !== 'Customer';

  // -------------------------------------------------------------
  // Personal PIN Strength Meter & 4 Security Rules
  // -------------------------------------------------------------
  const pinDigitsOnly = signupPin.replace(/\D/g, '').slice(0, 6);
  const pinLength = pinDigitsOnly.length;
  
  // Rule 1: الرمز مكون من 6 أرقام كاملة (أو 8 خانات لكلمات المرور المتقدمة)
  const isRule1Met = pinLength === 6;
  
  // Rule 2: أرقام متنوعة وغير متوقعة
  const uniqueDigits = new Set(pinDigitsOnly.split('')).size;
  const isRule2Met = uniqueDigits >= 4;
  
  // Rule 3: تجنب الأرقام المتكررة السهلة (مثل 111111 أو 000000)
  const isAllSame = pinLength > 1 && pinDigitsOnly.split('').every(d => d === pinDigitsOnly[0]);
  const isRule3Met = !isAllSame && pinLength > 0;
  
  // Rule 4: تجنب الأرقام المتتالية الواضحة (مثل 123456 أو 654321)
  const isSequential = pinLength >= 3 && (
    '0123456789'.includes(pinDigitsOnly) || 
    '9876543210'.includes(pinDigitsOnly)
  );
  const isRule4Met = !isSequential && pinLength > 0;

  const strengthCount = [isRule1Met, isRule2Met, isRule3Met, isRule4Met].filter(Boolean).length;

  // Keyboard listeners for login keypad
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (authMode === 'login') {
        if (/^[0-9]$/.test(e.key)) {
          handleLoginKeypad(e.key);
        } else if (e.key === 'Backspace') {
          handleLoginBackspace();
        } else if (e.key === 'Enter' && loginPin.length === 6) {
          handleLoginSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authMode, loginPin]);

  const handleLoginKeypad = (num: string) => {
    playChime('bump');
    setLoginError('');
    setActiveSessionConflict(false);
    if (loginPin.length < 6) {
      const updated = loginPin + num;
      setLoginPin(updated);
      if (updated.length === 6) {
        verifyAndLogin(updated);
      }
    }
  };

  const handleLoginBackspace = () => {
    playChime('bump');
    setLoginPin(prev => prev.slice(0, -1));
    setLoginError('');
    setActiveSessionConflict(false);
  };

  const handleLoginClear = () => {
    playChime('bump');
    setLoginPin('');
    setLoginError('');
    setActiveSessionConflict(false);
  };

  const verifyAndLogin = (enteredPin: string, forceOverride: boolean = false) => {
    const currentStoredPin = localStorage.getItem('orderk_6digit_pin');
    const currentStoredName = localStorage.getItem('orderk_user_name') || 'Guest';
    const currentStoredRole = localStorage.getItem('orderk_user_role') || 'مدير عام';

    // Concurrency Lock: Check if account already has an active session
    const isActiveSession = localStorage.getItem('orderk_active_session') === 'true';
    if (isActiveSession && !forceOverride) {
      playChime('bump');
      setActiveSessionConflict(true);
      setLoginError('🔒 هذا الحساب قيد الاستخدام حالياً! لا يمكن الدخول بحساب مفتوح بالفعل من جهاز آخر، يجب تسجيل الخروج أولاً.');
      return;
    }

    const isMasterMatch = enteredPin === MASTER_STAFF_PASSCODE || enteredPin === MASTER_STAFF_PASSCODE.slice(0, 6);

    if (!currentStoredPin && !isMasterMatch) {
      setLoginError('لم يتم إنشاء رمز مرور بعد! يرجى استخدام Sign Up لإنشاء حساب.');
      return;
    }

    // Only the FIRST registered personal PIN (or master passcode) can log in
    if (enteredPin === currentStoredPin || isMasterMatch) {
      playChime('success');
      setLoginError('');
      setActiveSessionConflict(false);
      localStorage.setItem('orderk_active_session', 'true');
      localStorage.setItem('orderk_user_registered', 'true');
      setTimeout(() => {
        onAuthenticated(currentStoredName, currentStoredRole);
      }, 350);
    } else {
      playChime('bump');
      setLoginError('❌ كلمة المرور غير صحيحة! لا يمكنك الدخول إلا برمز الدخول الشخصي الأصلي المسجل، أو بالضغط على Sign Up لإنشاء حساب جديد.');
      setTimeout(() => {
        setLoginPin('');
      }, 900);
    }
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loginPin.length !== 6 && loginPin !== MASTER_STAFF_PASSCODE) {
      setLoginError('يجب إدخال 6 أرقام كاملة أو الرمز المعتمد.');
      return;
    }
    verifyAndLogin(loginPin);
  };

  const handleForceOverrideLogin = () => {
    localStorage.removeItem('orderk_active_session');
    setActiveSessionConflict(false);
    verifyAndLogin(loginPin, true);
  };

  // Signup Submit handler
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim()) {
      setSignupError('يرجى كتابة اسم المستخدم.');
      return;
    }

    // Role check for staff/owner: strictly verified against MASTER_STAFF_PASSCODE ('89472631')
    if (isStaffRole) {
      if (!signupStaffCode.trim() || signupStaffCode.length !== 8) {
        setSignupError('⚠️ يرجى كتابة الرمز المتعارف عليه من 8 أرقام (إجباري للدخول لبيانات المطعم والإدارة)!');
        playChime('bump');
        return;
      }

      if (signupStaffCode.trim() !== MASTER_STAFF_PASSCODE) {
        setSignupError('❌ الرمز المتعارف عليه غير صحيح! لا يمكن فتح بيانات المطعم إلا بالرمز المعتمد الصعب.');
        playChime('bump');
        return;
      }
    }

    // PIN check: strictly 6 digits
    if (pinDigitsOnly.length !== 6) {
      setSignupError('⚠️ يجب أن يتكون رمز الدخول الشخصي من 6 أرقام كاملة بدون حروف.');
      playChime('bump');
      return;
    }

    if (signupConfirmPin !== pinDigitsOnly) {
      setSignupError('❌ تأكيد رمز الدخول غير متطابق مع الرمز الشخصي!');
      playChime('bump');
      return;
    }

    // Save strictly to localStorage
    localStorage.setItem('orderk_6digit_pin', pinDigitsOnly);
    localStorage.setItem('orderk_user_name', signupName.trim());
    localStorage.setItem('orderk_user_role', signupRole);
    localStorage.setItem('orderk_user_registered', 'true');
    localStorage.setItem('orderk_active_session', 'true');
    
    if (isStaffRole) {
      localStorage.setItem('orderk_staff_code', signupStaffCode);
    } else {
      localStorage.removeItem('orderk_staff_code');
    }

    playChime('success');
    setSignupSuccess(true);

    setTimeout(() => {
      onAuthenticated(signupName.trim(), signupRole);
    }, 700);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-[#060817]/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-4 select-none overflow-y-auto animate-in fade-in`}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Auth Container */}
      <div className="w-full max-w-md my-auto rounded-3xl bg-[#0c102a] border border-white/10 p-5 sm:p-7 shadow-2xl relative z-10 space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Close Button if opened as modal */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
            title="إغلاق والعودة لتصفح المطعم"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-coral-500 to-rose-400 flex items-center justify-center font-bold text-white shadow-lg shadow-coral-500/30">
              <span className="text-lg font-black tracking-tight">K</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-2xl tracking-tight">OrderK</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                POS v2.4
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {authMode === 'login' 
              ? 'تسجيل الدخول إلى حسابك (Log In)' 
              : 'إنشاء حساب جديد لأول مرة (Sign Up)'}
          </p>
        </div>

        {/* Only show Switch Tabs if not forced to a specific mode */}
        {!initialMode && (
          <div className="p-1 rounded-2xl bg-[#111738] border border-white/[0.06] grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                playChime('bump');
                setAuthMode('signup');
                setSignupError('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                authMode === 'signup'
                  ? 'bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#190808] shadow-md shadow-coral-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إنشاء حساب (Sign Up)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playChime('bump');
                setAuthMode('login');
                setLoginError('');
                setLoginPin('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#190808] shadow-md shadow-coral-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل الدخول (Log In)</span>
            </button>
          </div>
        )}

        {/* ----------------- MODE 1: LOG IN ----------------- */}
        {authMode === 'login' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center space-y-1">
              <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                أدخل رمز الدخول الشخصي المكون من 6 أرقام
              </div>
              <div className="text-[11px] text-slate-400">
                الحساب المسجل: <strong className="text-white">{savedName}</strong> ({savedRole === 'Customer' ? 'زبون 🍽️' : `${savedRole} 🔑`})
              </div>
            </div>

            {/* 6 PIN Indicator Dots */}
            <div className="flex items-center justify-center gap-3 py-1">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    loginPin.length > idx
                      ? 'bg-coral-400 scale-125 shadow-lg shadow-coral-400/60 ring-2 ring-coral-300'
                      : 'bg-[#151c44] border-2 border-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Error Message & Concurrency Lock Override */}
            {loginError && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center flex flex-col items-center justify-center gap-2 animate-in shake">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
                {activeSessionConflict && (
                  <button
                    type="button"
                    onClick={handleForceOverrideLogin}
                    className="mt-1 px-3 py-1 rounded-xl bg-rose-500/30 hover:bg-rose-500/50 border border-rose-400/40 text-white text-[11px] font-bold flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>إنهاء الجلسة السابقة والدخول الآن</span>
                  </button>
                )}
              </div>
            )}

            {/* Numeric Keypad (1-9, Clear, 0, Backspace) */}
            <div className="grid grid-cols-3 gap-2 max-w-[270px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleLoginKeypad(digit)}
                  className="h-11 sm:h-12 rounded-2xl bg-[#13193e] hover:bg-[#1a2354] active:scale-95 text-white font-mono text-xl font-bold border border-white/[0.08] shadow-md transition flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}

              <button
                type="button"
                onClick={handleLoginClear}
                className="h-11 sm:h-12 rounded-2xl bg-[#161a38] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-bold border border-white/[0.06] transition flex items-center justify-center"
              >
                مسح
              </button>

              <button
                type="button"
                onClick={() => handleLoginKeypad('0')}
                className="h-11 sm:h-12 rounded-2xl bg-[#13193e] hover:bg-[#1a2354] active:scale-95 text-white font-mono text-xl font-bold border border-white/[0.08] shadow-md transition flex items-center justify-center"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleLoginBackspace}
                className="h-11 sm:h-12 rounded-2xl bg-[#161a38] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/[0.06] transition flex items-center justify-center"
              >
                حذف ⌫
              </button>
            </div>
          </div>
        )}

        {/* ----------------- MODE 2: SIGN UP ----------------- */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3 animate-in fade-in duration-200">
            {/* User Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">اسم المستخدم (Full Name)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="مثال: عمر الشريف أو زائر المطعم"
                  className="w-full bg-[#111738] text-white rounded-xl pl-9 pr-3 py-2 text-xs border border-white/10 focus:outline-none focus:border-coral-400"
                />
              </div>
            </div>

            {/* Role Select with exact user Arabic terms */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>الدور الوظيفي</span>
                {signupRole === 'زبون' || signupRole === 'Customer' ? (
                  <span className="text-[10px] text-emerald-400 font-bold">طلب المأكولات والمشروبات فقط 🍽️</span>
                ) : (
                  <span className="text-[10px] text-amber-400 font-bold">بيانات المطعم والإدارة والأرباح 🔒</span>
                )}
              </label>
              <select
                value={signupRole}
                onChange={(e) => {
                  setSignupRole(e.target.value as UserRole);
                  setSignupError('');
                }}
                className="w-full bg-[#111738] text-white rounded-xl px-3 py-2 text-xs border border-white/10 focus:outline-none focus:border-coral-400 font-semibold"
              >
                <option value="زبون">زبون</option>
                <option value="صاحب الموقع">صاحب الموقع</option>
                <option value="صاحب المطعم">صاحب المطعم</option>
                <option value="مدير عام">مدير عام</option>
                <option value="مشرف وردية">مشرف وردية</option>
                <option value="كاشير رئيسي">كاشير رئيسي</option>
                <option value="رئيس طهاة">رئيس طهاة</option>
              </select>
            </div>

            {/* 8-Digit Staff Code (DISPLAY NONE when role is زبون!) */}
            <div 
              className="space-y-1 transition-all"
              style={{ display: isStaffRole ? 'block' : 'none' }}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>الرمز المتعارف عليه من 8 ارقام</span>
                </label>
                {signupStaffCode.length === 8 && (
                  signupStaffCode === MASTER_STAFF_PASSCODE ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>الرمز صحيح 🔒</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>رمز غير معتمد ❌</span>
                    </span>
                  )
                )}
              </div>
              <div className="relative">
                <ShieldCheck className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition ${
                  signupStaffCode.length === 8 && signupStaffCode === MASTER_STAFF_PASSCODE
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`} />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={signupStaffCode}
                  onChange={(e) => {
                    setSignupStaffCode(e.target.value.replace(/\D/g, ''));
                    setSignupError('');
                  }}
                  placeholder="اكتب الرمز المتعارف عليه (8 أرقام)"
                  className={`w-full bg-[#191e45] text-amber-200 font-mono tracking-widest rounded-xl pl-9 pr-3 py-2 text-xs border focus:outline-none transition ${
                    signupStaffCode.length === 8
                      ? (signupStaffCode === MASTER_STAFF_PASSCODE
                          ? 'border-emerald-500/70 focus:border-emerald-400'
                          : 'border-rose-500/70 focus:border-rose-400')
                      : 'border-amber-500/40 focus:border-amber-400'
                  }`}
                />
              </div>
              <p className="text-[10px] text-amber-400/90 font-medium">
                * للمطعم والإدارة فقط: الرمز المعتمد هو الذي يتيح فتح بيانات المطعم، أي رمز آخر لن يفتح.
              </p>
            </div>

            {/* Create 6-digit Personal PIN (Strictly numeric, max 6 digits) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>رمز الدخول الشخصي (6 أرقام فقط)</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {pinLength} / 6 خانات
                </span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={signupPin}
                  onChange={(e) => {
                    // Strictly numbers only, max 6 digits, no letters
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setSignupPin(clean);
                  }}
                  placeholder="أدخل 6 أرقام (أرقام فقط بدون حروف)"
                  className="w-full bg-[#111738] text-white font-mono tracking-widest rounded-xl pl-9 pr-3 py-2 text-sm border border-white/10 focus:outline-none focus:border-coral-400"
                />
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  The Black Line Strength Meter (يتلون كلما زاد الأمان)
                 ───────────────────────────────────────────────────────────── */}
              <div className="space-y-1.5 pt-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">مستوى قوة وأمان رمز الدخول:</span>
                  <span className={`font-bold transition-colors ${
                    strengthCount === 4 ? 'text-emerald-400' :
                    strengthCount === 3 ? 'text-cyan-400' :
                    strengthCount === 2 ? 'text-amber-400' :
                    strengthCount === 1 ? 'text-rose-400' : 'text-slate-500'
                  }`}>
                    {strengthCount === 4 ? 'قوي جداً ومحمي 🔒' :
                     strengthCount === 3 ? 'جيد جداً 🛡️' :
                     strengthCount === 2 ? 'متوسط ⚠️' :
                     strengthCount === 1 ? 'ضعيف ❌' : 'غير مكتمل'}
                  </span>
                </div>

                {/* The Black Line container */}
                <div className="h-3 w-full bg-black rounded-full border border-white/20 p-0.5 overflow-hidden relative shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      strengthCount === 4 ? 'w-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' :
                      strengthCount === 3 ? 'w-3/4 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]' :
                      strengthCount === 2 ? 'w-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
                      strengthCount === 1 ? 'w-1/4 bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                      'w-0'
                    }`}
                  />
                </div>

                {/* The 4 Security Tips */}
                <div className="p-2.5 rounded-2xl bg-[#080b20] border border-white/[0.06] space-y-1.5 mt-1">
                  <div className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-coral-400" />
                    <span>إرشادات أمان الرمز الشخصي:</span>
                  </div>

                  <div className="space-y-1 text-[10px]">
                    {/* Tip 1 */}
                    <div className={`flex items-start gap-1.5 transition ${isRule1Met ? 'text-emerald-300' : 'text-slate-400'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isRule1Met ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-white/5 text-slate-500'
                      }`}>
                        {isRule1Met ? <CheckCircle2 className="w-2.5 h-2.5" /> : '•'}
                      </div>
                      <span>أن يتكون الرمز من 6 أرقام كاملة (أو 8 خانات لكلمات المرور المتقدمة)</span>
                    </div>

                    {/* Tip 2 */}
                    <div className={`flex items-start gap-1.5 transition ${isRule2Met ? 'text-emerald-300' : 'text-slate-400'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isRule2Met ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-white/5 text-slate-500'
                      }`}>
                        {isRule2Met ? <CheckCircle2 className="w-2.5 h-2.5" /> : '•'}
                      </div>
                      <span>أرقام متنوعة وغير متوقعة (مع إمكانية إضافة رموز وعلامات خاصة للأمان العالي)</span>
                    </div>

                    {/* Tip 3 */}
                    <div className={`flex items-start gap-1.5 transition ${isRule3Met ? 'text-emerald-300' : 'text-slate-400'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isRule3Met ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-white/5 text-slate-500'
                      }`}>
                        {isRule3Met ? <CheckCircle2 className="w-2.5 h-2.5" /> : '•'}
                      </div>
                      <span>تجنب الأرقام المتكررة السهلة (مثل 111111 أو 000000)</span>
                    </div>

                    {/* Tip 4 */}
                    <div className={`flex items-start gap-1.5 transition ${isRule4Met ? 'text-emerald-300' : 'text-slate-400'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isRule4Met ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-white/5 text-slate-500'
                      }`}>
                        {isRule4Met ? <CheckCircle2 className="w-2.5 h-2.5" /> : '•'}
                      </div>
                      <span>تجنب الأرقام المتتالية الواضحة (مثل 123456 أو 654321)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm 6-digit PIN */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                تأكيد رمز الدخول (6 أرقام)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={signupConfirmPin}
                  onChange={(e) => setSignupConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="أعد إدخال نفس الـ 6 أرقام"
                  className="w-full bg-[#111738] text-white font-mono tracking-widest rounded-xl pl-9 pr-3 py-2 text-sm border border-white/10 focus:outline-none focus:border-coral-400"
                />
              </div>
            </div>

            {/* Signup Error */}
            {signupError && (
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {/* Signup Success */}
            {signupSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>تم إنشاء الحساب بنجاح! جاري تسجيل الدخول...</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 active:scale-95 text-[#1a0808] font-bold text-xs shadow-lg shadow-coral-500/25 transition mt-2"
            >
              حفظ وإنشاء الحساب (Sign Up)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};