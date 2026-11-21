import React, { useState, useEffect } from 'react';
import { Lock, UserPlus, LogIn, ShieldCheck, AlertCircle, CheckCircle2, User, KeyRound, Sparkles, Delete } from 'lucide-react';
import { playChime } from '../utils/sound';

interface AuthScreenProps {
  onAuthenticated: (userName: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  // Check if a PIN already exists in localStorage
  const savedPin = localStorage.getItem('orderk_6digit_pin');
  const savedName = localStorage.getItem('orderk_user_name') || 'Elena Vance';
  const savedRole = localStorage.getItem('orderk_user_role') || 'General Manager';

  // If no PIN exists yet, default to 'signup', else 'login'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(savedPin ? 'login' : 'signup');

  // Login state
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState(savedName);
  const [signupRole, setSignupRole] = useState(savedRole);
  const [signupPin, setSignupPin] = useState('');
  const [signupConfirmPin, setSignupConfirmPin] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Focus and keyboard listeners for typing 0-9 directly from keyboard
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

  // Keypad functions for Login
  const handleLoginKeypad = (num: string) => {
    playChime('bump');
    setLoginError('');
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
  };

  const handleLoginClear = () => {
    playChime('bump');
    setLoginPin('');
    setLoginError('');
  };

  const verifyAndLogin = (enteredPin: string) => {
    const currentStoredPin = localStorage.getItem('orderk_6digit_pin');
    
    if (!currentStoredPin) {
      setLoginError('لم يتم إنشاء رمز مرور بعد! يرجى الضغط على زر Sign Up لإنشاء باسوورد.');
      return;
    }

    if (enteredPin === currentStoredPin) {
      playChime('success');
      setLoginError('');
      setTimeout(() => {
        onAuthenticated(savedName);
      }, 350);
    } else {
      playChime('bump');
      setLoginError('❌ الرمز غير صحيح! يجب إدخال الرمز المكون من 6 أرقام الذي حددته بالضبط.');
      setTimeout(() => {
        setLoginPin('');
      }, 700);
    }
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loginPin.length !== 6) {
      setLoginError('يجب إدخال 6 أرقام كاملة.');
      return;
    }
    verifyAndLogin(loginPin);
  };

