import React from 'react';
import { useTenantConfig } from '../contexts/TenantContext';

export default function DebugInfo() {
  const { tenantConfig, isLoading, error } = useTenantConfig();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🐛 Debug Info</h3>
      <div className="space-y-1">
        <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
        <div><strong>Error:</strong> {error || 'None'}</div>
        <div><strong>Tenant ID:</strong> {tenantConfig?.id || 'None'}</div>
        <div><strong>Tenant Slug:</strong> {tenantConfig?.slug || 'None'}</div>
        <div><strong>Business Name:</strong> {tenantConfig?.business?.name || 'None'}</div>
      </div>
    </div>
  );
}
