import { supabase } from '../config/supabase';

export interface OwnerData {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  subscriptionStatus: 'active' | 'expired' | 'cancelled';
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  plan: 'starter' | 'professional' | 'enterprise';
  tenantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOwnerData {
  name?: string;
  email?: string;
  status?: 'active' | 'inactive' | 'suspended';
  subscriptionStatus?: 'active' | 'expired' | 'cancelled';
  plan?: 'starter' | 'professional' | 'enterprise';
}

export class OwnerService {
  // Obtener todos los owners con información de suscripción
  static async getAllOwners(): Promise<OwnerData[]> {
    try {
      // Obtener tenants agrupados por owner
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        throw tenantsError;
      }

      // Agrupar por owner_id y crear estructura de owner
      const ownersMap = new Map<string, OwnerData>();
      
      tenants?.forEach(tenant => {
        const ownerId = tenant.owner_id;
        
        if (!ownersMap.has(ownerId)) {
          // Crear nuevo owner
          const ownerData: OwnerData = {
            id: ownerId,
            email: `Owner ${ownerId.slice(0, 8)}`,
            name: `Owner ${ownerId.slice(0, 8)}`,
            role: 'tenant_owner',
            status: 'active', // Por defecto activo
            subscriptionStatus: 'active', // Por defecto activo
            plan: tenant.plan || 'starter',
            tenantCount: 0,
            createdAt: tenant.created_at,
            updatedAt: tenant.updated_at
          };
          ownersMap.set(ownerId, ownerData);
        }

        const owner = ownersMap.get(ownerId)!;
        owner.tenantCount++;
        
        // Actualizar plan si es más alto
        if (tenant.plan === 'enterprise' && owner.plan !== 'enterprise') {
          owner.plan = 'enterprise';
        } else if (tenant.plan === 'professional' && owner.plan === 'starter') {
          owner.plan = 'professional';
        }
      });

      return Array.from(ownersMap.values());
    } catch (error) {
      console.error('Error in getAllOwners:', error);
      throw error;
    }
  }

  // Obtener un owner específico
  static async getOwnerById(ownerId: string): Promise<OwnerData | null> {
    try {
      const owners = await this.getAllOwners();
      return owners.find(owner => owner.id === ownerId) || null;
    } catch (error) {
      console.error('Error getting owner by ID:', error);
      throw error;
    }
  }

  // Actualizar información del owner
  static async updateOwner(ownerId: string, updates: UpdateOwnerData): Promise<OwnerData> {
    try {
      // Por ahora, como no tenemos tabla de owners, simulamos la actualización
      // En una implementación real, esto se haría en una tabla de owners
      console.log('Updating owner:', ownerId, updates);
      
      // Retornar owner actualizado (simulado)
      const owner = await this.getOwnerById(ownerId);
      if (!owner) {
        throw new Error('Owner not found');
      }

      return {
        ...owner,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating owner:', error);
      throw error;
    }
  }

  // Cambiar estado del owner (activo/inactivo)
  static async toggleOwnerStatus(ownerId: string, newStatus: 'active' | 'inactive' | 'suspended'): Promise<void> {
    try {
      // Obtener todos los tenants del owner
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('id, status')
        .eq('owner_id', ownerId);

      if (tenantsError) {
        console.error('Error fetching owner tenants:', tenantsError);
        throw tenantsError;
      }

      // Actualizar estado de todos los tenants del owner
      const tenantIds = tenants?.map(t => t.id) || [];
      
      if (tenantIds.length > 0) {
        const { error: updateError } = await supabase
          .from('tenants')
          .update({ status: newStatus === 'active' ? 'active' : 'inactive' })
          .in('id', tenantIds);

        if (updateError) {
          console.error('Error updating tenant statuses:', updateError);
          throw updateError;
        }
      }

      console.log(`Owner ${ownerId} status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error toggling owner status:', error);
      throw error;
    }
  }

  // Marcar owner como inactivo por falta de pago
  static async markOwnerInactiveForPayment(ownerId: string): Promise<void> {
    try {
      await this.toggleOwnerStatus(ownerId, 'inactive');
      
      // Aquí se podría agregar lógica adicional como:
      // - Enviar notificación al owner
      // - Registrar en log de auditoría
      // - Actualizar métricas de facturación
      
      console.log(`Owner ${ownerId} marked as inactive due to payment issues`);
    } catch (error) {
      console.error('Error marking owner inactive for payment:', error);
      throw error;
    }
  }

  // Reactivar owner después del pago
  static async reactivateOwnerAfterPayment(ownerId: string): Promise<void> {
    try {
      await this.toggleOwnerStatus(ownerId, 'active');
      
      // Aquí se podría agregar lógica adicional como:
      // - Enviar confirmación de reactivación
      // - Actualizar fechas de pago
      // - Registrar en log de auditoría
      
      console.log(`Owner ${ownerId} reactivated after payment`);
    } catch (error) {
      console.error('Error reactivating owner:', error);
      throw error;
    }
  }

  // Obtener métricas de pagos del owner
  static async getOwnerPaymentMetrics(ownerId: string): Promise<{
    totalRevenue: number;
    lastPaymentAmount: number;
    paymentHistory: Array<{
      date: string;
      amount: number;
      status: string;
    }>;
  }> {
    try {
      // Por ahora retornamos datos simulados
      // En una implementación real, esto vendría de una tabla de pagos
      return {
        totalRevenue: 0,
        lastPaymentAmount: 0,
        paymentHistory: []
      };
    } catch (error) {
      console.error('Error getting owner payment metrics:', error);
      throw error;
    }
  }
}
