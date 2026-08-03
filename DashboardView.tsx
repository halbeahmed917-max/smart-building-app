import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Plus, 
  Zap, 
  Droplet, 
  Home, 
  Layers, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    buildings, 
    units, 
    addBuilding, 
    getBuildingStats, 
    setActiveTab, 
    setSelectedBuildingId,
    userRole 
  } = useApp();

  const [isAddBuildingModalOpen, setIsAddBuildingModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    floorsCount: 4,
    totalUnitsCount: 8,
  });
  const [successMsg, setSuccessMsg] = useState('');

  const totalBuildingsCount = buildings.length;
  const totalUnitsCount = units.length;
  const totalElectricityKWh = units.reduce((sum, u) => sum + u.monthlyElectricityKWh, 0);
  const totalWaterLiters = units.reduce((sum, u) => sum + u.monthlyWaterLiters, 0);

  const handleSubmitNewBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const created = addBuilding({
      name: formData.name,
      code: formData.code || `BLD-${Date.now().toString().slice(-4)}`,
      address: formData.address || 'العنوان الرئيسي',
      floorsCount: Number(formData.floorsCount),
      totalUnitsCount: Number(formData.totalUnitsCount),
    });

    setSuccessMsg(`تم إضافة المبنى (${created.name}) بنجاح للمنظومة الذكية!`);
    setFormData({ name: '', code: '', address: '', floorsCount: 4, totalUnitsCount: 8 });
    setTimeout(() => {
      setSuccessMsg('');
      setIsAddBuildingModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Add Building Button */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3.5 py-1 rounded-full font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              لوحة التحكم المركزية بالذكاء الاصطناعي
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              مرحباً بك في المنظومة الذكية لإدارة المباني والوحدات
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
              يمكنك متابعة إجمالي الاستهلاك الكهربائي والمائي، معرفة استهلاك كل شقة منفصلة، وإضافة مبانٍ جديدة ومتابعة حالة الوحدات فورياً.
            </p>
          </div>

          {(userRole === 'owner' || userRole === 'manager') && (
            <button
              onClick={() => setIsAddBuildingModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.01] cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              إضافة مبنى جديد
            </button>
          )}
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-semibold">إجمالي المباني</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalBuildingsCount}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">مباني مسجلة بالداتا بيز</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-semibold">إجمالي الوحدات والشقق</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalUnitsCount}</div>
          <div className="text-xs text-blue-600 font-semibold mt-1">
            {units.filter(u => u.status === 'rented').length} مؤجرة / {units.filter(u => u.status === 'vacant').length} شاغرة
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-amber-900/80 text-xs font-semibold">استهلاك الكهرباء الإجمالي</span>
            <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-900">{totalElectricityKWh.toLocaleString()} <span className="text-sm font-semibold text-amber-700">ك.و.س</span></div>
          <div className="text-xs text-amber-700 mt-1 font-medium">إجمالي استهلاك كل المباني</div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-emerald-900/80 text-xs font-semibold">إجمالي استهلاك الماء</span>
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-sm">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-900">{totalWaterLiters.toLocaleString()} <span className="text-sm font-semibold text-emerald-700">لتر</span></div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">موزعة على كافة الشقق منفصلة</div>
        </div>

      </div>

      {/* Buildings List with Units & Individual Water Consumption */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              تفاصيل المباني المسجلة واستهلاك الشقق المنفصلة
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              عرض إجمالي الوحدات، استهلاك الكهرباء لكل مبنى، واستهلاك المياه لكل شقة منفصلة.
            </p>
          </div>

          <button
            onClick={() => setActiveTab(1)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-200 transition-all cursor-pointer"
          >
            إدارة الشقق بالكامل
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {buildings.map((b) => {
            const stats = getBuildingStats(b.id);
            return (
              <div
                key={b.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 transition-all group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      {b.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {b.floorsCount} طوابق
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {b.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4 font-medium">{b.address}</p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white p-2.5 rounded-xl text-center border border-slate-200">
                      <span className="text-[11px] text-slate-500 block font-medium">إجمالي الوحدات</span>
                      <span className="text-base font-bold text-slate-900">{stats.totalUnits} شقق</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl text-center border border-slate-200">
                      <span className="text-[11px] text-slate-500 block font-medium">كهرباء المبنى</span>
                      <span className="text-base font-bold text-amber-700">{stats.totalElectricityKWh} ك.و.س</span>
                    </div>
                  </div>

                  {/* Individual Apartment Water Consumption Table */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                      <Droplet className="w-3.5 h-3.5 text-blue-600" />
                      استهلاك الماء لكل شقة منفصلة:
                    </span>

                    {stats.perUnitWater.length > 0 ? (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
                        {stats.perUnitWater.map((uw, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white px-3 py-2 rounded-xl text-slate-700 border border-slate-200/70"
                          >
                            <span className="font-semibold text-slate-900">
                              شقة {uw.unitNumber} {uw.tenantName ? `(${uw.tenantName})` : ''}
                            </span>
                            <span className="font-bold text-emerald-700">
                              {uw.waterLiters.toLocaleString()} لتر
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">لا توجد شقق مسجلة بهذا المبنى بعد</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedBuildingId(b.id);
                      setActiveTab(1);
                    }}
                    className="w-full text-center text-xs font-bold text-indigo-600 hover:bg-indigo-50 py-2.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                  >
                    عرض شقق المبنى وإضافة المزيد
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Building Modal */}
      {isAddBuildingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">إضافة مبنى جديد للمنظومة</h3>
                  <p className="text-xs text-slate-500">أدخل معلومات المبنى ليتم إضافته للداتا بيز الذكية</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddBuildingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="my-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitNewBuilding} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم المبنى *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: برج الرياض الذكي 4"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رمز المبنى (Code)</label>
                    <input
                      type="text"
                      placeholder="مثلاً: RIYADH-04"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">عدد الطوابق</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.floorsCount}
                      onChange={(e) => setFormData({ ...formData, floorsCount: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">العنوان والموقع</label>
                  <input
                    type="text"
                    placeholder="مثلاً: طريق الملك عبدالله، الرياض"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عدد الوحدات والشقق التقديري</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.totalUnitsCount}
                    onChange={(e) => setFormData({ ...formData, totalUnitsCount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddBuildingModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    حفظ وإضافة المبنى
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
