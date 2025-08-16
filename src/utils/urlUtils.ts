import { FilterState, UrlState } from '../types/filters';

/**
 * URL parameter keys for filters
 */
export const URL_PARAMS = {
  SEARCH: 'q',
  CATEGORY: 'category',
  BRAND: 'brand',
  CONDITION: 'condition',
  PRICE_MIN: 'price_min',
  PRICE_MAX: 'price_max',
  DISCOUNT: 'discount',
  IN_STOCK: 'in_stock',
  SORT: 'sort',
  PAGE: 'page',
} as const;

/**
 * Convert filters to URL search parameters
 */
export function filtersToUrlParams(filters: FilterState, sort?: string, page?: number): URLSearchParams {
  const params = new URLSearchParams();

  // Search query
  if (filters.searchQuery?.trim()) {
    params.set(URL_PARAMS.SEARCH, filters.searchQuery.trim());
  }

  // Category filter (array)
  if (filters.category?.length) {
    params.set(URL_PARAMS.CATEGORY, filters.category.join(','));
  }

  // Brand filter (array)
  if (filters.brand?.length) {
    params.set(URL_PARAMS.BRAND, filters.brand.join(','));
  }

  // Condition filter (array)
  if (filters.condition?.length) {
    params.set(URL_PARAMS.CONDITION, filters.condition.join(','));
  }

  // Price range
  if (filters.priceRange) {
    if (filters.priceRange.min > 0) {
      params.set(URL_PARAMS.PRICE_MIN, filters.priceRange.min.toString());
    }
    if (filters.priceRange.max < 1000000) {
      params.set(URL_PARAMS.PRICE_MAX, filters.priceRange.max.toString());
    }
  }

  // Boolean filters
  if (filters.discount) {
    params.set(URL_PARAMS.DISCOUNT, '1');
  }

  if (filters.inStock !== undefined && !filters.inStock) {
    params.set(URL_PARAMS.IN_STOCK, '0');
  }

  // Sort and pagination
  if (sort && sort !== 'relevance') {
    params.set(URL_PARAMS.SORT, sort);
  }

  if (page && page > 1) {
    params.set(URL_PARAMS.PAGE, page.toString());
  }

  return params;
}

/**
 * Parse URL search parameters to filters
 */
export function urlParamsToFilters(searchParams: URLSearchParams): Partial<UrlState> {
  const filters: FilterState = {};
  let sort: string | undefined;
  let page: number | undefined;

  // Search query
  const searchQuery = searchParams.get(URL_PARAMS.SEARCH);
  if (searchQuery) {
    filters.searchQuery = searchQuery;
  }

  // Category filter
  const categoryParam = searchParams.get(URL_PARAMS.CATEGORY);
  if (categoryParam) {
    filters.category = categoryParam.split(',').filter(Boolean);
  }

  // Brand filter
  const brandParam = searchParams.get(URL_PARAMS.BRAND);
  if (brandParam) {
    filters.brand = brandParam.split(',').filter(Boolean);
  }

  // Condition filter
  const conditionParam = searchParams.get(URL_PARAMS.CONDITION);
  if (conditionParam) {
    filters.condition = conditionParam.split(',').filter(Boolean);
  }

  // Price range
  const priceMin = searchParams.get(URL_PARAMS.PRICE_MIN);
  const priceMax = searchParams.get(URL_PARAMS.PRICE_MAX);
  if (priceMin || priceMax) {
    filters.priceRange = {
      min: priceMin ? parseInt(priceMin, 10) : 0,
      max: priceMax ? parseInt(priceMax, 10) : 1000000,
    };
  }

  // Boolean filters
  const discountParam = searchParams.get(URL_PARAMS.DISCOUNT);
  if (discountParam === '1') {
    filters.discount = true;
  }

  const inStockParam = searchParams.get(URL_PARAMS.IN_STOCK);
  if (inStockParam === '0') {
    filters.inStock = false;
  }

  // Sort
  const sortParam = searchParams.get(URL_PARAMS.SORT);
  if (sortParam) {
    sort = sortParam;
  }

  // Page
  const pageParam = searchParams.get(URL_PARAMS.PAGE);
  if (pageParam) {
    const pageNum = parseInt(pageParam, 10);
    if (pageNum > 0) {
      page = pageNum;
    }
  }

  return { filters, sort, page };
}

/**
 * Update URL with current filters
 */
export function updateUrlWithFilters(
  filters: FilterState,
  sort?: string,
  page?: number,
  replace: boolean = false
): void {
  if (typeof window === 'undefined') return;

  const params = filtersToUrlParams(filters, sort, page);
  const url = new URL(window.location.href);
  
  // Clear existing filter params
  Object.values(URL_PARAMS).forEach(param => {
    url.searchParams.delete(param);
  });

  // Set new params
  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  // Update URL
  const newUrl = url.toString();
  if (newUrl !== window.location.href) {
    if (replace) {
      window.history.replaceState(null, '', newUrl);
    } else {
      window.history.pushState(null, '', newUrl);
    }
  }
}

