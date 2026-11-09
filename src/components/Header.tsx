import React from 'react';
import { Store, ShieldCheck, Database, Layers, Package, FolderTree, Monitor, Smartphone, Terminal, LogOut } from 'lucide-react';
import { UserSession } from '../types/store';

interface HeaderProps {
  currentTab: 'bootstrap' | 'products' | 'categories' | 'schema' | 'pos';
  setCurrentTab: (tab: 'bootstrap' | 'products' | 'categories' | 'schema' | 'pos') => void;
  session: UserSession | null;
  onLogout: () => void;
  onResetSetup: () => void;
  tenantName: string;
  storeName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  session,
  onLogout,
  onResetSetup,
  tenantName,
  storeName,
}) => {
  return (
    <header className="border-b border-[#1B3B59] bg-[#07182B]/95 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Store Context */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img
                src="/assets/aistudio/Store_Manager_Pro_bdf64b53.png"
                alt="Store Manager Pro Logo"
                className="w-11 h-11 rounded-xl object-contain bg-[#07182B] p-1 border border-[#1B3B59] shadow-lg shadow-[#07182B]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand font-black text-lg text-white tracking-wide">STORE MANAGER</span>
                <span className="font-brand font-bold text-xs tracking-widest text-[#159EAA]">PRO</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#159EAA]/15 text-[#159EAA] font-mono-brand border border-[#159EAA]/30">
                  v3.0
                </span>
              </div>
              <p className="text-xs text-[#C5CDD5] flex items-center gap-1.5">
                <span className="font-medium text-white">{storeName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{tenantName}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0B2238] p-1.5 rounded-xl border border-[#1B3B59]">
            <button
              onClick={() => setCurrentTab('bootstrap')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'bootstrap'
                  ? 'bg-[#159EAA] text-white shadow-md shadow-[#159EAA]/25'
                  : 'text-[#C5CDD5] hover:text-white hover:bg-[#0E2942]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              نظرة عامة والتشغيل
            </button>

            <button
              onClick={() => setCurrentTab('products')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'products'
                  ? 'bg-[#159EAA] text-white shadow-md shadow-[#159EAA]/25'
                  : 'text-[#C5CDD5] hover:text-white hover:bg-[#0E2942]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              المنتجات والمتغيرات
            </button>

            <button
              onClick={() => setCurrentTab('categories')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'categories'
                  ? 'bg-[#159EAA] text-white shadow-md shadow-[#159EAA]/25'
                  : 'text-[#C5CDD5] hover:text-white hover:bg-[#0E2942]'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              فئات المنتجات
            </button>

            <button
              onClick={() => setCurrentTab('schema')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'schema'
                  ? 'bg-[#159EAA] text-white shadow-md shadow-[#159EAA]/25'
                  : 'text-[#C5CDD5] hover:text-white hover:bg-[#0E2942]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              المخطط وقاعدة البيانات
            </button>

            <button
              onClick={() => setCurrentTab('pos')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'pos'
                  ? 'bg-[#159EAA] text-white shadow-md shadow-[#159EAA]/25'
                  : 'text-[#C5CDD5] hover:text-white hover:bg-[#0E2942]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              واجهة الكاشير (POS)
            </button>
          </nav>

          {/* User & Session Status */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2 bg-[#0B2238] border border-[#1B3B59] rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#159EAA]/15 text-[#159EAA] flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white leading-tight">{session.fullName}</p>
                  <p className="text-[10px] text-[#159EAA] font-medium">مدير النظام (Administrator)</p>
                </div>
                <button
                  onClick={onLogout}
                  title="تسجيل الخروج"
                  className="mr-2 text-slate-400 hover:text-rose-400 transition-colors p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onResetSetup}
                className="text-xs bg-[#159EAA] hover:bg-[#128B96] text-white font-bold px-3.5 py-2 rounded-xl transition-colors shadow-md shadow-[#159EAA]/20"
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
