import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  Sparkles, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Plus, 
  Key, 
  ShieldCheck, 
  Zap,
  Car,
  Dumbbell,
  TreePine,
  Activity
} from 'lucide-react';
import { MaintenanceTicket, FacilityBooking } from '../types';

export const MaintenancePredictiveView: React.FC = () => {
  const { 
    predictiveDiagnostics, 
    runPredictiveCheck, 
    appliances, 
    maintenanceTickets, 
    addMaintenanceTicket, 
    updateTicketStatus,
    facilityBookings,
    addFacilityBooking,
    units,
    buildings,
    activeTenantUnitId,
    userRole
  } = useApp();

  // Maintenance Form state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general'>('hvac');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [ticketDesc, setTicketDesc] = useState('');

  // Facility Booking state
  const [bookingFacility, setBookingFacility] = useState('شاحن السيارات الكهربائية السريع (EV Charger #1)');
  const [bookingDate, setBookingDate] = useState('2026-08-04');
  const [bookingSlot, setBookingSlot] = useState('08:00 AM - 10:00 AM');

  const currentUnit = units.find(u => u.id === activeTenantUnitId) || units[0];
  const currentBuilding = buildings.find(b => b.id === currentUnit.buildingId) || buildings[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle) return;

    addMaintenanceTicket({
      unitId: currentUnit.id,
      unitNumber: currentUnit.unitNumber,
      buildingName: currentBuilding.name,
      tenantName: currentUnit.tenant?.tenantName || 'ساكن الشقة',
      title: ticketTitle,
      category: ticketCategory,
      priority: ticketPriority,
      description: ticketDesc || 'بلاغ صيانة مقدم عبر النظام الذكي',
    });

    setTicketTitle('');
    setTicketDesc('');
    setShowNewTicketModal(false);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    addFacilityBooking({
      facilityName: bookingFacility,
      buildingName: currentBuilding.name,
      unitNumber: currentUnit.unitNumber,
      tenantName: currentUnit.tenant?.tenantName || 'ساكن الشقة',
      date: bookingDate,
      timeSlot: bookingSlot,
    });
    alert('تم حجز المرفق بنجاح وجدولة الطاقة أوتوماتيكياً!');
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Gemini Predictive Maintenance & Community Hub
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-600" />
            التنبؤ بالأعطال بالذكاء الاصطناعي وبلاغات الصيانة وحجز المرافق
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            تنبؤ مبكر بالأعطال قبل خروج التكييف أو المضخات عن الخدمة، تتبع الفنيين ومنح رموز الدخول للمبنى، وحجز المرافق العامة.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          تقديم بلاغ صيانة جديد
        </button>
      </div>

      {/* AI Predictive Anomaly Diagnostic Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              منظومة التنبؤ بالأعطال والصيانة الوقائية الذكية (AI Predictive Health)
            </h3>
            <p className="text-xs text-slate-500 font-medium">تحليل نمط استهلاك الطاقة واهتزاز الأجهزة للتنبؤ بالأعطال قبل حدوثها بأسابيع</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {appliances.slice(0, 3).map((app) => {
            const diag = predictiveDiagnostics.find(p => p.applianceId === app.id);
            return (
              <div key={app.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{app.name}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    diag?.severity === 'critical'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : diag?.severity === 'warning'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {diag?.severity === 'critical' ? 'خطر عطل وشيك ⚠️' : diag?.severity === 'warning' ? 'يحتاج صيانة 🛠️' : 'حالة ممتازة ✅'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>مؤشر السلامة (Health Score):</span>
                    <span className="font-bold text-slate-900">{diag?.healthScore || 90}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        (diag?.healthScore || 90) < 60 ? 'bg-rose-500' : (diag?.healthScore || 90) < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${diag?.healthScore || 90}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs space-y-1 font-medium">
                  <p className="text-slate-500">التشخيص: <span className="text-slate-800 font-bold">{diag?.anomalyDetected || 'كفاءة مستقرة'}</span></p>
                  <p className="text-slate-500">التوصية: <span className="text-indigo-600 font-bold">{diag?.recommendation || 'استمرار الاستخدام الطبيعي'}</span></p>
                  {diag?.estimatedDaysToFailure && (
                    <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-100">
                      الوقت المتوقع حتى الصيانة: <span className="font-bold text-slate-900 font-mono">{diag.estimatedDaysToFailure} يوماً</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => runPredictiveCheck(app.id)}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-2 rounded-xl border border-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  إجراء تشخيص أوتوماتيكي الآن
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maintenance Ticketing & Smart Lock Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Maintenance Tickets List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              بلاغات الصيانة وتتبع الفنيين ({maintenanceTickets.length})
            </h3>
          </div>

          <div className="space-y-3">
            {maintenanceTickets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{t.title}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    t.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : t.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {t.status === 'completed' ? 'تمت الصيانة ✅' : t.status === 'in_progress' ? 'الفني بالموقع 🛠️' : 'مفتوح بانتظار الفني ⏳'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">{t.description}</p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-slate-200 pt-2 font-medium">
                  <span>الشقة: <b>{t.unitNumber}</b> ({t.tenantName})</span>
                  <span>التاريخ: <b>{t.createdAt}</b></span>
                </div>

                {t.smartLockCodeGranted && (
                  <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-indigo-900">
                      <Key className="w-4 h-4 text-indigo-600" />
                      رمز قفل الباب المؤقت للفني:
                    </span>
                    <span className="font-mono font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                      {t.smartLockCodeGranted}
                    </span>
                  </div>
                )}

                {userRole !== 'tenant' && t.status !== 'completed' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => updateTicketStatus(t.id, 'in_progress', 'مهندس الفني المعتمد')}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      إسناد فني 🛠️
                    </button>
                    <button
                      onClick={() => updateTicketStatus(t.id, 'completed')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      إغلاق البلاغ ✅
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Community Facility Booking */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              حجز المرافق المشتركة والخدمات الذكية
            </h3>
            <p className="text-xs text-slate-500 font-medium">حجز شواحن EV، النادي، وتنسيق استهلاك الكهرباء بين جيران المبنى</p>
          </div>

          <form onSubmit={handleCreateBooking} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">المرفق المطلوب:</label>
              <select
                value={bookingFacility}
                onChange={(e) => setBookingFacility(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="شاحن السيارات الكهربائية السريع (EV Charger #1)">⚡ شاحن السيارات الكهربائية السريع (EV Charger #1)</option>
                <option value="النادي الرياضي والصالة المغلقة">🏋️ النادي الرياضي والصالة المغلقة</option>
                <option value="جلسة حديقة المبنى والسطح">🌴 جلسة حديقة المبنى والسطح</option>
                <option value="قاعة الاجتماعات والضيافة">🤝 قاعة الاجتماعات والضيافة</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">التاريخ:</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الفترة الزمنية:</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                >
                  <option value="01:00 AM - 05:00 AM">01:00 AM - 05:00 AM (توفير 35%)</option>
                  <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  <option value="08:00 PM - 10:00 PM">08:00 PM - 10:00 PM</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
            >
              تأكيد حجز المرفق ومزامنة الطاقة ⚡
            </button>
          </form>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 block">الحجوزات الحالية بالمبنى:</span>
            {facilityBookings.map((fb) => (
              <div key={fb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{fb.facilityName}</h4>
                  <p className="text-[11px] text-slate-500">شقة {fb.unitNumber} ({fb.tenantName}) • {fb.date}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                  {fb.timeSlot}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl text-right animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              تقديم طلب صيانة جديدة للشقة {currentUnit.unitNumber}
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">عنوان المشكلة:</label>
                <input
                  type="text"
                  placeholder="مثلاً: فحص تكييف الغرفة أو تسريب بالماء..."
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">تصنيف المشكلة:</label>
                  <select
                    value={ticketCategory}
                    onChange={(e: any) => setTicketCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="hvac">تكييف وتهوية (HVAC)</option>
                    <option value="plumbing">سباكة ومياه</option>
                    <option value="electrical">كهرباء وأجهزة</option>
                    <option value="appliance">أجهزة منزلية ذكية</option>
                    <option value="general">عام ومبنى</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الأهمية:</label>
                  <select
                    value={ticketPriority}
                    onChange={(e: any) => setTicketPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                    <option value="urgent">طارئة جداً</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">تفاصيل ووصف الطلب:</label>
                <textarea
                  rows={3}
                  placeholder="اشرح المشكلة بالتفصيل..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                >
                  إرسال الطلب وإصدار رمز الدخول الذكي ➔
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
