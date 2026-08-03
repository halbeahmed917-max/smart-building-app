import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Camera, 
  ShieldAlert, 
  Lock, 
  Eye, 
  EyeOff, 
  Activity, 
  Database, 
  Building2, 
  User, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  KeyRound
} from 'lucide-react';
import { CameraFeed } from '../types';

export const CCTVView: React.FC = () => {
  const { 
    cameras, 
    units, 
    userRole, 
    activeTenantUnitId, 
    hasCameraAccess, 
    addCameraLog,
    updateUnitLease,
    reportTheftIncident
  } = useApp();

  const [selectedCameraId, setSelectedCameraId] = useState<string>(cameras[0]?.id || 'cam-b1-entrance');
  const [newEventText, setNewEventText] = useState('');

  const activeCamera = cameras.find((c) => c.id === selectedCameraId) || cameras[0];
  const activeUnit = units.find((u) => u.id === activeTenantUnitId);

  // Check access rights matrix for currently selected camera
  const accessCheck = activeCamera ? hasCameraAccess(activeCamera) : { allowed: false, reason: 'لا توجد كاميرا' };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventText.trim() || !activeCamera) return;

    addCameraLog(activeCamera.id, newEventText);
    setNewEventText('');
  };

  // Toggle tenant lease status to test Requirement 9
  const handleToggleLeaseExpiryTest = () => {
    if (!activeUnit || !activeUnit.tenant) return;
    const isCurrentlyActive = activeUnit.tenant.status === 'active';
    updateUnitLease(
      activeUnit.id,
      activeUnit.tenant.tenantName,
      activeUnit.tenant.tenantEmail,
      activeUnit.tenant.startDate,
      activeUnit.tenant.endDate,
      isCurrentlyActive ? 'expired' : 'active'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold mb-2">
            <Database className="w-3.5 h-3.5" />
            Database Encryption & Lease Privacy Matrix
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            كاميرات المراقبة وقاعدة البيانات وحماية الخصوصية
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            سجلات حركة الكاميرات محفوظة بالداتا بيز. يحق للمالك مشاهدة كافة المباني إلا الشقق المؤجرة حمايةً لخصوصية المستأجر، وتنتهي صلاحية المستأجر تلقائياً بانتهاء العقد.
          </p>
        </div>

        {/* Lease Expiration Simulator Button */}
        {userRole === 'tenant' && activeUnit?.tenant && (
          <button
            onClick={handleToggleLeaseExpiryTest}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
              activeUnit.tenant.status === 'active'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-emerald-600/20'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            {activeUnit.tenant.status === 'active'
              ? 'اختبار: محاكاة انتهاء عقد الإيجار سريعا'
              : 'تجديد عقد الإيجار (تفعيل الصلاحية)'}
          </button>
        )}
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Camera Stream Viewer & Privacy Shield */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeCamera?.locationName}</h3>
                  <span className="text-xs text-slate-500 font-medium">{activeCamera?.buildingName}</span>
                </div>
              </div>

              {accessCheck.allowed ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  بث مباشر مباشر 📡
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  البث محجوب بحماية الداتا بيز 🔒
                </span>
              )}
            </div>

            {/* Video Canvas Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl min-h-[320px] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden text-white">
              
              {accessCheck.allowed ? (
                /* Allowed Stream Visualizer */
                <div className="space-y-4 w-full">
                  <div className="relative w-full h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                    
                    {/* Simulated Camera Overlay Elements */}
                    <div className="absolute top-3 right-3 bg-slate-900/90 px-3 py-1 rounded-md text-[11px] font-mono text-emerald-400 border border-slate-800 flex items-center gap-2 font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      REC 🔴 LIVE • 1080p 60fps
                    </div>

                    <div className="absolute bottom-3 left-3 bg-slate-900/90 px-3 py-1 rounded-md text-[10px] font-mono text-slate-400 border border-slate-800 dir-ltr">
                      {new Date().toISOString().replace('T', ' ').slice(0, 19)}
                    </div>

                    <div className="text-center space-y-2">
                      <Camera className="w-12 h-12 text-slate-500 mx-auto animate-pulse" />
                      <p className="text-xs font-mono text-slate-300">
                        خلاصة الكاميرا المباشرة: {activeCamera?.locationName}
                      </p>
                      <p className="text-[11px] text-emerald-400 font-bold">
                        مزامنة السجلات محفوظة بالداتا بيز أوتوماتيكياً
                      </p>
                    </div>

                  </div>
                </div>
              ) : (
                /* Blocked Privacy Screen */
                <div className="space-y-4 max-w-md my-6 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-8 h-8" />
                  </div>

                  <h4 className="text-lg font-bold text-rose-400">
                    تم تطبيق سياسة حماية الخصوصية بالداتا بيز 🔒
                  </h4>

                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 leading-relaxed text-right font-medium">
                    {accessCheck.reason}
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium">
                    وفقاً لقانون حماية المستأجر، يتم حفظ السجلات مشفرة في قاعدة البيانات ولا يحق للمالك مشاهدة الشقة أثناء فترة عقد المستأجر الساري.
                  </p>

                  {/* Incident Override Trigger Button for Owner or Tenant */}
                  {activeCamera?.unitId && (
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          const res = reportTheftIncident(activeCamera.unitId!);
                          alert(`🚨 ${res.message}`);
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>الإبلاغ عن سرقة / مشكلة طارئة (تفعيل استثناء البث للمالك)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* Database Log Stream */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-slate-900">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                سجل الحركة المربوط بالداتا بيز ({activeCamera?.logs.length || 0})
              </h3>

              {accessCheck.allowed && (
                <form onSubmit={handleAddLog} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="تسجيل رصد جديد بالداتا بيز..."
                    value={newEventText}
                    onChange={(e) => setNewEventText(e.target.value)}
                    className="bg-slate-50 text-xs text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer shadow-sm"
                  >
                    إضافة سجل
                  </button>
                </form>
              )}
            </div>

            {accessCheck.allowed ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
                {activeCamera?.logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-slate-800 font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{log.event}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-500 font-medium italic bg-slate-50 rounded-xl border border-slate-200">
                سجلات الحركة لهذه الكاميرة مشفرة ومحجوبة لدواعي الخصوصية بالداتا بيز
              </div>
            )}
          </div>

        </div>

        {/* Right Column: List of All Cameras in Database */}
        <div className="space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 text-slate-900">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Camera className="w-4 h-4 text-indigo-600" />
              قائمة كاميرات المباني بالشجرة
            </h3>

            <div className="space-y-3">
              {cameras.map((cam) => {
                const isSelected = cam.id === selectedCameraId;
                const check = hasCameraAccess(cam);

                return (
                  <button
                    key={cam.id}
                    onClick={() => setSelectedCameraId(cam.id)}
                    className={`w-full text-right p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-slate-900 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{cam.locationName}</h4>
                      <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{cam.buildingName}</span>
                    </div>

                    <div>
                      {check.allowed ? (
                        <span className="text-emerald-700 text-xs flex items-center gap-1 font-bold">
                          <Eye className="w-3.5 h-3.5 text-emerald-600" /> متاح
                        </span>
                      ) : (
                        <span className="text-rose-700 text-xs flex items-center gap-1 font-bold">
                          <EyeOff className="w-3.5 h-3.5 text-rose-600" /> محجوب
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
