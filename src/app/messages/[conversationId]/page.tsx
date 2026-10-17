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
  MessageSquare 
} from 'lucide-react';
import { Message } from '@/types/database';

export default function ActiveConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  const [messages, setMessages] = useState<Message[]>([]);

  const [inputText, setInputText] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
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
      sender_id: 'user-current',
      content: inputText.trim(),
      is_system: false,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[82vh]">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center justify-between gap-4 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/messages"
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="w-10 h-10 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-sm">
            أ
          </div>

          <div>
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              أحمد محمود
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                صاحب السكن
              </span>
            </h2>
            <Link
              href="/listings/listing-cairo-1"
              className="text-xs text-stone-500 hover:underline flex items-center gap-1 truncate max-w-xs"
            >
              <Building className="w-3 h-3 text-stone-400" />
              غرفة سنجل مفروشة قرب مترو الدقي
            </Link>
          </div>
        </div>

        {/* Actions Dropdown / buttons */}
        <div className="flex items-center gap-2">
          <Link
            href={`/complaints/new?conversation_id=${conversationId}&reported_user_id=user-ahmed-1`}
            className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition"
            title="الإبلاغ عن مخالفة أو سمسار"
          >
            <Flag className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowBlockConfirm(true)}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-lg transition"
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

    </div>
  );
}
