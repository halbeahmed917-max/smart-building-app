import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flower2, 
  Droplet, 
  Thermometer, 
  CloudRain, 
  Zap, 
  Clock, 
  Power, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw,
  Sparkles,
  Waves,
  Activity,
  Cpu
} from 'lucide-react';

export const GardenSimulatorView: React.FC = () => {
  const { 
    gardenState, 
    setSoilMoisture, 
    setTemperature, 
    setHumidity, 
    toggleRainSensor, 
    toggleGardenPump, 
    toggleGardenFountain,
    setGardenAutoSchedule,
    resetGardenSimulation 
  } = useApp();

  // Test trigger for 5:00 AM schedule
  const handleTrigger5AMSchedule = () => {
    if (gardenState.isRaining) {
      alert('🌧️ عند الساعة 5:00 صباحاً كشف حساس المطر هطول أمطار على الحديقة، فتم إلغاء الري تماماً لمنع الري الفائض!');
      return;
    }
    setSoilMoisture(25); // Set moisture low to trigger watering at 5:00 AM
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            Wokwi ESP32 IoT Sensor Simulator Engine
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-indigo-600" />
            محاكي الحديقة والري الذكي (Wokwi & Rain Sensors)
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            موصولة بحساس الرطوبة والحرارة، مضخات المياه، ونوافير الحديقة. الري مجدول أوتوماتيكياً عند 05:00، ويعمل حساس المطر Wokwi على إلغاء الري الفائض فوراً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetGardenSimulation}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة تعيين المحاكي
          </button>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Interactive Wokwi Circuit Diagram Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Wokwi Hardware Circuit Visual Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-bold text-slate-900 font-mono">Wokwi ESP32 Diagram Simulator</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">الجدولة التلقائية:</span>
                <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-md font-mono font-bold">
                  {gardenState.scheduledTime} يومياً
                </span>
              </div>
            </div>

            {/* Wokwi Components Schematic Graphic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
              
              {/* DHT22 Temp & Humidity Sensor Component */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center text-center relative group">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 mb-2">
                  <Thermometer className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 mb-1">حساس DHT22</span>
                <span className="text-[11px] text-slate-500 font-medium">حرارة & رطوبة الجو</span>
                <div className="mt-3 text-sm font-extrabold text-amber-900">
                  {gardenState.temperature}°C / {gardenState.humidity}%
                </div>
              </div>

              {/* Soil Moisture Sensor Component */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center text-center relative group">
                <div className={`p-3 rounded-2xl mb-2 ${gardenState.soilMoisture < 35 ? 'bg-rose-50 text-rose-600' : 'bg-cyan-50 text-cyan-600'}`}>
                  <Droplet className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 mb-1">مقياس رطوبة التربة</span>
                <span className="text-[11px] text-slate-500 font-medium">Soil Moisture Probe</span>
                <div className="mt-3 text-sm font-extrabold text-cyan-900">
                  {gardenState.soilMoisture}% (الحد الأدنى 35%)
                </div>
              </div>

              {/* Rain Sensor Component */}
              <div className={`border rounded-2xl p-4 flex flex-col items-center text-center relative transition-all ${
                gardenState.isRaining 
                  ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-500/20' 
                  : 'bg-slate-50 border-slate-200/90 text-slate-600'
              }`}>
                <div className={`p-3 rounded-2xl mb-2 ${gardenState.isRaining ? 'bg-blue-600 text-white animate-bounce' : 'bg-slate-200 text-slate-600'}`}>
                  <CloudRain className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 mb-1">حساس المطر Wokwi</span>
                <span className="text-[11px] text-slate-500 font-medium">Rain Raindrop Sensor</span>
                <div className="mt-3 text-xs font-bold">
                  {gardenState.isRaining ? (
                    <span className="text-blue-700 flex items-center gap-1 font-extrabold">🌧️ أمطار هاطلة!</span>
                  ) : (
                    <span className="text-slate-500">جاف (بدون مطر)</span>
                  )}
                </div>
              </div>

              {/* Pump & Fountain Relays */}
              <div className={`border rounded-2xl p-4 flex flex-col items-center text-center relative transition-all ${
                gardenState.pumpsActive 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                  : 'bg-slate-50 border-slate-200/90 text-slate-600'
              }`}>
                <div className={`p-3 rounded-2xl mb-2 ${gardenState.pumpsActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Waves className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900 mb-1">المضخات والنوافير</span>
                <span className="text-[11px] text-slate-500 font-medium">Dual Channel Relay</span>
                <div className="mt-3 text-xs font-bold">
                  {gardenState.pumpsActive ? (
                    <span className="text-emerald-700 animate-pulse font-extrabold">شغالة وتطخ المياه 💧</span>
                  ) : (
                    <span className="text-slate-500">متوقفة</span>
                  )}
                </div>
              </div>

            </div>

            {/* Live Rain Inhibition Warning Banner */}
            {gardenState.isRaining && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl my-4 text-xs text-blue-900 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">حساس المطر الذكي Wokwi كشف هطول الأمطار!</span>
                    <span className="font-medium">تم إلغاء وإيقاف الري والمضخات أوتوماتيكياً لحماية الحديقة ومنع الري الفائض.</span>
                  </div>
                </div>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                  إلغاء متكرر: {gardenState.rainInhibitedCount} مرات
                </span>
              </div>
            )}

            {/* Animated Garden Fountain Simulation Visualizer */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] text-center">
              {gardenState.pumpsActive ? (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-center gap-3 text-emerald-600">
                    <Waves className="w-8 h-8 animate-bounce" />
                    <Droplet className="w-6 h-6 animate-pulse text-cyan-600" />
                    <Waves className="w-8 h-8 animate-bounce" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-700">
                    نوافير الحديقة ومضخات الري تعمل الآن بحجم تدفق مثالي 💧
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    يتم قياس رطوبة التربة لحظياً ({gardenState.soilMoisture}%). ستتوقف المضخات تلقائياً فور الوصول لدرجة 75%.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-slate-500">
                  <Flower2 className="w-10 h-10 mx-auto opacity-50 text-slate-400" />
                  <p className="text-xs font-medium">المضخات والنوافير متوقفة حالياً بانتظار 05:00 صباحاً أو انخفاض الرطوبة.</p>
                </div>
              )}
            </div>

          </div>

          {/* Log Stream from Wokwi Simulator */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-slate-900">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-indigo-600" />
              سجل أحداث وقراءات محاكي Wokwi والري الذكي
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
              {gardenState.logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between font-medium ${
                    log.type === 'rain'
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : log.type === 'pump'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-semibold">{log.message}</span>
                  <span className="text-[10px] text-slate-500 font-mono dir-ltr">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Sensor Simulation Sliders & Test Triggers */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-5 text-slate-900">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Zap className="w-4 h-4 text-indigo-600" />
              أدوات تحكم محاكي Wokwi للحساسات
            </h3>

            {/* Rain Detector Trigger Button */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                محاكاة هطول الأمطار (حساس المطر):
              </label>
              <button
                onClick={toggleRainSensor}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  gardenState.isRaining
                    ? 'bg-blue-600 text-white shadow-blue-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <CloudRain className="w-4 h-4" />
                {gardenState.isRaining ? 'إيقاف الأمطار بالمحاكي' : 'محاكاة هطول الأمطار 🌧️'}
              </button>
            </div>

            {/* Soil Moisture Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">رطوبة التربة (Soil Moisture):</span>
                <span className="text-cyan-700 font-mono text-sm">{gardenState.soilMoisture}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                value={gardenState.soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                (إذا انخفضت عن 35% يبدأ الري أوتوماتيكياً)
              </span>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">درجة الحرارة (DHT22):</span>
                <span className="text-amber-700 font-mono text-sm">{gardenState.temperature}°C</span>
              </div>
              <input
                type="range"
                min={20}
                max={50}
                value={gardenState.temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Humidity Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">رطوبة الجو (Humidity):</span>
                <span className="text-indigo-700 font-mono text-sm">{gardenState.humidity}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={90}
                value={gardenState.humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* 5:00 AM Automated Schedule Test Trigger */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                اختبار جدول الري الأوتوماتيكي الساعة 05:00:
              </label>
              <button
                onClick={handleTrigger5AMSchedule}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                محاكاة وصول الوقت إلى الساعة 05:00 صباحاً
              </button>
            </div>

            {/* Manual Controls */}
            <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-2">
              <button
                onClick={toggleGardenPump}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  gardenState.pumpsActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                المضخات: {gardenState.pumpsActive ? 'تشغيل' : 'إيقاف'}
              </button>

              <button
                onClick={toggleGardenFountain}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  gardenState.fountainsActive
                    ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                النوافير: {gardenState.fountainsActive ? 'تشغيل' : 'إيقاف'}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
