'use client';

import React, { useState } from 'react';
import { ScrollText, ShieldCheck, Search, Clock, Lock } from 'lucide-react';
import { AdminAuditLog } from '@/types/database';
import { formatDateArabic } from '@/lib/utils';

export default function AdminAuditLogsPage() {
  const [logs] = useState<AdminAuditLog[]>([]);

  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target_type.toLowerCase().includes(search.toLowerCase()) ||
      l.target_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F2942]">سجل العمليات والرقابة الإدارية (Audit Logs)</h1>
            <span className="bg-stone-200 text-stone-700 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              سجل غير قابل للتعديل (Immutable)
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            توثيق كامل لكل قرار إداري، إيقاف حساب، أو اعتماد إعلان مع توقيت العملية الدقيق
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في السجلات..."
            className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 pl-9 text-xs focus:ring-1 focus:ring-[#0F2942] focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
              <tr>
                <th className="p-3.5">العملية الإدارية</th>
                <th className="p-3.5">المسؤول (Actor)</th>
                <th className="p-3.5">الهدف</th>
                <th className="p-3.5">التفاصيل والبيانات الوصفية</th>
                <th className="p-3.5">التوقيت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 text-xs">
                    لا توجد عمليات مسجلة في سجل الرقابة حتى الآن
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/60 transition">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-[#0F2942] bg-stone-100 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-stone-600">
                    {log.actor_id}
                  </td>
                  <td className="p-3.5 text-stone-700">
                    <span className="font-semibold">{log.target_type}:</span>{' '}
                    <span className="font-mono text-stone-500">{log.target_id}</span>
                  </td>
                  <td className="p-3.5 text-stone-600 font-mono text-[11px] max-w-xs truncate">
                    {JSON.stringify(log.metadata)}
                  </td>
                  <td className="p-3.5 text-stone-400 whitespace-nowrap">
                    {formatDateArabic(log.created_at)}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
