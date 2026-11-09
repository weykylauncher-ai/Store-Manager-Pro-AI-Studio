import React, { useState } from 'react';
import { Store, ShieldCheck, Key, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface FirstRunSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSetup: (data: {
    tenantName: string;
    storeName: string;
    storeCode: string;
    adminFullName: string;
    adminUsername: string;
  }) => void;
}

export const FirstRunSetupModal: React.FC<FirstRunSetupModalProps> = ({
  isOpen,
  onClose,
  onCompleteSetup,
}) => {
  const [tenantName, setTenantName] = useState('مؤسسة النور للتجارة والتوزيع');
  const [storeName, setStoreName] = useState('المتجر الرئيسي المركزي');
  const [storeCode, setStoreCode] = useState('MAIN');
  const [adminFullName, setAdminFullName] = useState('المدير العام للنظام');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@2026');
  const [confirmPassword, setConfirmPassword] = useState('Admin@2026');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tenantName.trim() || !storeName.trim() || !storeCode.trim() || !adminUsername.trim()) {
      setError('جميع الحقول الإلزامية يجب ملؤها.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين.');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onCompleteSetup({
        tenantName: tenantName.trim(),
        storeName: storeName.trim(),
        storeCode: storeCode.trim().toUpperCase(),
        adminFullName: adminFullName.trim(),
        adminUsername: adminUsername.trim(),
      });
      setIsProcessing(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07182B]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B2238] border border-[#1B3B59] rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-[#C5CDD5] hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-2">
          <img
            src="/assets/aistudio/Store_Manager_Pro_bdf64b53.png"
            alt="Store Manager Pro Logo"
            className="w-12 h-12 rounded-2xl object-contain bg-[#07182B] p-1.5 border border-[#1B3B59] shadow-md shadow-[#07182B]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-brand font-black text-white">إعداد النظام الأولي (First-Run Setup)</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#159EAA]/20 text-[#159EAA] font-mono-brand">v3.0</span>
            </div>
            <p className="text-xs text-[#C5CDD5]">تكوين المؤسسة والمتجر الافتراضي وحساب المدير المعتمد</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="bg-[#07182B] p-4 rounded-2xl border border-[#1B3B59] space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 font-brand">
              <Store className="w-3.5 h-3.5 text-[#159EAA]" />
              بيانات المؤسسة والمتجر الأول:
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                اسم المؤسسة (Tenant Name) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full bg-[#0B2238] border border-[#1B3B59] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#159EAA]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#C5CDD5] mb-1">
                  اسم المتجر (Store Name) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-[#0B2238] border border-[#1B3B59] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#159EAA]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#C5CDD5] mb-1">
                  كود المتجر (Store Code) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storeCode}
                  onChange={(e) => setStoreCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#0B2238] border border-[#1B3B59] rounded-xl px-3.5 py-2 text-xs font-mono-brand text-[#159EAA] font-bold focus:outline-none focus:ring-2 focus:ring-[#159EAA]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#07182B] p-4 rounded-2xl border border-[#1B3B59] space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 font-brand">
              <ShieldCheck className="w-3.5 h-3.5 text-[#159EAA]" />
              بيانات حساب مدير النظام (Administrator User):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#C5CDD5] mb-1">
                  الاسم الكامل <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminFullName}
                  onChange={(e) => setAdminFullName(e.target.value)}
                  className="w-full bg-[#0B2238] border border-[#1B3B59] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#159EAA]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#C5CDD5] mb-1">
                  اسم المستخدم (Username) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full bg-[#0B2238] border border-[#1B3B59] rounded-xl px-3.5 py-2 text-xs font-mono-brand text-white focus:outline-none focus:ring-2 focus:ring-[#159EAA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#C5CDD5] mb-1">
                  كلمة المرور <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B2238] border border-[#1B3B59] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#159EAA]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#C5CDD5] mb-1">
                  تأكيد كلمة المرور <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0B2238] border border-[#1B3B59] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#159EAA]"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0B2238] text-[11px] text-[#C5CDD5] font-mono-brand border border-[#1B3B59]">
              سيتم التشفير باستخدام: <span className="text-[#159EAA] font-bold">Argon2id v13 (m=19456, t=2, p=1)</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1B3B59]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0E2942] hover:bg-[#13385a] text-[#C5CDD5] hover:text-white text-xs font-bold transition-colors border border-[#1B3B59]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-[#159EAA] hover:bg-[#128B96] disabled:opacity-50 text-white text-xs font-extrabold shadow-lg shadow-[#159EAA]/25 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isProcessing ? 'جارٍ الإعداد الذري...' : 'تهيئة وحفظ الإعداد الأولي'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