/**
 * Get filters from current URL
 */
export function getFiltersFromUrl(): Partial<UrlState> {
  if (typeof window === 'undefined') {
    return { filters: {} };
  }

  const searchParams = new URLSearchParams(window.location.search);
  return urlParamsToFilters(searchParams);
}

/**
 * Clear all filter parameters from URL
 */
export function clearFiltersFromUrl(replace: boolean = false): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  
  // Remove all filter params
  Object.values(URL_PARAMS).forEach(param => {
    url.searchParams.delete(param);
  });

  const newUrl = url.toString();
  if (newUrl !== window.location.href) {
    if (replace) {
      window.history.replaceState(null, '', newUrl);
    } else {
      window.history.pushState(null, '', newUrl);
    }
  }
}

/**
 * Generate shareable URL with current filters
 */
export function generateShareableUrl(
  filters: FilterState,
  sort?: string,
  page?: number,
  baseUrl?: string
): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '');
  const params = filtersToUrlParams(filters, sort, page);
  
  return params.toString() ? `${base}?${params.toString()}` : base;
}

/**
 * Parse URL hash for additional state (e.g., modal states)
 */
export function parseUrlHash(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const hash = window.location.hash.slice(1); // Remove #
  if (!hash) return {};

  const params: Record<string, string> = {};
  hash.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });

  return params;
}

/**
 * Update URL hash
 */
export function updateUrlHash(hashParams: Record<string, string>, replace: boolean = false): void {
  if (typeof window === 'undefined') return;

  const hashString = Object.entries(hashParams)
    .filter(([, value]) => value)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  const newHash = hashString ? `#${hashString}` : '';
  const newUrl = window.location.pathname + window.location.search + newHash;

  if (replace) {
    window.history.replaceState(null, '', newUrl);
  } else {
    window.history.pushState(null, '', newUrl);
  }
}

/**
 * Get clean URL without filters (for canonical links)
 */
export function getCleanUrl(): string {
  if (typeof window === 'undefined') return '';
  
  return window.location.origin + window.location.pathname;
}

/**
 * Check if current URL has any filters
 */
export function hasUrlFilters(): boolean {
  if (typeof window === 'undefined') return false;

  const searchParams = new URLSearchParams(window.location.search);
  return Object.values(URL_PARAMS).some(param => searchParams.has(param));
}

/**
 * Validate and sanitize URL parameters
 */
export function sanitizeUrlParams(searchParams: URLSearchParams): URLSearchParams {
  const sanitized = new URLSearchParams();

  // Validate search query
  const search = searchParams.get(URL_PARAMS.SEARCH);
  if (search && search.trim().length > 0 && search.trim().length <= 100) {
    sanitized.set(URL_PARAMS.SEARCH, search.trim());
  }

  // Validate arrays (category, brand, condition)
  const validateArray = (param: string, validValues?: string[]) => {
    const value = searchParams.get(param);
    if (value) {
      const items = value.split(',').filter(Boolean).slice(0, 10); // Max 10 items
      if (validValues) {
        const filtered = items.filter(item => validValues.includes(item));
        if (filtered.length > 0) {
          sanitized.set(param, filtered.join(','));
        }
      } else if (items.length > 0) {
        sanitized.set(param, items.join(','));
      }
    }
  };

  validateArray(URL_PARAMS.CATEGORY, ['sierras', 'fresadoras', 'lijadoras', 'prensas', 'accesorios', 'fresas', 'discos', 'guias']);
  validateArray(URL_PARAMS.BRAND, ['makita', 'bosch', 'irwin', 'kreg', 'milescraft', 'otros']);
  validateArray(URL_PARAMS.CONDITION, ['nuevo', 'usado-excelente', 'usado-bueno', 'usado-como-nuevo']);

  // Validate numeric values
  const validateNumber = (param: string, min: number = 0, max: number = 1000000) => {
    const value = searchParams.get(param);
    if (value) {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= min && num <= max) {
        sanitized.set(param, num.toString());
      }
    }
  };

  validateNumber(URL_PARAMS.PRICE_MIN);
  validateNumber(URL_PARAMS.PRICE_MAX);
  validateNumber(URL_PARAMS.PAGE, 1, 1000);

  // Validate boolean values
  const validateBoolean = (param: string) => {
    const value = searchParams.get(param);
    if (value === '1' || value === '0') {
      sanitized.set(param, value);
    }
  };

  validateBoolean(URL_PARAMS.DISCOUNT);
  validateBoolean(URL_PARAMS.IN_STOCK);

  // Validate sort
  const sort = searchParams.get(URL_PARAMS.SORT);
  const validSorts = ['relevance', 'price-asc', 'price-desc', 'name-asc', 'name-desc', 'discount-desc', 'condition-best'];
  if (sort && validSorts.includes(sort)) {
    sanitized.set(URL_PARAMS.SORT, sort);
  }

  return sanitized;
}
