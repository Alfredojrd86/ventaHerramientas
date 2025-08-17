import React, { useState, useEffect, useMemo } from 'react';
import { useTenantConfig } from '../contexts/TenantContext';
import { ProductService } from '../services/productService';
import { Tool } from '../types';
import GenericProductCard, { GenericProductListItem } from './GenericProductCard';

interface ProductGridProps {
  readonly className?: string;
  readonly searchQuery?: string;
  readonly category?: string;
}

export default function ProductGrid({ 
  className = '',
  searchQuery = '',
  category = ''
}: ProductGridProps) {
  const { tenantConfig, layout } = useTenantConfig();
  const [products, setProducts] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(layout.productGridLayout as 'grid' | 'list');

  // Cargar productos desde Supabase
  useEffect(() => {
    const loadProducts = async () => {
      // Verificar que tenemos un tenant ID válido
      if (!tenantConfig?.id || tenantConfig.id === 'demo-tenant') {
        console.warn('No hay tenant ID válido, usando productos vacíos');
        setProducts([]);
        setIsLoading(false);
        return;
      }

      console.log('Loading products for tenant:', tenantConfig.id);

      try {
        setIsLoading(true);
        setError('');
        
        let data: Tool[];
        
        if (searchQuery) {
          data = await ProductService.searchProducts(tenantConfig.id, searchQuery);
        } else if (category) {
          data = await ProductService.getProductsByCategory(tenantConfig.id, category);
        } else {
          data = await ProductService.getTenantProducts(tenantConfig.id);
        }
        
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Error al cargar los productos. Verifica la conexión a la base de datos.');
        setProducts([]); // Mostrar lista vacía en lugar de pantalla en blanco
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [tenantConfig?.id, searchQuery, category]);

  // Paginación
  const itemsPerPage = layout.productsPerPage;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tenant-primary"></div>
          <span className="ml-3 text-gray-600">Cargando productos...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-tenant-primary text-white rounded-lg hover:opacity-90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con controles */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {searchQuery && (
            <span className="mr-4">
              Resultados para: <strong>"{searchQuery}"</strong>
            </span>
          )}
          {category && (
            <span className="mr-4">
              Categoría: <strong>{category}</strong>
            </span>
          )}
          Mostrando {paginatedProducts.length} de {products.length} productos
        </div>
        
        {/* Toggle de vista */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Vista:</span>
          <button
            onClick={toggleViewMode}
            className="flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {viewMode === 'grid' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Lista
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid o Lista de productos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <GenericProductCard
              key={product.id}
              product={product}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedProducts.map((product) => (
            <GenericProductListItem
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

      {/* Mensaje si no hay productos */}
      {products.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? `No hay productos que coincidan con "${searchQuery}"`
              : category
              ? `No hay productos en la categoría "${category}"`
              : 'No hay productos disponibles'
            }
          </p>
          {(searchQuery || category) && (
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.location.reload();
              }}
              className="px-4 py-2 bg-tenant-primary text-white rounded-lg hover:opacity-90"
            >
              Ver todos los productos
            </button>
          )}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Mostrar solo algunas páginas para evitar overflow
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-tenant-primary text-white'
                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span key={page} className="px-2 py-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Información de paginación */}
      {totalPages > 1 && (
        <div className="text-center text-sm text-gray-500">
          Página {currentPage} de {totalPages}
        </div>
      )}
    </div>
  );
}
