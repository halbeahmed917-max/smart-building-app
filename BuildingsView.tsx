import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Home, 
  Plus, 
  Tv, 
  Zap, 
  Droplet, 
  Wifi, 
  Bluetooth, 
  User, 
  CheckCircle, 
  Search,
  Check,
  Cpu,
  Flame,
  Clock
} from 'lucide-react';
import { ApplianceType, ConnectionType } from '../types';

export const BuildingsView: React.FC = () => {
  const { 
    buildings, 
    units, 
    appliances, 
    addUnit, 
    addAppliance, 
    selectedBuildingId, 
    setSelectedBuildingId,
    setActiveTab,
    userRole
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isAddApplianceModalOpen, setIsAddApplianceModalOpen] = useState(false);
  const [selectedUnitForAppliance, setSelectedUnitForAppliance] = useState<string>('');

  // Add Unit Form State
  const [unitFormData, setUnitFormData] = useState({
    buildingId: buildings[0]?.id || '',
    unitNumber: '',
    floor: 1,
    rooms: 3,
    tenantName: '',
    tenantEmail: '',
    startDate: '',
    endDate: '',
  });

  // Add Appliance Form State
  const [applianceFormData, setApplianceFormData] = useState({
    unitId: '',
    name: '',
    type: 'ac' as ApplianceType,
    connection: 'wifi' as ConnectionType,
    powerWatts: 1500,
    waterLitersPerMin: 0,
    scheduledOnTime: '',
    scheduledOffTime: '',
  });

  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Filtered units list
  const filteredUnits = units.filter((u) => {
    const matchesBuilding = selectedBuildingId === 'all' || u.buildingId === selectedBuildingId;
    const matchesSearch = 
      u.unitNumber.includes(searchTerm) ||
      (u.tenant?.tenantName && u.tenant.tenantName.includes(searchTerm));
    return matchesBuilding && matchesSearch;
  });

  const handleAddUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitFormData.unitNumber.trim()) return;

    const bId = unitFormData.buildingId || buildings[0]?.id;
    const hasTenant = unitFormData.tenantName.trim().length > 0;

    const created = addUnit({
      buildingId: bId,
      unitNumber: unitFormData.unitNumber,
      floor: Number(unitFormData.floor),
      rooms: Number(unitFormData.rooms),
      status: hasTenant ? 'rented' : 'vacant',
      tenant: hasTenant ? {
        tenantName: unitFormData.tenantName,
        tenantEmail: unitFormData.tenantEmail || 'tenant@example.com',
        startDate: unitFormData.startDate || '2026-01-01',
        endDate: unitFormData.endDate || '2026-12-31',
        status: 'active',
      } : undefined,
      energyTier: 'normal',
      monthlyElectricityKWh: 300,
      monthlyWaterLiters: 3500,
    });

    setFeedbackMsg(`تم إضافة الشقة ${created.unitNumber} بنجاح!`);
    setIsAddUnitModalOpen(false);
    setUnitFormData({
      buildingId: buildings[0]?.id || '',
      unitNumber: '',
      floor: 1,
      rooms: 3,
      tenantName: '',
      tenantEmail: '',
      startDate: '',
      endDate: '',
    });
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const handleOpenApplianceModal = (unitId: string) => {
    setSelectedUnitForAppliance(unitId);
    setApplianceFormData(prev => ({ ...prev, unitId }));
    setIsAddApplianceModalOpen(true);
  };

  const handleAddApplianceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applianceFormData.name.trim() || !selectedUnitForAppliance) return;

    const targetUnit = units.find(u => u.id === selectedUnitForAppliance);
    
    addAppliance({
      unitId: selectedUnitForAppliance,
      buildingId: targetUnit?.buildingId || buildings[0]?.id,
      name: applianceFormData.name,
      type: applianceFormData.type,
      connection: applianceFormData.connection,
      isOn: true,
      powerWatts: Number(applianceFormData.powerWatts),
      waterLitersPerMin: Number(applianceFormData.waterLitersPerMin),
      dailyHoursUsed: 4.0,
      autoScheduleEnabled: Boolean(applianceFormData.scheduledOnTime || applianceFormData.scheduledOffTime),
      scheduledOnTime: applianceFormData.scheduledOnTime || undefined,
      scheduledOffTime: applianceFormData.scheduledOffTime || undefined,
      aiAutomationActive: true,
      aiNotes: 'تم ضبط الجهاز ذكياً وحفظه بالداتا بيز',
    });

    setFeedbackMsg(`تم إضافة الجهاز الذكي (${applianceFormData.name}) للشقة بنجاح!`);
    setIsAddApplianceModalOpen(false);
    setApplianceFormData({
      unitId: '',
      name: '',
      type: 'ac',
      connection: 'wifi',
      powerWatts: 1500,
      waterLitersPerMin: 0,
      scheduledOnTime: '',
      scheduledOffTime: '',
    });
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            إدارة المباني والشقق والأجهزة الذكية
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            يمكنك الاطلاع على كل شقة ومعلوماتها على حدة، إضافة شقق جديدة للمباني، وتزويدها بأجهزة كهربائية موصولة بالإنترنت أو البلوتوث.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(userRole === 'owner' || userRole === 'manager') && (
            <>
              <button
                onClick={() => setIsAddUnitModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                إضافة شقة جديدة
              </button>
            </>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {feedbackMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-bold">المبنى:</span>
          <select
            value={selectedBuildingId}
            onChange={(e) => setSelectedBuildingId(e.target.value)}
            className="bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            <option value="all">عرض كافة الشقق بالمباني</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="بحث برقم الشقة أو اسم المستأجر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
          />
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((unit) => {
          const building = buildings.find((b) => b.id === unit.buildingId);
          const unitApplianceList = appliances.filter((a) => a.unitId === unit.id);

          return (
            <div
              key={unit.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between text-slate-900 group"
            >
              <div>
                
                {/* Unit Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">شقة {unit.unitNumber}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-mono font-bold">
                      الطابق {unit.floor}
                    </span>
                  </div>

                  {unit.status === 'rented' ? (
                    <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <User className="w-3 h-3" />
                      مؤجرة
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full">
                      شاغرة
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 mb-4 flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {building?.name || 'مبنى مسجل'}
                </div>

                {/* Tenant Lease Info */}
                {unit.tenant ? (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90 mb-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500 font-medium">المستأجر الحالي:</span>
                      <span className="font-bold text-slate-900">{unit.tenant.tenantName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
                      <span>فترة الإيجار:</span>
                      <span dir="ltr" className="font-mono font-semibold text-slate-700">{unit.tenant.startDate} ➔ {unit.tenant.endDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200 mb-4 text-xs text-slate-400 italic text-center font-medium">
                    الشقة شاغرة - يمكن إضافة عقد جديد
                  </div>
                )}

                {/* Consumption Stats & Energy Badge */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80">
                    <span className="text-[10px] text-amber-800 block font-bold">كهرباء الشقة</span>
                    <span className="text-sm font-extrabold text-amber-900">{unit.monthlyElectricityKWh} ك.و.س</span>
                  </div>

                  <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/80">
                    <span className="text-[10px] text-emerald-800 block font-bold">ماء الشقة المنفصل</span>
                    <span className="text-sm font-extrabold text-emerald-900">{unit.monthlyWaterLiters.toLocaleString()} لتر</span>
                  </div>
                </div>

                {/* Installed Appliances List in this apartment */}
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      الأجهزة الكهربائية بالشقة ({unitApplianceList.length}):
                    </span>

                    {(userRole === 'owner' || userRole === 'manager') && (
                      <button
                        onClick={() => handleOpenApplianceModal(unit.id)}
                        className="text-[11px] text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        إضافة جهاز
                      </button>
                    )}
                  </div>

                  {unitApplianceList.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {unitApplianceList.map((dev) => (
                        <div
                          key={dev.id}
                          className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-xs border border-slate-200/80"
                        >
                          <div className="flex items-center gap-2">
                            {dev.connection === 'wifi' || dev.connection === 'hybrid' ? (
                              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Bluetooth className="w-3.5 h-3.5 text-indigo-600" />
                            )}
                            <span className="text-slate-800 font-semibold">{dev.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-slate-500 font-mono font-bold">{dev.powerWatts}W</span>
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                dev.isOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                              }`}
                            ></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic py-2 text-center bg-slate-50 rounded-xl border border-slate-200/60 font-medium">
                      لم يتم إضافة أجهزة كهربائية لهذه الشقة بعد
                    </div>
                  )}

                </div>

              </div>

              {/* Bottom Action */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab(2)}
                  className="w-full text-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                >
                  التحكم في أجهزة الشقة ومراقبة الاستهلاك
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Apartment Modal */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">إضافة شقة جديدة للمبنى</h3>
                  <p className="text-xs text-slate-500 font-medium">حدد المبنى ورقم الشقة ومعلومات المستأجر</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUnitModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUnitSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اختر المبنى *</label>
                <select
                  value={unitFormData.buildingId}
                  onChange={(e) => setUnitFormData({ ...unitFormData, buildingId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                >
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الشقة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: 301"
                    value={unitFormData.unitNumber}
                    onChange={(e) => setUnitFormData({ ...unitFormData, unitNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الطابق</label>
                  <input
                    type="number"
                    min={1}
                    value={unitFormData.floor}
                    onChange={(e) => setUnitFormData({ ...unitFormData, floor: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">عدد الغرف</label>
                  <input
                    type="number"
                    min={1}
                    value={unitFormData.rooms}
                    onChange={(e) => setUnitFormData({ ...unitFormData, rooms: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <span className="font-bold text-slate-800 block mb-2">معلومات المستأجر (اختياري - إذا كانت الشقة مؤجرة):</span>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="اسم المستأجر"
                    value={unitFormData.tenantName}
                    onChange={(e) => setUnitFormData({ ...unitFormData, tenantName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />

                  <input
                    type="email"
                    placeholder="البريد الإلكتروني للمستأجر"
                    value={unitFormData.tenantEmail}
                    onChange={(e) => setUnitFormData({ ...unitFormData, tenantEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">تاريخ بداية العقد</label>
                      <input
                        type="date"
                        value={unitFormData.startDate}
                        onChange={(e) => setUnitFormData({ ...unitFormData, startDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">تاريخ نهاية العقد</label>
                      <input
                        type="date"
                        value={unitFormData.endDate}
                        onChange={(e) => setUnitFormData({ ...unitFormData, endDate: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddUnitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  إضافة الشقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Smart Electrical Appliance Modal */}
      {isAddApplianceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">إضافة جهاز كهربائي ذكي لشقة</h3>
                  <p className="text-xs text-slate-500 font-medium">توصيل جهاز جديد بالواي فاي أو البلوتوث مع الجدولة الذكية</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddApplianceModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddApplianceSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الجهاز الذكي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: مكيف غرفة النوم الرئيسي 24000 BTU"
                  value={applianceFormData.name}
                  onChange={(e) => setApplianceFormData({ ...applianceFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الجهاز</label>
                  <select
                    value={applianceFormData.type}
                    onChange={(e) => setApplianceFormData({ ...applianceFormData, type: e.target.value as ApplianceType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="ac">مكيف الهواء (AC)</option>
                    <option value="water_heater">سخان المياه</option>
                    <option value="fridge">ثلاجة / مجمد</option>
                    <option value="washing_machine">غسالة ملابس</option>
                    <option value="ev_charger">شاحن سيارات كهربائية</option>
                    <option value="tv">تلفزيون ذكي</option>
                    <option value="purifier">منقي هواء</option>
                    <option value="oven">فرن كهربائي</option>
                    <option value="lighting">إضاءة mesh ذكية</option>
                    <option value="smart_lock">قفل باب ذكي</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الاتصال عن بعد</label>
                  <select
                    value={applianceFormData.connection}
                    onChange={(e) => setApplianceFormData({ ...applianceFormData, connection: e.target.value as ConnectionType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                  >
                    <option value="wifi">واي فاي (Wi-Fi 2.4GHz / 5GHz)</option>
                    <option value="bluetooth">بلوتوث (Bluetooth Low Energy)</option>
                    <option value="hybrid">مزدوج (Wi-Fi + Bluetooth Mesh)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">استهلاك الطاقة المقدر (واط - W)</label>
                  <input
                    type="number"
                    min={0}
                    value={applianceFormData.powerWatts}
                    onChange={(e) => setApplianceFormData({ ...applianceFormData, powerWatts: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">استهلاك الماء (لتر/دقيقة إن وجد)</label>
                  <input
                    type="number"
                    min={0}
                    value={applianceFormData.waterLitersPerMin}
                    onChange={(e) => setApplianceFormData({ ...applianceFormData, waterLitersPerMin: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <span className="font-bold text-slate-800 block mb-2">جدولة التشغيل الأوتوماتيكي AI (بدون تدخل):</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">وقت التشغيل التلقائي</label>
                    <input
                      type="time"
                      value={applianceFormData.scheduledOnTime}
                      onChange={(e) => setApplianceFormData({ ...applianceFormData, scheduledOnTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">وقت الإغلاق التلقائي</label>
                    <input
                      type="time"
                      value={applianceFormData.scheduledOffTime}
                      onChange={(e) => setApplianceFormData({ ...applianceFormData, scheduledOffTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddApplianceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  ربط وتوصيل الجهاز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
