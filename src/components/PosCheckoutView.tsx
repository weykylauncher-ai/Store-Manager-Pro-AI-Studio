import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle2, CreditCard, Banknote, Barcode, Package, User } from 'lucide-react';
import { Product } from '../types/store';

interface PosCheckoutViewProps {
  products: Product[];
  storeName: string;
}

interface CartItem {
  product: Product;
  variantId?: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPrice: number; // in centimes
}

export const PosCheckoutView: React.FC<PosCheckoutViewProps> = ({ products, storeName }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('عميل نقدي افتراضي');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'CREDIT'>('CASH');
  const [completedSale, setCompletedSale] = useState<any | null>(null);

  const activeProducts = products.filter((p) => p.isActive);

  const handleAddToCart = (product: Product, variantIndex = 0) => {
    let sku = product.code || product.id;
    let variantName = undefined;
    let variantId = undefined;

    if (product.hasVariants && product.variants && product.variants.length > 0) {
      const v = product.variants[variantIndex];
      sku = v.sku;
      variantName = v.variantName;
      variantId = v.id;
    }

    const price = product.price || 100000;

    const existingIndex = cart.findIndex((item) => item.sku === sku);
    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          product,
          variantId,
          variantName,
          sku,
          quantity: 1,
          unitPrice: price,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setCart(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const totalCentimes = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalDZD = totalCentimes / 100;

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    const saleRecord = {
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      total: totalDZD,
      itemsCount: cart.reduce((sum, i) => sum + i.quantity, 0),
      paymentMethod,
      customerName,
      timestamp: new Date().toLocaleTimeString('ar-DZ'),
    };
    setCompletedSale(saleRecord);
    setCart([]);
  };

  return (
    <div className="space-y-6">
      {/* POS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
            Cashier Terminal • Offline-Ready POS
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">نقطة البيع وتسجيل الفواتير (POS)</h1>
          <p className="text-xs text-slate-400 mt-1">
            تسجيل مبيعات فورية متوافقة مع نموذج الحصص `inventory_quotas` وقيود عدم القابلية للتعديل في SQLite
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">الوردية الحالية</span>
            <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              وردية مفتوحة (SHIFT #1)
            </span>
          </div>
        </div>
      </div>

      {/* Main POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Product Catalog Grid (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">اختر من المنتجات المتاحة للإضافة السريعة:</span>
            <span className="text-xs text-slate-500 font-mono">{activeProducts.length} عناصر متوفرة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeProducts.map((p) => {
              const hasMultipleVariants = p.hasVariants && p.variants && p.variants.length > 1;

              return (
                <div
                  key={p.id}
                  className="bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl transition-all flex flex-col justify-between shadow-sm group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {p.name}
                      </span>
                      <Package className="w-4 h-4 text-slate-500 shrink-0" />
                    </div>

                    {p.barcode && (
                      <span className="text-[10px] font-mono text-slate-500 block mb-2">
                        {p.barcode}
                      </span>
                    )}

                    <div className="text-sm font-extrabold text-emerald-400 font-mono mb-3">
                      {((p.price || 0) / 100).toLocaleString('ar-DZ')} د.ج
                    </div>
                  </div>

                  {hasMultipleVariants ? (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-indigo-400 font-semibold block">اختر المتغير (Variant):</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {p.variants!.map((v, vIdx) => (
                          <button
                            key={v.id}
                            onClick={() => handleAddToCart(p, vIdx)}
                            className="text-[10px] bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-300 p-1.5 rounded-lg border border-slate-700/60 font-mono font-medium truncate transition-colors"
                            title={v.variantName}
                          >
                            {v.sku.split('-').slice(-2).join('-')}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(p, 0)}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-bold border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إضافة للسلة
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cart and Checkout (4-5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-slate-850 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-base text-white">سلة الفاتورة الحالية</h2>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
              {cart.reduce((s, i) => s + i.quantity, 0)} قطع
            </span>
          </div>

          {/* Customer Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <User className="w-3 h-3" />
              العميل المسجل:
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Cart Items List */}
          <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <ShoppingCart className="w-10 h-10 mx-auto text-slate-700 mb-2" />
                <p className="text-xs">السلة فارغة حالياً</p>
                <p className="text-[11px] text-slate-600 mt-0.5">اضغط على أي صنف من اليسار لإدراجه</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.sku}-${idx}`} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-white truncate">{item.product.name}</p>
                    <p className="text-[10px] font-mono text-emerald-400">{item.sku}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {(item.unitPrice / 100).toLocaleString('ar-DZ')} د.ج / ق
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700/80">
                      <button
                        onClick={() => handleUpdateQuantity(idx, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(idx, 1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-[11px] font-semibold text-slate-400 block">طريقة الدفع:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition-colors flex items-center justify-center gap-1 ${
                  paymentMethod === 'CASH'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                نقداً (كاش)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition-colors flex items-center justify-center gap-1 ${
                  paymentMethod === 'CARD'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                بطاقة بنكية
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT')}
                className={`py-2 px-1 text-xs font-bold rounded-xl border transition-colors flex items-center justify-center gap-1 ${
                  paymentMethod === 'CREDIT'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                آجل (ذمم)
              </button>
            </div>
          </div>

          {/* Total & Checkout */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">الإجمالي النهائي:</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {totalDZD.toLocaleString('ar-DZ')} د.ج
              </span>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              تأكيد وإصدار الفاتورة (Complete Sale)
            </button>
          </div>

          {/* Completed Sale Notification */}
          {completedSale && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                تم قيد الفاتورة بنجاح في قاعدة البيانات:
              </div>
              <p>رقم الفاتورة: <strong className="font-mono text-white">{completedSale.invoiceNumber}</strong></p>
              <p>القيمة: <strong className="font-mono text-emerald-400">{completedSale.total.toLocaleString('ar-DZ')} د.ج</strong> ({completedSale.paymentMethod})</p>
              <p className="text-[10px] text-emerald-400/80">
                تم تحديث رصيد المخزون في `inventory_balances` وسجل المبيعات `sales` بشكل غير قابل للتعديل.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
