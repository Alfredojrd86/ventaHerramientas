import { Tool } from '../types';
import { FilterState } from '../types/filters';

/**
 * Search scoring weights for different fields
 */
export const SEARCH_WEIGHTS = {
  name: 100,
  code: 80,
  description: 50,
  features: 30,
  condition: 20,
} as const;

/**
 * Search configuration options
 */
export interface SearchConfig {
  fuzzyMatch?: boolean;
  caseSensitive?: boolean;
  minScore?: number;
  maxResults?: number;
  highlightMatches?: boolean;
}

/**
 * Search result with score and highlights
 */
export interface SearchResult {
  item: Tool;
  score: number;
  highlights?: Record<string, string[]>;
}

/**
 * Advanced text search with scoring and highlighting
 */
export function searchTools(
  query: string,
  tools: Tool[],
  config: SearchConfig = {}
): SearchResult[] {
  const {
    fuzzyMatch = true,
    caseSensitive = false,
    minScore = 0,
    maxResults = 100,
    highlightMatches = false,
  } = config;

  if (!query.trim()) return tools.map(tool => ({ item: tool, score: 0 }));

  const searchTerms = query
    .trim()
    .split(/\s+/)
    .map(term => caseSensitive ? term : term.toLowerCase());

  const results: SearchResult[] = tools.map(tool => {
    let totalScore = 0;
    const highlights: Record<string, string[]> = {};

    const searchableFields = {
      name: tool.name,
      code: tool.code,
      description: tool.description,
      features: tool.features.join(' '),
      condition: tool.condition,
    };

    searchTerms.forEach(term => {
      Object.entries(searchableFields).forEach(([field, text]) => {
        const fieldText = caseSensitive ? text : text.toLowerCase();
        const weight = SEARCH_WEIGHTS[field as keyof typeof SEARCH_WEIGHTS];

        // Exact match
        if (fieldText.includes(term)) {
          totalScore += weight;
          
          if (highlightMatches) {
            if (!highlights[field]) highlights[field] = [];
            highlights[field].push(term);
          }
        }

        // Fuzzy matching for partial words
        if (fuzzyMatch && term.length > 2) {
          const words = fieldText.split(/\s+/);
          words.forEach(word => {
            if (word.includes(term) && word !== term) {
              totalScore += Math.floor(weight * 0.5);
            }
            
            // Levenshtein distance for typos (simplified)
            if (getLevenshteinDistance(word, term) <= 1 && Math.abs(word.length - term.length) <= 1) {
              totalScore += Math.floor(weight * 0.3);
            }
          });
        }

        // Boost for terms at the beginning
        if (fieldText.startsWith(term)) {
          totalScore += Math.floor(weight * 0.5);
        }

        // Boost for word boundaries
        const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(term)}`, caseSensitive ? 'g' : 'gi');
        const matches = fieldText.match(wordBoundaryRegex);
        if (matches) {
          totalScore += matches.length * Math.floor(weight * 0.3);
        }
      });
    });

    return {
      item: tool,
      score: totalScore,
      ...(highlightMatches && Object.keys(highlights).length > 0 && { highlights }),
    };
  });

  return results
    .filter(result => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Filter tools based on filter state
 */
export function filterTools(tools: Tool[], filters: FilterState): Tool[] {
  return tools.filter(tool => {
    // Search query filter
    if (filters.searchQuery?.trim()) {
      const searchResults = searchTools(filters.searchQuery, [tool]);
      if (searchResults.length === 0 || searchResults[0].score === 0) {
        return false;
      }
    }

    // Category filter
    if (filters.category?.length) {
      const toolCategories = getToolCategories(tool);
      if (!filters.category.some(cat => toolCategories.includes(cat))) {
        return false;
      }
    }

    // Brand filter
    if (filters.brand?.length) {
      const toolBrand = getToolBrand(tool);
      if (!filters.brand.includes(toolBrand)) {
        return false;
      }
    }

    // Condition filter
    if (filters.condition?.length) {
      const normalizedCondition = normalizeCondition(tool.condition);
      if (!filters.condition.includes(normalizedCondition)) {
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
      const hasDiscount = tool.price < tool.originalPrice;
      if (!hasDiscount) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort tools based on sort criteria
 */
export function sortTools(tools: Tool[], sortBy: string): Tool[] {
  const sorted = [...tools];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'es'));
    
    case 'discount-desc':
      return sorted.sort((a, b) => {
        const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
        return discountB - discountA;
      });
    
    case 'condition-best':
      return sorted.sort((a, b) => {
        const conditionOrder = {
          'Nuevo': 0,
          'Usado - Como Nuevo': 1,
          'Usado - Excelente Estado': 2,
          'Usado - Buen Estado': 3,
        };
        const scoreA = conditionOrder[a.condition as keyof typeof conditionOrder] ?? 4;
        const scoreB = conditionOrder[b.condition as keyof typeof conditionOrder] ?? 4;
        return scoreA - scoreB;
      });
    
    case 'relevance':
    default:
      return sorted; // Keep original order (usually search score order)
  }
}

/**
 * Generate search suggestions based on query
 */
export function generateSearchSuggestions(
  query: string,
  tools: Tool[],
  maxSuggestions: number = 5
): string[] {
  if (!query.trim() || query.length < 2) return [];

  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();

  // Collect suggestions from various sources
  tools.forEach(tool => {
    // Name-based suggestions
    const nameWords = tool.name.toLowerCase().split(/\s+/);
    nameWords.forEach(word => {
      if (word.startsWith(queryLower) && word.length > queryLower.length) {
        suggestions.add(word);
      }
    });

    // Brand suggestions
    const brand = getToolBrand(tool);
    if (brand.toLowerCase().startsWith(queryLower)) {
      suggestions.add(brand);
    }

    // Category suggestions
    const categories = getToolCategories(tool);
    categories.forEach(category => {
      if (category.toLowerCase().startsWith(queryLower)) {
        suggestions.add(getCategoryDisplayName(category));
      }
    });

    // Code suggestions
    if (tool.code.toLowerCase().startsWith(queryLower)) {
      suggestions.add(tool.code);
    }
  });

  return Array.from(suggestions)
    .sort((a, b) => a.length - b.length) // Shorter suggestions first
    .slice(0, maxSuggestions);
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(
  text: string,
  searchTerms: string[],
  highlightClass: string = 'bg-yellow-200 font-semibold'
): string {
  if (!searchTerms.length) return text;

  let highlightedText = text;
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    highlightedText = highlightedText.replace(
      regex,
      `<span class="${highlightClass}">$1</span>`
    );
  });

  return highlightedText;
}

/**
 * Get tool categories (simplified categorization)
 */
export function getToolCategories(tool: Tool): string[] {
  const categories: string[] = [];
  const searchText = `${tool.name} ${tool.description}`.toLowerCase();
  
  if (searchText.includes('sierra')) categories.push('sierras');
  if (searchText.includes('fresadora')) categories.push('fresadoras');
  if (searchText.includes('lijadora')) categories.push('lijadoras');
  if (searchText.includes('prensa')) categories.push('prensas');
  if (searchText.includes('disco')) categories.push('discos');
  if (searchText.includes('guía') || searchText.includes('riel')) categories.push('guias');
  if (searchText.includes('fresa') && !searchText.includes('fresadora')) categories.push('fresas');
  
  return categories.length > 0 ? categories : ['accesorios'];
}

/**
 * Get tool brand
 */
export function getToolBrand(tool: Tool): string {
  const name = tool.name.toLowerCase();
  if (name.includes('makita')) return 'makita';
  if (name.includes('bosch')) return 'bosch';
  if (name.includes('irwin')) return 'irwin';
  if (name.includes('kreg')) return 'kreg';
  if (name.includes('milescraft')) return 'milescraft';
  return 'otros';
}

/**
 * Normalize condition string
 */
export function normalizeCondition(condition: string): string {
  const normalized = condition.toLowerCase();
  if (normalized.includes('nuevo')) return 'nuevo';
  if (normalized.includes('excelente')) return 'usado-excelente';
  if (normalized.includes('como nuevo')) return 'usado-como-nuevo';
  if (normalized.includes('buen')) return 'usado-bueno';
  return 'usado-bueno';
}

/**
 * Get display name for category
 */
export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    'sierras': 'Sierras',
    'fresadoras': 'Fresadoras',
    'lijadoras': 'Lijadoras',
    'prensas': 'Prensas',
    'accesorios': 'Accesorios',
    'fresas': 'Fresas',
    'discos': 'Discos',
    'guias': 'Guías y Rieles',
  };
  return displayNames[category] || category;
}

/**
 * Calculate search relevance score
 */
export function calculateRelevanceScore(tool: Tool, query: string): number {
  const searchResults = searchTools(query, [tool], { minScore: 0 });
  return searchResults[0]?.score || 0;
}

/**
 * Get Levenshtein distance between two strings (for fuzzy matching)
 */
function getLevenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
