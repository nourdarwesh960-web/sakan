import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'سَكَن — سكن مباشر بدون عمولات سماسرة',
  description: 'المنصة الأولى المباشرة في مصر للبحث عن سكن للطلبة والموظفين والمغتربين بدون عمولات سماسرة. تواصل مباشر مع أصحاب السكن وتفاصيل شفافة.',
  keywords: ['سكن في مصر', 'سكن طلبة', 'شقق مفروشة', 'غرف مشتركة', 'بدون عمولة', 'سكن القاهرة', 'سكن الإسكندرية'],
  openGraph: {
    title: 'سَكَن — سكن مباشر بدون عمولات سماسرة',
    description: 'ابحث عن سكن للطلبة والموظفين في مصر بدون عمولات سماسرة.',
    url: 'https://sakan.eg',
    siteName: 'سَكَن',
    locale: 'ar_EG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`h-full ${cairo.className}`}>
      <body className="min-h-full flex flex-col bg-[#FBFBFD] text-stone-900 antialiased selection:bg-amber-100 selection:text-amber-900 font-sans">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
