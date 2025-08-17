import React, { useState, useMemo } from 'react';
import { useTenantConfig } from '../contexts/TenantContext';
import { tools } from '../data/tools';
import GenericProductCard, { GenericProductListItem } from './GenericProductCard';

interface GenericProductGridProps {
  products?: typeof tools;
  className?: string;
}

export default function GenericProductGrid({ 
  products = tools, 
  className = '' 
}: GenericProductGridProps) {
  const { layout } = useTenantConfig();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(layout.productGridLayout as 'grid' | 'list');

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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con controles */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
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
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros de búsqueda
          </p>
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
      <div className="text-center text-sm text-gray-500">
        Página {currentPage} de {totalPages}
      </div>
    </div>
  );
}
