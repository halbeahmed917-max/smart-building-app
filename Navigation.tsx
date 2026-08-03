import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Building2, 
  Zap, 
  Flower2, 
  Receipt, 
  Camera, 
  Sparkles,
  Siren,
  Wrench,
  Users
} from 'lucide-react';

export const ALL_NAV_ITEMS = [
  { id: 0, title: 'لوحة التحكم', subtitle: 'ملخص النظام وإضافة مبنى', icon: LayoutDashboard },
  { id: 1, title: 'المباني والشقق', subtitle: 'إدارة الشقق والأجهزة', icon: Building2 },
  { id: 2, title: 'الأجهزة الذكية', subtitle: 'التحكم والمساعد الصوتي', icon: Zap },
  { id: 3, title: 'الحديقة والري الذكي', subtitle: 'محاكي Wokwi وحساس المطر', icon: Flower2 },
  { id: 4, title: 'فواتير المياه والكهرباء', subtitle: 'قياس وتفتيش ودفع إلكتروني', icon: Receipt },
  { id: 5, title: 'كاميرات المراقبة', subtitle: 'الداتا بيز وحماية الخصوصية', icon: Camera },
  { id: 6, title: 'المساعد الذكي صوتياً', subtitle: 'مخاطبة المساعد لتشغيل الأجهزة', icon: Sparkles },
  { id: 7, title: 'مركز الطوارئ والـ SOS', subtitle: 'حساسات مدمجة واستغاثة', icon: Siren },
  { id: 8, title: 'الصيانة والتنبؤ بالأعطال', subtitle: 'تنبؤ بالذكاء وحجز المرافق', icon: Wrench },
  { id: 9, title: 'المستخدمين والأمن السيبراني', subtitle: 'إدارة الصلاحيات وحجب الأخطاء', icon: Users },
];

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, userRole } = useApp();

  // Tenant view cleanup requirement: "في واجهة المستأجر في لوحة التحكم إزالة ميزة وحدتك و إزالة واجهة المباني و الوحدات الحديقة"
  const navItems = ALL_NAV_ITEMS.filter((item) => {
    if (userRole === 'tenant') {
      // Hide "لوحة التحكم العامة" (id 0), "المباني والشقق" (id 1), "الحديقة والري" (id 3), and "إدارة المستخدمين والأمن" (id 9)
      if (item.id === 0 || item.id === 1 || item.id === 3 || item.id === 9) return false;
    }
    return true;
  });

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-[65px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto py-2.5 scrollbar-none gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-right group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md font-bold scale-[1.01]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-indigo-600 group-hover:bg-slate-200 group-hover:text-indigo-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold leading-tight">
                    {item.title}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isActive ? 'text-indigo-100' : 'text-slate-400 font-normal'
                    }`}
                  >
                    {item.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
