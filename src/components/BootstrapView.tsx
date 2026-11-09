import React from 'react';
import { Monitor, Smartphone, Database, CheckCircle2, ShieldAlert, Cpu, HardDrive, Key, ArrowLeft, Sparkles } from 'lucide-react';
import { CANONICAL_SCHEMA_METRICS } from '../data/canonicalData';

interface BootstrapViewProps {
  onNavigateTab: (tab: 'products' | 'categories' | 'schema' | 'pos') => void;
  storeName: string;
  tenantName: string;
}

export const BootstrapView: React.FC<BootstrapViewProps> = ({
  onNavigateTab,
  storeName,
  tenantName,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner - Matching Compose StoreBootstrapScreen */}
      <div className="bg-[#0B2238] border border-[#1B3B59] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#159EAA]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src="/assets/aistudio/Store_Manager_Pro_bdf64b53.png"
              alt="Store Manager Pro Official Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-[#07182B] p-2 border border-[#1B3B59] shadow-2xl shadow-[#07182B] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#159EAA] bg-[#159EAA]/10 px-2.5 py-0.5 rounded-full border border-[#159EAA]/30">
                  Visual Identity • The Pivot Module (v1.0 / 2026)
                </span>
                <span className="text-xs font-mono-brand text-[#C5CDD5]">
                  3×3 Grid • Navy · Teal · Silver · White
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-brand font-black text-white tracking-tight">
                STORE MANAGER <span className="text-[#159EAA] font-bold">PRO</span>
              </h1>
              <p className="text-[#C5CDD5] text-sm mt-1 max-w-2xl leading-relaxed">
                Run every store as one — inventory, sales, staff and reporting in a single operating layer.
                (الأساس المشترك للتشغيل المحلي الموثوق مع حماية التناغم وعزل المستأجر).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0E2942] border border-[#1B3B59] text-white text-xs font-bold">
              <Monitor className="w-3.5 h-3.5 text-[#159EAA]" />
              Windows Desktop (Host)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#159EAA]/15 border border-[#159EAA]/30 text-[#159EAA] text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              Android POS (Client)
            </span>
          </div>
        </div>
      </div>

      {/* Operational Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card 1 */}
        <div className="bg-[#0B2238] border border-[#1B3B59] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#159EAA] animate-pulse shadow-lg shadow-[#159EAA]/50" />
            <div>
              <p className="text-xs text-[#C5CDD5] font-medium">حالة التشغيل الأساسية</p>
              <p className="text-sm font-bold text-white mt-0.5">نواة مشتركة تعمل بنجاح</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-[#1B3B59]">
            تم التحقق من محرك SQLite وتهيئة سياق المتجر
          </p>
        </div>

        {/* Status Card 2 */}
        <div className="bg-[#0B2238] border border-[#1B3B59] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#C5CDD5] shadow-lg shadow-white/20" />
            <div>
              <p className="text-xs text-[#C5CDD5] font-medium">نمط التخزين والمتانة</p>
              <p className="text-sm font-bold text-white mt-0.5">{CANONICAL_SCHEMA_METRICS.durabilityMode}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-[#1B3B59]">
            أمان مالي كامل بحماية Transactions & Triggers
          </p>
        </div>

        {/* Status Card 3 */}
        <div className="bg-[#0B2238] border border-[#1B3B59] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#159EAA] shadow-lg shadow-[#159EAA]/40" />
            <div>
              <p className="text-xs text-[#C5CDD5] font-medium">مخطط قاعدة البيانات</p>
              <p className="text-sm font-bold text-white mt-0.5">Schema Version 3 (56 جداول)</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-[#1B3B59]">
            109 فهارس صريحة • 188 مشغلاً نشطاً
          </p>
        </div>

        {/* Status Card 4 */}
        <div className="bg-[#0B2238] border border-[#1B3B59] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" />
            <div>
              <p className="text-xs text-[#C5CDD5] font-medium">حالة فحص المخطط</p>
              <p className="text-sm font-bold text-white mt-0.5">{CANONICAL_SCHEMA_METRICS.schemaVerificationStatus}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-[#1B3B59]">
            اجتياز كامل الفحوصات في verify_canonical_schema
          </p>
        </div>
      </div>

      {/* System Specifications Card */}
      <div className="bg-[#0B2238] border border-[#1B3B59] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#159EAA]/15 text-[#159EAA] flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">مواصفات البيئة البرمجية القياسية (Baseline Architecture Specs)</h2>
              <p className="text-xs text-[#C5CDD5]">القرارات المعمارية المعتمدة وفق كود المخطط والمستودع</p>
            </div>
          </div>
          <span className="text-xs font-mono-brand px-2.5 py-1 rounded-md bg-[#07182B] text-[#C5CDD5] border border-[#1B3B59]">
            PRAGMA user_version = {CANONICAL_SCHEMA_METRICS.version}
          </span>
        </div>

        <div className="divide-y divide-[#1B3B59] text-sm">
          <div className="py-3 flex items-center justify-between">
            <span className="text-[#C5CDD5]">الإصدار المعماري المعتمد</span>
            <span className="font-semibold text-white">{CANONICAL_SCHEMA_METRICS.architectureVersion}</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-[#C5CDD5]">المنصة المستهدفة</span>
            <span className="font-semibold text-white">{CANONICAL_SCHEMA_METRICS.targetPlatform}</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-400">دور الجهاز في الشبكة</span>
            <span className="font-semibold text-slate-200">مضيف مركزي محلي والكاتب الوحيد لقاعدة البيانات (Windows Host)</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-[#C5CDD5]">المؤسسة والمتجر النشط</span>
            <span className="font-semibold text-[#159EAA]">{tenantName} — {storeName}</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-[#C5CDD5]">العملة واللغة</span>
            <span className="font-semibold text-white">DZD (الدينار الجزائري) | العربية (RTL)</span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-[#C5CDD5]">تمثيل القيم النقدية والكميات</span>
            <span className="font-mono-brand text-xs font-bold text-white bg-[#07182B] px-2.5 py-1 rounded border border-[#1B3B59]">
              INTEGER Ticks & Centimes (No Float / Double)
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-[#C5CDD5]">عزل المؤسسات وعالمية الـ SKU</span>
            <span className="font-mono-brand text-xs font-semibold text-[#159EAA] bg-[#07182B] px-2.5 py-1 rounded border border-[#159EAA]/30">
              UNIQUE(tenant_id, sku) & CHECK(sku = UPPER(TRIM(sku)))
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-[#C5CDD5]">تشفير كلمات المرور</span>
            <span className="font-mono-brand text-xs font-semibold text-white bg-[#07182B] px-2.5 py-1 rounded border border-[#1B3B59]">
              Argon2id v13 (m=19456 KiB, t=2, p=1) + Salt 16B
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <span className="text-[#C5CDD5]">الهوية البصرية المعتمدة (Visual Identity)</span>
            <span className="text-xs font-semibold text-[#159EAA] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#159EAA]" />
              The Pivot Module (Deep Navy · Corporate Teal · Metallic Silver · Pure White)
            </span>
          </div>
        </div>

        {/* Visual Identity Showcase Card */}
        <div className="mt-5 p-5 rounded-xl bg-[#07182B] border border-[#1B3B59] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/Store_Manager_Pro_bdf64b53.png"
              alt="Store Manager Pro Logo"
              className="w-14 h-14 rounded-xl object-contain bg-[#07182B] p-1.5 border border-[#1B3B59] shrink-0"
            />
            <div>
              <p className="text-sm font-bold text-white font-brand">THE PIVOT MODULE — 3×3 UNIT GRID</p>
              <p className="text-xs text-[#C5CDD5] mt-0.5">
                "Flat, solid, deliberate. Navy carries authority (60%). Teal is used sparingly (10%) to signal point of focus. Silver (15%) and white (15%) provide calm structure."
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono-brand px-2.5 py-1 rounded bg-[#07182B] text-white border border-[#1B3B59]">
              Deep Navy #07182B
            </span>
            <span className="text-[10px] font-mono-brand px-2.5 py-1 rounded bg-[#159EAA] text-white font-bold shadow-sm shadow-[#159EAA]/30">
              Teal #159EAA
            </span>
            <span className="text-[10px] font-mono-brand px-2.5 py-1 rounded bg-[#C5CDD5] text-[#07182B] font-bold">
              Silver #C5CDD5
            </span>
            <span className="text-[10px] font-mono-brand px-2.5 py-1 rounded bg-white text-[#07182B] font-bold">
              White #FFFFFF
            </span>
          </div>
        </div>

        {/* Quick Launch Actions */}
        <div className="mt-6 pt-5 border-t border-[#1B3B59] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigateTab('products')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#159EAA] hover:bg-[#128B96] text-white font-bold text-xs transition-all shadow-lg shadow-[#159EAA]/25"
          >
            الانتقال إلى إدارة المنتجات
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigateTab('categories')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0E2942] hover:bg-[#13385a] text-[#C5CDD5] hover:text-white font-bold text-xs transition-all border border-[#1B3B59]"
          >
            إدارة الفئات الهرمية
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigateTab('schema')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0E2942] hover:bg-[#13385a] text-[#C5CDD5] hover:text-white font-bold text-xs transition-all border border-[#1B3B59]"
          >
            استعراض المخطط وفحص SQLite
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
