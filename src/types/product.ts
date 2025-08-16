import { Tool } from './index';

// Enhanced product interface extending the existing Tool interface
export interface EnhancedTool extends Tool {
  // Additional product details
  specifications?: ProductSpecification[];
  gallery?: ProductImage[];
  reviews?: ProductReview[];
  relatedProducts?: string[]; // Array of product codes
  accessories?: string[]; // Array of accessory product codes
  bundles?: ProductBundle[];
  
  // Enhanced metadata
  brand?: string;
  model?: string;
  sku?: string;
  weight?: number; // in kg
  dimensions?: ProductDimensions;
  warranty?: WarrantyInfo;
  
  // Inventory
  stock?: number;
  lowStockThreshold?: number;
  
  // SEO and content
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  tags?: string[];
}

export interface ProductSpecification {
  category: string;
  items: SpecificationItem[];
}

export interface SpecificationItem {
  label: string;
  value: string;
  unit?: string;
  important?: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isPrimary?: boolean;
  thumbnail?: string;
  order: number;
}

export interface ProductReview {
  id: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string;
  verified?: boolean;
  helpful?: number;
}

export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: BundleProduct[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  popular?: boolean;
}

export interface BundleProduct {
  productCode: string;
  quantity: number;
  required: boolean;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'm' | 'mm';
}

export interface WarrantyInfo {
  duration: number;
  unit: 'months' | 'years';
  type: 'manufacturer' | 'extended' | 'store';
  description?: string;
  coverage?: string[];
}

// Product recommendation types
export interface ProductRecommendation {
  type: 'frequently-bought' | 'alternatives' | 'accessories' | 'upgrades';
  products: RecommendedProduct[];
  title: string;
  description?: string;
}

export interface RecommendedProduct {
  product: EnhancedTool;
  reason?: string;
  confidence: number; // 0-1
  savings?: number;
}

// Product comparison
export interface ProductComparison {
  products: EnhancedTool[];
  categories: ComparisonCategory[];
}

export interface ComparisonCategory {
  name: string;
  attributes: ComparisonAttribute[];
}

export interface ComparisonAttribute {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'rating';
  unit?: string;
  important?: boolean;
}

// Trust signals and badges
export interface TrustSignal {
  type: 'guarantee' | 'security' | 'shipping' | 'support' | 'quality';
  title: string;
  description: string;
  icon: string;
  verified?: boolean;
}

// Urgency and social proof
export interface UrgencyIndicator {
  type: 'stock' | 'time' | 'demand' | 'price';
  message: string;
  level: 'low' | 'medium' | 'high';
  expiresAt?: string;
}

export interface SocialProofData {
  recentPurchases: RecentPurchase[];
  viewingCount: number;
  popularityRank?: number;
  categoryRank?: number;
}

export interface RecentPurchase {
  customerName: string;
  productName: string;
  location?: string;
  timeAgo: string;
}

// Cart enhancements
export interface CartDiscount {
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  threshold?: number;
  description: string;
  code?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  free?: boolean;
  threshold?: number;
}

// Checkout flow
export interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
  optional?: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fee?: number;
  installments?: PaymentInstallment[];
}

export interface PaymentInstallment {
  months: number;
  monthlyAmount: number;
  totalAmount: number;
  interestRate: number;
}
