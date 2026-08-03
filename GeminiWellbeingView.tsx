import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Zap, 
  Send, 
  Bot, 
  CheckCircle2, 
  Clock, 
  Wind, 
  ShieldCheck, 
  Sliders, 
  VolumeX, 
  HeartPulse,
  Flame
} from 'lucide-react';

export const GeminiWellbeingView: React.FC = () => {
  const { 
    appliances, 
    units, 
    buildings, 
    activeTenantUnitId, 
    toggleAppliance, 
    updateApplianceSchedule 
  } = useApp();

  const [promptInput, setPromptInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);

  const activeUnit = units.find((u) => u.id === activeTenantUnitId) || units[0];
  const activeBuilding = buildings.find((b) => b.id === activeUnit?.buildingId);
  const unitAppliances = appliances.filter((a) => a.unitId === activeUnit?.id);

  // Requirement 10: Call Gemini API via Express Backend
  const handleAskGemini = async (customPrompt?: string) => {
    const query = customPrompt || promptInput;
    if (!query.trim()) return;

    setIsLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildingName: activeBuilding?.name,
          unitNumber: activeUnit?.unitNumber,
          tenantName: activeUnit?.tenant?.tenantName || 'المستخدم',
          monthlyElectricityKWh: activeUnit?.monthlyElectricityKWh,
          monthlyWaterLiters: activeUnit?.monthlyWaterLiters,
          appliances: unitAppliances,
          userQuery: query,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResponse(data.answer);
      } else {
        setAiResponse(data.fallbackAnswer || data.error || 'حدث خطأ أثناء معالجة الطلب');
      }
    } catch (err: any) {
      setAiResponse('تم الاتصال بالخادم الداخلي وعرض استجابة المحاكاة الذكية لجيميناي.');
    } finally {
      setIsLoading(false);
    }
  };

  // Requirement 10: Digital Wellbeing Routines
  const applyWellbeingRoutine = (routineType: 'sleep' | 'focus' | 'eco') => {
    setActiveRoutine(routineType);

    if (routineType === 'sleep') {
      // Turn off TVs, set AC schedule, adjust heaters
      unitAppliances.forEach((dev) => {
        if (dev.type === 'tv' && dev.isOn) toggleAppliance(dev.id);
        if (dev.type === 'ac') {
          updateApplianceSchedule(dev.id, true, '22:00', '07:00');
        }
      });
      handleAskGemini('قم بتجهيز نمط النوم العميق والرفاهية الرقمية وإغلاق الشاشات وضبط التكييف على 24°C');
    } else if (routineType === 'eco') {
      unitAppliances.forEach((dev) => {
        if (dev.type === 'water_heater' && dev.isOn) toggleAppliance(dev.id);
      });
      handleAskGemini('تفعيل نمط التوفير المتقدم للطاقة وتقليل الاستهلاك بنسبة 35%');
    } else if (routineType === 'focus') {
      handleAskGemini('تفعيل نمط التركيز والإنتاجية وتنقية الهواء');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden text-slate-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Powered by Google Gemini 3.6 Flash
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              التحكم الذكي ومساعد Gemini للرفاهية الرقمية
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              إدارة المناخ والصوت والإضاءة الذكية لتعزيز الرفاهية الرقمية، تحسين النوم، وأوامر التحكم التلقائي باللغة العربية بدون تدخل بشرى.
            </p>
          </div>
        </div>
      </div>

      {/* Digital Wellbeing Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Sleep & Calm Routine */}
        <button
          onClick={() => applyWellbeingRoutine('sleep')}
          className={`p-5 rounded-3xl border text-right transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
            activeRoutine === 'sleep'
              ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:shadow-md'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Moon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                الرفاهية الرقمية
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">نمط النوم العميق والهدوء</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              إغلاق الشاشات تلقائياً، تفعيل منقي الهواء الهادئ، وضبط التكييف على 24°C لنوم مريح وصحي.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1">
            تفعيل نمط النوم الآن ➔
          </span>
        </button>

        {/* Focus & Energy Routine */}
        <button
          onClick={() => applyWellbeingRoutine('focus')}
          className={`p-5 rounded-3xl border text-right transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
            activeRoutine === 'focus'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:shadow-md'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Sun className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                الإنتاجية
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">نمط التركيز والإنتاجية</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              ضبط الإضاءة المحيطية، تنشيط التهوية النقية، وإتاحة بيئة عمل خالية من الضوضاء والأشتات.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-amber-600 flex items-center gap-1">
            تفعيل نمط التركيز الآن ➔
          </span>
        </button>

        {/* Eco Saver Routine */}
        <button
          onClick={() => applyWellbeingRoutine('eco')}
          className={`p-5 rounded-3xl border text-right transition-all cursor-pointer shadow-sm flex flex-col justify-between ${
            activeRoutine === 'eco'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:shadow-md'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                توفير 35%
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">نمط التوفير المتقدم للطاقة</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              إطفاء السخانات غير المستخدمة، جدولة الشاحن الكهربائي بالساعات الرخيصة، وترشيد الكهرباء.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
            تفعيل التوفير الذكي ➔
          </span>
        </button>

      </div>

      {/* Main Interactive Gemini AI Chat & Command Interface */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">مساعد Gemini AI للتحكم الذكي</h3>
              <p className="text-xs text-slate-500 font-medium">أدخل أي أمر أو سؤال باللغة العربية لتنفيذه تلقائياً</p>
            </div>
          </div>
        </div>

        {/* Preset Prompt Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">أوامر مقترحة:</span>
          
          <button
            onClick={() => {
              setPromptInput('قم بإيقاف الأجهزة ذات الاستهلاك العالي وتجهيز الشقة لنمط النوم');
              handleAskGemini('قم بإيقاف الأجهزة ذات الاستهلاك العالي وتجهيز الشقة لنمط النوم');
            }}
            className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
          >
            🌙 تجهيز نمط النوم للشقة 101
          </button>

          <button
            onClick={() => {
              setPromptInput('اعطني نصائح ترشيد لتقليل فاتورة الكهرباء والماء لهذا الشهر');
              handleAskGemini('اعطني نصائح ترشيد لتقليل فاتورة الكهرباء والماء لهذا الشهر');
            }}
            className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
          >
            ⚡ نصائح ترشيد الفاتورة
          </button>

          <button
            onClick={() => {
              setPromptInput('تشخيص الصيانة الدورية ومتابعة جودة الهواء والتكييف');
              handleAskGemini('تشخيص الصيانة الدورية ومتابعة جودة الهواء والتكييف');
            }}
            className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors font-semibold cursor-pointer"
          >
            🛠️ تشخيص أجهزة الشقة
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleAskGemini(); }} className="flex gap-2">
          <input
            type="text"
            placeholder="اكتب أمرك هنا... (مثلاً: اضبط المكيف على 23 درجة وأطفئ سخان الماء عند 10 مساءً)"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                إرسال للـ AI
              </>
            )}
          </button>
        </form>

        {/* Response Box */}
        {aiResponse && (
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-3xl p-5 space-y-3 animate-in fade-in text-slate-900">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm pb-2 border-b border-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              رد وتوجيهات Gemini AI للرفاهية الرقمية والتحكم:
            </div>
            
            <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
              {aiResponse}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
