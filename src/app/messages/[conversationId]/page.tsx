'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowRight, 
  Send, 
  Paperclip, 
  Building, 
  ShieldCheck, 
  Flag, 
  Ban, 
  CheckCheck, 
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  User 
} from 'lucide-react';
import { Message } from '@/types/database';
import { updateListingStatus } from '@/lib/data-service';
import { useAuth } from '@/lib/use-auth';
import AuthGuard from '@/components/AuthGuard';

export default function ActiveConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);

  const [inputText, setInputText] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [isRented, setIsRented] = useState(false);
  const [showRentedModal, setShowRentedModal] = useState(false);
  const [rentedSuccessToast, setRentedSuccessToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isBlocked) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: user?.id || 'user-current',
      content: inputText.trim(),
      is_system: false,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleConfirmRented = async () => {
    setIsRented(true);
    setShowRentedModal(false);

    // Call data service to mark listing as rented
    await updateListingStatus(conversationId, 'rented');

    const systemMsg: Message = {
      id: `sys-rented-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: 'system',
      content: 'تم تأكيد الاتفاق وإتمام تأجير السكن بنجاح بين الطرفين. تم تغيير حالة الإعلان رسمياً إلى "تم التأجير" وإغلاقه.',
      is_system: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, systemMsg]);
    setRentedSuccessToast(true);
    setTimeout(() => setRentedSuccessToast(false), 4000);
  };

  return (
    <AuthGuard fallbackMessage="يجب تسجيل الدخول للوصول إلى هذه المحادثة ومراسلة الطرف الآخر." redirectUrl={`/messages/${conversationId}`}>
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[82vh]">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/messages"
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="w-10 h-10 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <User className="w-5 h-5 text-stone-200" />
          </div>

          <div>
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <span>محادثة السكن المباشرة</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                تواصل مباشر
              </span>
            </h2>
            <Link
              href="/listings"
              className="text-xs text-stone-500 hover:underline flex items-center gap-1 truncate max-w-xs mt-0.5"
            >
              <Building className="w-3.5 h-3.5 text-stone-400" />
              <span>تفاصيل وموقع السكن</span>
            </Link>
          </div>
        </div>

        {/* Actions Dropdown / buttons */}
        <div className="flex items-center gap-2">
          {/* Mark as Rented Button inside chat */}
          {isRented ? (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم التأجير بنجاح</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowRentedModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="تأكيد إتمام التأجير وإغلاق الإعلان"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تم التأجير</span>
            </button>
          )}

          <Link
            href={`/complaints/new?conversation_id=${conversationId}`}
            className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-50 transition"
            title="الإبلاغ عن مخالفة أو سمسار"
          >
            <Flag className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowBlockConfirm(true)}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-50 transition"
            title="حظر المستخدم"
          >
            <Ban className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="my-2 bg-amber-50/80 border border-amber-200/80 rounded-xl px-4 py-2 text-amber-900 text-[11px] flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          تذكير سَكَن: لا تدفع أي رسوم حجز مسبقة أو مصاريف معاينة خارج العقد الرسمي.
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/60 rounded-2xl border border-stone-200/60 my-2 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-stone-400 space-y-2">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-xs font-bold text-stone-700">بدء محادثة آمنة ومباشرة</p>
            <p className="text-[11px] text-stone-500 max-w-xs">
              اكتب استفسارك بالأسفل وسيتلقى الطرف الآخر رسالتك فوراً داخل المنصة بدون وسطاء.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.is_system) {
              return (
                <div
                  key={msg.id}
                  className="my-3 mx-auto max-w-md w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      توثيق رسمي: تم تأكيد التأجير بنجاح
                    </h4>
                    <p className="text-[11px] text-emerald-800 leading-relaxed mt-1">
                      {msg.content}
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-600/70 block">
                    {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            }

            const isMe = msg.sender_id === 'user-current';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-[#0F2942] text-white rounded-br-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1 px-1">
                  <span>{new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      {isBlocked ? (
        <div className="bg-stone-100 rounded-2xl p-4 text-center text-xs text-stone-500 font-medium">
          تم حظر هذا المستخدم. لا يمكنك إرسال أو استقبال رسائل جديدة.
        </div>
      ) : (
        <form onSubmit={handleSendMessage} className="bg-white rounded-2xl border border-stone-200 p-2 flex items-center gap-2 shadow-xs shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب استفسارك هنا..."
            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
          />

          <button
            type="button"
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl transition"
            title="إرفاق صورة"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-[#0F2942] hover:bg-[#0A3A40] text-white rounded-xl text-xs font-bold transition disabled:opacity-40 flex items-center gap-1.5 shadow"
          >
            <span>إرسال</span>
            <Send className="w-3.5 h-3.5 rotate-180" />
          </button>
        </form>
      )}

      {/* Rented Confirmation Modal */}
      {showRentedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">تأكيد إتمام التأجير</h3>
              <p className="text-xs text-stone-500 leading-relaxed mt-2">
                هل تم الاتفاق وتأكيد استئجار هذا السكن بالفعل بينكما؟
                <br />
                سيتم تغيير حالة الإعلان رسمياً إلى <strong className="text-emerald-700">"تم التأجير"</strong> لمنع إزعاج صاحب السكن بمزيد من الطلبات وتوثيق العملية في الشات مباشرة.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRentedModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmRented}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
              >
                تأكيد التأجير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <Ban className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="font-bold text-stone-900 text-base">حظر هذا المستخدم؟</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              لن يتمكن هذا المستخدم من مراسلتك مرة أخرى داخل المنصة.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  setIsBlocked(true);
                  setShowBlockConfirm(false);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                تأكيد الحظر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rented Success Toast */}
      {rentedSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F2942] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>تم توثيق إتمام التأجير وتحديث حالة الإعلان بنجاح!</span>
        </div>
      )}

    </div>
    </AuthGuard>
  );
}
