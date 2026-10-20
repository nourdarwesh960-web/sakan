'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Phone, Flag, ShieldAlert, LogIn } from 'lucide-react';
import { Listing } from '@/types/database';
import { useAuth } from '@/lib/use-auth';
import RequireAuthModal from './RequireAuthModal';

interface ListingContactCardProps {
  listing: Listing;
}

export default function ListingContactCard({ listing }: ListingContactCardProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<{ title: string; desc: string }>({
    title: 'تسجيل الدخول مطلوب للتواصل',
    desc: 'لحماية خصوصية الطرفين ومنع السماسرة والوسطاء، يجب تسجيل الدخول للتواصل في الشات الخاص مع صاحب السكن.',
  });

  const handleProtectedAction = (actionTitle: string, actionDesc: string, onAuthorized?: () => void) => {
    if (!isAuthenticated) {
      setAuthModalReason({ title: actionTitle, desc: actionDesc });
      setShowAuthModal(true);
      return;
    }
    if (onAuthorized) onAuthorized();
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6 sticky top-24">
        {/* Provider Public Profile */}
        <div className="space-y-3">
          <span className="text-xs text-stone-400 font-semibold block">صاحب الإعلان</span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-xs">
              {listing.owner?.full_name ? listing.owner.full_name[0] : 'س'}
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-xs sm:text-base flex items-center gap-1.5">
                {listing.owner?.full_name || 'صاحب السكن'}
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                  موثق
                </span>
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-500">
                عضو في سَكَن • مباشر بدون وسيط
              </p>
            </div>
          </div>

          {listing.owner?.bio && (
            <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl leading-relaxed">
              "{listing.owner.bio}"
            </p>
          )}
        </div>

        {/* Direct Communication Actions */}
        <div className="space-y-2.5 sm:space-y-3 pt-2 border-t border-stone-100">
          {isAuthenticated ? (
            <Link
              href={`/messages?listing_id=${listing.id}`}
              className="w-full py-2.5 sm:py-3 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>تواصل في الشات الخاص</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleProtectedAction(
                'تسجيل الدخول لبدء المحادثة',
                'يجب تسجيل الدخول أو إنشاء حساب بحرية للبدء في مراسلة صاحب السكن والتفاوض مباشرة بدون عمولة.'
              )}
              className="w-full py-2.5 sm:py-3 bg-[#0F2942] hover:bg-[#0A3A40] text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>تواصل في الشات الخاص</span>
            </button>
          )}

          {/* Optional Phone Reveal */}
          {listing.show_phone_publicly && listing.owner?.phone ? (
            isAuthenticated ? (
              <a
                href={`tel:${listing.owner.phone}`}
                className="w-full py-2 sm:py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition flex items-center justify-center gap-1.5 text-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>اتصال: {listing.owner.phone}</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => handleProtectedAction(
                  'تسجيل الدخول لإظهار رقم الهاتف',
                  'لحماية أصحاب السكن ومنع الإزعاج من أرقام مجهولة، يشترط تسجيل الدخول لإظهار أرقام التواصل.'
                )}
                className="w-full py-2 sm:py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition flex items-center justify-center gap-1.5 text-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>سجل دخولك لإظهار رقم الهاتف</span>
              </button>
            )
          ) : (
            <div className="text-center text-[10px] sm:text-[11px] text-stone-400 flex items-center justify-center gap-1">
              <span>الهاتف محمي • التواصل الأولي عبر الشات فقط</span>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-amber-50 border border-amber-200/80 p-2 sm:p-2.5 rounded-xl text-[10px] sm:text-[11px] text-amber-900 text-center flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>تسجيل الدخول مطلوب لإجراء أي تواصل مباشر.</span>
            </div>
          )}
        </div>

        {/* Report Listing */}
        <div className="pt-2 sm:pt-3 border-t border-stone-100">
          {isAuthenticated ? (
            <Link
              href={`/complaints/new?listing_id=${listing.id}&reported_user_id=${listing.owner_id}`}
              className="text-xs text-stone-500 hover:text-rose-600 flex items-center justify-center gap-1.5 transition py-1"
            >
              <Flag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>الإبلاغ عن إعلان مخالف أو سمسار</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleProtectedAction(
                'تسجيل الدخول لتقديم بلاغ',
                'يجب تسجيل الدخول لتقديم شكوى أو بلاغ رسمي للتحقق من هوية المبلغ.'
              )}
              className="w-full text-xs text-stone-500 hover:text-rose-600 flex items-center justify-center gap-1.5 transition py-1"
            >
              <Flag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>الإبلاغ عن إعلان مخالف أو سمسار</span>
            </button>
          )}
        </div>
      </div>

      <RequireAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={authModalReason.title}
        description={authModalReason.desc}
        redirectUrl={`/listings/${listing.id}`}
      />
    </>
  );
}
