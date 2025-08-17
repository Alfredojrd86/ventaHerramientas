// Tipos base para el sistema multi-tenant
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  whatsapp?: string;
}

export interface BrandingConfig {
  logo: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  customCSS?: string;
}

export interface BusinessConfig {
  name: string;
  industry: string;
  description: string;
  currency: string;
  language: string;
  timezone: string;
  contactInfo: ContactInfo;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface FeatureFlags {
  enableWishlist: boolean;
  enableFilters: boolean;
  enableMultiCurrency: boolean;
  enableReviews: boolean;
  enableInventoryTracking: boolean;
  enableDiscountCodes: boolean;
  enableGuestCheckout: boolean;
  enableSocialLogin: boolean;
}

export interface PaymentConfig {
  methods: string[]; // ['mercadopago', 'stripe', 'paypal', 'bank_transfer']
  currencies: string[];
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold?: number;
  mercadoPago?: {
    publicKey: string;
    accessToken: string;
  };
  stripe?: {
    publicKey: string;
    secretKey: string;
  };
}

export interface ProductConfig {
  // Configuración de campos de producto personalizables
  customFields: ProductField[];
  categories: string[];
  conditions: string[];
  brands: string[];
  defaultImagePlaceholder: string;
}

export interface ProductField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'textarea';
  required: boolean;
  options?: string[]; // Para select/multiselect
  defaultValue?: any;
}

export interface LayoutConfig {
  headerStyle: 'minimal' | 'standard' | 'hero';
  footerStyle: 'minimal' | 'standard' | 'extended';
  productGridLayout: 'grid' | 'list' | 'masonry';
  productsPerPage: number;
  showProductCode: boolean;
  showStock: boolean;
  showDiscount: boolean;
}

export interface TenantConfig {
  id: string;
  slug: string; // Para subdomain/path
  domain?: string; // Dominio custom opcional
  status: 'active' | 'inactive' | 'suspended';
  plan: 'starter' | 'professional' | 'enterprise';
  
  // Configuraciones principales
  branding: BrandingConfig;
  business: BusinessConfig;
  features: FeatureFlags;
  payment: PaymentConfig;
  product: ProductConfig;
  layout: LayoutConfig;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

// Configuración por defecto para nuevos tenants
export const DEFAULT_TENANT_CONFIG: Omit<TenantConfig, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'ownerId'> = {
  domain: undefined,
  status: 'active',
  plan: 'starter',
  
  branding: {
    logo: '/default-logo.png',
    primaryColor: '#1e40af', // blue-800
    secondaryColor: '#1e3a8a', // blue-900
    accentColor: '#3b82f6', // blue-500
    fontFamily: 'Inter, sans-serif',
  },
  
  business: {
    name: 'Mi Tienda',
    industry: 'general',
    description: 'Tienda en línea profesional',
    currency: 'CLP',
    language: 'es',
    timezone: 'America/Santiago',
    contactInfo: {
      phone: '',
      email: '',
      address: '',
      city: '',
      region: '',
    },
  },
  
  features: {
    enableWishlist: true,
    enableFilters: true,
    enableMultiCurrency: false,
    enableReviews: false,
    enableInventoryTracking: true,
    enableDiscountCodes: false,
    enableGuestCheckout: true,
    enableSocialLogin: false,
  },
  
  payment: {
    methods: ['mercadopago'],
    currencies: ['CLP'],
    taxRate: 0.19, // IVA Chile
    shippingCost: 8000,
    freeShippingThreshold: 50000,
  },
  
  product: {
    customFields: [],
    categories: ['General'],
    conditions: ['Nuevo', 'Usado - Excelente', 'Usado - Buen Estado'],
    brands: [],
    defaultImagePlaceholder: '/placeholder-product.jpg',
  },
  
  layout: {
    headerStyle: 'standard',
    footerStyle: 'standard',
    productGridLayout: 'grid',
    productsPerPage: 12,
    showProductCode: true,
    showStock: true,
    showDiscount: true,
  },
};
