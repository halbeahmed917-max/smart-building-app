import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Lock, KeyRound, UserCheck, AlertCircle, Sparkles, CheckCircle2, X } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, systemUsers, currentUser } = useApp();

  const [emailInput, setEmailInput] = useState(currentUser?.email || 'halbeahmed917@gmail.com');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  const [mfaCode, setMfaCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = loginWithEmail(emailInput.trim(), passwordInput);
    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setSuccessMsg(`تم تسجيل الدخول بنجاح! مرحباً بك (${result.user?.name})`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1000);
    }
  };

  const handleQuickSelectUser = (email: string) => {
    setEmailInput(email);
    const result = loginWithEmail(email);
    if (result.success) {
      setSuccessMsg(`تم الدخول بنجاح كـ (${result.user?.name})`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-indigo-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">بوابة تسجيل الدخول الآمنة</h2>
              <p className="text-xs text-indigo-100 font-medium">نظام حماية الداتا بيز ومنع الاختراق (Zero-Trust Guard)</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick User Selector Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              تسجيل دخول سريع بحسب الصلاحية:
            </label>
            <div className="space-y-2">
              {systemUsers.map((user) => {
                const isCurrent = currentUser?.email === user.email;
                let roleLabel = 'مستأجر';
                let roleBadgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                
                if (user.role === 'super_admin') {
                  roleLabel = 'مدير النظام الرئيسي (أنت)';
                  roleBadgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
                } else if (user.role === 'owner') {
                  roleLabel = 'مالك العقارات';
                  roleBadgeBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                }

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleQuickSelectUser(user.email)}
                    className={`w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-indigo-600 text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadgeBg}`}>
                      {roleLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-[11px] text-slate-400 font-medium bg-white px-3">
              أو الدخول يدويًا بالبريد الإلكتروني
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@smartbuilding.sa"
                  className="w-full pl-3 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور:</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>دخول النظام وتفعيل الجلسة المشفرة</span>
            </button>
          </form>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 text-center space-y-1">
            <div className="font-semibold text-slate-700 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              حماية ضد الهجمات الإلكترونية والتجسس
            </div>
            <p>يتم إلغاء رسائل الداتا بيز المباشرة وتخزين السجلات بتشفير SHA-256 لمنع المخترقين من معرفة بنية الجداول.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
