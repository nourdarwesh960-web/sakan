'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  PlusCircle, 
  MapPin, 
  DollarSign, 
  Calendar, 
  X, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Bell, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import { EGYPT_GOVERNORATES, HousingType, EligibleOccupants, WantedRequest } from '@/types/database';
import { HOUSING_TYPE_LABELS, OCCUPANT_LABELS, formatCurrencyEGP, formatDateArabic } from '@/lib/utils';
import { createWantedRequest } from '@/lib/data-service';

export default function WantedRequestsPage() {
  const [requests, setRequests] = useState<WantedRequest[]>([
    {
      id: 'req-1',
      user_id: 'user-demo',
      housing_type: 'room',
      governorate: 'الجيزة',
      area: 'الدقي أو المهندسين',
      budget_max: 3000,
      beds_count: 1,
      occupant_preference: 'both',
      move_in_date: '2026-11-01',
      furnished_preference: true,
      additional_requirements: 'قريب من محطة المترو، إنترنت سريع، بيئة هادئة للمذاكرة.',
      is_active: true,
      created_at: '2026-10-15T10:00:00.000Z',
      updated_at: '2026-10-16T12:00:00.000Z',
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  
  // New request fields
  const [governorate, setGovernorate] = useState('القاهرة');
  const [area, setArea] = useState('');
  const [housingType, setHousingType] = useState<HousingType>('room');
  const [budgetMax, setBudgetMax] = useState<number>(2500);
  const [bedsCount, setBedsCount] = useState<number>(1);
  const [occupantPreference, setOccupantPreference] = useState<EligibleOccupants>('both');
  const [moveInDate, setMoveInDate] = useState<string>('2026-11-01');
  const [furnishedPreference, setFurnishedPreference] = useState<boolean>(true);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await createWantedRequest({
        governorate,
        area: area || undefined,
        housing_type: housingType,
        budget_max: Number(budgetMax),
        beds_count: Number(bedsCount),
        occupant_preference: occupantPreference,
        move_in_date: moveInDate,
        furnished_preference: furnishedPreference,
        additional_requirements: additionalRequirements || undefined,
      });

      setRequests([created, ...requests]);
      setShowModal(false);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = (id: string) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, is_active: !r.is_active } : r))
    );
  };

  const deleteRequest = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F2942] to-[#0A3A40] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-500 text-[#0F2942] text-xs font-black px-3 py-1 rounded-full uppercase">
            <Compass className="w-4 h-4" />
            خدمة مجانية للطلبة والشباب
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">دوّرلي على سكن</h1>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            سجّل تفضيلات ومواصفات السكن التي تبحث عنها، ونظام سَكَن الذكي سيبحث وينبهك فوراً على موبايلك أول ما ينزل إعلان يطابق شروطك مباشرة.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-[#0F2942] font-black rounded-xl shadow transition flex items-center gap-2 text-xs sm:text-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          تسجيل طلب سكن جديد
        </button>
      </div>

      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>تم حفظ طلبك بنجاح! سيتم فحص أي إعلان سكن جديد ومطابقته تلقائياً.</span>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0F2942]">طلباتك المحفوظة ({requests.length})</h2>
          <span className="text-xs text-stone-500">التنبيهات التلقائية نشطة</span>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
            <Compass className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">ليس لديك طلبات سكن محفوظة</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              سجّل متطلبات السكن والميزانية لتتلقى إشعارات فورية عند توفر سكن مناسب لك.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-[#0F2942] text-white text-xs font-bold rounded-xl"
            >
              تسجيل طلبك الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                      req.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {req.is_active ? 'التنبيه الفوري نشط' : 'موقوف مؤقتاً'}
                    </span>
                    <span className="text-xs text-stone-400">
                      تاريخ التسجيل: {formatDateArabic(req.created_at)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0F2942]" />
                    {req.governorate} {req.area ? `— ${req.area}` : ''}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                    <span className="bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-lg">
                      {HOUSING_TYPE_LABELS[req.housing_type || 'room']}
                    </span>
                    {req.budget_max && (
                      <span className="bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-lg font-bold text-[#0F2942]">
                        حتى {formatCurrencyEGP(req.budget_max)}
                      </span>
                    )}
                    {req.beds_count && (
                      <span className="bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-lg">
                        {req.beds_count} أسِرّة
                      </span>
                    )}
                    {req.furnished_preference && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                        مفروش
                      </span>
                    )}
                  </div>

                  {req.additional_requirements && (
                    <p className="text-xs text-stone-500 bg-stone-50/70 p-2.5 rounded-xl border border-stone-100">
                      ملاحظاتك: {req.additional_requirements}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => toggleActive(req.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 hover:bg-stone-50 transition flex items-center gap-1"
                  >
                    {req.is_active ? (
                      <>
                        <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                        إيقاف التنبيهات
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                        تفعيل التنبيهات
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteRequest(req.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition rounded-lg"
                    title="حذف الطلب"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-black text-[#0F2942] flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600" />
                تسجيل طلب سكن جديد
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">المحافظة</label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs"
                  >
                    {EGYPT_GOVERNORATES.map((g) => (
                      <option key={g.id} value={g.nameAr}>
                        {g.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">المنطقة المفضلة</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="مثال: الدقي، بين السرايات"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">نوع السكن</label>
                  <select
                    value={housingType}
                    onChange={(e) => setHousingType(e.target.value as HousingType)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs"
                  >
                    <option value="room">غرفة خاصة / مشتركة</option>
                    <option value="shared_apartment">شقة مشتركة (طلبة/شباب)</option>
                    <option value="studio">استوديو مستقل</option>
                    <option value="full_apartment">شقة كاملة</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">أقصى ميزانية شهرية (ج.م)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">عدد الأسِرّة المطلوبة</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bedsCount}
                    onChange={(e) => setBedsCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">حالة الفرش</label>
                  <select
                    value={furnishedPreference ? 'true' : 'false'}
                    onChange={(e) => setFurnishedPreference(e.target.value === 'true')}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-xs"
                  >
                    <option value="true">مفروش</option>
                    <option value="false">غير مفروش</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">ملاحظات وشروط إضافية (اختياري)</label>
                <textarea
                  rows={2}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="مثال: قريب من جامعة عين شمس، وجود مصعد، يمنع التدخين..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl text-xs transition shadow"
                >
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ وتفعيل التنبيهات'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
