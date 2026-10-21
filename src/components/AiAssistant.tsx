'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Compass, 
  PhoneCall, 
  CheckCircle2, 
  RotateCcw,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  links?: { label: string; href: string }[];
  time: string;
}

const QUICK_PROMPTS = [
  { label: '🔍 إزاي أدور على سكن؟', query: 'كيف أبحث عن سكن مناسب لميزانيتي؟' },
  { label: '🏠 إزاي أعرض سكني مجاناً؟', query: 'كيف أضيف إعلان سكن على المنصة؟' },
  { label: '🎯 إيه ميزة دوّرلي على سكن؟', query: 'ما هي ميزة دوّرلي على سكن وكيف تعمل؟' },
  { label: '🛡️ نصائح الأمان ضد السماسرة', query: 'كيف أحمي نفسي من السماسرة ورسوم المعاينة؟' },
  { label: '📞 رقم التواصل والدعم', query: 'ما هو رقم هاتف الدعم الفني للتواصل؟' },
  { label: '🤝 إزاي أثبت إن السكن اتأجر؟', query: 'كيف أضغط تم التأجير في الشات؟' },
];

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'أهلاً بيك في سَكَن! 👋 أنا مساعدك الذكي. أقدر أساعدك تلاقي سكن مناسب، أو تعرض شقتك مجاناً وبدون أي عمولات، أو أجاوبك على أي استفسار في المنصة. تحب تسأل عن إيه؟',
      time: 'الآن',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTooltip(false);
    }
  }, [isOpen, messages, isTyping]);

  const generateResponse = (query: string): { text: string; links?: { label: string; href: string }[] } => {
    const q = query.toLowerCase();

    // Support & Phone
    if (q.includes('دعم') || q.includes('تواصل') || q.includes('رقم') || q.includes('تليفون') || q.includes('موبايل') || q.includes('خدمة العملاء')) {
      return {
        text: 'رقم هاتف الدعم الفني المباشر لمنصة سَكَن هو: 01062127372 📞\nفريقنا في خدمتكم يومياً من الساعة 9:00 صباحاً حتى 10:00 مساءً للرد على أي استفسار أو بلاغ.',
        links: [
          { label: 'اتصل الآن: 01062127372', href: 'tel:01062127372' },
          { label: 'مركز التواصل والمساعدة', href: '/contact' },
        ],
      };
    }

    // Search & Browse
    if (q.includes('بحث') || q.includes('ادور') || q.includes('أدور') || q.includes('الاقي') || q.includes('ألاقي') || q.includes('تصفح')) {
      return {
        text: 'للبحث عن سكن:\n1. اضغط على صفحة "تصفح السكن".\n2. استخدم الفلاتر السريعة لتحديد محافظتك (القاهرة، الجيزة، الإسكندرية...) والحي المناسب.\n3. حدد نوع السكن (غرفة، استوديو، شقة مشتركة) والحد الأقصى للميزانية.\n4. تواصل مباشرة مع صاحب السكن عبر الشات الخاص بدون أي وسيط!',
        links: [
          { label: 'تصفح كل الإعلانات المتاحة', href: '/listings' },
        ],
      };
    }

    // Post Listing
    if (q.includes('اضيف') || q.includes('أضيف') || q.includes('اعرض') || q.includes('أعرض') || q.includes('إعلان') || q.includes('صاحب سكن') || q.includes('مؤجر')) {
      return {
        text: 'عرض سكنك على منصة سَكَن مجاني 100% وبدون أي عمولات:\n1. سجّل دخولك بحسابك.\n2. اضغط على زر "اعرض سكنك مجاناً".\n3. أضف الصور من معرض هاتفك، وحدد السعر والمواصفات بدقة.\n4. سيظهر إعلانك فوراً لآلاف الطلبة والموظفين المغتربين!',
        links: [
          { label: 'إضافة سكن جديد الآن', href: '/my-listings/new' },
        ],
      };
    }

    // Dowar Li (Wanted Requests)
    if (q.includes('دورلي') || q.includes('دوّرلي') || q.includes('طلب سكن') || q.includes('تنبيه')) {
      return {
        text: 'خدمة "دوّرلي على سكن" مخصصة إذا لم تجد سكناً يناسب ميزانيتك حالياً!\nسجّل مواصفات السكن المطلوب (المحافظة، الميزانية، عدد الأسِرّة)، والنظام هيبعتلك إشعار فوري على حسابك أول ما ينزل سكن يطابق طلبك.',
        links: [
          { label: 'تسجيل طلب في دوّرلي على سكن', href: '/wanted-requests' },
        ],
      };
    }

    // Safety & Anti-broker
    if (q.includes('امان') || q.includes('أمان') || q.includes('سمسار') || q.includes('سماسرة') || q.includes('عمولة') || q.includes('نصب') || q.includes('حجز') || q.includes('معاينة')) {
      return {
        text: '🛡️ ميثاق سَكَن الصارم ضد السماسرة:\n• المنصة مباشرة 100% وتمنع دخول الوسطاء.\n• تحذير مهم: لا تدفع أبداً أي رسوم معاينة أو مبالغ حجز مسبقة عبر فودافون كاش أو إنستاباي قبل رؤية السكن فعلياً ومقابلة صاحبه والتأكد من هويته.\n• إذا طلب منك أي شخص عمولة، يمكنك الإبلاغ عنه فوراً وسيتم إيقاف حسابه.',
        links: [
          { label: 'قواعد المعاينة الآمنة', href: '/safety' },
          { label: 'تقديم بلاغ عن سمسار', href: '/complaints/new' },
        ],
      };
    }

    // Rental Confirmation (تم التأجير)
    if (q.includes('تاجر') || q.includes('تأجير') || q.includes('تم التأجير') || q.includes('شات') || q.includes('محادثة') || q.includes('اتفاق')) {
      return {
        text: 'عند الاتفاق بنجاح بين المستأجر وصاحب السكن داخل المحادثة الخاصة:\nستجد في أعلى الشات زر أخضر مكتوب عليه "تم التأجير". بمجرد الضغط عليه، يتم تأكيد إتمام العملية رسمياً وإغلاق الإعلان تلقائياً ليظهر للمستأجرين الآخرين أنه لم يعد متاحاً.',
        links: [
          { label: 'فتح المحادثات الخاصة', href: '/messages' },
        ],
      };
    }

    // Notifications
    if (q.includes('اشعار') || q.includes('إشعار') || q.includes('اشعارات') || q.includes('إشعارات') || q.includes('تنبيهات')) {
      return {
        text: 'مركز الإشعارات في سَكَن يعمل الآن بشكل كامل!\nيصلك تنبيه فوري عند تلقي رسائل جديدة، أو عند تطابق سكن جديد مع طلبك، أو عند تغيير حالة إعلانك. يمكنك الاطلاع على جميع الإشعارات من أيقونة الجرس بالأعلى.',
        links: [
          { label: 'فتح مركز الإشعارات', href: '/notifications' },
        ],
      };
    }

    // Default friendly response
    return {
      text: `أنا هنا لمساعدتك! 😊 بخصوص "${query}": يمكنك استخدام منصة سَكَن للبحث عن سكن طلابي أو شبابي بدون أي عمولات وساطة، أو عرض سكنك مجاناً. كما يمكنك التواصل مع فريق الدعم مباشرة على رقم 01062127372 إذا كان لديك أي استفسار خاص.`,
      links: [
        { label: 'تصفح السكن', href: '/listings' },
        { label: 'دوّرلي على سكن', href: '/wanted-requests' },
        { label: 'اتصل بنا: 01062127372', href: 'tel:01062127372' },
      ],
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: 'الآن',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(query);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        links: response.links,
        time: 'الآن',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 sm:bottom-6 sm:left-6" dir="rtl">
      
      {/* Floating Tooltip Bubble */}
      {showTooltip && !isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="absolute bottom-16 left-0 bg-[#0F2942] text-white text-xs font-bold py-1.5 px-3 rounded-2xl shadow-lg border border-amber-400/40 whitespace-nowrap cursor-pointer flex items-center gap-1.5 animate-bounce mb-1"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>اسأل مساعد سَكَن الذكي ✨</span>
        </div>
      )}

      {/* Cute Circular Floating Trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#0F2942] via-[#0A3A40] to-emerald-700 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/60 relative group"
          aria-label="افتح المساعد الآلي"
        >
          <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-[#0F2942] rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-[#0F2942]" />
          </span>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F2942] to-[#0A3A40] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-amber-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white">مساعد سَكَن الذكي</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[10px] text-stone-300">متاح 24/7 لمساعدتك في أي وقت</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-white/10 transition"
                title="إعادة بدء المحادثة"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-300 hover:text-white rounded-xl hover:bg-white/10 transition"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#FBFBFD] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0F2942] text-white rounded-bl-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-br-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs font-normal">{msg.text}</p>

                  {/* Links / Action pills inside message */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-col gap-1.5">
                      {msg.links.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.href}
                          onClick={() => {
                            if (!link.href.startsWith('tel:')) {
                              setIsOpen(false);
                            }
                          }}
                          className="inline-flex items-center justify-between px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-[#0F2942] font-bold text-[11px] rounded-xl transition"
                        >
                          <span>{link.label}</span>
                          <span className="text-stone-400">←</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-stone-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-stone-400 p-2 bg-white rounded-2xl border border-stone-200 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F2942] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F2942] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F2942] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] text-stone-500 mr-1">يكتب الرد...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-stone-100 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt.query)}
                className="text-[10px] sm:text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-xl shrink-0 transition"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب سؤالك هنا لمساعد سَكَن..."
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0F2942]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-[#0F2942] hover:bg-[#0A3A40] disabled:bg-stone-200 text-white disabled:text-stone-400 rounded-xl transition shadow-xs"
              aria-label="إرسال"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