  // Signup Submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim()) {
      setSignupError('يرجى كتابة اسم المستخدم.');
      return;
    }

    if (signupPin.length !== 6 || !/^\d{6}$/.test(signupPin)) {
      setSignupError('يجب أن يتكون رمز المرور من 6 أرقام بالضبط (0-9).');
      return;
    }

    if (signupPin !== signupConfirmPin) {
      setSignupError('الرمزان غير متطابقين! يرجى التأكد من تطابق الـ 6 أرقام.');
      return;
    }

    // Save strictly to localStorage
    localStorage.setItem('orderk_6digit_pin', signupPin);
    localStorage.setItem('orderk_user_name', signupName.trim());
    localStorage.setItem('orderk_user_role', signupRole);

    playChime('success');
    setSignupSuccess(true);

    setTimeout(() => {
      onAuthenticated(signupName.trim());
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060817] flex flex-col items-center justify-center p-4 select-none overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Auth Container */}
      <div className="w-full max-w-md my-auto rounded-3xl bg-[#0c102a] border border-white/10 p-5 sm:p-8 shadow-2xl relative z-10 space-y-5 sm:space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
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
            نظام إدارة عمليات المطاعم ونقاط البيع الآمن
          </p>
        </div>

        {/* Two Switch Buttons: Log In and Sign Up */}
        <div className="p-1 rounded-2xl bg-[#111738] border border-white/[0.06] grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              playChime('bump');
              setAuthMode('login');
              setLoginError('');
              setLoginPin('');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              authMode === 'login'
                ? 'bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#190808] shadow-md shadow-coral-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول (Log In)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playChime('bump');
              setAuthMode('signup');
              setSignupError('');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              authMode === 'signup'
                ? 'bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] text-[#190808] shadow-md shadow-coral-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>إنشاء حساب (Sign Up)</span>
          </button>
        </div>

        {/* ----------------- MODE 1: LOG IN ----------------- */}
        {authMode === 'login' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-center space-y-1">
              <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                أدخل رمز المرور المكون من 6 أرقام
              </div>
              <div className="text-[11px] text-slate-400">
                المستخدم الحالي: <strong className="text-white">{savedName}</strong> ({savedRole})
              </div>
            </div>

            {/* 6 PIN Indicator Dots */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    loginPin.length > idx
                      ? 'bg-coral-400 scale-125 shadow-lg shadow-coral-400/60 ring-2 ring-coral-300'
                      : 'bg-[#151c44] border-2 border-white/20'
                  }`}
                ></div>
              ))}
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center flex items-center justify-center gap-2 animate-in shake">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="font-semibold">{loginError}</span>
              </div>
            )}

            {/* Numeric Keypad (1-9, Clear, 0, Backspace) */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleLoginKeypad(digit)}
                  className="h-13 py-3 rounded-2xl bg-[#13193e] hover:bg-[#1a2354] active:scale-95 text-white font-mono text-xl font-bold border border-white/[0.08] shadow-md transition flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}

              <button
                type="button"
                onClick={handleLoginClear}
                className="h-13 py-3 rounded-2xl bg-[#161a38] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs font-bold border border-white/[0.06] transition flex items-center justify-center"
              >
                مسح
              </button>

              <button
                type="button"
                onClick={() => handleLoginKeypad('0')}
                className="h-13 py-3 rounded-2xl bg-[#13193e] hover:bg-[#1a2354] active:scale-95 text-white font-mono text-xl font-bold border border-white/[0.08] shadow-md transition flex items-center justify-center"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleLoginBackspace}
                className="h-13 py-3 rounded-2xl bg-[#161a38] hover:bg-white/10 text-slate-300 font-bold border border-white/[0.06] transition flex items-center justify-center"
                title="حذف آخر رقم"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Login Submit Button */}
            <button
              type="button"
              onClick={() => handleLoginSubmit()}
              disabled={loginPin.length !== 6}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 disabled:opacity-40 text-[#190808] font-extrabold text-sm shadow-xl shadow-coral-500/30 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>تسجيل الدخول بالرمز (Log In)</span>
            </button>
          </div>
        )}

        {/* ----------------- MODE 2: SIGN UP ----------------- */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center space-y-0.5">
              <div className="text-xs uppercase font-bold text-coral-400 tracking-wider">
                إنشاء حساب جديد وتعيين باسوورد 6 أرقام
              </div>
              <p className="text-[11px] text-slate-400">
                الرمز الذي ستحدده هنا هو الرمز الوحيد الذي يمكنك استخدامه للدخول
              </p>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">اسم المستخدم (Full Name)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="مثال: Elena Vance"
                  className="w-full bg-[#111738] text-white rounded-xl pl-9 pr-3 py-2.5 text-xs border border-white/10 focus:outline-none focus:border-coral-400"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">الدور الوظيفي (Role)</label>
              <select
                value={signupRole}
                onChange={(e) => setSignupRole(e.target.value)}
                className="w-full bg-[#111738] text-white rounded-xl px-3 py-2.5 text-xs border border-white/10 focus:outline-none focus:border-coral-400"
              >
                <option value="General Manager">General Manager (مدير عام)</option>
                <option value="Shift Lead">Shift Lead (مشرف وردية)</option>
                <option value="Head Cashier">Head Cashier (كاشير رئيسي)</option>
                <option value="Head Chef">Head Chef (رئيس طهاة)</option>
              </select>
            </div>

            {/* Create 6-digit PIN */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                رمز المرور الجديد (6 أرقام فقط)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={signupPin}
                  onChange={(e) => setSignupPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="أدخل 6 أرقام (مثال: 123456)"
                  className="w-full bg-[#111738] text-white font-mono tracking-widest rounded-xl pl-9 pr-3 py-2.5 text-sm border border-white/10 focus:outline-none focus:border-coral-400"
                />
              </div>
            </div>

            {/* Confirm 6-digit PIN */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                تأكيد رمز المرور (Confirm PIN)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={signupConfirmPin}
                  onChange={(e) => setSignupConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="أعد إدخال نفس الـ 6 أرقام"
                  className="w-full bg-[#111738] text-white font-mono tracking-widest rounded-xl pl-9 pr-3 py-2.5 text-sm border border-white/10 focus:outline-none focus:border-coral-400"
                />
              </div>
            </div>

            {/* Signup Error */}
            {signupError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {/* Signup Success */}
            {signupSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>تم إنشاء الحساب وحفظ الباسوورد بنجاح! جاري تحويلك للنظام...</span>
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={signupPin.length !== 6 || signupConfirmPin.length !== 6}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff9e93] to-[#ff7b72] hover:brightness-110 disabled:opacity-40 text-[#190808] font-extrabold text-sm shadow-xl shadow-coral-500/30 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>إنشاء الحساب وتعيين الباسوورد (Sign Up)</span>
            </button>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="pt-2 border-t border-white/[0.05] flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-coral-400" />
          <span>حماية مشددة: لا يمكن الدخول إلا بالـ 6 أرقام المحددة حصراً.</span>
        </div>
      </div>
    </div>
  );
};

