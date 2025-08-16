import React, { useState } from 'react';

interface StaticFilterBarProps {
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onFilterChange: (filters: { brand?: string; condition?: string; priceRange?: string }) => void;
  className?: string;
}

const StaticFilterBar: React.FC<StaticFilterBarProps> = ({
  onSearchChange,
  onSortChange,
  onFilterChange,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedSort, setSelectedSort] = useState('relevance');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedBrand(value);
    onFilterChange({ brand: value, condition: selectedCondition, priceRange: selectedPriceRange });
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCondition(value);
    onFilterChange({ brand: selectedBrand, condition: value, priceRange: selectedPriceRange });
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPriceRange(value);
    onFilterChange({ brand: selectedBrand, condition: selectedCondition, priceRange: value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSort(value);
    onSortChange(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedCondition('');
    setSelectedPriceRange('');
    setSelectedSort('relevance');
    onSearchChange('');
    onSortChange('relevance');
    onFilterChange({});
  };

  const hasActiveFilters = searchQuery || selectedBrand || selectedCondition || selectedPriceRange;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar herramientas..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <select
            value={selectedBrand}
            onChange={handleBrandChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Todas las marcas</option>
            <option value="makita">Makita</option>
            <option value="bosch">Bosch</option>
            <option value="irwin">Irwin</option>
            <option value="kreg">Kreg</option>
            <option value="milescraft">Milescraft</option>
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={selectedCondition}
            onChange={handleConditionChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="usado-bueno">Usado - Buen Estado</option>
            <option value="nuevo">Nuevo</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <select
            value={selectedPriceRange}
            onChange={handlePriceRangeChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Todos los precios</option>
            <option value="0-50000">Hasta $50.000</option>
            <option value="50000-100000">$50.000 - $100.000</option>
            <option value="100000-300000">$100.000 - $300.000</option>
            <option value="300000-500000">$300.000 - $500.000</option>
            <option value="500000-999999">Más de $500.000</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select
            value={selectedSort}
            onChange={handleSortChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="discount-desc">Mayor Descuento</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Búsqueda: "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearchChange('');
                }}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
              >
                ×
              </button>
            </span>
          )}
          {selectedBrand && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Marca: {selectedBrand.charAt(0).toUpperCase() + selectedBrand.slice(1)}
              <button
                onClick={() => handleBrandChange({ target: { value: '' } } as any)}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
              >
                ×
              </button>
            </span>
          )}
          {selectedCondition && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              Estado: {selectedCondition.replace('-', ' ')}
              <button
                onClick={() => handleConditionChange({ target: { value: '' } } as any)}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-yellow-200"
              >
                ×
              </button>
            </span>
          )}
          {selectedPriceRange && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              Precio: ${selectedPriceRange.replace('-', ' - $')}
              <button
                onClick={() => handlePriceRangeChange({ target: { value: '' } } as any)}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StaticFilterBar;
