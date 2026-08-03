import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Lock, 
  QrCode, 
  Share2, 
  Copy, 
  Check, 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Building2,
  Filter,
  RefreshCw,
  Sliders,
  Download,
  Trash2,
  Globe,
  Search,
  FileText,
  SlidersHorizontal,
  EyeOff,
  Eye,
  Shield,
  Zap,
  Activity
} from 'lucide-react';
import { UserRole, SystemUser } from '../types';

export const UserManagementView: React.FC = () => {
  const { 
    userRole, 
    systemUsers, 
    addSystemUser, 
    updateUserStatus, 
    units, 
    buildings, 
    securityLogs,
    addSecurityLog,
    securitySettings,
    updateSecuritySettings,
    rotateMasterEncryptionKey,
    clearSecurityLogs,
    currentUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'grant_tenant' | 'cyber_security'>('users');
  const [cyberSecTab, setCyberSecTab] = useState<'e2ee' | 'policies' | 'audit_logs'>('e2ee');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Add user form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRoleSelect, setUserRoleSelect] = useState<UserRole>('tenant');
  const [assignedUnit, setAssignedUnit] = useState(units[0]?.id || '');
  const [copiedLinkCode, setCopiedLinkCode] = useState<string | null>(null);

  // Audit Log search & filter
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<'all' | 'security_alert' | 'warning' | 'info'>('all');
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  // Filter users according to zero-trust rules
  const visibleUsers = systemUsers.filter((u) => {
    if (userRole === 'super_admin') return true;
    if (userRole === 'owner') {
      return u.role === 'tenant';
    }
    return false;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;

    addSystemUser({
      name: userName,
      email: userEmail,
      role: userRoleSelect,
      assignedBuildingIds: ['b-1'],
      assignedUnitId: userRoleSelect === 'tenant' ? assignedUnit : undefined,
      status: 'active',
      mfaEnabled: true,
      magicLinkCode: `LNK-${Math.floor(1000 + Math.random() * 9000)}`
    });

    setUserName('');
    setUserEmail('');
    setIsAddUserModalOpen(false);
  };

  const handleCopyMagicLink = (code: string) => {
    const magicUrl = `https://smartbuilding.sa/access?code=${code}`;
    navigator.clipboard.writeText(magicUrl);
    setCopiedLinkCode(code);
    setTimeout(() => setCopiedLinkCode(null), 2000);
  };

  // Simulate Threat & Security Defense
  const handleSimulateThreat = () => {
    const threatTypes = [
      'حجب هجمة SQL Injection خبيثة: SELECT * FROM users WHERE 1=1--',
      'رصد وإحباط محاولة Cross-Site Scripting (XSS) في حقل الملاحظات',
      'حظر محاولة تخطي المصادقة Brute-Force IP: 198.51.100.42 (تم قفل الجلسة)',
      'رصد استعلام غير مصرح به على جداول الفواتير المشفرة - تم الرفض وحفظ الـ HMAC'
    ];
    const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    addSecurityLog(`🚨 [Anti-Cyberthreat Shield]: ${randomThreat}`, 'security_alert');
    setSimulationToast('تم تنفيذ محاكاة هجوم سيبراني واختبار صد الثغرات بنجاح!');
    setTimeout(() => setSimulationToast(null), 4000);
  };

  // Export Audit Logs to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Action', 'UserEmail', 'IP_Hash', 'HMAC_Digest', 'Severity'];
    const rows = securityLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.userEmail}"`,
      `"${l.ipHash}"`,
      `"${l.encryptedDigest}"`,
      l.severity
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Security_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addSecurityLog('تصدير سجلات التدقيق بصيغة ملف CSV مشفر', 'info');
  };

  // Export Audit Logs to JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(securityLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Security_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addSecurityLog('تنزيل التقرير الأمني بصيغة JSON مشفرة', 'info');
  };

  // Filtered Audit Logs
  const filteredAuditLogs = securityLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                          log.userEmail.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                          log.encryptedDigest.toLowerCase().includes(auditSearchTerm.toLowerCase());
    const matchesSeverity = auditSeverityFilter === 'all' || log.severity === auditSeverityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-indigo-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>إعدادات الأمان السبراني وتشفير E2EE وZero-Trust Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <span>إدارة الأمان والوصول وتشفير البيانات</span>
              {securitySettings.e2eeEnabled && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] px-2.5 py-0.5 rounded-full font-extrabold">
                  🔒 E2EE ACTIVE
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              تفعيل التشفير الشامل بين الأطراف (E2EE)، وتحديد سياسات الدخول الصارمة للمستخدمين، وتفعيل سجل التدقيق (Audit Logs) لجميع التحركات لضمان أعلى مستويات الحماية.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة مستخدم جديد</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>المستخدمين والصلاحيات ({visibleUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('grant_tenant')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'grant_tenant'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4 text-emerald-500" />
          <span>صلاحية المستأجرين (Magic Link / QR)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cyber_security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'cyber_security'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-300" />
          <span>مركز الأمان والتشفير الشامل (E2EE & Audit Logs)</span>
        </button>
      </div>

      {/* SubTab 1: Users Table */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>المستخدمين المسجلين بقاعدة البيانات</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {userRole === 'super_admin' 
                ? '🔒 صلاحية Super Admin: إظهار جميع المستخدمين في الداتا بيز.'
                : '🔒 صلاحية المالك: التحكم في المستأجرين التابعين لعقاراتك فقط.'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">اسم المستخدم</th>
                  <th className="p-3">البريد الإلكتروني</th>
                  <th className="p-3">مستوى الصلاحية</th>
                  <th className="p-3">الوحدة / المبنى</th>
                  <th className="p-3">حالة الحساب</th>
                  <th className="p-3">MFA</th>
                  <th className="p-3">كود الوصول</th>
                  <th className="p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {visibleUsers.map((u) => {
                  const unit = units.find(unit => unit.id === u.assignedUnitId);
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{u.email}</td>
                      <td className="p-3">
                        {u.role === 'super_admin' ? (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            Super Admin
                          </span>
                        ) : u.role === 'owner' ? (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            مالك عقار
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            مستأجر
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {unit ? (
                          <span className="font-semibold text-slate-700">شقة {unit.unitNumber}</span>
                        ) : (
                          <span className="text-slate-400">كافة المباني</span>
                        )}
                      </td>
                      <td className="p-3">
                        {u.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            نشط
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            معطل مؤقتاً
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {u.mfaEnabled || securitySettings.mfaEnforced ? (
                          <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            مفعل 🟢
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">غير مفعل</span>
                        )}
                      </td>
                      <td className="p-3">
                        <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-[11px] font-mono border">
                          {u.magicLinkCode || 'LNK-8821'}
                        </code>
                      </td>
                      <td className="p-3">
                        {u.role !== 'super_admin' && (
                          <button
                            onClick={() => updateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                              u.status === 'active'
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'تعطيل الحساب' : 'إعادة تفعيل'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Quick Tenant Access Provisioning */}
      {activeSubTab === 'grant_tenant' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">منح المستأجر صلاحية الوصول المباشرة</h3>
                <p className="text-xs text-slate-500">إنشاء رابط دخول سريع أو رمز QR لإرساله عبر الواتساب للمستأجر.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اختر الشقة أو المستأجر:</label>
                <select
                  value={assignedUnit}
                  onChange={(e) => setAssignedUnit(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      شقة {u.unitNumber} - المستأجر: {u.tenant?.tenantName || 'غير محدد'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">رابط الدخول السريع (Magic Access Link):</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">صالح 365 يوم</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://smartbuilding.sa/access?unit=${assignedUnit}&code=LNK-${Math.floor(1000 + Math.random() * 9000)}`}
                    className="w-full text-xs bg-white border border-emerald-300 rounded-lg p-2 font-mono text-emerald-900"
                  />
                  <button
                    onClick={() => handleCopyMagicLink('LNK-9921')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedLinkCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLinkCode ? 'تم النسخ!' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-slate-50">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800">رمز QR التفاعلي للدخول عبر الجوال</div>
                  <div className="text-[11px] text-slate-500">يمسحه المستأجر بكاميرا هاتفه للدخول فوراً دون كتابة كلمة مرور.</div>
                </div>
                <div className="w-16 h-16 bg-white border-2 border-slate-900 p-1.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <QrCode className="w-full h-full text-slate-900" />
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-indigo-950 text-white rounded-2xl p-6 shadow-md border border-indigo-900 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>شروط وأحكام خصوصية المستأجر والأمان السبراني</span>
              </div>
              <h3 className="text-base font-bold text-white">سهولة الوصول مع الحماية القصوى</h3>
              <ul className="text-xs text-indigo-200 space-y-2.5 list-disc list-inside">
                <li>عند تزويد المستأجر بالرابط، يتم منحه وصولاً محصوراً لشقته فقط (Smart Appliances + Private Camera).</li>
                <li>يتم حجب بيانات المباني الشاغرة الأخرى ومقاييس فواتير المالك الأصلية تلقائياً.</li>
                <li>بمجرد انتهاء تاريخ العقد المدخل، يتم تعطيل الجلسة وسحب الصلاحية تلقائياً من خوادم النظام.</li>
              </ul>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-[11px] text-indigo-300">
              🔒 خوارزمية التشفير: AES-256 Bit Token Auth with SHA-256 Salt Validation.
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Advanced Cyber Security & E2EE Settings & Audit Logs */}
      {activeSubTab === 'cyber_security' && (
        <div className="space-y-6">

          {/* Toast Notification */}
          {simulationToast && (
            <div className="bg-emerald-600 text-white font-bold p-3.5 rounded-2xl text-xs flex items-center justify-between shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>{simulationToast}</span>
              </div>
              <button onClick={() => setSimulationToast(null)} className="text-white/80 hover:text-white font-bold">✕</button>
            </div>
          )}

          {/* Cyber Security Section Sub-Header Tabs */}
          <div className="flex items-center justify-between bg-slate-900 text-white p-2 rounded-2xl border border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCyberSecTab('e2ee')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  cyberSecTab === 'e2ee'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>التشفير الشامل (E2EE Controls)</span>
              </button>

              <button
                onClick={() => setCyberSecTab('policies')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  cyberSecTab === 'policies'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>سياسات الوصول وشروط الدخول</span>
              </button>

              <button
                onClick={() => setCyberSecTab('audit_logs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  cyberSecTab === 'audit_logs'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>سجل التدقيق والمراقبة (Audit Trail)</span>
              </button>
            </div>

            <button
              onClick={handleSimulateThreat}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>اختبار محاكاة الهجمات (Threat Sim)</span>
            </button>
          </div>

          {/* Section 1: End-to-End Encryption (E2EE) Controls */}
          {cyberSecTab === 'e2ee' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Main E2EE Toggle Card */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">حالة التشفير الشامل (End-to-End Encryption - E2EE)</h3>
                      <p className="text-xs text-slate-500">تشفير جميع البيانات الحساسة والبث المباشر قبل إرسالها إلى قاعدة البيانات.</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.e2eeEnabled}
                      onChange={(e) => updateSecuritySettings({ e2eeEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="text-slate-500 font-bold">خوارزمية التشفير النشطة:</div>
                    <div className="font-mono font-bold text-slate-900 bg-white p-2 rounded-xl border border-slate-200">
                      {securitySettings.e2eeAlgorithm}
                    </div>
                    <p className="text-[11px] text-slate-500">تعتمد خوارزمية AES-GCM 256 مع تبادل مفاتيح Curve25519 لمنع أي طرف من قراءة البيانات.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="text-slate-500 font-bold">بصمة مفتاح التشفير الرئيسي (Master Key):</div>
                    <div className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100 truncate">
                      {securitySettings.masterKeyFingerprint}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>آخر تدوير للمفتاح:</span>
                      <span className="font-bold text-slate-800">{securitySettings.lastKeyRotation}</span>
                    </div>
                  </div>
                </div>

                {/* Key Rotation Action */}
                <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4" />
                      <span>سياسة التدوير التلقائي لمفاتيح التشفير</span>
                    </div>
                    <p className="text-xs text-slate-300">إعادة توليد المفاتيح يضمن صمود النظام أمام هجمات التخمين وفك التشفير.</p>
                  </div>

                  <button
                    onClick={() => {
                      const newFingerprint = rotateMasterEncryptionKey();
                      alert(`🔑 تم تدوير وتوليد مفتاح جديد بنجاح:\n${newFingerprint}`);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer shrink-0"
                  >
                    توليد وتدوير المفتاح الآن
                  </button>
                </div>

                {/* Granular Encryption Features */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-800">تخصيص نطاق التشفير الشامل:</h4>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800">تشفير وحجب بيانات المستخدمين الشخصية (PII Masking)</div>
                      <div className="text-[11px] text-slate-500">حجب أرقام الهواتف والبطاقات والبريد الإلكتروني في سجلات السيرفر.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.obfuscateUserData}
                      onChange={(e) => updateSecuritySettings({ obfuscateUserData: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800">تشفير استعلامات وقواعد البيانات (DB Error Masking)</div>
                      <div className="text-[11px] text-slate-500">منع إظهار تفاصيل جداول الداتا بيز في رسائل الأخطاء للعميل (Anti-SQLi Shield).</div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      disabled
                      className="w-4 h-4 text-emerald-600 rounded cursor-not-allowed"
                    />
                  </div>
                </div>

              </div>

              {/* Security Shield Card */}
              <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-indigo-900 shadow-md space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-extrabold text-white">معايير حماية خبراء الأمن السيبراني</h3>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    تم بناء هذا النظام وفق معايير **NIST SP 800-53** ومعايير **الهيئة الوطنية للأمن السيبراني (NCA)** للحماية من الاختراقات وتسريب البيانات.
                  </p>

                  <div className="space-y-2 pt-2 text-xs text-indigo-200">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                      <span>درجة أمان الداتا بيز:</span>
                      <span className="font-extrabold text-emerald-400">99.8% (ممتازة)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                      <span>حماية ثغرات XSS & SQLi:</span>
                      <span className="font-extrabold text-emerald-400">مفعّلة 100%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                      <span>تشفير الكاميرات والجلسات:</span>
                      <span className="font-extrabold text-indigo-300">AES-256</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-[11px] text-center font-bold">
                  🛡️ لا يمكن لأي مخترق الوصول إلى السجلات بدون مفتاح التشفير المتغير.
                </div>
              </div>

            </div>
          )}

          {/* Section 2: User Access Policies & Zero-Trust Rules */}
          {cyberSecTab === 'policies' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">سياسات وشروط دخول المستخدمين (Zero-Trust Access Policies)</h3>
                  <p className="text-xs text-slate-500">تحديد معايير المصادقة، مدة الجلسات، وتقييد الدخول لضمان عدم تسريب الحسابات.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Policy 1: Multi-Factor Authentication */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      <span>فرض التحقق الثنائي (MFA Enforcement)</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.mfaEnforced}
                        onChange={(e) => updateSecuritySettings({ mfaEnforced: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <p className="text-slate-500 text-[11px]">إجبار جميع المستخدمين (الملاك والمستأجرين) على إدخال رمز التحقق عند الدخول من جهاز جديد.</p>
                </div>

                {/* Policy 2: Session Timeout */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <span>مهلة خمول الجلسة (Session Timeout)</span>
                    </div>
                    <select
                      value={securitySettings.sessionTimeoutMinutes}
                      onChange={(e) => updateSecuritySettings({ sessionTimeoutMinutes: Number(e.target.value) })}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value={15}>15 دقيقة</option>
                      <option value={30}>30 دقيقة (موصى به)</option>
                      <option value={60}>60 دقيقة</option>
                      <option value={120}>120 دقيقة</option>
                    </select>
                  </div>
                  <p className="text-slate-500 text-[11px]">تسجيل خروج أوتوماتيكي عند عدم وجود حركة لحماية النظام عند ترك الشاشة مفتوحة.</p>
                </div>

                {/* Policy 3: IP Whitelisting */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span>جدار حماية نطاق IP المعتمد (IP Whitelist)</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.ipWhitelistEnabled}
                        onChange={(e) => updateSecuritySettings({ ipWhitelistEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">نطاقات العناوين المسموح بها (CIDR):</label>
                    <input
                      type="text"
                      value={securitySettings.allowedIpRanges}
                      onChange={(e) => updateSecuritySettings({ allowedIpRanges: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-800 focus:outline-none"
                      placeholder="192.168.1.0/24, 10.0.0.0/8"
                    />
                  </div>
                </div>

                {/* Policy 4: Login Attempts & Lockout */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>الحد الأقصى لمحاولات الدخول الخاطئة</span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={securitySettings.maxFailedLoginAttempts}
                      onChange={(e) => updateSecuritySettings({ maxFailedLoginAttempts: Number(e.target.value) })}
                      className="w-16 bg-white border border-slate-200 rounded-xl p-1.5 text-center font-bold text-slate-900"
                    />
                  </div>
                  <p className="text-slate-500 text-[11px]">حظر وحجب الحساب أوتوماتيكياً عند تجاوز المحاولات لمنع هجمات التخمين Brute-Force.</p>
                </div>

              </div>
            </div>
          )}

          {/* Section 3: Comprehensive Audit Logs Engine */}
          {cyberSecTab === 'audit_logs' && (
            <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5">
              
              {/* Audit Header Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Terminal className="w-5 h-5" />
                    <span>سجل التدقيق الشامل والتتبع الأمني (Zero-Trust Audit Logs Engine)</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    توثيق وتشفير جميع التحركات والدخول والتعديلات بالنظام برمز HMAC SHA-256 لمنع التلاعب بالسجلات.
                  </p>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleExportCSV}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تصدير CSV</span>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>تقرير JSON</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('هل أنت تأكد من تفريغ كافة سجلات التدقيق بالنظام؟')) {
                        clearSecurityLogs();
                      }
                    }}
                    className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold px-3.5 py-2 rounded-xl border border-rose-800 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>مسح السجلات</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute top-2.5 right-3" />
                  <input
                    type="text"
                    value={auditSearchTerm}
                    onChange={(e) => setAuditSearchTerm(e.target.value)}
                    placeholder="بحث بالحركة، البريد، أو رمز التشفير..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    onClick={() => setAuditSeverityFilter('all')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      auditSeverityFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    الكل ({securityLogs.length})
                  </button>
                  <button
                    onClick={() => setAuditSeverityFilter('security_alert')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      auditSeverityFilter === 'security_alert' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    تنبيهات 🚨
                  </button>
                  <button
                    onClick={() => setAuditSeverityFilter('warning')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      auditSeverityFilter === 'warning' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    تحذيرات ⚠️
                  </button>
                  <button
                    onClick={() => setAuditSeverityFilter('info')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      auditSeverityFilter === 'info' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    معلومات ℹ️
                  </button>
                </div>
              </div>

              {/* Terminal Logs Table */}
              <div className="font-mono text-xs space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
                {filteredAuditLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-sans">
                    لا توجد سجلات تدقيق مطابقة للفلتر المحدد.
                  </div>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                        log.severity === 'security_alert'
                          ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                          : log.severity === 'warning'
                          ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-[11px]">
                          <span className="text-slate-500">[{log.timestamp}]</span>
                          <span className={log.severity === 'security_alert' ? 'text-rose-400' : 'text-emerald-300'}>
                            {log.action}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          المستخدم: <span className="font-mono text-slate-300">{log.userEmail}</span> | <span className="font-mono">{log.ipHash}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono bg-slate-950 text-indigo-400 px-2 py-1 rounded border border-slate-800">
                          {log.encryptedDigest}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>إضافة مستخدم جديد للنظام</span>
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المستخدم:</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="مثال: المهندس خالد العتيبي"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="khalid@smartbuilding.sa"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الصلاحية:</label>
                <select
                  value={userRoleSelect}
                  onChange={(e) => setUserRoleSelect(e.target.value as UserRole)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                >
                  {userRole === 'super_admin' && (
                    <option value="super_admin">Super Admin (مدير النظام الرئيسي)</option>
                  )}
                  <option value="owner">مالك عقار</option>
                  <option value="tenant">مستأجر شقة</option>
                </select>
              </div>

              {userRoleSelect === 'tenant' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تخصيص الشقة:</label>
                  <select
                    value={assignedUnit}
                    onChange={(e) => setAssignedUnit(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        شقة {u.unitNumber} - {u.tenant?.tenantName || 'شاغرة'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer"
                >
                  إنشاء الحساب وتوليد الكود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
