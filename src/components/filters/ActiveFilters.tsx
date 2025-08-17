import React from 'react';
import { useFilterContext } from '../../contexts/FilterContext';
import { FILTER_CATEGORIES } from '../../constants/filterOptions';

const ActiveFilters: React.FC = () => {
  const { filters, updateFilter, resetFilter } = useFilterContext();

  const getFilterDisplayValue = (key: string, value: any): string[] => {
    const category = FILTER_CATEGORIES.find(cat => cat.key === key);
    
    switch (key) {
      case 'searchQuery':
        return value ? [`"${value}"`] : [];
      
      case 'category':
      case 'brand':
      case 'condition':
        if (!Array.isArray(value) || value.length === 0) return [];
        return value.map(v => {
          const option = category?.options?.find(opt => opt.value === v);
          return option?.label || v;
        });
      
      case 'priceRange':
        if (!value || (value.min === 0 && value.max === 1000000)) return [];
        const formatPrice = (price: number) => 
          new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
          }).format(price);
        return [`${formatPrice(value.min)} - ${formatPrice(value.max)}`];
      
      case 'discount':
        return value ? ['Con descuento'] : [];
      
      case 'inStock':
        return value === false ? ['Incluir sin stock'] : [];
      
      default:
        return [];
    }
  };

  const getCategoryLabel = (key: string): string => {
    const category = FILTER_CATEGORIES.find(cat => cat.key === key);
    return category?.label || key;
  };

  const removeFilter = (key: string, valueToRemove?: string) => {
    if (valueToRemove && Array.isArray(filters[key as keyof typeof filters])) {
      // Remove specific value from array
      const currentValues = filters[key as keyof typeof filters] as string[];
      const newValues = currentValues.filter(v => v !== valueToRemove);
      updateFilter(key as keyof typeof filters, newValues);
    } else {
      // Reset entire filter
      resetFilter(key as keyof typeof filters);
    }
  };

  // Collect all active filter chips
  const activeFilterChips: Array<{
    key: string;
    label: string;
    value: string;
    displayValue: string;
    canRemoveIndividually: boolean;
  }> = [];

  Object.entries(filters).forEach(([key, value]) => {
    const displayValues = getFilterDisplayValue(key, value);
    const categoryLabel = getCategoryLabel(key);
    const isArray = Array.isArray(value);

    displayValues.forEach((displayValue, index) => {
      activeFilterChips.push({
        key,
        label: categoryLabel,
        value: isArray ? (value as string[])[index] : key,
        displayValue,
        canRemoveIndividually: isArray && (value as string[]).length > 1,
      });
    });
  });

  if (activeFilterChips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilterChips.map((chip, index) => (
        <div
          key={`${chip.key}-${chip.value}-${index}`}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
        >
          <span className="flex items-center">
            <span className="font-medium text-xs text-blue-600 mr-1">
              {chip.label}:
            </span>
            <span>{chip.displayValue}</span>
          </span>
          
          <button
            type="button"
            onClick={() => 
              chip.canRemoveIndividually 
                ? removeFilter(chip.key, chip.value)
                : removeFilter(chip.key)
            }
            className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 focus:outline-none focus:bg-blue-200 transition-colors"
            aria-label={`Remover filtro ${chip.displayValue}`}
          >
            <svg
              className="w-3 h-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
      
      {activeFilterChips.length > 1 && (
        <button
          type="button"
          onClick={() => {
            // Clear all filters
            Object.keys(filters).forEach(key => {
              resetFilter(key as keyof typeof filters);
            });
          }}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition-colors"
        >
          <span>Limpiar todo</span>
          <svg
            className="ml-2 w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;
