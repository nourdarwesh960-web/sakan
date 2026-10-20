'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Calendar, 
  FileText, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  X, 
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  ImagePlus
} from 'lucide-react';
import { EGYPT_GOVERNORATES, HousingType, EligibleOccupants, GenderPreference } from '@/types/database';
import { createListing } from '@/lib/data-service';
import AuthGuard from '@/components/AuthGuard';

export default function NewListingPage() {
  const router = useRouter();

  // Basic Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [area, setArea] = useState('');
  const [addressPrivate, setAddressPrivate] = useState('');
  const [housingType, setHousingType] = useState<HousingType>('room');
  const [eligibleOccupants, setEligibleOccupants] = useState<EligibleOccupants>('both');
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('any');

  // Pricing
  const [monthlyRent, setMonthlyRent] = useState<number>(2000);
  const [deposit, setDeposit] = useState<number>(2000);
  const [utilitiesCost, setUtilitiesCost] = useState<number>(0);
  const [furnished, setFurnished] = useState<boolean>(true);
  const [availableFrom, setAvailableFrom] = useState<string>(new Date().toISOString().split('T')[0]);

  // Conditional Fields
  const [roomOccupancyType, setRoomOccupancyType] = useState<'private' | 'shared'>('private');
  const [bedsCount, setBedsCount] = useState<number>(1);
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [bathroomsCount, setBathroomsCount] = useState<number>(1);
  const [maxOccupancy, setMaxOccupancy] = useState<number>(1);

  // Phone Privacy
  const [showPhonePublicly, setShowPhonePublicly] = useState<boolean>(false);

  // Amenities
  const AMENITY_OPTIONS = [
    'واي فاي سريع',
    'مكيف هواء',
    'غسالة ملابس',
    'مطبخ مجهز',
    'غاز طبيعي',
    'مصعد بالعمارة',
    'سخان مياه',
    'شاشة تلفزيون',
    'حارس عقار / أمن',
    'مكتب للمذاكرة',
    'بلكونة بإطلالة',
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['واي فاي سريع', 'مطبخ مجهز']);

  // Photos URLs (from device gallery or link - clean empty default)
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [newPhotoInput, setNewPhotoInput] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrls((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const addPhotoUrl = () => {
    if (newPhotoInput.trim()) {
      setPhotoUrls([...photoUrls, newPhotoInput.trim()]);
      setNewPhotoInput('');
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !area.trim() || !description.trim()) {
      setFormError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (monthlyRent <= 0) {
      setFormError('قيمة الإيجار الشهري يجب أن تكون أكبر من صفر');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createListing({
        title,
        description,
        governorate,
        area,
        address_private: addressPrivate || undefined,
        housing_type: housingType,
        eligible_occupants: eligibleOccupants,
        gender_preference: genderPreference,
        monthly_rent: Number(monthlyRent),
        deposit: Number(deposit),
        utilities_cost: Number(utilitiesCost),
        furnished,
        available_from: availableFrom,
        amenities: selectedAmenities,
        room_occupancy_type: housingType === 'room' ? roomOccupancyType : undefined,
        beds_count: Number(bedsCount),
        rooms_count: Number(roomsCount),
        bathrooms_count: Number(bathroomsCount),
        max_occupancy: Number(maxOccupancy),
        show_phone_publicly: showPhonePublicly,
        photos: photoUrls.map((url, i) => ({
          id: `p-${i}`,
          listing_id: '',
          photo_url: url,
          order_index: i,
          created_at: new Date().toISOString(),
        })),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/listings/${created.id}`);
      }, 1500);
    } catch {
      setFormError('حدث خطأ أثناء حفظ الإعلان، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard
      fallbackMessage="يجب تسجيل الدخول بحساب سَكَن أولاً لتتمكن من إضافة وعرض سكنك على المنصة."
      redirectUrl="/my-listings/new"
    >
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          إعلان مجاني مباشر بدون عمولة
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F2942]">نشر إعلان سكن جديد</h1>
        <p className="text-xs sm:text-sm text-stone-500">
          أدخل تفاصيل وحدتك السكنية بدقة لتصل إلى الطلبة والموظفين الباحثين عن سكن في مصر
        </p>
      </div>

      {formError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>تم نشر إعلانك بنجاح! جاري تحويلك لصفحة المعاينة...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-8 shadow-xs">
        
        {/* Section 1: Housing Type */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#0F2942]" />
            ١. نوع السكن والتصنيف
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'room', label: 'غرفة', sub: 'خاصة أو مشتركة' },
              { id: 'shared_apartment', label: 'شقة مشتركة', sub: 'سكن شباب / طلبة' },
              { id: 'studio', label: 'استوديو مستقل', sub: 'شخص أو اثنين' },
              { id: 'full_apartment', label: 'شقة كاملة', sub: 'عائلات أو مجموعة' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setHousingType(type.id as HousingType)}
                className={`p-3.5 rounded-2xl border text-right transition ${
                  housingType === type.id
                    ? 'border-[#0F2942] bg-[#0F2942]/5 ring-1 ring-[#0F2942]'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                }`}
              >
                <div className="font-bold text-stone-900 text-sm">{type.label}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{type.sub}</div>
              </button>
            ))}
          </div>

          {/* Conditional Specs */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {housingType === 'room' && (
              <div>
                <label className="font-bold text-stone-700 block mb-1">طبيعة الغرفة</label>
                <select
                  value={roomOccupancyType}
                  onChange={(e) => setRoomOccupancyType(e.target.value as 'private' | 'shared')}
                  className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-2"
                >
                  <option value="private">خاصة منفردة (Single)</option>
                  <option value="shared">مشتركة مع زميل</option>
                </select>
              </div>
            )}

            <div>
              <label className="font-bold text-stone-700 block mb-1">عدد الأسِرّة المتاحة</label>
              <input
                type="number"
                min="1"
                max="20"
                value={bedsCount}
                onChange={(e) => setBedsCount(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-2"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">عدد الحمامات</label>
              <input
                type="number"
                min="1"
                max="10"
                value={bathroomsCount}
                onChange={(e) => setBathroomsCount(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-2"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">أقصى عدد للشاغلين</label>
              <input
                type="number"
                min="1"
                max="30"
                value={maxOccupancy}
                onChange={(e) => setMaxOccupancy(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-2"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0F2942]" />
            ٢. الموقع والمحافظة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                المحافظة (من ٢٧ محافظة مصرية)
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              >
                {EGYPT_GOVERNORATES.map((g) => (
                  <option key={g.id} value={g.nameAr}>
                    {g.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                الحي أو المنطقة العامة (علني)
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="مثال: الدقي، شارع التحرير قرب المترو"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700 block">
                العنوان التفصيلي ورقم العمارة (خاص لا يظهر للعامة)
              </label>
              <span className="text-[10px] text-stone-400">محمي حتى المعاينة</span>
            </div>
            <input
              type="text"
              value={addressPrivate}
              onChange={(e) => setAddressPrivate(e.target.value)}
              placeholder="مثال: عمارة ١٤ شارع مصدق الدور الثالث شقة ٦"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Pricing & Conditions */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#0F2942]" />
            ٣. الأسعار والتكاليف (بالجنيه المصري EGP)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">الإيجار الشهري المطلوب (ج.م)</label>
              <input
                type="number"
                required
                min="100"
                step="50"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">مبلغ التأمين المسترد (ج.م)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">متوسط الفواتير / الخدمات (ج.م)</label>
              <input
                type="number"
                min="0"
                step="10"
                value={utilitiesCost}
                onChange={(e) => setUtilitiesCost(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              />
              <span className="text-[10px] text-stone-400">اتركها صفر إذا كانت الفواتير مشمولة</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">حالة الفرش</label>
              <select
                value={furnished ? 'true' : 'false'}
                onChange={(e) => setFurnished(e.target.value === 'true')}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              >
                <option value="true">مفروش بالكامل</option>
                <option value="false">غير مفروش (على البلاط)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">متاح للانتقال بدءاً من</label>
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">الفئة المسموح بها</label>
              <select
                value={genderPreference}
                onChange={(e) => setGenderPreference(e.target.value as GenderPreference)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
              >
                <option value="any">متاح للجميع</option>
                <option value="male">شباب / طلبة فقط</option>
                <option value="female">بنات / طالبات فقط</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Title & Description */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0F2942]" />
            ٤. عنوان ووصف السكن
          </h2>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">عنوان الإعلان الجذاب</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: غرفة سنجل مفروشة وهادئة قرب جامعة القاهرة ومحطة المترو"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">الوصف التفصيلي والشروط</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل إضافية عن الشقة، الأجهزة الكهربائية، طبيعة الجيران، مواعيد الدخول، وأي شروط خاصة..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
            />
          </div>

          {/* Amenities checklist */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-2">المرافق والخدمات المتوفرة:</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((item) => {
                const isSelected = selectedAmenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition inline-flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0F2942] text-white border-[#0F2942]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Photos */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#0F2942]" />
            ٥. صور السكن (من المعرض أو الكاميرا)
          </h2>

          {/* Gallery file upload trigger */}
          <div className="flex flex-col gap-3">
            <label className="border-2 border-dashed border-stone-300 hover:border-[#0F2942] bg-stone-50 hover:bg-stone-100/80 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-[#0F2942] group-hover:scale-105 transition">
                <ImagePlus className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                  اضغط هنا لاختيار صور من المعرض أو الكاميرا
                </span>
                <span className="text-[11px] text-stone-500 block">
                  يمكنك تحديد صورة واحدة أو عدة صور معاً مباشرة من هاتفك أو جهازك
                </span>
              </div>
            </label>

            {/* Photo preview grid */}
            {photoUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photoUrls.map((url, i) => (
                  <div key={i} className="aspect-video relative rounded-xl overflow-hidden border border-stone-200 shadow-xs group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 left-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow transition"
                      title="حذف الصورة"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      صورة {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 text-center py-1">
                لم يتم رفع أي صور بعد. يفضل رفع صور واضحة لكافة أنحاء السكن لزيادة فرص التواصل.
              </p>
            )}

            {/* Optional URL input */}
            <div className="pt-2 border-t border-stone-100 flex gap-2">
              <input
                type="url"
                dir="ltr"
                value={newPhotoInput}
                onChange={(e) => setNewPhotoInput(e.target.value)}
                placeholder="رابط صورة مباشر (اختياري) https://..."
                className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-right focus:outline-none focus:ring-1 focus:ring-[#0F2942]"
              />
              <button
                type="button"
                onClick={addPhotoUrl}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition whitespace-nowrap"
              >
                إضافة بالرابط
              </button>
            </div>
          </div>
        </div>

        {/* Section 6: Privacy setting */}
        <div className="pt-2 border-t border-stone-100">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
            <input
              type="checkbox"
              checked={showPhonePublicly}
              onChange={(e) => setShowPhonePublicly(e.target.checked)}
              className="rounded text-[#0F2942] focus:ring-0"
            />
            <span>السماح بإظهار رقم هاتفي للعامة على صفحة الإعلان (افتراضياً: يتم التواصل عبر الشات فقط)</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <Link
            href="/my-listings"
            className="text-xs text-stone-500 hover:text-stone-800 font-semibold"
          >
            إلغاء والعودة
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl text-sm shadow transition disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'جاري نشر الإعلان...' : 'نشر الإعلان الآن مجاناً'}
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
    </AuthGuard>
  );
}
