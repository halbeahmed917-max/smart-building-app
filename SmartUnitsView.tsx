import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  Droplet, 
  Wifi, 
  Bluetooth, 
  Power, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Tv, 
  Wind, 
  Flame, 
  Sliders,
  Check,
  ShieldCheck,
  Info,
  Mic,
  PlusCircle,
  Volume2
} from 'lucide-react';
import { SmartAppliance, ApplianceType } from '../types';

export const SmartUnitsView: React.FC = () => {
  const { 
    units, 
    buildings, 
    appliances, 
    toggleAppliance, 
    updateApplianceSchedule, 
    toggleAiAutomation,
    selectedBuildingId,
    setSelectedBuildingId,
    executeVoiceApplianceControl,
    addApplianceSimple
  } = useApp();

  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id || 'u-101');
  
  // Timer schedule editing modal
  const [editingScheduleAppliance, setEditingScheduleAppliance] = useState<SmartAppliance | null>(null);
  const [onTime, setOnTime] = useState<string>('07:00');
  const [offTime, setOffTime] = useState<string>('23:00');
  const [autoEnabled, setAutoEnabled] = useState<boolean>(true);

  // Gemini Voice Command Assistant State
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<{ message: string; success: boolean } | null>(null);

  // Simplified Appliance Add Modal
  const [showSimpleAddModal, setShowSimpleAddModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppType, setNewAppType] = useState<ApplianceType>('ac');

  // Filtered units list
  const filteredUnits = units.filter(
    (u) => selectedBuildingId === 'all' || u.buildingId === selectedBuildingId
  );

  const activeUnit = units.find((u) => u.id === selectedUnitId) || filteredUnits[0] || units[0];
  const activeBuilding = buildings.find((b) => b.id === activeUnit?.buildingId);

  // Appliances inside the active unit
  const activeUnitAppliances = appliances.filter((a) => a.unitId === activeUnit?.id);

  // Calculate live energy metrics
  const totalActiveWatts = activeUnitAppliances
    .filter((a) => a.isOn)
    .reduce((sum, a) => sum + a.powerWatts, 0);

  const totalActiveWaterLitersPerMin = activeUnitAppliances
    .filter((a) => a.isOn)
    .reduce((sum, a) => sum + a.waterLitersPerMin, 0);

  const handleVoiceSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!voiceText.trim()) return;

    const res = executeVoiceApplianceControl(voiceText);
    setVoiceFeedback({ message: res.message, success: res.success });
    setVoiceText('');
    setTimeout(() => setVoiceFeedback(null), 5000);
  };

  const handleSimulateVoice = (phrase: string) => {
    setIsListening(true);
    setVoiceText(phrase);
    setTimeout(() => {
      setIsListening(false);
      const res = executeVoiceApplianceControl(phrase);
      setVoiceFeedback({ message: res.message, success: res.success });
      setVoiceText('');
      setTimeout(() => setVoiceFeedback(null), 5000);
    }, 800);
  };

  const handleAddSimpleAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    addApplianceSimple(newAppName, newAppType, activeUnit?.id);
    setNewAppName('');
    setShowSimpleAddModal(false);
    alert(`تم إضافة الجهاز (${newAppName}) بضغط واحدة بدون تعقيدات!`);
  };

  // Requirement 4: High vs Low energy & water consumption tier calculation
  let energyBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let energyLabel = 'استهلاك منخفض ومثالي للطاقة والماء';
  let energyDesc = 'الأجهزة تعمل بكفاءة عالية ضمن الحدود الاقتصادية';

  if (activeUnit?.energyTier === 'high' || totalActiveWatts > 3500) {
    energyBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
    energyLabel = 'استهلاك مرتفع جداً للطاقة والماء ⚠️';
    energyDesc = 'ينصح بتفعيل جدول AI لتقليل التشغيل في أوقات الذروة';
  } else if (activeUnit?.energyTier === 'normal' || totalActiveWatts > 1500) {
    energyBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
    energyLabel = 'استهلاك متوسط ومتوازن للطاقة';
    energyDesc = 'الأجهزة تعمل ضمن المدى المعتاد للشقة';
  }

  const handleOpenScheduleModal = (app: SmartAppliance) => {
    setEditingScheduleAppliance(app);
    setOnTime(app.scheduledOnTime || '07:00');
    setOffTime(app.scheduledOffTime || '23:00');
    setAutoEnabled(app.autoScheduleEnabled);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheduleAppliance) return;

    updateApplianceSchedule(
      editingScheduleAppliance.id,
      autoEnabled,
      onTime || undefined,
      offTime || undefined
    );

    setEditingScheduleAppliance(null);
  };

  const getApplianceIcon = (type: string) => {
    switch (type) {
      case 'ac':
        return <Wind className="w-5 h-5 text-indigo-600" />;
      case 'water_heater':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'tv':
        return <Tv className="w-5 h-5 text-indigo-600" />;
      default:
        return <Zap className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            الأجهزة الذكية والتحكم عبر المساعد الصوتي والـ AI
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            مخاطبة المساعد الذكي بالصوت لتشغيل وإطفاء الأجهزة، إضافة أجهزة جديدة بأسلوب مبسط غير معقد، ومتابعة الاستهلاك الأوتوماتيكي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSimpleAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-2xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            إضافة جهاز كهربائي (مبسط)
          </button>

          {/* Unit Selector dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-600 font-bold">الشقة:</span>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="bg-white text-slate-900 text-xs px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none font-bold cursor-pointer shadow-sm"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  شقة {u.unitNumber} ({buildings.find(b => b.id === u.buildingId)?.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 🎤 Gemini AI Voice Assistant Command Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <Sparkles className="w-6 h-6 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                مساعد Gemini الصوتي للأجهزة الكهربائية 🎙️
              </h3>
              <p className="text-xs text-indigo-200 font-medium">
                تحدث مع المساعد الصوتي بلهجة طبيعية لتشغيل أو إطفاء التكييف، السخان، الأنوار، أو النوافير!
              </p>
            </div>
          </div>
          <span className="bg-white/10 text-amber-200 border border-amber-300/30 text-[11px] font-bold px-3 py-1 rounded-full hidden sm:inline-block">
            Gemini Voice Command Engine Active
          </span>
        </div>

        <form onSubmit={handleVoiceSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="مثلاً: شغل تكييف الصالة، أطفئ جميع الأجهزة، شغل السخان..."
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-200 rounded-2xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {isListening && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                جاري الاستماع...
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4 text-slate-900" />
            تنفيذ الأمر
          </button>
        </form>

        {/* Quick Voice Command Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-indigo-200 text-[11px] font-bold">أوامر سريعة بنقرة:</span>
          <button
            onClick={() => handleSimulateVoice('شغل المكيف')}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1 rounded-full border border-white/15 text-[11px] cursor-pointer"
          >
            🗣️ "شغّل المكيف"
          </button>
          <button
            onClick={() => handleSimulateVoice('طفي كل الأجهزة')}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1 rounded-full border border-white/15 text-[11px] cursor-pointer"
          >
            🗣️ "أطفئ جميع الأجهزة"
          </button>
          <button
            onClick={() => handleSimulateVoice('شغل سخان المياه الذكي')}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1 rounded-full border border-white/15 text-[11px] cursor-pointer"
          >
            🗣️ "شغل السخان"
          </button>
        </div>

        {/* Voice Feedback Popup */}
        {voiceFeedback && (
          <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-in fade-in ${
            voiceFeedback.success
              ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
              : 'bg-rose-500/20 border-rose-400/50 text-rose-200'
          }`}>
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>{voiceFeedback.message}</span>
          </div>
        )}
      </div>

      {activeUnit ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Summary Sidebar */}
          <div className="space-y-4">
            
            {/* Unit Details Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-slate-900">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">شقة {activeUnit.unitNumber}</h3>
                  <span className="text-xs text-slate-500 font-medium">{activeBuilding?.name}</span>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200">
                  الطابق {activeUnit.floor}
                </span>
              </div>

              {/* Requirement 4: High vs Low Energy Consumption Tag */}
              <div className={`p-4 rounded-2xl border mb-4 ${energyBadgeClass}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {activeUnit.energyTier === 'high' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {energyLabel}
                </div>
                <p className="text-xs mt-1 text-slate-600 font-medium opacity-90">{energyDesc}</p>
              </div>

              {/* Live Consumption Statistics */}
              <div className="space-y-3">
                <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-amber-900 font-bold">الطاقة اللحظية النشطة:</span>
                  </div>
                  <span className="text-sm font-extrabold text-amber-900">{totalActiveWatts} واط</span>
                </div>

                <div className="bg-cyan-50/80 p-3 rounded-2xl border border-cyan-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-cyan-600" />
                    <span className="text-xs text-cyan-900 font-bold">تدفق الماء اللحظي:</span>
                  </div>
                  <span className="text-sm font-extrabold text-cyan-900">{totalActiveWaterLitersPerMin} لتر/دقيقة</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">إجمالي الكهرباء الشهري:</span>
                  <span className="text-xs font-bold text-slate-900">{activeUnit.monthlyElectricityKWh} ك.و.س</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">إجمالي استهلاك الماء الشهري:</span>
                  <span className="text-xs font-bold text-slate-900">{activeUnit.monthlyWaterLiters.toLocaleString()} لتر</span>
                </div>
              </div>

              {/* Occupant Info */}
              {activeUnit.tenant && (
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
                  <span className="block text-slate-400 font-bold text-[11px]">الساكن الحالي:</span>
                  <span className="font-bold text-slate-900 text-sm block mt-0.5">{activeUnit.tenant.tenantName}</span>
                  <span className="text-[11px] text-slate-500 block mt-1 font-medium">
                    عقد الإيجار: {activeUnit.tenant.startDate} إلى {activeUnit.tenant.endDate}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Helper Note */}
            <div className="bg-white border border-slate-200 p-4 rounded-3xl text-xs text-slate-600 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Info className="w-4 h-4 text-indigo-600" />
                مميزات التحكم الذكي عن بعد
              </div>
              <p className="leading-relaxed font-medium">
                تتيح لك المنظومة التحكم في تشغيل وإغلاق كل جهاز عن بعد عبر شبكة الواي فاي أو البلوتوث، إضافة إلى جدولة التشغيل التلقائي عبر الذكاء الاصطناعي بدقة متناهية.
              </p>
            </div>

          </div>

          {/* Right Main Grid: Per-Appliance Consumption & Controls */}
          <div className="lg:col-span-2 space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                الأجهزة الذكية الموصلة بالشقة ({activeUnitAppliances.length})
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                {activeUnitAppliances.filter(a => a.isOn).length} جهاز قيد التشغيل حالياً
              </span>
            </div>

            {activeUnitAppliances.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeUnitAppliances.map((appliance) => (
                  <div
                    key={appliance.id}
                    className={`border rounded-3xl p-5 transition-all shadow-sm flex flex-col justify-between ${
                      appliance.isOn
                        ? 'bg-white border-indigo-300 ring-2 ring-indigo-500/10'
                        : 'bg-slate-50/70 border-slate-200 opacity-80'
                    }`}
                  >
                    <div>
                      {/* Device Header & Remote Connectivity Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-2.5 rounded-2xl ${
                              appliance.isOn
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'bg-slate-200/80 text-slate-400'
                            }`}
                          >
                            {getApplianceIcon(appliance.type)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{appliance.name}</h4>
                            
                            {/* Connection Type Indicator */}
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 font-medium">
                              {appliance.connection === 'wifi' || appliance.connection === 'hybrid' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                  <Wifi className="w-3 h-3 text-emerald-600" /> Wi-Fi 📶
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-indigo-700 font-bold">
                                  <Bluetooth className="w-3 h-3 text-indigo-600" /> Bluetooth 📡
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Remote ON/OFF Toggle Switch */}
                        <button
                          onClick={() => toggleAppliance(appliance.id)}
                          className={`p-3 rounded-full transition-all cursor-pointer shadow-md ${
                            appliance.isOn
                              ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-4 ring-indigo-600/20'
                              : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-700'
                          }`}
                          title={appliance.isOn ? 'إيقاف التشغيل عن بعد' : 'تشغيل الجهاز عن بعد'}
                        >
                          <Power className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Per-Appliance Consumption Metrics */}
                      <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                        <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200/80">
                          <span className="text-[10px] text-amber-800 block font-bold">استهلاك الكهرباء</span>
                          <span className="font-extrabold text-amber-900 text-sm">
                            {appliance.isOn ? appliance.powerWatts : 0} <span className="text-[10px]">واط</span>
                          </span>
                        </div>

                        <div className="bg-cyan-50/80 p-2.5 rounded-2xl border border-cyan-200/80">
                          <span className="text-[10px] text-cyan-800 block font-bold">استهلاك الماء</span>
                          <span className="font-extrabold text-cyan-900 text-sm">
                            {appliance.isOn ? appliance.waterLitersPerMin : 0} <span className="text-[10px]">لتر/د</span>
                          </span>
                        </div>
                      </div>

                      {/* AI & Automation Schedule Status */}
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-[11px] font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            الجدولة الأوتوماتيكية:
                          </span>
                          {appliance.autoScheduleEnabled ? (
                            <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                              {appliance.scheduledOnTime || '07:00'} ➔ {appliance.scheduledOffTime || '23:00'}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic font-medium">غير جدولة</span>
                          )}
                        </div>

                        {appliance.aiNotes && (
                          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                            {appliance.aiNotes}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Bottom Action Controls */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs">
                      <button
                        onClick={() => handleOpenScheduleModal(appliance)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 py-2.5 rounded-xl border border-slate-200 transition-colors font-bold text-center flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        ضبط مؤقت AI
                      </button>

                      <button
                        onClick={() => toggleAiAutomation(appliance.id)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          appliance.aiAutomationActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800'
                        }`}
                        title="تفعيل تحسين الطاقة الأوتوماتيكي بذكاء AI"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 shadow-sm">
                <p className="font-bold text-slate-700">لا توجد أجهزة كهربائية مضافة لهذه الشقة بعد.</p>
                <p className="text-xs text-slate-400 mt-1">يمكنك إضافة أجهزة جديدة من تبويب "المباني والشقق".</p>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 text-center text-slate-500 rounded-3xl shadow-sm font-medium">
          يرجى اختيار شقة لمشاهدة التفاصيل والاستهلاك.
        </div>
      )}

      {/* Edit Automated Timer Schedule Modal */}
      {editingScheduleAppliance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">جدولة تشغيل أوتوماتيكية للـ AI</h3>
                  <p className="text-xs text-slate-500 font-medium">{editingScheduleAppliance.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingScheduleAppliance(null)}
                className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 mt-4 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-800">تفعيل الجدولة الأوتوماتيكية</span>
                <input
                  type="checkbox"
                  checked={autoEnabled}
                  onChange={(e) => setAutoEnabled(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {autoEnabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">وقت التشغيل التلقائي</label>
                    <input
                      type="time"
                      value={onTime}
                      onChange={(e) => setOnTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">وقت الإغلاق التلقائي</label>
                    <input
                      type="time"
                      value={offTime}
                      onChange={(e) => setOffTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                🤖 يعمل النظام بذكاء وبدون أي تدخل بشري لتشغيل وإيقاف هذا الجهاز عند الأوقات المحددة عبر شبكة Wi-Fi أو البلوتوث.
              </p>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingScheduleAppliance(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  حفظ وتطبيق الجدولة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simplified Appliance Addition Modal (تبسيط إضافة الأجهزة لتصبح أقل تعقيداً) */}
      {showSimpleAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">إضافة جهاز كهربائي ذكي (طريقة مبسطة)</h3>
                  <p className="text-xs text-slate-500 font-medium">إدخال الاسم والنوع بنقرة واحدة بدون تعقيدات هندسية</p>
                </div>
              </div>
              <button
                onClick={() => setShowSimpleAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSimpleAppliance} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الجهاز:</label>
                <input
                  type="text"
                  placeholder="مثلاً: مكيف المطبخ، شاشة الصالة، سخان الماستر..."
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نوع الجهاز الكهربائي:</label>
                <select
                  value={newAppType}
                  onChange={(e: any) => setNewAppType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:outline-none"
                >
                  <option value="ac">❄️ مكيف هواء انفرتر ذكي</option>
                  <option value="water_heater">🔥 سخان مياه ذكي</option>
                  <option value="tv">📺 شاشة تلفزيون سمارت</option>
                  <option value="light">💡 إضاءة ذكية (Smart Light)</option>
                  <option value="pump">💧 مضخة مياه / نافورة</option>
                </select>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-[11px] text-emerald-800 font-medium leading-relaxed">
                ⚡ يقوم النظام تلقائياً بضبط عناوين IP والبروتوكول واستهلاك الواط افتراضياً لمنع أي تعقيد خطوة بخطوة.
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSimpleAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  إضافة الجهاز فوراً ⚡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
