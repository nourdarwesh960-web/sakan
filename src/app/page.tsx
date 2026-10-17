import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Home, 
  Users, 
  HelpCircle,
  Building,
  Key,
  Compass
} from 'lucide-react';
import { getPublishedListings } from '@/lib/data-service';
import ListingCard from '@/components/ListingCard';
import { EGYPT_GOVERNORATES } from '@/types/database';

export default async function HomePage() {
  const { listings, total } = await getPublishedListings({ limit: 6 });

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/80 via-white to-transparent pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>منصة مباشرة ١٠٠٪ بدون سماسرة وبدون عمولات</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F2942] tracking-tight leading-[1.15]">
              دور على سكنك، <br />
              <span className="text-[#0A3A40]">
                من غير عمولات.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              منصة سَكَن تربط طلبة الجامعات والموظفين المغتربين في مصر بأصحاب الشقق والغرف مباشرة.
              أسعار واضحة، محادثات خاصة، وتفاصيل دقيقة بدون وسيط ولا رسوم خفية.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/listings"
                className="px-6 py-3.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-base"
              >
                <Search className="w-5 h-5" />
                دور على سكن
              </Link>
              <Link
                href="/my-listings/new"
                className="px-6 py-3.5 bg-white hover:bg-stone-50 text-[#0F2942] border border-stone-300 font-bold rounded-xl shadow-xs hover:shadow transition flex items-center gap-2 text-base"
              >
                اعرض سكنك مجاناً
              </Link>
            </div>
          </div>

          {/* Search Box Card */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-xl p-4 sm:p-6">
            <form action="/listings" method="GET" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Governorate Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">المحافظة</label>
                <select
                  name="governorate"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
                  defaultValue=""
                >
                  <option value="">كل المحافظات (٢٧)</option>
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g.id} value={g.nameAr}>
                      {g.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">المنطقة أو الحي</label>
                <input
                  type="text"
                  name="area"
                  placeholder="مثال: الدقي، مدينة نصر"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
                />
              </div>

              {/* Housing Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">نوع السكن</label>
                <select
                  name="housing_type"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0F2942] focus:outline-none"
                  defaultValue=""
                >
                  <option value="">جميع الأنواع</option>
                  <option value="room">غرفة خاصة / مشتركة</option>
                  <option value="shared_apartment">شقة مشتركة (طلبة/شباب)</option>
                  <option value="studio">استوديو مستقل</option>
                  <option value="full_apartment">شقة كاملة</option>
                </select>
              </div>

              {/* Search Submit */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-sm"
                >
                  <Search className="w-4 h-4" />
                  بحث فوري
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* Popular Governorates Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#0F2942]">المحافظات الأكثر طلباً</h2>
            <p className="text-sm text-stone-500">اختر المحافظة لتصفح السكن الطلابي والشبابي المتاح</p>
          </div>
          <Link href="/listings" className="text-sm font-bold text-[#0F2942] hover:underline flex items-center gap-1">
            جميع المحافظات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'القاهرة', count: 'مدينة نصر، المعادي، حلوان' },
            { name: 'الجيزة', count: 'الدقي، المهندسين، بين السرايات' },
            { name: 'الإسكندرية', count: 'سموحة، لوران، الأزاريطة' },
            { name: 'الدقهلية', count: 'المنصورة، حي الجامعة' },
            { name: 'أسيوط', count: 'جامعة أسيوط، نزلة عبد اللاه' },
            { name: 'الغربية', count: 'طنطا، شارع البحر، سيجر' },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/listings?governorate=${encodeURIComponent(item.name)}`}
              className="bg-white p-4 rounded-xl border border-stone-200 hover:border-[#0F2942] hover:shadow-sm transition text-center group"
            >
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-stone-100 flex items-center justify-center text-[#0F2942] group-hover:bg-[#0F2942] group-hover:text-white transition">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-[#0F2942] transition">
                {item.name}
              </h3>
              <p className="text-[11px] text-stone-500 truncate mt-1">{item.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Listings from Database */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-md mb-1">
              <span>تحديث دوري ومستمر</span>
            </div>
            <h2 className="text-2xl font-black text-[#0F2942]">أحدث الإعلانات المتاحة</h2>
            <p className="text-sm text-stone-500">سكن حقيقي موثق من أصحاب العقارات وبدون عمولة سمسار</p>
          </div>
          <Link
            href="/listings"
            className="text-sm font-bold text-[#0F2942] hover:underline flex items-center gap-1"
          >
            عرض الكل ({total})
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
            <Building className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-lg font-bold text-stone-800">لا توجد إعلانات منشورة حالياً</h3>
            <p className="text-sm text-stone-500">
              كن أول من يعرض سكنه لآلاف الطلبة والموظفين المغتربين في مصر مجاناً وبدون عمولات.
            </p>
            <Link
              href="/my-listings/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl text-sm"
            >
              اعرض سكنك الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlight: "دوّرلي على سكن" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0F2942] to-[#0A3A40] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-amber-500 text-[#0F2942] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              ميزة "دوّرلي على سكن"
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-snug">
              مش لاقي السكن المناسب لميزانيتك وموقع كليتك؟
            </h2>
            <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
              احفظ مواصفات السكن المطلوب (المحافظة، الميزانية، عدد الأسِرّة) والنظام هينبهك فوراً على موبايلك أول ما ينزل سكن يطابق طلبك، بدون ما تضطر تتابع كل ساعة.
            </p>
            <div className="pt-2">
              <Link
                href="/wanted-requests"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0F2942] font-black rounded-xl shadow transition"
              >
                سجّل طلب سكن مجاناً
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How SAKAN Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F2942]">كيف تعمل منصة سَكَن؟</h2>
          <p className="text-sm text-stone-500 mt-2">خطوات واضحة وسريعة بدون لف ولا وساطة معقدة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* For Seekers */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#0F2942] bg-stone-100 px-3 py-1 rounded-lg">
              <Users className="w-4 h-4" />
              للطلبة والباحثين عن سكن
            </div>
            <ul className="space-y-4 pt-2">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white flex items-center justify-center text-xs font-bold shrink-0">١</span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">ابحث وفلتر حسب كليتك أو شغلك</h4>
                  <p className="text-xs text-stone-500 mt-0.5">اختر المحافظة، الحي، نوع السكن، والميزانية المناسبة لك بالجنيه المصري.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white flex items-center justify-center text-xs font-bold shrink-0">٢</span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">تواصل مباشرة في الشات الخاص</h4>
                  <p className="text-xs text-stone-500 mt-0.5">تحدث مع صاحب السكن داخل المنصة بأمان تام واستفسر عن الشروط وتحديد موعد للمعاينة.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white flex items-center justify-center text-xs font-bold shrink-0">٣</span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">عاين واسكن بدون دفع مليم سمسرة</h4>
                  <p className="text-xs text-stone-500 mt-0.5">عاين السكن بنفسك على أرض الواقع، ولا تدفع أي رسوم للمعاينة أو عمولات وسيط.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#0A3A40] bg-stone-100 px-3 py-1 rounded-lg">
              <Key className="w-4 h-4" />
              لأصحاب السكن والمؤجرين
            </div>
            <ul className="space-y-4 pt-2">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0A3A40] text-white flex items-center justify-center text-xs font-bold shrink-0">١</span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">أضف تفاصيل سكنك وصوره مجاناً</h4>
                  <p className="text-xs text-stone-500 mt-0.5">حدد نوع السكن (غرفة، استوديو، شقة)، السعر الشفاف، والشروط (بنات / شباب / عائلات).</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0A3A40] text-white flex items-center justify-center text-xs font-bold shrink-0">٢</span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">استقبل استفسارات المستأجرين الجادين</h4>
                  <p className="text-xs text-stone-500 mt-0.5">تواصل مع الطلبة والموظفين عبر شات المنصة دون الحاجة لنشر رقم هاتفك للعامة.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0A3A40] text-white flex items-center justify-center text-xs font-bold shrink-0">٣</span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">أجر وحدتك لأفضل مستأجر</h4>
                  <p className="text-xs text-stone-500 mt-0.5">اتفق مباشرة واكتب عقد الإيجار القانوني، بدون اقتطاع أي نسبة أو عمولة من إيجارك.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Trust and Safety / Anti-Commission Pledge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-stone-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                ميثاق سَكَن للأمان ومكافحة السماسرة
              </div>
              <h3 className="text-2xl font-black">سكنك أقرب. وحقك محفوظ.</h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                منصة سَكَن لا تتقاضى أي عمولة أو نسبة إيجار، وتمنع دخول الوسطاء والسماسرة.
                إذا طلب منك أي معلن دفع عمولة أو رسوم حجز مسبقة قبل المعاينة، أبلغنا فوراً وسيتم إيقاف حسابه فور التحقق.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/safety"
                className="px-5 py-3 bg-white text-stone-900 hover:bg-stone-100 font-bold rounded-xl text-sm transition text-center"
              >
                قواعد المعاينة الآمنة
              </Link>
              <Link
                href="/complaints/new"
                className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition text-center"
              >
                إبلاغ عن سمسار مخالف
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F2942]">الأسئلة الشائعة</h2>
          <p className="text-sm text-stone-500 mt-1">كل ما تحتاج معرفته عن استخدام منصة سَكَن</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'هل توجد أي عمولات تتقاضاها سَكَن من المستأجر أو المؤجر؟',
              a: 'لا نهائياً. استخدام منصة سَكَن للبحث عن سكن أو عرض سكنك مجاني بالكامل بدون أي عمولات وساطة أو رسوم إدارية.',
            },
            {
              q: 'هل تقوم سَكَن بجمع إيجار الشقة أو حفظ التأمين؟',
              a: 'لا. سَكَن ليست بوابة دفع أو وسيط مالي. التعامل المالي وكتابة العقد يتم مباشرة بين المستأجر وصاحب السكن بعد المعاينة الفعلية.',
            },
            {
              q: 'ماذا أفعل إذا طلب مني شخص رسوم معاينة أو حجز مسبق؟',
              a: 'ننصح بشدة بعدم تحويل أي أموال عبر فودافون كاش أو إنستاباي قبل رؤية الشقة على أرض الواقع ومقابلة المؤجر والتأكد من هويته وعقد الملكية. يمكنك الإبلاغ فوراً عبر زر "إبلاغ عن مخالفة".',
            },
            {
              q: 'هل أرقام الهواتف تظهر للعامة على المنصة؟',
              a: 'رقم هاتفك محمي ولا يظهر للعامة افتراضياً لحماية خصوصيتك من الإزعاج. التواصل يتم داخل شات المنصة، ولديك الخيار لإظهاره للمستأجرين إذا رغبت.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-stone-200">
              <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pr-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
