import { createClient } from '@supabase/supabase-js';

// 🔧 CONFIGURACIÓN: Claves de tu proyecto Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qjrsnanzhcyatdrqrgbz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcnNuYW56aGN5YXRkcnFyZ2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0Njc0MTAsImV4cCI6MjA3MTA0MzQxMH0.WiHa_G7M9bQbBeTuC4fqKychjNGga0nXUcm9M4K3vbw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para la base de datos
export interface DatabaseTenant {
  id: string;
  slug: string;
  domain?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'starter' | 'professional' | 'enterprise';
  
  // Configuración como JSON
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  
  business: {
    name: string;
    industry: string;
    description: string;
    currency: string;
    language: string;
    timezone: string;
    contactInfo: {
      phone: string;
      email: string;
      address: string;
      city: string;
      region: string;
      whatsapp?: string;
    };
  };
  
  features: {
    enableWishlist: boolean;
    enableFilters: boolean;
    enableMultiCurrency: boolean;
    enableReviews: boolean;
    enableInventoryTracking: boolean;
    enableDiscountCodes: boolean;
    enableGuestCheckout: boolean;
    enableSocialLogin: boolean;
  };
  
  payment: {
    methods: string[];
    currencies: string[];
    taxRate: number;
    shippingCost: number;
    freeShippingThreshold?: number;
  };
  
  product: {
    customFields: any[];
    categories: string[];
    conditions: string[];
    brands: string[];
    defaultImagePlaceholder: string;
  };
  
  layout: {
    headerStyle: string;
    footerStyle: string;
    productGridLayout: string;
    productsPerPage: number;
    showProductCode: boolean;
    showStock: boolean;
    showDiscount: boolean;
  };
  
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface DatabaseProduct {
  id: string;
  tenant_id: string;
  code: string;
  name: string;
  condition: string;
  original_price?: number;
  price: number;
  description: string;
  features: string[];
  urgency?: string;
  cta_text?: string;
  discount?: string;
  image_url: string;
  stock: number;
  category?: string;
  brand?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
