import React, { useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function SupabaseSetup() {
  const [copied, setCopied] = useState<string>('');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const sqlScript = `-- 🗄️ SCRIPT SQL PARA SUPABASE
-- Copia y pega esto en el SQL Editor de Supabase

-- 1. Tabla de tenants (tiendas)
CREATE TABLE tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  
  -- Configuraciones como JSONB para flexibilidad
  branding JSONB DEFAULT '{
    "logo": "",
    "primaryColor": "#1e40af",
    "secondaryColor": "#1e3a8a", 
    "accentColor": "#3b82f6",
    "fontFamily": "Inter, sans-serif"
  }'::jsonb,
  
  business JSONB DEFAULT '{
    "name": "Mi Tienda",
    "industry": "general",
    "description": "Tienda en línea",
    "currency": "USD",
    "language": "es",
    "timezone": "America/Santiago",
    "contactInfo": {
      "phone": "",
      "email": "",
      "address": "",
      "city": "",
      "region": ""
    }
  }'::jsonb,
  
  features JSONB DEFAULT '{
    "enableWishlist": true,
    "enableFilters": true,
    "enableMultiCurrency": false,
    "enableReviews": false,
    "enableInventoryTracking": true,
    "enableDiscountCodes": false,
    "enableGuestCheckout": true,
    "enableSocialLogin": false
  }'::jsonb,
  
  payment JSONB DEFAULT '{
    "methods": ["mercadopago"],
    "currencies": ["USD"],
    "taxRate": 0.19,
    "shippingCost": 0,
    "freeShippingThreshold": 50
  }'::jsonb,
  
  product JSONB DEFAULT '{
    "customFields": [],
    "categories": ["General"],
    "conditions": ["Nuevo", "Usado"],
    "brands": [],
    "defaultImagePlaceholder": "/placeholder.jpg"
  }'::jsonb,
  
  layout JSONB DEFAULT '{
    "headerStyle": "standard",
    "footerStyle": "standard", 
    "productGridLayout": "grid",
    "productsPerPage": 12,
    "showProductCode": true,
    "showStock": true,
    "showDiscount": true
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  condition TEXT DEFAULT 'Nuevo',
  original_price DECIMAL(12,2),
  price DECIMAL(12,2) NOT NULL,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  urgency TEXT,
  cta_text TEXT DEFAULT 'Comprar Ahora',
  discount TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  category TEXT,
  brand TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para búsqueda rápida
  UNIQUE(tenant_id, code)
);

-- 3. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Triggers para updated_at
CREATE TRIGGER update_tenants_updated_at 
  BEFORE UPDATE ON tenants 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Políticas de seguridad (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver/editar sus propios tenants
CREATE POLICY "Users can view their own tenants" ON tenants
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own tenants" ON tenants
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own tenants" ON tenants
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Los usuarios solo pueden ver/editar productos de sus tenants
CREATE POLICY "Users can view products of their tenants" ON products
  FOR SELECT USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage products of their tenants" ON products
  FOR ALL USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    )
  );

-- 6. Insertar tu tenant inicial (CAMBIA LOS VALORES)
INSERT INTO tenants (
  slug,
  owner_id,
  business,
  branding,
  product
) VALUES (
  'mi-taller', -- 🔧 CAMBIA ESTO por el slug de tu taller
  auth.uid(), -- Esto tomará tu user ID cuando ejecutes desde Supabase autenticado
  '{
    "name": "Herramientas Mi Taller",
    "industry": "carpinteria", 
    "description": "Herramientas profesionales de carpintería y construcción",
    "currency": "CLP",
    "language": "es",
    "timezone": "America/Santiago",
    "contactInfo": {
      "phone": "+56 9 XXXX XXXX",
      "email": "contacto@mitaller.cl",
      "address": "Tu dirección",
      "city": "Tu ciudad",
      "region": "Tu región"
    }
  }',
  '{
    "logo": "/logo-taller.png",
    "primaryColor": "#1e40af",
    "secondaryColor": "#1e3a8a",
    "accentColor": "#3b82f6", 
    "fontFamily": "Inter, sans-serif"
  }',
  '{
    "categories": ["Sierras", "Fresadoras", "Lijadoras", "Prensas", "Accesorios"],
    "conditions": ["Nuevo", "Usado - Excelente", "Usado - Buen Estado"],
    "brands": ["Makita", "Bosch", "DeWalt", "Milwaukee"],
    "customFields": [],
    "defaultImagePlaceholder": "/placeholder-tool.jpg"
  }'
);

-- 7. Índices para performance
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_owner ON tenants(owner_id);
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_active ON products(tenant_id, is_active);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('spanish', name || ' ' || description));`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-900">¡Configuración Requerida!</h2>
            <p className="text-blue-700">Necesitas configurar Supabase para usar la funcionalidad completa</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Paso 1: Crear cuenta */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold">Crear cuenta en Supabase</h3>
          </div>
          <div className="pl-11">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Ve a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></li>
              <li>Crea una cuenta gratuita</li>
              <li>**New Project** → Nombre: `venta-carpinteria`</li>
              <li>**Región**: Elige la más cercana (US East para Latam)</li>
              <li>**Password**: Guarda bien la contraseña de la DB</li>
            </ol>
          </div>
        </div>

        {/* Paso 2: Obtener claves */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold">Obtener las claves de API</h3>
          </div>
          <div className="pl-11">
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
              <li>Una vez creado el proyecto, ve a **Settings** → **API**</li>
              <li>Copia estas 2 claves:</li>
            </ol>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-white p-2 rounded border">https://tu-proyecto.supabase.co</code>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-medium text-gray-700 mb-1">anon public key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-white p-2 rounded border">eyJhbGciOiJIUzI1NiIs...</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paso 3: Configurar tablas */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold">Crear las tablas en Supabase</h3>
          </div>
          <div className="pl-11">
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
              <li>En tu proyecto Supabase, ve a **SQL Editor**</li>
              <li>Copia y pega el siguiente script SQL completo:</li>
              <li>Haz clic en **RUN** para ejecutar</li>
            </ol>

            <div className="relative">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => copyToClipboard(sqlScript, 'sql')}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded flex items-center gap-2 text-sm"
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                  {copied === 'sql' ? 'Copiado!' : 'Copiar SQL'}
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                {sqlScript}
              </pre>
            </div>
          </div>
        </div>

        {/* Paso 4: Crear usuario */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">4</span>
            </div>
            <h3 className="text-lg font-semibold">Crear tu primera cuenta de usuario</h3>
          </div>
          <div className="pl-11">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>En Supabase, ve a **Authentication** → **Users**</li>
              <li>**Add user** → Pon tu email y contraseña</li>
              <li>¡Ya puedes hacer login real en el dashboard!</li>
            </ol>
          </div>
        </div>

        {/* Estado actual */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">¡Configuración Detectada!</h3>
              <p className="text-green-700">Las claves de Supabase ya están configuradas en el código</p>
            </div>
          </div>
          <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Configurada</label>
              <code className="text-sm text-green-700 break-all">https://qjrsnanzhcyatdrqrgbz.supabase.co</code>
            </div>
            <div className="bg-white p-3 rounded border">
              <label className="block text-sm font-medium text-gray-700 mb-1">Clave Anon</label>
              <code className="text-sm text-green-700">eyJhbGciOiJIUzI1NiIs...✓</code>
            </div>
          </div>
        </div>

        {/* Siguiente paso */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">¿Todo listo?</h3>
              <p className="text-blue-700">
                Una vez que hayas ejecutado el script SQL y creado tu usuario, 
                ve a la pestaña **🔧 Productos** para empezar a agregar las herramientas de tu taller.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
