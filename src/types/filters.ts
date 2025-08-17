export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterCategory {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'checkbox';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  category?: string[];
  brand?: string[];
  condition?: string[];
  priceRange?: PriceRange;
  discount?: boolean;
  inStock?: boolean;
  searchQuery?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updateFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  resetFilter: (key: keyof FilterState) => void;
  activeFiltersCount: number;
}

export interface SearchResult {
  query: string;
  results: any[];
  totalCount: number;
  facets?: Record<string, FilterOption[]>;
}

export interface UrlState {
  filters: FilterState;
  sort?: string;
  page?: number;
}
