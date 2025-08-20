import React, { useState, useEffect } from 'react';
import { OwnerData, UpdateOwnerData, OwnerService } from '../../services/ownerService';

interface OwnerEditorProps {
  owner: OwnerData;
  onSave: (ownerId: string, updates: UpdateOwnerData) => Promise<void>;
  onCancel: () => void;
  onStatusChange: (ownerId: string, newStatus: 'active' | 'inactive' | 'suspended') => Promise<void>;
}

export default function OwnerEditor({ 
  owner, 
  onSave, 
  onCancel, 
  onStatusChange 
}: OwnerEditorProps) {
  const [formData, setFormData] = useState<UpdateOwnerData>({
    name: owner.name,
    email: owner.email,
    status: owner.status,
    subscriptionStatus: owner.subscriptionStatus,
    plan: owner.plan
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleInputChange = (field: keyof UpdateOwnerData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onSave(owner.id, formData);
    } catch (err) {
      setError('Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      setIsLoading(true);
      setError(null);
      await onStatusChange(owner.id, newStatus);
      setFormData(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError('Error al cambiar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentAction = async (action: 'markInactive' | 'reactivate') => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (action === 'markInactive') {
        await OwnerService.markOwnerInactiveForPayment(owner.id);
        setFormData(prev => ({ ...prev, status: 'inactive' }));
      } else {
        await OwnerService.reactivateOwnerAfterPayment(owner.id);
        setFormData(prev => ({ ...prev, status: 'active' }));
      }
      
      setShowPaymentModal(false);
    } catch (err) {
      setError('Error al procesar la acción de pago');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'starter': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Editar Owner: {owner.name}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Información del Owner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Owner
              </label>
              <input
                type="text"
                value={owner.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan
              </label>
              <select
                value={formData.plan || 'starter'}
                onChange={(e) => handleInputChange('plan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="starter">Starter</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {/* Estado y Suscripción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="suspended">Suspendido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de Suscripción
              </label>
              <select
                value={formData.subscriptionStatus || 'active'}
                onChange={(e) => handleInputChange('subscriptionStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Activa</option>
                <option value="expired">Expirada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Estadísticas del Owner</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{owner.tenantCount}</div>
                <div className="text-sm text-gray-500">Tiendas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {owner.status === 'active' ? 'Activo' : 'Inactivo'}
                </div>
                <div className="text-sm text-gray-500">Estado</div>
              </div>
            </div>
          </div>

          {/* Acciones de Pago */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-yellow-800 mb-3">Acciones de Pago</h4>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center px-3 py-2 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Gestionar Pagos
              </button>
              
              <button
                onClick={() => handleStatusChange('suspended')}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Suspender
              </button>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Gestión de Pagos */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Gestión de Pagos - {owner.name}
              </h4>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-red-800 mb-2">Marcar como Inactivo</h5>
                  <p className="text-sm text-red-700 mb-3">
                    Esta acción marcará al owner como inactivo por falta de pago, 
                    desactivando todas sus tiendas.
                  </p>
                  <button
                    onClick={() => handlePaymentAction('markInactive')}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    Marcar Inactivo por Falta de Pago
                  </button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Reactivar después del Pago</h5>
                  <p className="text-sm text-green-700 mb-3">
                    Esta acción reactivará al owner y todas sus tiendas después de confirmar el pago.
                  </p>
                  <button
                    onClick={() => handlePaymentAction('reactivate')}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    Reactivar después del Pago
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
