import { Product, ProductCategory, UnitOfMeasure } from '../types/store';

export const REFERENCE_UNITS: UnitOfMeasure[] = [
  { id: 'UOM_PIECE', dimension: 'COUNT', nameAr: 'قطعة', nameFr: 'Pièce', symbol: 'pc', isFractional: false },
  { id: 'UOM_KG', dimension: 'WEIGHT', nameAr: 'كيلوغرام', nameFr: 'Kilogramme', symbol: 'kg', isFractional: true },
  { id: 'UOM_GRAM', dimension: 'WEIGHT', nameAr: 'غرام', nameFr: 'Gramme', symbol: 'g', isFractional: true },
  { id: 'UOM_METER', dimension: 'LENGTH', nameAr: 'متر', nameFr: 'Mètre', symbol: 'm', isFractional: true },
  { id: 'UOM_LITER', dimension: 'VOLUME', nameAr: 'لتر', nameFr: 'Litre', symbol: 'L', isFractional: true },
];

export const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'CAT_ELECTRONICS', tenantId: 'TENANT_DEFAULT', parentId: null, name: 'إلكترونيات وأجهزة', code: 'ELEC', isActive: true },
  { id: 'CAT_PHONES', tenantId: 'TENANT_DEFAULT', parentId: 'CAT_ELECTRONICS', name: 'هواتف ذكية وملحقاتها', code: 'PHONE', isActive: true },
  { id: 'CAT_FOOD', tenantId: 'TENANT_DEFAULT', parentId: null, name: 'مواد غذائية واستباقية', code: 'FOOD', isActive: true },
  { id: 'CAT_CLOTHING', tenantId: 'TENANT_DEFAULT', parentId: null, name: 'ألبسة وأحذية', code: 'CLOTH', isActive: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PROD_1',
    tenantId: 'TENANT_DEFAULT',
    categoryId: 'CAT_PHONES',
    baseUnitId: 'UOM_PIECE',
    name: 'شاحن سريع 65 واط تايب سي',
    code: 'CHG-65W',
    barcode: '693417772001',
    hasVariants: false,
    trackInventory: true,
    isActive: true,
    price: 350000, // 3,500.00 DZD
    cost: 220000,
    stockOnHand: 45,
  },
  {
    id: 'PROD_2',
    tenantId: 'TENANT_DEFAULT',
    categoryId: 'CAT_FOOD',
    baseUnitId: 'UOM_PIECE',
    name: 'زيت زيتون بكر ممتاز 1 لتر',
    code: 'OIL-EVOO-1L',
    barcode: '613123456789',
    hasVariants: false,
    trackInventory: true,
    isActive: true,
    price: 120000, // 1,200.00 DZD
    cost: 95000,
    stockOnHand: 120,
  },
  {
    id: 'PROD_VAR',
    tenantId: 'TENANT_DEFAULT',
    categoryId: 'CAT_CLOTHING',
    baseUnitId: 'UOM_PIECE',
    name: 'قميص قطني كلاسيكي فاخر',
    code: 'SHIRT-OXFORD',
    barcode: null,
    hasVariants: true,
    trackInventory: true,
    isActive: true,
    price: 450000,
    cost: 280000,
    stockOnHand: 84,
    variants: [
      {
        id: 'VAR_1',
        productId: 'PROD_VAR',
        tenantId: 'TENANT_DEFAULT',
        sku: 'SHIRT-OX-WHT-M',
        barcode: '613998877101',
        variantName: 'أبيض / قياس M',
        attributesJson: JSON.stringify({ color: 'أبيض', size: 'M' }),
        isActive: true,
      },
      {
        id: 'VAR_2',
        productId: 'PROD_VAR',
        tenantId: 'TENANT_DEFAULT',
        sku: 'SHIRT-OX-WHT-L',
        barcode: '613998877102',
        variantName: 'أبيض / قياس L',
        attributesJson: JSON.stringify({ color: 'أبيض', size: 'L' }),
        isActive: true,
      },
      {
        id: 'VAR_3',
        productId: 'PROD_VAR',
        tenantId: 'TENANT_DEFAULT',
        sku: 'SHIRT-OX-BLU-L',
        barcode: '613998877103',
        variantName: 'أزرق سماوي / قياس L',
        attributesJson: JSON.stringify({ color: 'أزرق سماوي', size: 'L' }),
        isActive: true,
      },
    ],
  },
];

export const CANONICAL_SCHEMA_METRICS = {
  version: 3,
  tablesCount: 56,
  indexesCount: 109,
  triggersCount: 188,
  durabilityMode: 'WAL (Full Synchronous: 2)',
  architectureVersion: 'Phase 1B Baseline v3.0',
  targetPlatform: 'Windows Desktop (Host) & Android POS Client',
  schemaVerificationStatus: '61 PASS / 0 FAIL / 1 NOT RUN',
};
