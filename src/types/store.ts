export interface Tenant {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface Store {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

export interface ProductCategory {
  id: string;
  tenantId: string;
  parentId: string | null;
  name: string;
  code: string | null;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  tenantId: string;
  sku: string;
  barcode: string | null;
  variantName: string;
  attributesJson: string | null;
  isActive: boolean;
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string | null;
  baseUnitId: string;
  name: string;
  code: string | null;
  barcode: string | null;
  hasVariants: boolean;
  trackInventory: boolean;
  isActive: boolean;
  variants?: ProductVariant[];
  price?: number; // In centimes
  cost?: number; // In ticks/centimes
  stockOnHand?: number;
}

export interface UnitOfMeasure {
  id: string;
  dimension: string;
  nameAr: string;
  nameFr: string;
  symbol: string;
  isFractional: boolean;
}

export interface UserSession {
  userId: string;
  tenantId: string;
  storeId: string;
  username: string;
  fullName: string;
  roles: string[];
  permissions: string[];
}
