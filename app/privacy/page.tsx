"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck, LockKeyhole, FileText } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f4fa] px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <header className="mb-5 flex items-center justify-between rounded-[26px] bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-black text-purple-600">NOLERA X</p>
            <h1 className="mt-1 text-2xl font-black">الخصوصية والسياسات</h1>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 text-sm font-black text-purple-700"
          >
            <ArrowRight size={18} />
            لوحة القيادة
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] bg-white p-5 shadow-sm">
            <ShieldCheck className="text-purple-700" size={26} />
            <h2 className="mt-3 font-black">حماية البيانات</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
              إدارة وحماية بيانات المستخدمين وفق صلاحيات الوصول المعتمدة.
            </p>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-sm">
            <LockKeyhole className="text-purple-700" size={26} />
            <h2 className="mt-3 font-black">الأمان</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
              إعدادات الأمان والحسابات والصلاحيات الإدارية.
            </p>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-sm">
            <FileText className="text-purple-700" size={26} />
            <h2 className="mt-3 font-black">السياسات</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
              مكان مخصص لسياسات الخصوصية وشروط استخدام منصة NOLERA X.
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">سياسة الخصوصية</h2>
          <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
            سيتم هنا نشر سياسة الخصوصية الرسمية وشروط استخدام NOLERA X
            والإفصاحات القانونية المطلوبة قبل الإطلاق التجاري.
          </p>

          <div className="mt-5 rounded-2xl bg-purple-50 p-4 text-sm font-bold leading-7 text-purple-900">
            هذه الصفحة حالياً هي واجهة تنظيمية داخل لوحة المنصة، ويمكن ربطها
            لاحقاً بالمحتوى القانوني الرسمي دون تغيير بنية لوحة التحكم.
          </div>
        </section>
      </div>
    </main>
  )
}
