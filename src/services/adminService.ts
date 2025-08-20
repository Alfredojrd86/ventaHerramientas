import { supabase } from '../config/supabase';
import { TenantConfig } from '../types/tenant';
import { Tool } from '../types';

export interface OwnerInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  tenants: TenantInfo[];
}

export interface TenantInfo {
  id: string;
  slug: string;
  businessName: string;
  status: string;
  plan: string;
  productCount: number;
  products: Tool[];
}

export class AdminService {
  // Obtener todos los owners con sus tiendas y productos
  static async getOwnersHierarchy(): Promise<OwnerInfo[]> {
    try {
      // Obtener todos los tenants con información del owner
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        throw tenantsError;
      }

      // Obtener todos los productos
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      // Agrupar la información por owner_id
      const ownersMap = new Map<string, OwnerInfo>();

      // Procesar tenants y agrupar por owner
      tenants?.forEach(tenant => {
        const ownerId = tenant.owner_id;
        
        if (!ownersMap.has(ownerId)) {
          // Crear nuevo owner
          const ownerInfo: OwnerInfo = {
            id: ownerId,
            email: `Owner ${ownerId.slice(0, 8)}`, // ID truncado como identificador
            name: `Owner ${ownerId.slice(0, 8)}`, // ID truncado como identificador
            role: 'tenant_owner',
            tenants: []
          };
          ownersMap.set(ownerId, ownerInfo);
        }

        const owner = ownersMap.get(ownerId)!;
        const tenantProducts = products?.filter(p => p.tenant_id === tenant.id) || [];
        
        const tenantInfo: TenantInfo = {
          id: tenant.id,
          slug: tenant.slug,
          businessName: tenant.business?.name || 'Sin nombre',
          status: tenant.status,
          plan: tenant.plan,
          productCount: tenantProducts.length,
          products: tenantProducts.map(this.transformDatabaseToTool)
        };
        
        owner.tenants.push(tenantInfo);
      });

      return Array.from(ownersMap.values());
    } catch (error) {
      console.error('Error in getOwnersHierarchy:', error);
      throw error;
    }
  }

  // Obtener estadísticas generales del sistema
  static async getSystemStats(): Promise<{
    totalOwners: number;
    totalTenants: number;
    totalProducts: number;
    activeTenants: number;
    inactiveTenants: number;
  }> {
    try {
      const [owners, tenants, products] = await Promise.all([
        this.getOwnersHierarchy(),
        supabase.from('tenants').select('status'),
        supabase.from('products').select('id').eq('is_active', true)
      ]);

      const activeTenants = tenants.data?.filter(t => t.status === 'active').length || 0;
      const inactiveTenants = tenants.data?.filter(t => t.status !== 'active').length || 0;

      return {
        totalOwners: owners.length,
        totalTenants: tenants.data?.length || 0,
        totalProducts: products.data?.length || 0,
        activeTenants,
        inactiveTenants
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw error;
    }
  }

  // Transformar producto de base de datos a Tool
  private static transformDatabaseToTool(dbProduct: any): Tool {
    return {
      id: dbProduct.id,
      code: dbProduct.code,
      name: dbProduct.name,
      condition: dbProduct.condition,
      originalPrice: dbProduct.original_price || dbProduct.price,
      price: dbProduct.price,
      description: dbProduct.description,
      features: dbProduct.features || [],
      urgency: dbProduct.urgency || '',
      ctaText: dbProduct.cta_text || 'Comprar Ahora',
      discount: dbProduct.discount || '',
      image: dbProduct.image_url,
      stock: dbProduct.stock,
    };
  }
}
