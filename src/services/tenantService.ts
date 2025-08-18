import { supabase, DatabaseTenant } from '../config/supabase';
import { TenantConfig } from '../types/tenant';

export class TenantService {
  // Obtener todos los tenants del usuario actual
  static async getUserTenants(): Promise<TenantConfig[]> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }

    return data.map(this.transformDatabaseToTenant);
  }

  // Obtener un tenant por slug
  static async getTenantBySlug(slug: string): Promise<TenantConfig | null> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No encontrado
      }
      console.error('Error fetching tenant:', error);
      throw error;
    }

    return this.transformDatabaseToTenant(data);
  }

  // Crear un nuevo tenant
  static async createTenant(tenantData: Partial<TenantConfig>): Promise<TenantConfig> {
    const dbTenant = this.transformTenantToDatabase(tenantData);
    
    const { data, error } = await supabase
      .from('tenants')
      .insert([dbTenant])
      .select()
      .single();

    if (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }

    return this.transformDatabaseToTenant(data);
  }

  // Actualizar un tenant
  static async updateTenant(id: string, updates: Partial<TenantConfig>): Promise<TenantConfig> {
    const dbUpdates = this.transformTenantToDatabase(updates);
    
    const { data, error } = await supabase
      .from('tenants')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }

    return this.transformDatabaseToTenant(data);
  }

  // Eliminar un tenant
  static async deleteTenant(id: string): Promise<void> {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tenant:', error);
      throw error;
    }
  }

  // Transformar de base de datos a tipo de aplicación
  private static transformDatabaseToTenant(dbTenant: DatabaseTenant): TenantConfig {
    return {
      id: dbTenant.id,
      slug: dbTenant.slug,
      domain: dbTenant.domain || undefined,
      status: dbTenant.status,
      plan: dbTenant.plan,
      branding: dbTenant.branding,
      business: dbTenant.business,
      features: dbTenant.features,
      payment: dbTenant.payment,
      product: dbTenant.product,
      layout: dbTenant.layout,
      createdAt: dbTenant.created_at,
      updatedAt: dbTenant.updated_at,
      ownerId: dbTenant.owner_id,
    };
  }

  // Transformar de tipo de aplicación a base de datos
  private static transformTenantToDatabase(tenant: Partial<TenantConfig>): Partial<DatabaseTenant> {
    const dbTenant: Partial<DatabaseTenant> = {};
    
    if (tenant.slug) dbTenant.slug = tenant.slug;
    if (tenant.domain) dbTenant.domain = tenant.domain;
    if (tenant.status) dbTenant.status = tenant.status;
    if (tenant.plan) dbTenant.plan = tenant.plan;
    if (tenant.branding) dbTenant.branding = tenant.branding;
    if (tenant.business) dbTenant.business = tenant.business;
    if (tenant.features) dbTenant.features = tenant.features;
    if (tenant.payment) dbTenant.payment = tenant.payment;
    if (tenant.product) dbTenant.product = tenant.product;
    if (tenant.layout) dbTenant.layout = tenant.layout;
    if (tenant.ownerId) dbTenant.owner_id = tenant.ownerId;

    return dbTenant;
  }
}
