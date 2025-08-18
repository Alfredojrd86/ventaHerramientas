import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { ProductService } from '../services/productService';
import { supabase } from '../config/supabase';
import { Tool } from '../types';

export default function DiagnosticPanel() {
  const { tenant, isLoading: tenantLoading, error: tenantError } = useTenant();
  const [diagnostics, setDiagnostics] = useState({
    supabaseConnection: 'testing',
    tenantConfig: 'testing',
    productsCount: 'testing',
    productsData: 'testing',
  });
  const [products, setProducts] = useState<Tool[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, [tenant]);

  const runDiagnostics = async () => {
    const results = {
      supabaseConnection: 'testing',
      tenantConfig: 'testing',
      productsCount: 'testing',
      productsData: 'testing',
    };

    try {
      // Test 1: Conexión a Supabase
      console.log('🔍 Test 1: Probando conexión a Supabase...');
      const { data: testConnection, error: connectionError } = await supabase
        .from('products')
        .select('count', { count: 'exact', head: true });
      
      if (connectionError) {
        console.error('❌ Error de conexión:', connectionError);
        results.supabaseConnection = `error: ${connectionError.message}`;
      } else {
        console.log('✅ Conexión exitosa');
        results.supabaseConnection = 'success';
      }

      // Test 2: Configuración del tenant
      console.log('🔍 Test 2: Verificando tenant config...');
      console.log('Tenant ID:', tenant.id);
      console.log('Tenant slug:', tenant.slug);
      
      if (tenant.id && tenant.id !== 'demo-tenant') {
        results.tenantConfig = `success: ${tenant.id}`;
      } else {
        results.tenantConfig = `warning: usando tenant demo - ${tenant.id}`;
      }

      // Test 3: Contar productos del tenant
      console.log('🔍 Test 3: Contando productos del tenant...');
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id)
        .eq('is_active', true);

      if (countError) {
        console.error('❌ Error contando productos:', countError);
        results.productsCount = `error: ${countError.message}`;
      } else {
        console.log(`✅ Productos encontrados: ${count}`);
        results.productsCount = `success: ${count} productos`;
      }

      // Test 4: Cargar productos usando ProductService
      console.log('🔍 Test 4: Cargando productos con ProductService...');
      try {
        const productsData = await ProductService.getTenantProducts(tenant.id);
        console.log('✅ Productos cargados:', productsData.length);
        console.log('Primer producto:', productsData[0]);
        setProducts(productsData);
        results.productsData = `success: ${productsData.length} productos cargados`;
      } catch (serviceError) {
        console.error('❌ Error en ProductService:', serviceError);
        results.productsData = `error: ${serviceError}`;
      }

    } catch (globalError) {
      console.error('❌ Error global en diagnósticos:', globalError);
    }

    setDiagnostics(results);
  };

  const getStatusColor = (status: string) => {
    if (status.startsWith('success')) return 'text-green-600 bg-green-50';
    if (status.startsWith('error')) return 'text-red-600 bg-red-50';
    if (status.startsWith('warning')) return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getStatusIcon = (status: string) => {
    if (status.startsWith('success')) return '✅';
    if (status.startsWith('error')) return '❌';
    if (status.startsWith('warning')) return '⚠️';
    return '🔄';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700"
      >
        📊 Mostrar Diagnóstico
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">🔍 Panel de Diagnóstico</h3>
        <div className="flex gap-2">
          <button
            onClick={runDiagnostics}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            🔄 Recargar
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className={`p-2 rounded ${getStatusColor(diagnostics.supabaseConnection)}`}>
          <span className="mr-2">{getStatusIcon(diagnostics.supabaseConnection)}</span>
          <strong>Supabase:</strong> {diagnostics.supabaseConnection}
        </div>

        <div className={`p-2 rounded ${getStatusColor(diagnostics.tenantConfig)}`}>
          <span className="mr-2">{getStatusIcon(diagnostics.tenantConfig)}</span>
          <strong>Tenant:</strong> {diagnostics.tenantConfig}
        </div>

        <div className={`p-2 rounded ${getStatusColor(diagnostics.productsCount)}`}>
          <span className="mr-2">{getStatusIcon(diagnostics.productsCount)}</span>
          <strong>Conteo:</strong> {diagnostics.productsCount}
        </div>

        <div className={`p-2 rounded ${getStatusColor(diagnostics.productsData)}`}>
          <span className="mr-2">{getStatusIcon(diagnostics.productsData)}</span>
          <strong>Carga:</strong> {diagnostics.productsData}
        </div>

        {tenantError && (
          <div className="p-2 rounded text-red-600 bg-red-50">
            <span className="mr-2">❌</span>
            <strong>Error Tenant:</strong> {tenantError}
          </div>
        )}
      </div>

      {products.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <strong>Primer producto:</strong><br/>
            {products[0].name} - ${products[0].price}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Tenant ID: {tenant.id}<br/>
        Slug: {tenant.slug}
      </div>
    </div>
  );
}
