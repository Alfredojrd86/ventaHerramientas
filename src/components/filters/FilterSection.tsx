import React from 'react';
import { FilterCategory, PriceRange } from '../../types/filters';

interface FilterSectionProps {
  category: FilterCategory;
  isExpanded: boolean;
  onToggle: () => void;
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  category,
  isExpanded,
  onToggle,
  value,
  onChange,
  className = '',
}) => {
  const handleMultiSelectChange = (optionValue: string) => {
    const currentValues = (value as string[]) || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(newValues);
  };

  const handleRangeChange = (field: 'min' | 'max', newValue: number) => {
    const currentRange = value as PriceRange || { min: category.min || 0, max: category.max || 1000000 };
    onChange({
      ...currentRange,
      [field]: newValue,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderFilterContent = () => {
    switch (category.type) {
      case 'multiselect':
        return (
          <div className="space-y-2">
            {category.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={((value as string[]) || []).includes(option.value)}
                  onChange={() => handleMultiSelectChange(option.value)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700 flex-1">
                  {option.label}
                </span>
                {option.count !== undefined && (
                  <span className="text-xs text-gray-500 ml-auto">
                    ({option.count})
                  </span>
                )}
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Todos</option>
            {category.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.count !== undefined && ` (${option.count})`}
              </option>
            ))}
          </select>
        );

      case 'range':
        const currentRange = value as PriceRange || { 
          min: category.min || 0, 
          max: category.max || 1000000 
        };
        
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mínimo
                </label>
                <input
                  type="number"
                  value={currentRange.min}
                  onChange={(e) => handleRangeChange('min', parseInt(e.target.value) || 0)}
                  min={category.min || 0}
                  max={category.max || 1000000}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Máximo
                </label>
                <input
                  type="number"
                  value={currentRange.max}
                  onChange={(e) => handleRangeChange('max', parseInt(e.target.value) || 1000000)}
                  min={category.min || 0}
                  max={category.max || 1000000}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="1000000"
                />
              </div>
            </div>
            
            {/* Range Slider */}
            <div className="px-1">
              <div className="relative">
                <input
                  type="range"
                  min={category.min || 0}
                  max={category.max || 1000000}
                  value={currentRange.min}
                  onChange={(e) => handleRangeChange('min', parseInt(e.target.value))}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ zIndex: 1 }}
                />
                <input
                  type="range"
                  min={category.min || 0}
                  max={category.max || 1000000}
                  value={currentRange.max}
                  onChange={(e) => handleRangeChange('max', parseInt(e.target.value))}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ zIndex: 2 }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{formatPrice(currentRange.min)}</span>
                <span>{formatPrice(currentRange.max)}</span>
              </div>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">
              {category.label}
            </span>
          </label>
        );

      default:
        return null;
    }
  };

  const hasActiveFilters = () => {
    if (!value) return false;
    
    switch (category.type) {
      case 'multiselect':
        return Array.isArray(value) && value.length > 0;
      case 'select':
        return value !== '';
      case 'range':
        const range = value as PriceRange;
        return range && (range.min > (category.min || 0) || range.max < (category.max || 1000000));
      case 'checkbox':
        return Boolean(value);
      default:
        return false;
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50 rounded-t-lg"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">
            {category.label}
          </span>
          {hasActiveFilters() && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {category.type === 'multiselect' && Array.isArray(value) 
                ? value.length 
                : '1'}
            </span>
          )}
        </div>
        
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
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

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="pt-3">
            {renderFilterContent()}
          </div>
          
          {hasActiveFilters() && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onChange(
                  category.type === 'multiselect' ? [] :
                  category.type === 'checkbox' ? false :
                  category.type === 'range' ? { min: category.min || 0, max: category.max || 1000000 } :
                  ''
                )}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Limpiar filtro
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
