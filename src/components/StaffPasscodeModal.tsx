import React from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Utensils, 
  Users, 
  Sparkles, 
  X, 
  LogIn, 
  Receipt,
  Building2,
  Lock
} from 'lucide-react';
import { playChime } from '../utils/sound';

interface StaffPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickStaffLogin?: () => void;
}

export const StaffPasscodeModal: React.FC<StaffPasscodeModalProps> = ({
  isOpen,
  onClose,
  onQuickStaffLogin
}) => {
  if (!isOpen) return null;

  const staffRoles = [
    { title: 'صاحب المطعم / الموقع', icon: Crown, color: 'text-amber-400', desc: 'متابعة الأرباح والبيانات والتقارير المالية المباشرة' },
    { title: 'مدير عام (General Manager)', icon: ShieldCheck, color: 'text-rose-400', desc: 'التحكم الشامل بجميع الصلاحيات وإدارة العمليات' },
    { title: 'مشرف وردية (Shift Supervisor)', icon: Users, color: 'text-cyan-400', desc: 'إدارة وتوزيع الطاولات وإشراف صالة الطعام' },
    { title: 'رئيس طهاة (Head Chef)', icon: Utensils, color: 'text-emerald-400', desc: 'استلام التذاكر عبر شاشة المطبخ KDS وتجهيز الأطباق' },
    { title: 'كاشير رئيسي (Head Cashier)', icon: Receipt, color: 'text-purple-400', desc: 'تسجيل طلبات POS وإصدار الفواتير وتسوية الحسابات' },
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto animate-in fade-in duration-200">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl my-auto rounded-3xl bg-[#0b0e26] border border-amber-500/30 p-5 sm:p-7 shadow-2xl relative z-10 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          title="إغلاق والعودة"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20">
            <Building2 className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              بوابة العاملين وإدارة المطعم (Staff Portal)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              منطقة مخصصة لطاقم العمل للوصول إلى لوحة المراقبة وإدارة الطلبات والعمليات
            </p>
          </div>
        </div>

        {/* Secure Staff Entrance Card (No exposed password) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#14183d] to-[#0d102b] border border-amber-500/30 text-center space-y-3.5 shadow-inner">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>منطقة مؤمنة لطاقم العمل فقط</span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-white">
            الوصول المباشر لمنظومة تشغيل المطعم
          </h3>

          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            إذا كنت تعمل ضمن طاقم المطعم، يمكنك الانتقال فوراً إلى لوحة التحكم التشغيلية الخاصة بك لمتابعة شاشات المطبخ، تسجيل الطلبات، والاطلاع على البيانات المباشرة.
          </p>

          {onQuickStaffLogin && (
            <div className="pt-1">
              <button
                onClick={() => {
                  playChime('success');
                  onClose();
                  onQuickStaffLogin();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:brightness-110 active:scale-98 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 inline-flex items-center justify-center gap-2 transition"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>الدخول المباشر للوحة الإدارة وبيانات المطعم ➔</span>
              </button>
            </div>
          )}
        </div>

        {/* Staff Roles & Allowed Operations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>الأدوار الوظيفية داخل منظومة المطعم:</span>
            <span className="text-[10px] text-amber-400">طاقم العمل 👥</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {staffRoles.map((role, idx) => {
              const Icon = role.icon;
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-[#101438] border border-white/[0.06] flex items-start gap-2.5"
                >
                  <div className={`p-1.5 rounded-xl bg-white/5 ${role.color} flex-shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-[11px] truncate">{role.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{role.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>العودة لقائمة الطعام</span>
          </button>
        </div>
      </div>
    </div>
  );
};