import { useState, useMemo } from 'react';
import { Tool } from '../types';

interface StaticFilters {
  search: string;
  brand: string;
  condition: string;
  priceRange: string;
  sort: string;
}

export function useStaticFilters(tools: Tool[]) {
  const [filters, setFilters] = useState<StaticFilters>({
    search: '',
    brand: '',
    condition: '',
    priceRange: '',
    sort: 'relevance',
  });

  // Función para obtener la marca de una herramienta
  const getBrandFromTool = (tool: Tool): string => {
    const name = tool.name.toLowerCase();
    if (name.includes('makita')) return 'makita';
    if (name.includes('bosch')) return 'bosch';
    if (name.includes('irwin')) return 'irwin';
    if (name.includes('kreg')) return 'kreg';
    if (name.includes('milescraft')) return 'milescraft';
    return 'otros';
  };

  // Función para normalizar el estado - solo dos estados
  const normalizeCondition = (condition: string): string => {
    const normalized = condition.toLowerCase();
    if (normalized.includes('nuevo')) return 'nuevo';
    // Todo lo demás es "usado - buen estado"
    return 'usado-bueno';
  };

  // Función para verificar si el precio está en el rango
  const isPriceInRange = (price: number, range: string): boolean => {
    if (!range) return true;
    
    const [min, max] = range.split('-').map(Number);
    return price >= min && price <= max;
  };

  // Filtrar herramientas
  const filteredTools = useMemo(() => {
    let result = tools.filter(tool => {
      // Filtro de búsqueda
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = `${tool.name} ${tool.description} ${tool.features.join(' ')} ${tool.code}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Filtro de marca
      if (filters.brand) {
        const toolBrand = getBrandFromTool(tool);
        if (toolBrand !== filters.brand) {
          return false;
        }
      }

      // Filtro de estado
      if (filters.condition) {
        const toolCondition = normalizeCondition(tool.condition);
        if (toolCondition !== filters.condition) {
          return false;
        }
      }

      // Filtro de precio
      if (filters.priceRange) {
        if (!isPriceInRange(tool.price, filters.priceRange)) {
          return false;
        }
      }

      return true;
    });

    // Aplicar ordenamiento
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        break;
      case 'discount-desc':
        result.sort((a, b) => {
          const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
          const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
          return discountB - discountA;
        });
        break;
      default:
        // Mantener orden original (relevancia)
        break;
    }

    return result;
  }, [tools, filters]);

  // Funciones para actualizar filtros
  const updateSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const updateSort = (sort: string) => {
    setFilters(prev => ({ ...prev, sort }));
  };

  const updateFilters = (newFilters: Partial<Pick<StaticFilters, 'brand' | 'condition' | 'priceRange'>>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      condition: '',
      priceRange: '',
      sort: 'relevance',
    });
  };

  // Estadísticas de filtros
  const stats = useMemo(() => {
    const totalTools = tools.length;
    const filteredCount = filteredTools.length;
    const hasActiveFilters = Boolean(filters.search || filters.brand || filters.condition || filters.priceRange);

    return {
      total: totalTools,
      filtered: filteredCount,
      hasActiveFilters,
      activeFiltersCount: [filters.search, filters.brand, filters.condition, filters.priceRange].filter(Boolean).length,
    };
  }, [tools.length, filteredTools.length, filters]);

  return {
    filters,
    filteredTools,
    stats,
    updateSearch,
    updateSort,
    updateFilters,
    clearFilters,
  };
}
