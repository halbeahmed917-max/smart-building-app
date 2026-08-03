import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Receipt, 
  Zap, 
  Droplet, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Printer, 
  Building2, 
  User, 
  Plus,
  DollarSign,
  FileText,
  CreditCard,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Invoice, PaymentMethodType } from '../types';

export const InvoicesView: React.FC = () => {
  const { 
    invoices, 
    units, 
    buildings, 
    generateInvoiceForUnit, 
    toggleInvoiceStatus, 
    userRole,
    activeTenantUnitId,
    payInvoice,
    paymentReceipts
  } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('visa_mastercard');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<any | null>(null);
  const [notificationSentMsg, setNotificationSentMsg] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('أغسطس 2026');
  const [targetUnitIdForGen, setTargetUnitIdForGen] = useState(units[0]?.id || '');

  // Filter invoices based on user role
  const displayedInvoices = invoices.filter((inv) => {
    if (userRole === 'tenant') {
      return inv.unitId === activeTenantUnitId;
    }
    return true; // Owner & Super Admin can see all
  });

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUnitIdForGen) return;

    const newInv = generateInvoiceForUnit(targetUnitIdForGen, selectedMonth);
    setSelectedInvoice(newInv);
    setNotificationSentMsg('تم قياس الاستهلاك أوتوماتيكياً وإرسال إشعار الفاتورة للمستأجر والمالك بنجاح!');
    setTimeout(() => setNotificationSentMsg(''), 4000);
  };

  const handleSendNotification = (inv: Invoice) => {
    setNotificationSentMsg(`تم إرسال إشعار فاتورة ${inv.billingPeriod} للشقة ${inv.unitNumber} عبر البريد الإلكتروني والنظام لكل من المستأجر (${inv.tenantName}) والمالك.`);
    setTimeout(() => setNotificationSentMsg(''), 4000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    const lastFour = cardNumber ? cardNumber.slice(-4) : '4242';
    const receipt = payInvoice(payingInvoice.id, paymentMethod, lastFour);
    setPaymentSuccessReceipt(receipt);
    setPayingInvoice(null);
    setCardNumber('');
    setCardHolder('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            منظومة الفواتير الأوتوماتيكية وإشعارات الاستهلاك
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            تقيس الاستهلاك تلقائياً للكهرباء والماء وترسل الفاتورة المفصلة فورياً لكل من المستأجر والمالك.
          </p>
        </div>

        {(userRole === 'owner' || userRole === 'manager') && (
          <form onSubmit={handleGenerateInvoice} className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <select
              value={targetUnitIdForGen}
              onChange={(e) => setTargetUnitIdForGen(e.target.value)}
              className="bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  شقة {u.unitNumber} ({u.tenant?.tenantName || 'شاغرة'})
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              اصدار فاتورة أوتوماتيكية
            </button>
          </form>
        )}
      </div>

      {notificationSentMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {notificationSentMsg}
        </div>
      )}

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all text-slate-900"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">فاتورة شقة {invoice.unitNumber}</h3>
                  <span className="text-xs text-slate-500 font-medium">{invoice.buildingName}</span>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    invoice.status === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {invoice.status === 'paid' ? 'مسددة ✓' : 'غير مسددة'}
                </span>
              </div>

              <div className="text-xs text-slate-700 mb-3 flex items-center justify-between font-medium">
                <span className="text-slate-500">فترة الاستهلاك:</span>
                <span className="font-bold text-slate-900">{invoice.billingPeriod}</span>
              </div>

              <div className="text-xs text-slate-700 mb-4 flex items-center justify-between font-medium">
                <span className="text-slate-500">المستأجر:</span>
                <span className="font-bold text-indigo-700">{invoice.tenantName}</span>
              </div>

              {/* Itemized Breakdown Table */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4 text-xs font-medium">
                
                {/* Electricity Row */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-slate-700">كهرباء ({invoice.electricityKWh} ك.و.س):</span>
                  </div>
                  <span className="font-bold text-amber-800">{invoice.electricityTotalCost} ر.س</span>
                </div>

                {/* Water Row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-cyan-600" />
                    <span className="text-slate-700">ماء ({invoice.waterLiters.toLocaleString()} لتر):</span>
                  </div>
                  <span className="font-bold text-cyan-800">{invoice.waterTotalCost} ر.س</span>
                </div>

              </div>

              {/* Total Cost Display */}
              <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700">المبلغ الإجمالي المستحق:</span>
                <span className="text-lg font-extrabold text-emerald-700">{invoice.totalCost} ر.س</span>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setSelectedInvoice(invoice)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl border border-slate-200 transition-colors font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                معاينة
              </button>

              {invoice.status === 'unpaid' && (
                <button
                  onClick={() => {
                    setPayingInvoice(invoice);
                    setPaymentMethod('visa_mastercard');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  تسديد إلكتروني
                </button>
              )}

              <button
                onClick={() => handleSendNotification(invoice)}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                title="إرسال إشعار تلقائي للمستأجر والمالك"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Itemized Printable Statement Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">بيان الفاتورة الرسمية الأوتوماتيكية</h3>
                  <p className="text-xs text-slate-500 font-medium">مرسلة إلكترونياً لكل من المستأجر والمالك</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs text-slate-700">
              
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">رقم الفاتورة:</span>
                  <span className="font-mono text-slate-900 font-bold">{selectedInvoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">المبنى والشقة:</span>
                  <span className="text-slate-900 font-bold">{selectedInvoice.buildingName} - شقة {selectedInvoice.unitNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">اسم المستأجر:</span>
                  <span className="text-indigo-700 font-bold">{selectedInvoice.tenantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">تاريخ الإصدار:</span>
                  <span className="text-slate-900">{selectedInvoice.createdAt}</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-2">الخدمة</th>
                    <th className="py-2">الاستهلاك</th>
                    <th className="py-2">التعرفة</th>
                    <th className="py-2">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
                  <tr>
                    <td className="py-2.5 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      الكهرباء
                    </td>
                    <td className="py-2.5">{selectedInvoice.electricityKWh} ك.و.س</td>
                    <td className="py-2.5">{selectedInvoice.electricityRatePerKWh} ر.س</td>
                    <td className="py-2.5 font-bold text-amber-700">{selectedInvoice.electricityTotalCost} ر.س</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-cyan-600" />
                      الماء
                    </td>
                    <td className="py-2.5">{selectedInvoice.waterLiters.toLocaleString()} لتر</td>
                    <td className="py-2.5">{selectedInvoice.waterRatePerLiter} ر.س</td>
                    <td className="py-2.5 font-bold text-cyan-700">{selectedInvoice.waterTotalCost} ر.س</td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-emerald-900 text-sm font-bold">
                <span>إجمالي المبلغ المطلوب:</span>
                <span className="text-lg font-extrabold text-emerald-700">{selectedInvoice.totalCost} ر.س</span>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-slate-200 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  طباعة بيان الفاتورة
                </button>

                <div className="flex items-center gap-2">
                  {selectedInvoice.status === 'unpaid' && (
                    <button
                      onClick={() => {
                        setPayingInvoice(selectedInvoice);
                        setSelectedInvoice(null);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      الدفع الآن (فيزا / مدى)
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                  >
                    إغلاق
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 💳 Payment Gateway Modal (عدة طرق للتسديد: Visa/MasterCard, Mada, Apple Pay, Sadad) */}
      {payingInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">بوابة الدفع الإلكتروني المعتمدة 💳</h3>
                  <p className="text-xs text-slate-500 font-medium">فاتورة {payingInvoice.billingPeriod} - شقة {payingInvoice.unitNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 mt-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-bold">المبلغ المطلوب تسديده:</span>
                <span className="text-lg font-extrabold text-emerald-700">{payingInvoice.totalCost} ر.س</span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">اختر طريقة الدفع المناسبة:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('visa_mastercard')}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'visa_mastercard'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs">💳 فيزا / ماستركارد</span>
                    {paymentMethod === 'visa_mastercard' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mada')}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'mada'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs">🟢 مدى (Mada)</span>
                    {paymentMethod === 'mada' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Apple Pay</span>
                    {paymentMethod === 'apple_pay' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('sadad')}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'sadad'
                        ? 'bg-amber-50 border-amber-600 text-amber-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs">🏛️ نظام سداد</span>
                    {paymentMethod === 'sadad' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </button>
                </div>
              </div>

              {(paymentMethod === 'visa_mastercard' || paymentMethod === 'mada') && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رقم البطاقة (16 رقم):</label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اسم صاحب البطاقة:</label>
                    <input
                      type="text"
                      placeholder="كما هو مدون على البطاقة"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">تاريخ الانتهاء:</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-mono font-bold text-slate-900 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">رمز الأمان (CVC):</label>
                      <input
                        type="password"
                        placeholder="***"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-mono font-bold text-slate-900 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>دفع مشفر بأمان 256-bit SSL وفق معايير البنك المركزي.</span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  تأكيد وتسديد {payingInvoice.totalCost} ر.س
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🧾 Payment Confirmation Receipt Modal */}
      {paymentSuccessReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-900 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">تم التسديد بنجاح! 🧾</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">تم إصدار سند القبض الرقمي وتحديث الفاتورة بالداتا بيز.</p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 my-4 text-xs space-y-2 text-right font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">رقم المرجع:</span>
                <span className="font-mono font-bold text-slate-900">{paymentSuccessReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المبلغ المدفوع:</span>
                <span className="font-extrabold text-emerald-700">{paymentSuccessReceipt.amountPaid} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">وسيلة الدفع:</span>
                <span className="font-bold text-slate-800">{paymentSuccessReceipt.paymentMethod.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">تاريخ وساعة السداد:</span>
                <span className="text-slate-800">{paymentSuccessReceipt.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => setPaymentSuccessReceipt(null)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl text-xs cursor-pointer shadow-md"
            >
              موافق وإغلاق السند
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
