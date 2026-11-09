import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BootstrapView } from './components/BootstrapView';
import { ProductManagementView } from './components/ProductManagementView';
import { CategoryManagementView } from './components/CategoryManagementView';
import { SchemaExplorerView } from './components/SchemaExplorerView';
import { PosCheckoutView } from './components/PosCheckoutView';
import { FirstRunSetupModal } from './components/FirstRunSetupModal';
import { Product, ProductCategory, ProductVariant, UserSession } from './types/store';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data/canonicalData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'bootstrap' | 'products' | 'categories' | 'schema' | 'pos'>('bootstrap');

  // Tenant and Store state
  const [tenantName, setTenantName] = useState<string>(() => {
    return localStorage.getItem('smp_tenant_name') || 'المؤسسة الافتراضية للتجارة';
  });
  const [storeName, setStoreName] = useState<string>(() => {
    return localStorage.getItem('smp_store_name') || 'المتجر الرئيسي (Store 01)';
  });
  const [tenantId] = useState('TENANT_DEFAULT');

  // Categories state
  const [categories, setCategories] = useState<ProductCategory[]>(() => {
    const saved = localStorage.getItem('smp_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_CATEGORIES;
  });

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smp_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_PRODUCTS;
  });

  // User session
  const [session, setSession] = useState<UserSession | null>(() => {
    return {
      userId: 'USER_ADMIN_1',
      tenantId: 'TENANT_DEFAULT',
      storeId: 'STORE_DEFAULT',
      username: 'admin',
      fullName: 'مدير النظام (Administrator)',
      roles: ['ADMINISTRATOR'],
      permissions: [
        'SALE_CREATE',
        'INVENTORY_ADJUST',
        'PAYMENT_CREATE',
        'REPORT_VIEW',
        'PRODUCT_VIEW',
        'PRODUCT_CREATE',
        'PRODUCT_UPDATE',
        'PRODUCT_DEACTIVATE',
        'CATEGORY_CREATE',
        'CATEGORY_UPDATE',
        'CATEGORY_DEACTIVATE',
      ],
    };
  });

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('smp_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('smp_products', JSON.stringify(products));
  }, [products]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Handlers
  const handleAddProduct = (
    newProd: Omit<Product, 'id'>,
    variants?: Omit<ProductVariant, 'id' | 'productId' | 'tenantId'>[]
  ) => {
    const prodId = `PROD_${Date.now()}`;
    const formattedVariants: ProductVariant[] | undefined = variants?.map((v, i) => ({
      ...v,
      id: `VAR_${Date.now()}_${i + 1}`,
      productId: prodId,
      tenantId,
    }));

    const productWithId: Product = {
      ...newProd,
      id: prodId,
      variants: formattedVariants,
    };

    setProducts([productWithId, ...products]);
    showToast(`تم إنشاء المنتج "${newProd.name}" بنجاح في قاعدة البيانات.`);
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('تم حفظ تعديلات المنتج بنجاح.');
  };

  const handleToggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.isActive;
          showToast(next ? `تمت إعادة تفعيل المنتج "${p.name}".` : `تم تعطيل المنتج "${p.name}".`);
          return { ...p, isActive: next };
        }
        return p;
      })
    );
  };

  const handleAddCategory = (newCat: Omit<ProductCategory, 'id'>) => {
    const catId = `CAT_${Date.now()}`;
    setCategories([...categories, { ...newCat, id: catId }]);
    showToast(`تمت إضافة الفئة "${newCat.name}" بنجاح.`);
  };

  const handleUpdateCategory = (id: string, updates: Partial<ProductCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('تم تحديث الفئة بنجاح.');
  };

  const handleToggleCategoryActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isActive;
          showToast(next ? `تمت إعادة تفعيل الفئة "${c.name}".` : `تم تعطيل الفئة "${c.name}".`);
          return { ...c, isActive: next };
        }
        return c;
      })
    );
  };

  const handleCompleteSetup = (data: {
    tenantName: string;
    storeName: string;
    storeCode: string;
    adminFullName: string;
    adminUsername: string;
  }) => {
    setTenantName(data.tenantName);
    setStoreName(`${data.storeName} (${data.storeCode})`);
    localStorage.setItem('smp_tenant_name', data.tenantName);
    localStorage.setItem('smp_store_name', `${data.storeName} (${data.storeCode})`);

    setSession({
      userId: `USER_${Date.now()}`,
      tenantId: 'TENANT_DEFAULT',
      storeId: 'STORE_DEFAULT',
      username: data.adminUsername,
      fullName: data.adminFullName,
      roles: ['ADMINISTRATOR'],
      permissions: [
        'SALE_CREATE',
        'INVENTORY_ADJUST',
        'PAYMENT_CREATE',
        'REPORT_VIEW',
        'PRODUCT_VIEW',
        'PRODUCT_CREATE',
        'PRODUCT_UPDATE',
        'PRODUCT_DEACTIVATE',
        'CATEGORY_CREATE',
        'CATEGORY_UPDATE',
        'CATEGORY_DEACTIVATE',
      ],
    });

    showToast('تمت تهيئة المؤسسة والمتجر وحساب الإدارة بنجاح.');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        session={session}
        onLogout={() => {
          setSession(null);
          showToast('تم تسجيل الخروج بنجاح.');
        }}
        onResetSetup={() => setIsSetupModalOpen(true)}
        tenantName={tenantName}
        storeName={storeName}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'bootstrap' && (
          <BootstrapView
            onNavigateTab={setCurrentTab}
            storeName={storeName}
            tenantName={tenantName}
          />
        )}

        {currentTab === 'products' && (
          <ProductManagementView
            products={products}
            categories={categories}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onToggleActive={handleToggleProductActive}
            onNavigateToCategories={() => setCurrentTab('categories')}
            tenantId={tenantId}
          />
        )}

        {currentTab === 'categories' && (
          <CategoryManagementView
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onToggleActive={handleToggleCategoryActive}
            onBack={() => setCurrentTab('products')}
            tenantId={tenantId}
          />
        )}

        {currentTab === 'schema' && <SchemaExplorerView />}

        {currentTab === 'pos' && (
          <PosCheckoutView products={products} storeName={storeName} />
        )}
      </main>

      {/* Setup Modal */}
      <FirstRunSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onCompleteSetup={handleCompleteSetup}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
