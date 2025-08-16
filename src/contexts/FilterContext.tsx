import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { FilterState, FilterContextType } from '../types/filters';
import { DEFAULT_FILTERS } from '../constants/filterOptions';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Tool } from '../types';
// Temporary placeholder functions until urlUtils is properly implemented
const getFiltersFromUrl = () => ({});
const updateUrlWithFilters = (_filters: FilterState) => {
  // Placeholder implementation
};

interface FilterProviderProps {
  readonly children: ReactNode;
  readonly syncWithUrl?: boolean;
  readonly storageKey?: string;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ 
  children, 
  syncWithUrl = true,
  storageKey = 'venta-carpinteria-filters'
}: FilterProviderProps) {
  // Initialize filters from localStorage (URL sync temporarily disabled)
  const getInitialFilters = useCallback((): FilterState => {
    if (syncWithUrl && typeof window !== 'undefined') {
      const urlFilters = getFiltersFromUrl();
      if (Object.keys(urlFilters).length > 0) {
        return { ...DEFAULT_FILTERS, ...urlFilters };
      }
    }
    return DEFAULT_FILTERS;
  }, [syncWithUrl]);

  const [filters, setStoredFilters] = useLocalStorage<FilterState>(
    storageKey,
    getInitialFilters()
  );

  // Set filters with URL sync
  const setFilters = useCallback((newFilters: FilterState) => {
    setStoredFilters(newFilters);
    
    if (syncWithUrl && typeof window !== 'undefined') {
      updateUrlWithFilters(newFilters);
    }
  }, [setStoredFilters, syncWithUrl]);

  // Update a specific filter
  const updateFilter = useCallback((key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  }, [filters, setFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, [setFilters]);

  // Reset a specific filter
  const resetFilter = useCallback((key: keyof FilterState) => {
    const newFilters = { ...filters };
    
    // Reset to default value
    if (key in DEFAULT_FILTERS) {
      (newFilters as Record<string, FilterState[keyof FilterState]>)[key] = DEFAULT_FILTERS[key];
    } else {
      delete (newFilters as Record<string, FilterState[keyof FilterState]>)[key];
    }
    
    setFilters(newFilters);
  }, [filters, setFilters]);

  // Count active filters
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    
    if (filters.category?.length) count += filters.category.length;
    if (filters.brand?.length) count += filters.brand.length;
    if (filters.condition?.length) count += filters.condition.length;
    if (filters.priceRange && (
      filters.priceRange.min > 0 || 
      filters.priceRange.max < 1000000
    )) count += 1;
    if (filters.discount) count += 1;
    if (filters.searchQuery?.trim()) count += 1;
    
    return count;
  }, [filters]);

  // Listen for URL changes (browser back/forward)
  React.useEffect(() => {
    if (!syncWithUrl || typeof window === 'undefined') return;

    const handlePopState = () => {
      const urlFilters = getFiltersFromUrl();
      const newFilters = { ...DEFAULT_FILTERS, ...urlFilters };
      setStoredFilters(newFilters);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncWithUrl, setStoredFilters]);

  const contextValue: FilterContextType = React.useMemo(() => ({
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    resetFilter,
    activeFiltersCount,
  }), [filters, setFilters, updateFilter, clearFilters, resetFilter, activeFiltersCount]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext(): FilterContextType {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}

// HOC for easier integration
export function withFilters<P extends object>(
  Component: React.ComponentType<P>
) {
  return function FilteredComponent(props: P) {
    return (
      <FilterProvider>
        <Component {...props} />
      </FilterProvider>
    );
  };
}

// Hook for components that need both filters and tools
export function useFilteredTools(tools: Tool[]) {
  const { filters } = useFilterContext();
  
  return React.useMemo(() => {
    if (!tools?.length) return [];
    
    return tools.filter(tool => {
      // Apply the same filtering logic as in useFilters hook
      // This is a simplified version - you might want to extract this to a utility function
      
      // Search query filter
      if (filters.searchQuery?.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const searchableText = `${tool.name} ${tool.description} ${tool.features?.join(' ') || ''} ${tool.code}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        if (tool.price < min || tool.price > max) {
          return false;
        }
      }

      // Discount filter
      if (filters.discount) {
        if (tool.price >= tool.originalPrice) {
          return false;
        }
      }

      // Add more filter logic as needed...
      
      return true;
    });
  }, [tools, filters]);
}
