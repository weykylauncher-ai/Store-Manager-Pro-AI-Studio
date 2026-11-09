import React, { useState, useMemo } from 'react';
import { Package, Plus, Search, Tag, Barcode, Layers, Edit2, PowerOff, CheckCircle2, AlertCircle, X, ChevronDown, ChevronUp, FolderTree } from 'lucide-react';
import { Product, ProductCategory, ProductVariant, UnitOfMeasure } from '../types/store';
import { REFERENCE_UNITS } from '../data/canonicalData';

interface ProductManagementViewProps {
  products: Product[];
  categories: ProductCategory[];
  onAddProduct: (product: Omit<Product, 'id'>, variants?: Omit<ProductVariant, 'id' | 'productId' | 'tenantId'>[]) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onToggleActive: (id: string) => void;
  onNavigateToCategories: () => void;
  tenantId: string;
}

export const ProductManagementView: React.FC<ProductManagementViewProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onToggleActive,
  onNavigateToCategories,
  tenantId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCategory, setFormCategory] = useState<string>('');
  const [formUnit, setFormUnit] = useState<string>('UOM_PIECE');
  const [formHasVariants, setFormHasVariants] = useState(false);
  const [formPrice, setFormPrice] = useState<number>(1000); // In DZD (displayed to user)
  const [formCost, setFormCost] = useState<number>(700);

  // Variant rows in modal
  interface VariantDraft {
    id: string;
    sku: string;
    barcode: string;
    name: string;
    color: string;
    size: string;
  }
  const [variantDrafts, setVariantDrafts] = useState<VariantDraft[]>([
    { id: '1', sku: '', barcode: '', name: '', color: '', size: '' }
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.code && prod.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (prod.barcode && prod.barcode.includes(searchQuery)) ||
        prod.variants?.some((v) =>
          v.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (v.barcode && v.barcode.includes(searchQuery)) ||
          v.variantName.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Category
      const matchesCategory =
        selectedCategory === 'ALL' || prod.categoryId === selectedCategory;

      // Status
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && prod.isActive) ||
        (statusFilter === 'INACTIVE' && !prod.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCode('');
    setFormBarcode('');
    setFormCategory(categories[0]?.id || '');
    setFormUnit('UOM_PIECE');
    setFormHasVariants(false);
    setFormPrice(1500);
    setFormCost(1000);
    setVariantDrafts([
      { id: '1', sku: '', barcode: '', name: '', color: '', size: '' }
    ]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormCode(prod.code || '');
    setFormBarcode(prod.barcode || '');
    setFormCategory(prod.categoryId || '');
    setFormUnit(prod.baseUnitId || 'UOM_PIECE');
    setFormHasVariants(prod.hasVariants);
    setFormPrice(prod.price ? prod.price / 100 : 1500);
    setFormCost(prod.cost ? prod.cost / 100 : 1000);
    if (prod.variants && prod.variants.length > 0) {
      setVariantDrafts(
        prod.variants.map((v, i) => {
          let color = '';
          let size = '';
          if (v.attributesJson) {
            try {
              const parsed = JSON.parse(v.attributesJson);
              color = parsed.color || '';
              size = parsed.size || '';
            } catch (_) {}
          }
          return {
            id: String(i + 1),
            sku: v.sku,
            barcode: v.barcode || '',
            name: v.variantName,
            color,
            size,
          };
        })
      );
    } else {
      setVariantDrafts([{ id: '1', sku: '', barcode: '', name: '', color: '', size: '' }]);
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleAddVariantRow = () => {
    const baseCode = formCode.trim().toUpperCase() || 'PROD';
    setVariantDrafts([
      ...variantDrafts,
      {
        id: String(Date.now()),
        sku: `${baseCode}-VAR-${variantDrafts.length + 1}`,
        barcode: '',
        name: '',
        color: '',
        size: '',
      },
    ]);
  };

  const handleRemoveVariantRow = (id: string) => {
    if (variantDrafts.length <= 1) return;
    setVariantDrafts(variantDrafts.filter((v) => v.id !== id));
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('اسم المنتج حقل إلزامي.');
      return;
    }

    if (formHasVariants) {
      // Validate variants
      for (const v of variantDrafts) {
        if (!v.sku.trim()) {
          setFormError('رمز الـ SKU إلزامي لجميع المتغيرات.');
          return;
        }
      }
      // Check duplicate SKUs in draft
      const skus = variantDrafts.map((v) => v.sku.trim().toUpperCase());
      if (new Set(skus).size !== skus.length) {
        setFormError('يوجد تكرار في رمز الـ SKU بين المتغيرات.');
        return;
      }
    }

    if (editingProductId) {
      onUpdateProduct(editingProductId, {
        name: formName.trim(),
        code: formCode.trim() || null,
        barcode: formBarcode.trim() || null,
        categoryId: formCategory || null,
        baseUnitId: formUnit,
        price: Math.round(formPrice * 100),
        cost: Math.round(formCost * 100),
      });
    } else {
      const formattedVariants = formHasVariants
        ? variantDrafts.map((v) => ({
            sku: v.sku.trim().toUpperCase(),
            barcode: v.barcode.trim() || null,
            variantName: v.name.trim() || `${formName} (${v.color || ''} ${v.size || ''})`.trim(),
            attributesJson: JSON.stringify({ color: v.color, size: v.size }),
            isActive: true,
          }))
        : undefined;

      onAddProduct(
        {
          tenantId,
          categoryId: formCategory || null,
          baseUnitId: formUnit,
          name: formName.trim(),
          code: formCode.trim() || null,
          barcode: formBarcode.trim() || null,
          hasVariants: formHasVariants,
          trackInventory: true,
          isActive: true,
          price: Math.round(formPrice * 100),
          cost: Math.round(formCost * 100),
          stockOnHand: 50,
        },
        formattedVariants
      );
    }

    setIsModalOpen(false);
  };

  const toggleVariantsExpanded = (prodId: string) => {
    setExpandedVariants((prev) => ({
      ...prev,
      [prodId]: !prev[prodId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B2238] p-6 rounded-2xl border border-[#1B3B59] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#159EAA] bg-[#159EAA]/10 px-2 py-0.5 rounded border border-[#159EAA]/30">
              Inventory & Catalog
            </span>
          </div>
          <h1 className="text-2xl font-brand font-black text-white">إدارة المنتجات والأصناف</h1>
          <p className="text-xs text-[#C5CDD5] mt-1">
            دعم كامل للمنتجات البسيطة والمنتجات ذات المتغيرات والأحجام (SKU & Barcodes) وفق قواعد العزل وعالمية الكود
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToCategories}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E2942] hover:bg-[#13385a] text-[#C5CDD5] hover:text-white text-xs font-bold border border-[#1B3B59] transition-colors"
          >
            <FolderTree className="w-4 h-4 text-[#159EAA]" />
            إدارة الفئات
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#159EAA] hover:bg-[#128B96] text-white text-xs font-bold shadow-lg shadow-[#159EAA]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            إضافة منتج جديد
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B2238] p-4 rounded-2xl border border-[#1B3B59] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو بادئة الكود أو الباركود..."
            className="w-full bg-[#07182B] border border-[#1B3B59] rounded-xl pr-10 pl-4 py-2 text-xs text-[#C5CDD5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#159EAA] focus:border-transparent transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#07182B] border border-[#1B3B59] rounded-xl px-3 py-2 text-xs text-[#C5CDD5] focus:outline-none focus:ring-2 focus:ring-[#159EAA]"
          >
            <option value="ALL">جميع الفئات</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-[#07182B] border border-[#1B3B59] rounded-xl px-3 py-2 text-xs text-[#C5CDD5] focus:outline-none focus:ring-2 focus:ring-[#159EAA]"
          >
            <option value="ALL">جميع الحالات (النشطة والمعطلة)</option>
            <option value="ACTIVE">النشطة فقط</option>
            <option value="INACTIVE">المعطلة فقط</option>
          </select>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="flex items-center justify-between text-xs text-[#C5CDD5] px-2">
        <span>إجمالي المنتجات المطابقة: <strong className="text-white font-mono-brand">{filteredProducts.length}</strong></span>
        <span>العملة المعتمدة: <strong className="text-[#159EAA] font-semibold">DZD (سنتيم = Centimes)</strong></span>
      </div>

      {/* Products Grid / Cards */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-[#0B2238] border border-[#1B3B59] rounded-2xl p-12 text-center">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">لا توجد منتجات مطابقة</h3>
            <p className="text-xs text-[#C5CDD5] mt-1 max-w-sm mx-auto">
              جرب تغيير معايير البحث أو الفلتر أو اضغط على زر "إضافة منتج جديد" لإنشاء عنصر جديد.
            </p>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const categoryObj = categories.find((c) => c.id === prod.categoryId);
            const unitObj = REFERENCE_UNITS.find((u) => u.id === prod.baseUnitId);
            const isExpanded = !!expandedVariants[prod.id];
            const hasVariants = prod.hasVariants && prod.variants && prod.variants.length > 0;

            return (
              <div
                key={prod.id}
                className={`bg-[#0B2238] border rounded-2xl p-5 transition-all shadow-sm ${
                  prod.isActive ? 'border-[#1B3B59] hover:border-[#159EAA]/60' : 'border-rose-950/40 bg-[#07182B]/60 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        prod.hasVariants
                          ? 'bg-[#159EAA]/15 text-[#159EAA] border border-[#159EAA]/30'
                          : 'bg-[#0E2942] text-white border border-[#1B3B59]'
                      }`}
                    >
                      <Package className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-white">{prod.name}</h3>
                        {!prod.isActive && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold border border-red-500/30">
                            معطّل
                          </span>
                        )}
                        {prod.hasVariants ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                            متعدد المتغيرات ({prod.variants?.length || 0})
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
                            منتج بسيط
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 flex-wrap">
                        {prod.code && (
                          <span className="flex items-center gap-1 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                            <Tag className="w-3 h-3 text-slate-500" />
                            {prod.code}
                          </span>
                        )}

                        {prod.barcode && (
                          <span className="flex items-center gap-1 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                            <Barcode className="w-3 h-3 text-slate-500" />
                            {prod.barcode}
                          </span>
                        )}

                        {categoryObj && (
                          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                            {categoryObj.name}
                          </span>
                        )}

                        {unitObj && (
                          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                            الوحدة: {unitObj.nameAr} ({unitObj.symbol})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-[#1B3B59]">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#159EAA] font-mono-brand">
                        {((prod.price || 0) / 100).toLocaleString('ar-DZ')} د.ج
                      </div>
                      <div className="text-[11px] text-[#C5CDD5] mt-0.5">
                        التكلفة: {((prod.cost || 0) / 100).toLocaleString('ar-DZ')} د.ج • المتوفر: {prod.stockOnHand ?? 0}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        title="تعديل المنتج"
                        className="p-2 rounded-xl bg-[#0E2942] hover:bg-[#13385a] text-[#C5CDD5] hover:text-white border border-[#1B3B59] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onToggleActive(prod.id)}
                        title={prod.isActive ? 'تعطيل المنتج' : 'إعادة تفعيل المنتج'}
                        className={`p-2 rounded-xl border transition-colors ${
                          prod.isActive
                            ? 'bg-[#0E2942] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border-[#1B3B59]'
                            : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border-emerald-800/40'
                        }`}
                      >
                        {prod.isActive ? <PowerOff className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      {hasVariants && (
                        <button
                          onClick={() => toggleVariantsExpanded(prod.id)}
                          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#159EAA]/15 hover:bg-[#159EAA]/25 text-[#159EAA] text-xs font-semibold border border-[#159EAA]/30 transition-colors"
                        >
                          <span>المتغيرات</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Variants Subtable */}
                {hasVariants && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#1B3B59] bg-[#07182B] -mx-5 -mb-5 p-5 rounded-b-2xl">
                    <p className="text-xs font-bold text-white mb-2.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#159EAA]" />
                      متغيرات المنتج المسجلة في المخطط (Schema v3 Variants):
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-right">
                        <thead>
                          <tr className="border-b border-[#1B3B59] text-[#C5CDD5]">
                            <th className="pb-2 font-medium">اسم المتغير</th>
                            <th className="pb-2 font-medium">رمز الـ SKU (فريد للـ Tenant)</th>
                            <th className="pb-2 font-medium">الباركود</th>
                            <th className="pb-2 font-medium">الخصائص</th>
                            <th className="pb-2 font-medium">الحالة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1B3B59]/60">
                          {prod.variants!.map((v) => {
                            let attrs: any = {};
                            try {
                              if (v.attributesJson) attrs = JSON.parse(v.attributesJson);
                            } catch (_) {}

                            return (
                              <tr key={v.id} className="text-slate-300 hover:bg-[#0B2238]/60">
                                <td className="py-2.5 font-semibold text-white">{v.variantName}</td>
                                <td className="py-2.5 font-mono-brand text-[#159EAA] font-bold">{v.sku}</td>
                                <td className="py-2.5 font-mono-brand text-[#C5CDD5]">{v.barcode || '—'}</td>
                                <td className="py-2.5 text-slate-400">
                                  {Object.entries(attrs).map(([k, val]: any) => (
                                    <span key={k} className="inline-block bg-slate-800 px-1.5 py-0.5 rounded ml-1 text-[11px]">
                                      {val}
                                    </span>
                                  ))}
                                </td>
                                <td className="py-2.5">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    نشط
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Product Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">
              {editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              يدعم المخطط v3 التحقق من تطابق الـ Tenant وعزل بيانات الـ SKU والباركود.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    اسم المنتج <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="مثال: شاحن سريع 65 واط"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    رمز المنتج (كود الكتالوج)
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="CHG-65W"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الباركود الرئيسي
                  </label>
                  <input
                    type="text"
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    placeholder="613123456789"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الفئة التصنيفية
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">(بدون فئة)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    وحدة القياس الأساسية
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {REFERENCE_UNITS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nameAr} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    سعر البيع (د.ج)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    تكلفة الشراء التقديرية (د.ج)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formCost}
                    onChange={(e) => setFormCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Variants Toggle */}
              {!editingProductId && (
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 bg-slate-850 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={formHasVariants}
                      onChange={(e) => setFormHasVariants(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        المنتج يحتوي على متغيرات (ألوان أو أحجام أو سعات)
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        سيتم إنشاء سجلات في جدول `product_variants` وتوليد `stock_items` تلقائياً عبر مشغلات SQLite.
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {/* Variants Dynamic Rows */}
              {!editingProductId && formHasVariants && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      إضافة المتغيرات (SKU & Barcodes)
                    </span>
                    <button
                      type="button"
                      onClick={handleAddVariantRow}
                      className="text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold px-3 py-1 rounded-lg border border-indigo-500/30 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إضافة متغير
                    </button>
                  </div>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {variantDrafts.map((row, idx) => (
                      <div key={row.id} className="grid grid-cols-12 gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800 items-center">
                        <div className="col-span-4">
                          <input
                            type="text"
                            placeholder="رمز الـ SKU (إلزامي)"
                            value={row.sku}
                            onChange={(e) => {
                              const updated = [...variantDrafts];
                              updated[idx].sku = e.target.value.toUpperCase();
                              setVariantDrafts(updated);
                            }}
                            className="w-full bg-slate-850 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] font-mono text-emerald-400 placeholder-slate-500"
                          />
                        </div>

                        <div className="col-span-3">
                          <input
                            type="text"
                            placeholder="اللون (مثال: أبيض)"
                            value={row.color}
                            onChange={(e) => {
                              const updated = [...variantDrafts];
                              updated[idx].color = e.target.value;
                              setVariantDrafts(updated);
                            }}
                            className="w-full bg-slate-850 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-white placeholder-slate-500"
                          />
                        </div>

                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="القياس (M/L)"
                            value={row.size}
                            onChange={(e) => {
                              const updated = [...variantDrafts];
                              updated[idx].size = e.target.value;
                              setVariantDrafts(updated);
                            }}
                            className="w-full bg-slate-850 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-white placeholder-slate-500"
                          />
                        </div>

                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="باركود فرعي"
                            value={row.barcode}
                            onChange={(e) => {
                              const updated = [...variantDrafts];
                              updated[idx].barcode = e.target.value;
                              setVariantDrafts(updated);
                            }}
                            className="w-full bg-slate-850 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] font-mono text-slate-300 placeholder-slate-500"
                          />
                        </div>

                        <div className="col-span-1 text-center">
                          {variantDrafts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(row.id)}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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
                  {editingProductId ? 'حفظ التعديلات' : 'إنشاء المنتج في قاعدة البيانات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
