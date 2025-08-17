import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Tool } from '../types';
import { FilterState, SearchResult } from '../types/filters';
import { DEBOUNCE_DELAY, SORT_OPTIONS } from '../constants/filterOptions';

interface UseProductSearchProps {
  tools: Tool[];
  filters?: FilterState;
  sortBy?: string;
  itemsPerPage?: number;
}

interface SearchOptions {
  fuzzyMatch?: boolean;
  highlightMatches?: boolean;
  searchFields?: string[];
}

export function useProductSearch({
  tools,
  filters = {},
  sortBy = 'relevance',
  itemsPerPage = 12,
}: UseProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounce search query
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  // Update search query
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setCurrentPage(1);
  }, []);

  // Advanced search function with scoring
  const searchTools = useCallback((
    query: string,
    toolsList: Tool[],
    options: SearchOptions = {}
  ): Tool[] => {
    if (!query.trim()) return toolsList;

    const {
      fuzzyMatch = true,
      searchFields = ['name', 'description', 'features', 'code', 'condition']
    } = options;

    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    const scoredTools = toolsList.map(tool => {
      let score = 0;
      const searchableText: Record<string, string> = {
        name: tool.name.toLowerCase(),
        description: tool.description.toLowerCase(),
        features: tool.features.join(' ').toLowerCase(),
        code: tool.code.toLowerCase(),
        condition: tool.condition.toLowerCase(),
      };

      searchTerms.forEach(term => {
        searchFields.forEach(field => {
          const text = searchableText[field];
          if (!text) return;

          // Exact match gets highest score
          if (text.includes(term)) {
            score += field === 'name' ? 100 : field === 'code' ? 80 : 50;
          }

          // Fuzzy match for partial words
          if (fuzzyMatch) {
            const words = text.split(/\s+/);
            words.forEach(word => {
              if (word.includes(term) && word !== term) {
                score += field === 'name' ? 30 : 10;
              }
            });
          }

          // Boost for terms at the beginning of fields
          if (text.startsWith(term)) {
            score += field === 'name' ? 50 : 20;
          }
        });
      });

      return { tool, score };
    });

    // Filter out tools with no matches and sort by score
    return scoredTools
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ tool }) => tool);
  }, []);

  // Apply filters to tools
  const applyFilters = useCallback((toolsList: Tool[], filterState: FilterState): Tool[] => {
    return toolsList.filter(tool => {
      // Category filter (simplified - you may want to enhance this)
      if (filterState.category?.length) {
        const toolCategory = getToolCategory(tool);
        if (!filterState.category.some(cat => toolCategory.includes(cat))) {
          return false;
        }
      }

      // Brand filter
      if (filterState.brand?.length) {
        const toolBrand = getToolBrand(tool);
        if (!filterState.brand.includes(toolBrand)) {
          return false;
        }
      }

      // Condition filter
      if (filterState.condition?.length) {
        const normalizedCondition = normalizeCondition(tool.condition);
        if (!filterState.condition.includes(normalizedCondition)) {
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
        if (tool.price >= tool.originalPrice) {
          return false;
        }
      }

      return true;
    });
  }, []);

  // Sort tools
  const sortTools = useCallback((toolsList: Tool[], sortOption: string): Tool[] => {
    const sorted = [...toolsList];

    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'discount-desc':
        return sorted.sort((a, b) => {
          const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
          const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
          return discountB - discountA;
        });
      case 'condition-best':
        return sorted.sort((a, b) => {
          const conditionOrder = { 'Nuevo': 0, 'Usado - Como Nuevo': 1, 'Usado - Excelente Estado': 2, 'Usado - Buen Estado': 3 };
          return (conditionOrder[a.condition as keyof typeof conditionOrder] || 4) - 
                 (conditionOrder[b.condition as keyof typeof conditionOrder] || 4);
        });
      case 'relevance':
      default:
        return sorted; // Keep search score order
    }
  }, []);

  // Get processed results
  const searchResults = useMemo((): SearchResult => {
    let processedTools = tools;

    // Apply search
    if (debouncedQuery.trim()) {
      processedTools = searchTools(debouncedQuery, processedTools);
    }

    // Apply filters
    processedTools = applyFilters(processedTools, filters);

    // Apply sorting
    processedTools = sortTools(processedTools, sortBy);

    return {
      query: debouncedQuery,
      results: processedTools,
      totalCount: processedTools.length,
    };
  }, [tools, debouncedQuery, filters, sortBy, searchTools, applyFilters, sortTools]);

  // Paginated results
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchResults.results.slice(startIndex, endIndex);
  }, [searchResults.results, currentPage, itemsPerPage]);

  // Pagination info
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(searchResults.totalCount / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
      currentPage,
      totalPages,
      totalItems: searchResults.totalCount,
      itemsPerPage,
      hasNextPage,
      hasPrevPage,
      startIndex: (currentPage - 1) * itemsPerPage + 1,
      endIndex: Math.min(currentPage * itemsPerPage, searchResults.totalCount),
    };
  }, [searchResults.totalCount, currentPage, itemsPerPage]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const totalPages = Math.ceil(searchResults.totalCount / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [searchResults.totalCount, itemsPerPage]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPrevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Search suggestions (simple implementation)
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const suggestions = new Set<string>();
    const query = searchQuery.toLowerCase();

    tools.forEach(tool => {
      // Add name-based suggestions
      const words = tool.name.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.startsWith(query) && word.length > query.length) {
          suggestions.add(word);
        }
      });

      // Add brand suggestions
      const brand = getToolBrand(tool);
      if (brand.toLowerCase().startsWith(query)) {
        suggestions.add(brand);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery, tools]);

  // Helper functions (same as in useFilters)
  const getToolCategory = (tool: Tool): string[] => {
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
  };

  const getToolBrand = (tool: Tool): string => {
    const name = tool.name.toLowerCase();
    if (name.includes('makita')) return 'makita';
    if (name.includes('bosch')) return 'bosch';
    if (name.includes('irwin')) return 'irwin';
    if (name.includes('kreg')) return 'kreg';
    if (name.includes('milescraft')) return 'milescraft';
    return 'otros';
  };

  const normalizeCondition = (condition: string): string => {
    const normalized = condition.toLowerCase();
    if (normalized.includes('nuevo')) return 'nuevo';
    if (normalized.includes('excelente')) return 'usado-excelente';
    if (normalized.includes('como nuevo')) return 'usado-como-nuevo';
    if (normalized.includes('buen')) return 'usado-bueno';
    return 'usado-bueno';
  };

  return {
    // Search state
    searchQuery,
    debouncedQuery,
    isSearching,
    
    // Search actions
    updateSearchQuery,
    clearSearch,
    
    // Results
    searchResults,
    paginatedResults,
    
    // Pagination
    paginationInfo,
    goToPage,
    goToNextPage,
    goToPrevPage,
    
    // Suggestions
    searchSuggestions,
    
    // Available sort options
    sortOptions: SORT_OPTIONS,
  };
}
