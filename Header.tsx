import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Shield, User, Clock, AlertTriangle, Cpu, CheckCircle2, LogIn } from 'lucide-react';
import { UserRole } from '../types';
import { LoginModal } from './LoginModal';

export const Header: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    activeTenantUnitId, 
    setActiveTenantUnitId,
    units, 
    buildings,
    selectedBuildingId,
    setSelectedBuildingId,
    setActiveTab,
    activeEmergencyCount,
    currentUser
  } = useApp();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const currentTenantUnit = units.find(u => u.id === activeTenantUnitId);

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3.5 gap-3">
          
          {/* App Branding with Indigo Square Logo */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                منظومة إدارة المباني والوحدات الذكية
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  نظام أوتوماتيكي متصل
                </span>
                <span>•</span>
                <span className="text-slate-400 font-medium">Gemini AI Engine</span>
              </div>
            </div>
          </div>

          {/* Center Building Selector & SOS Alarm Shortcut */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span className="text-slate-500 font-medium">المبنى النشط:</span>
              <select
                value={selectedBuildingId}
                onChange={(e) => setSelectedBuildingId(e.target.value)}
                className="bg-transparent text-slate-900 focus:outline-none font-bold text-xs cursor-pointer"
              >
                <option value="all" className="bg-white text-slate-900">كل المباني (إجمالي الشقق)</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id} className="bg-white text-slate-900">
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick SOS Emergency Button */}
            <button
              onClick={() => setActiveTab(7)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                activeEmergencyCount > 0
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow-md'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SOS طوارئ</span>
              {activeEmergencyCount > 0 && (
                <span className="bg-white text-rose-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {activeEmergencyCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Role Switcher and Email Login */}
          <div className="flex items-center gap-3">
            
            {/* Email Login Button */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-200 transition-all text-xs font-bold cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="flex flex-col text-right leading-tight">
                <span className="text-xs font-bold text-slate-900">
                  {currentUser?.name || 'تسجيل الدخول بالبريد'}
                </span>
                <span className="text-[10px] text-indigo-600 font-medium">
                  {userRole === 'super_admin' ? 'مدير النظام (أنت)' : userRole === 'owner' ? 'مالك العقارات' : 'المستأجر'}
                </span>
              </div>
              <LogIn className="w-3.5 h-3.5 text-slate-500 mr-1" />
            </button>

            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setUserRole('super_admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  userRole === 'super_admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="المدير الرئيسي للبرنامج (حسابي - رؤية كامل الداتا بيز)"
              >
                <Shield className="w-3.5 h-3.5" />
                حسابي (Super Admin)
              </button>

              <button
                onClick={() => setUserRole('owner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  userRole === 'owner'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                المالك
              </button>

              <button
                onClick={() => setUserRole('tenant')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  userRole === 'tenant'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                المستأجر
              </button>
            </div>

            {/* Tenant specific active lease status */}
            {userRole === 'tenant' && (
              <div className="flex items-center gap-2">
                <select
                  value={activeTenantUnitId}
                  onChange={(e) => setActiveTenantUnitId(e.target.value)}
                  className="bg-slate-100 text-slate-900 text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 focus:outline-none font-medium"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      شقة {u.unitNumber} ({u.tenant?.tenantName || 'بدون ساكن'})
                    </option>
                  ))}
                </select>

                {currentTenantUnit?.tenant?.status === 'expired' ? (
                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] px-2.5 py-1 rounded-full font-semibold">
                    <AlertTriangle className="w-3 h-3" />
                    عقد منتهي
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] px-2.5 py-1 rounded-full font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    عقد ساري
                  </span>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
};
