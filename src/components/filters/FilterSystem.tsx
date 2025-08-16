import React, { useState } from 'react';
import { FilterState } from '../../types/filters';
import { useFilterContext } from '../../contexts/FilterContext';
import { FILTER_CATEGORIES } from '../../constants/filterOptions';
import SearchBar from './SearchBar';
import FilterSection from './FilterSection';
import ActiveFilters from './ActiveFilters';

interface FilterSystemProps {
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

const FilterSystem: React.FC<FilterSystemProps> = ({
  isOpen = true,
  onToggle,
  className = '',
}) => {
  const { filters, updateFilter, clearFilters, activeFiltersCount } = useFilterContext();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['category', 'brand']) // Default expanded sections
  );

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const handleSearchChange = (query: string) => {
    updateFilter('searchQuery', query);
  };

  const handleClearAll = () => {
    clearFilters();
    // Reset expanded sections to default
    setExpandedSections(new Set(['category', 'brand']));
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Limpiar todo
            </button>
          )}
          
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label={isOpen ? 'Cerrar filtros' : 'Abrir filtros'}
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Search Bar */}
          <div>
            <SearchBar
              value={filters.searchQuery || ''}
              onChange={handleSearchChange}
              placeholder="Buscar herramientas..."
              className="w-full"
            />
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Filtros Activos
              </h3>
              <ActiveFilters />
            </div>
          )}

          {/* Filter Sections */}
          <div className="space-y-4">
            {FILTER_CATEGORIES.map((category) => (
              <FilterSection
                key={category.key}
                category={category}
                isExpanded={expandedSections.has(category.key)}
                onToggle={() => toggleSection(category.key)}
                value={filters[category.key as keyof FilterState]}
                onChange={(value) => updateFilter(category.key as keyof FilterState, value)}
              />
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="border-t border-gray-200 pt-4">
            <FilterSection
              category={{
                key: 'priceRange',
                label: 'Rango de Precio',
                type: 'range',
                min: 0,
                max: 1000000,
              }}
              isExpanded={expandedSections.has('priceRange')}
              onToggle={() => toggleSection('priceRange')}
              value={filters.priceRange}
              onChange={(value) => updateFilter('priceRange', value)}
            />
          </div>

          {/* Boolean Filters */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.discount || false}
                onChange={(e) => updateFilter('discount', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">
                Solo con descuento
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock !== false}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">
                En stock
              </span>
            </label>
          </div>

          {/* Filter Summary */}
          {activeFiltersCount > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="text-xs text-gray-500">
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSystem;
