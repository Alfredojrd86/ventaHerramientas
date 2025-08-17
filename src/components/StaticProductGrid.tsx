import React, { useState } from 'react';
import { Tool } from '../types';
import { tools } from '../data/tools';
import { useStaticFilters } from '../hooks/useStaticFilters';
import StaticFilterBar from './StaticFilterBar';
import EnhancedToolCard from './EnhancedToolCard';

interface StaticProductGridProps {
  onAddToCart?: (tool: Tool) => void;
  className?: string;
}

const StaticProductGrid: React.FC<StaticProductGridProps> = ({ 
  onAddToCart,
  className = '' 
}) => {
  const [quickViewTool, setQuickViewTool] = useState<Tool | null>(null);
  
  const {
    filteredTools,
    stats,
    updateSearch,
    updateSort,
    updateFilters,
    clearFilters,
  } = useStaticFilters(tools);

  const handleQuickView = (tool: Tool) => {
    setQuickViewTool(tool);
  };

  const closeQuickView = () => {
    setQuickViewTool(null);
  };

  return (
    <div className={className}>
      {/* Filter Bar */}
      <div className="mb-8">
        <StaticFilterBar
          onSearchChange={updateSearch}
          onSortChange={updateSort}
          onFilterChange={updateFilters}
        />
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {stats.hasActiveFilters ? (
            <span>
              Mostrando <span className="font-semibold">{stats.filtered}</span> de{' '}
              <span className="font-semibold">{stats.total}</span> productos
              {stats.activeFiltersCount > 0 && (
                <span className="ml-2 text-blue-600">
                  ({stats.activeFiltersCount} filtro{stats.activeFiltersCount !== 1 ? 's' : ''} activo{stats.activeFiltersCount !== 1 ? 's' : ''})
                </span>
              )}
            </span>
          ) : (
            <span>
              Mostrando <span className="font-semibold">{stats.total}</span> productos disponibles
            </span>
          )}
        </div>

        {stats.hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Limpiar todos los filtros
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <EnhancedToolCard
              key={tool.id}
              tool={tool}
              onQuickView={handleQuickView}

              showUrgency={true}
              showSocialProof={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 mb-6">
            Intenta ajustar los filtros o buscar con otros términos
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ver todos los productos
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewTool && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeQuickView}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Vista Rápida
                  </h3>
                  <button
                    onClick={closeQuickView}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <img
                    src={quickViewTool.image}
                    alt={quickViewTool.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{quickViewTool.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{quickViewTool.description}</p>
                    
                    <div className="mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {quickViewTool.condition}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                          ${quickViewTool.price.toLocaleString('es-CL')}
                        </span>
                        {quickViewTool.originalPrice > quickViewTool.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${quickViewTool.originalPrice.toLocaleString('es-CL')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Características:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {quickViewTool.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-3 h-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Aquí puedes agregar la lógica para agregar al carrito
                    closeQuickView();
                  }}
                >
                  Agregar al Carrito
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeQuickView}
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
};

export default StaticProductGrid;
