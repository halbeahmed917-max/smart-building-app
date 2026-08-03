import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  Siren, 
  Flame, 
  Wind, 
  Droplets, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  BellRing,
  PhoneCall,
  Lock,
  Unlock,
  Building2,
  Volume2
} from 'lucide-react';
import { EmergencyType } from '../types';

export const EmergencySOSView: React.FC = () => {
  const { 
    emergencyAlerts, 
    triggerEmergency, 
    resolveEmergency, 
    activeEmergencyCount,
    userRole,
    units
  } = useApp();

  const [sosTriggered, setSosTriggered] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<EmergencyType>('smoke_fire');

  const handleManualSOS = () => {
    setSosTriggered(true);
    triggerEmergency('sos_manual', 'زر الاستغاثة الرئيسي (SOS)');
    setTimeout(() => {
      setSosTriggered(false);
    }, 4000);
  };

  const handleSimulateSensor = (type: EmergencyType) => {
    triggerEmergency(type);
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-1 rounded-full font-bold mb-2">
              <Siren className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              نظام الطوارئ والسلامة المدمج بالحساسات الذكية
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              مركز الاستغاثة وإدارة طوارئ المباني والوحدات
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              ربط مباشر بحساسات الدخان، الغاز، تسرب المياه، السطو، الزلازل وسقوط كبار السن مع إجراءات استجابة أوتوماتيكية سريعة.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium block">البلاغات النشطة حالياً</span>
              <span className={`text-lg font-extrabold ${activeEmergencyCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {activeEmergencyCount} حالة طوارئ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary SOS Panic Button Section */}
      <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-3xl p-8 shadow-xl text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/30">
            <BellRing className="w-4 h-4 animate-bounce" />
            زر الاستغاثة الفوري للساكن والمالك
          </div>

          <h3 className="text-2xl font-extrabold">
            اضغط هنا لإطلاق نداء الاستغاثة فوراً (SOS)
          </h3>
          <p className="text-xs text-rose-100 font-medium leading-relaxed">
            عند الضغط سيتم إشعار الدفاع المدني، الشرطة، المالك، وفتح الأبواب الذكية أوتوماتيكياً وتفعيل صافرات الإنذار.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleManualSOS}
              className={`w-36 h-36 rounded-full border-8 border-white/40 shadow-2xl flex flex-col items-center justify-center font-extrabold text-xl transition-all transform active:scale-95 cursor-pointer ${
                sosTriggered
                  ? 'bg-amber-400 text-slate-950 animate-ping ring-8 ring-amber-300'
                  : 'bg-white text-rose-600 hover:bg-rose-50 hover:scale-105'
              }`}
            >
              <Siren className="w-10 h-10 mb-1 animate-pulse" />
              <span>SOS</span>
              <span className="text-[10px] text-slate-600 font-bold">طوارئ عاجلة</span>
            </button>
          </div>

          {sosTriggered && (
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl border border-emerald-500/40 text-xs font-bold animate-in fade-in flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4 animate-spin" />
              تم إرسال إشارة الطوارئ وتفعيل كافة إجراءات السلامة بالداتا بيز أوتوماتيكياً!
            </div>
          )}
        </div>
      </div>

      {/* Integrated Multi-Sensor Simulation Matrix */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              مصفوفة الحساسات المدمجة بالمبنى (المحاكي المباشر)
            </h3>
            <p className="text-xs text-slate-500 font-medium">اختبار المحاكاة الأوتوماتيكية لكل حساس وتأثيرها المباشر على الأجهزة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Fire / Smoke Sensor */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:border-rose-300 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                حساس الدخان والحريق
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">حساس الحريق (Smoke Sensor)</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                يقوم بقطع صمام الغاز، فتح أقفال الشقق، وتشغيل الشفاطات وإرسال بلاغ للدفاع المدني.
              </p>
            </div>
            <button
              onClick={() => handleSimulateSensor('smoke_fire')}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              محاكاة رصد دخان وحريق 🔥
            </button>
          </div>

          {/* Gas Leak Sensor */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:border-amber-300 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                <Wind className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                حساس الغاز LPG
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">حساس تسريب الغاز</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                يغلق الصمام الكهرومغناطيسي للغاز ويقطع الكهرباء عن المطبخ لتفادي حدوث شرارة.
              </p>
            </div>
            <button
              onClick={() => handleSimulateSensor('gas_leak')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              محاكاة تسريب غاز ⚠️
            </button>
          </div>

          {/* Water Flood Sensor */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:border-blue-300 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                حساس انغمار المياه
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">حساس الفيضان والماء</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                يغلق محبس الماء الرئيسي للشقة تلقائياً عند غمر الأرضية لمنع تلف الأثاث.
              </p>
            </div>
            <button
              onClick={() => handleSimulateSensor('water_flood')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              محاكاة تسرب ماء 💧
            </button>
          </div>

          {/* Intrusion / Door Sensor */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                حساس الاقتحام والسطو
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">حساس كسر الباب والحركة</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                يلتقط لقطة فورية من الكاميرا، يفعل الكشافات التحذيرية، ويرسل إشعاراً للمالك.
              </p>
            </div>
            <button
              onClick={() => handleSimulateSensor('intrusion')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              محاكاة محاولة اقتحام 🛡️
            </button>
          </div>

          {/* Seismic Vibration Sensor */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:border-purple-300 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                حساس الهزات والزلازل
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">حساس الزلازل والاهتزاز</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                يقوم بإيقاف المصاعد عند اقرب دور وفتحها تلقائياً وتشغيل إضاءة الطوارئ.
              </p>
            </div>
            <button
              onClick={() => handleSimulateSensor('seismic')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              محاكاة هزة أرضية 🌋
            </button>
          </div>

          {/* Fall Detection Sensor */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                حساس سقوط كبار السن
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">رصد السقوط المفاجئ</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                يرصد السقوط أو انقطاع الحركة لفترة طارئة ويطلب الإسعاف تلقائياً.
              </p>
            </div>
            <button
              onClick={() => handleSimulateSensor('fall_detected')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              محاكاة سقوط طارئ 🚑
            </button>
          </div>

        </div>
      </div>

      {/* Real-Time Emergency Activity Log */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
          <Siren className="w-5 h-5 text-rose-600" />
          سجل بلاغات وتنبيهات الطوارئ بالداتا بيز ({emergencyAlerts.length})
        </h3>

        <div className="space-y-3">
          {emergencyAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all ${
                alert.status === 'active'
                  ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${alert.status === 'active' ? 'bg-rose-600 animate-ping' : 'bg-emerald-500'}`}></span>
                  <h4 className="font-bold text-sm text-slate-900">{alert.title}</h4>
                  <span className="text-xs text-slate-500 font-medium font-mono">({alert.timestamp})</span>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status === 'active' ? (
                    <button
                      onClick={() => resolveEmergency(alert.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      إغلاق البلاغ والمعالجة
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                      تم الحسم والمعالجة ✅
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-600 font-medium mb-3">
                الموقع: <span className="font-bold text-slate-900">{alert.locationName}</span> • المبنى: <span className="font-bold text-slate-900">{alert.buildingName}</span>
                {alert.sensorValue && <span className="mr-2 text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-md">{alert.sensorValue}</span>}
              </div>

              {/* Automated Actions matrix executed */}
              <div className="bg-white border border-slate-200 p-3 rounded-xl text-xs space-y-1.5 font-medium">
                <span className="text-slate-500 font-bold block mb-1">الإجراءات التلقائية المنفذة بواسطة النظام:</span>
                {alert.actionsTaken.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-800">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
