'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[#0F2942]">تواصل مع فريق سَكَن</h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          فريق خدمة المستخدمين والتحقق في خدمتكم يومياً للرد على أي استفسارات أو بلاغات
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Info Column */}
        <div className="bg-[#0F2942] text-white rounded-3xl p-6 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-amber-400">معلومات الدعم والتواصل</h2>
          
          <div className="space-y-4 text-xs sm:text-sm text-stone-300">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">البريد الإلكتروني:</span>
                <span dir="ltr">support@sakan.eg</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">ساعات العمل:</span>
                <span>يومياً من ٩:٠٠ ص حتى ١٠:٠٠ م بتوقيت القاهرة</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">المقر:</span>
                <span>القاهرة — جمهورية مصر العربية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          {sent ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-stone-900">تم استلام رسالتك بنجاح!</h3>
              <p className="text-xs text-stone-500">سيتواصل معك أحد مسؤولي الدعم في أقرب وقت.</p>
              <button
                onClick={() => setSent(false)}
                className="px-4 py-2 bg-[#0F2942] text-white text-xs font-bold rounded-xl mt-2"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">الاسم</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسمك الكريم"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">الهاتف أو البريد</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="010xxxxxxx أو name@example.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-right focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">الموضوع</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="استفسار عن إعلان، دعم فني، اقتراح..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">الرسالة</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب استفسارك بالتفصيل..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl text-xs sm:text-sm shadow transition flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  إرسال الرسالة
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
