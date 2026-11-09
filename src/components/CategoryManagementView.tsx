import React, { useState } from 'react';
import { FolderTree, Plus, Edit2, PowerOff, CheckCircle2, ChevronRight, CornerDownLeft, AlertCircle, X, ArrowLeft } from 'lucide-react';
import { ProductCategory } from '../types/store';

interface CategoryManagementViewProps {
  categories: ProductCategory[];
  onAddCategory: (category: Omit<ProductCategory, 'id'>) => void;
  onUpdateCategory: (id: string, updates: Partial<ProductCategory>) => void;
  onToggleActive: (id: string) => void;
  onBack: () => void;
  tenantId: string;
}

export const CategoryManagementView: React.FC<CategoryManagementViewProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onToggleActive,
  onBack,
  tenantId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Build hierarchical category list
  interface HierarchicalItem {
    category: ProductCategory;
    depth: number;
  }

  const buildTree = (): HierarchicalItem[] => {
    const result: HierarchicalItem[] = [];

    const appendChildren = (parentId: string | null, depth: number) => {
      const children = categories.filter((c) => c.parentId === parentId);
      for (const child of children) {
        result.push({ category: child, depth });
        appendChildren(child.id, depth + 1);
      }
    };

    appendChildren(null, 0);

    // Any orphans (safety)
    const processedIds = new Set(result.map((r) => r.category.id));
    for (const cat of categories) {
      if (!processedIds.has(cat.id)) {
        result.push({ category: cat, depth: 0 });
      }
    }

    return result;
  };

  const tree = buildTree();

  const handleOpenCreateModal = () => {
    setEditingCategoryId(null);
    setFormName('');
    setFormCode('');
    setFormParentId('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: ProductCategory) => {
    setEditingCategoryId(cat.id);
    setFormName(cat.name);
    setFormCode(cat.code || '');
    setFormParentId(cat.parentId || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('اسم الفئة مطلوب.');
      return;
    }

    if (editingCategoryId) {
      if (formParentId === editingCategoryId) {
        setFormError('لا يمكن أن تكون الفئة أباً لنفسها (Self-parenting forbidden).');
        return;
      }
      onUpdateCategory(editingCategoryId, {
        name: formName.trim(),
        code: formCode.trim() || null,
        parentId: formParentId || null,
      });
    } else {
      onAddCategory({
        tenantId,
        name: formName.trim(),
        code: formCode.trim() || null,
        parentId: formParentId || null,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B2238] p-6 rounded-2xl border border-[#1B3B59] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-[#0E2942] hover:bg-[#13385a] text-[#C5CDD5] hover:text-white border border-[#1B3B59] transition-colors"
            title="العودة للمنتجات"
          >
            <ArrowLeft className="w-4 h-4 text-[#159EAA]" />
          </button>
          <div>
            <h1 className="text-2xl font-brand font-black text-white">إدارة فئات المنتجات (Categories)</h1>
            <p className="text-xs text-[#C5CDD5] mt-1">
              تصنيف هرمي يدعم الفئات الرئيسية والفرعية مع منع الحلقات التكرارية (Cycle Prevention)
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#159EAA] hover:bg-[#128B96] text-white text-xs font-bold shadow-lg shadow-[#159EAA]/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          إضافة فئة جديدة
        </button>
      </div>

      {/* Category Tree List */}
      <div className="bg-[#0B2238] rounded-2xl border border-[#1B3B59] divide-y divide-[#1B3B59] overflow-hidden shadow-sm">
        {tree.length === 0 ? (
          <div className="p-12 text-center text-[#C5CDD5]">
            <FolderTree className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-white">لا توجد فئات حالياً</p>
            <p className="text-xs text-slate-400 mt-1">أضف فئات لتنظيم الكتالوج وتسهيل البحث</p>
          </div>
        ) : (
          tree.map(({ category: cat, depth }) => {
            const parentCat = categories.find((c) => c.id === cat.parentId);

            return (
              <div
                key={cat.id}
                style={{ paddingRight: `${Math.max(1.25, 1.25 + depth * 2)}rem` }}
                className={`py-4 px-5 flex items-center justify-between gap-4 transition-colors ${
                  cat.isActive ? 'hover:bg-slate-800/40' : 'bg-slate-900/40 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  {depth > 0 && (
                    <CornerDownLeft className="w-4 h-4 text-emerald-500 shrink-0 transform rotate-180" />
                  )}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      depth === 0
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    <FolderTree className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{cat.name}</span>
                      {cat.code && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {cat.code}
                        </span>
                      )}
                      {!cat.isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold border border-red-500/30">
                          معطلة
                        </span>
                      )}
                    </div>
                    {parentCat && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        تابعة للفئة الأب: <span className="text-slate-300 font-medium">{parentCat.name}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    title="تعديل الفئة"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onToggleActive(cat.id)}
                    title={cat.isActive ? 'تعطيل الفئة' : 'إعادة تفعيل الفئة'}
                    className={`p-2 rounded-xl border transition-colors ${
                      cat.isActive
                        ? 'bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border-slate-700'
                        : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border-emerald-800/40'
                    }`}
                  >
                    {cat.isActive ? <PowerOff className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">
              {editingCategoryId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              ترتبط الفئات بالـ Tenant الحالي ويتم التحقق من عدم التكرار.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  اسم الفئة <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: هواتف ذكية"
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  كود الفئة (اختياري)
                </label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="PHONE"
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  الفئة الأب (Hierarchical Parent)
                </label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">(فئة رئيسية جذرية بدون أب)</option>
                  {categories
                    .filter((c) => !editingCategoryId || c.id !== editingCategoryId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
                >
                  {editingCategoryId ? 'حفظ التعديلات' : 'إنشاء الفئة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
