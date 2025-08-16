import { useState, useCallback, useMemo, useEffect } from 'react';
import { FilterState, FilterOption } from '../types/filters';
import { DEFAULT_FILTERS } from '../constants/filterOptions';
import { Tool } from '../types';

interface UseFiltersProps {
  tools: Tool[];
  initialFilters?: Partial<FilterState>;
  onFiltersChange?: (filters: FilterState) => void;
}

export function useFilters({ 
  tools, 
  initialFilters = {}, 
  onFiltersChange 
}: UseFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  }));

  // Update filters and notify parent component
  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [onFiltersChange]);

  // Update a specific filter
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    updateFilters(newFilters);
  }, [filters, updateFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    updateFilters(DEFAULT_FILTERS);
  }, [updateFilters]);

  // Reset a specific filter
  const resetFilter = useCallback((key: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    updateFilters({ ...DEFAULT_FILTERS, ...newFilters });
  }, [filters, updateFilters]);

  // Get category from tool name/description (simplified categorization)
  const getToolCategory = useCallback((tool: Tool): string[] => {
    const categories: string[] = [];
    const searchText = `${tool.name} ${tool.description}`.toLowerCase();
    
    if (searchText.includes('sierra')) categories.push('sierras');
    if (searchText.includes('fresadora') || searchText.includes('fresa')) categories.push('fresadoras');
    if (searchText.includes('lijadora')) categories.push('lijadoras');
    if (searchText.includes('prensa')) categories.push('prensas');
    if (searchText.includes('disco')) categories.push('discos');
    if (searchText.includes('guía') || searchText.includes('riel')) categories.push('guias');
    if (searchText.includes('fresa') && !searchText.includes('fresadora')) categories.push('fresas');
    
    return categories.length > 0 ? categories : ['accesorios'];
  }, []);

  // Get brand from tool name
  const getToolBrand = useCallback((tool: Tool): string => {
    const name = tool.name.toLowerCase();
    if (name.includes('makita')) return 'makita';
    if (name.includes('bosch')) return 'bosch';
    if (name.includes('irwin')) return 'irwin';
    if (name.includes('kreg')) return 'kreg';
    if (name.includes('milescraft')) return 'milescraft';
    return 'otros';
  }, []);

  // Normalize condition string
  const normalizeCondition = useCallback((condition: string): string => {
    const normalized = condition.toLowerCase();
    if (normalized.includes('nuevo')) return 'nuevo';
    if (normalized.includes('excelente')) return 'usado-excelente';
    if (normalized.includes('como nuevo')) return 'usado-como-nuevo';
    if (normalized.includes('buen')) return 'usado-bueno';
    return 'usado-bueno';
  }, []);

  // Filter tools based on current filters
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      return applyToolFilters(tool, filters, { getToolCategory, getToolBrand, normalizeCondition });
    });
  }, [tools, filters, getToolCategory, getToolBrand, normalizeCondition]);

  // Helper function to apply filters to a single tool
  const applyToolFilters = useCallback((tool: Tool, filterState: FilterState, helpers: {
    getToolCategory: (tool: Tool) => string[];
    getToolBrand: (tool: Tool) => string;
    normalizeCondition: (condition: string) => string;
  }) => {
    // Category filter
    if (filterState.category?.length) {
      const toolCategories = helpers.getToolCategory(tool);
      if (!toolCategories.some(cat => filterState.category!.includes(cat))) {
        return false;
      }
    }

    // Brand filter
    if (filterState.brand?.length) {
      const toolBrand = helpers.getToolBrand(tool);
      if (!filterState.brand.includes(toolBrand)) {
        return false;
      }
    }

    // Condition filter
    if (filterState.condition?.length) {
      const toolCondition = helpers.normalizeCondition(tool.condition);
      if (!filterState.condition.includes(toolCondition)) {
        return false;
      }
    }

    // Price range filter
    if (filterState.priceRange) {
      const { min, max } = filterState.priceRange;
      if (tool.price < min || tool.price > max) {
        return false;
      }
    }

    // Discount filter
    if (filterState.discount) {
      const hasDiscount = tool.price < tool.originalPrice;
      if (!hasDiscount) {
        return false;
      }
    }

    // Search query filter
    if (filterState.searchQuery?.trim()) {
      const query = filterState.searchQuery.toLowerCase().trim();
      const searchableText = `${tool.name} ${tool.description} ${tool.features.join(' ')} ${tool.code}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  }, []);

  // Generate filter facets (counts for each filter option)
  const filterFacets = useMemo(() => {
    const facets: Record<string, FilterOption[]> = {
      category: [],
      brand: [],
      condition: [],
    };

    // Count occurrences for each filter option
    const categoryCounts: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};
    const conditionCounts: Record<string, number> = {};

    tools.forEach(tool => {
      // Count categories
      getToolCategory(tool).forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      // Count brands
      const brand = getToolBrand(tool);
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;

      // Count conditions
      const condition = normalizeCondition(tool.condition);
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });

    // Build facet options with counts
    facets.category = Object.entries(categoryCounts).map(([value, count]) => ({
      value,
      label: getCategoryLabel(value),
      count,
    }));

    facets.brand = Object.entries(brandCounts).map(([value, count]) => ({
      value,
      label: getBrandLabel(value),
      count,
    }));

    facets.condition = Object.entries(conditionCounts).map(([value, count]) => ({
      value,
      label: getConditionLabel(value),
      count,
    }));

    return facets;
  }, [tools, getToolCategory, getToolBrand, normalizeCondition]);

  // Helper functions for labels
  const getCategoryLabel = (value: string): string => {
    const labels: Record<string, string> = {
      'sierras': 'Sierras',
      'fresadoras': 'Fresadoras',
      'lijadoras': 'Lijadoras',
      'prensas': 'Prensas',
      'accesorios': 'Accesorios',
      'fresas': 'Fresas',
      'discos': 'Discos',
      'guias': 'Guías y Rieles',
    };
    return labels[value] || value;
  };

  const getBrandLabel = (value: string): string => {
    const labels: Record<string, string> = {
      'makita': 'Makita',
      'bosch': 'Bosch',
      'irwin': 'Irwin',
      'kreg': 'Kreg',
      'milescraft': 'Milescraft',
      'otros': 'Otros',
    };
    return labels[value] || value;
  };

  const getConditionLabel = (value: string): string => {
    const labels: Record<string, string> = {
      'nuevo': 'Nuevo',
      'usado-excelente': 'Usado - Excelente Estado',
      'usado-bueno': 'Usado - Buen Estado',
      'usado-como-nuevo': 'Usado - Como Nuevo',
    };
    return labels[value] || value;
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    
    if (filters.category?.length) count += filters.category.length;
    if (filters.brand?.length) count += filters.brand.length;
    if (filters.condition?.length) count += filters.condition.length;
    if (filters.priceRange) count += 1;
    if (filters.discount) count += 1;
    if (filters.searchQuery?.trim()) count += 1;
    
    return count;
  }, [filters]);

  // Sync with external filter changes
  useEffect(() => {
    if (initialFilters) {
      setFilters(prev => ({ ...prev, ...initialFilters }));
    }
  }, [initialFilters]);

  return {
    filters,
    setFilters: updateFilters,
    updateFilter,
    clearFilters,
    resetFilter,
    filteredTools,
    filterFacets,
    activeFiltersCount,
    totalResults: filteredTools.length,
  };
}
