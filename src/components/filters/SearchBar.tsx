import React, { useState, useRef, useEffect } from 'react';
import { useProductSearch } from '../../hooks/useProductSearch';
import { tools } from '../../data/tools';
import { debounce } from '../../utils/searchUtils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  maxSuggestions?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar productos...',
  className = '',
  showSuggestions = true,
  maxSuggestions = 5,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { searchSuggestions } = useProductSearch({
    tools,
    filters: { searchQuery: value },
  });

  // Debounced onChange to avoid excessive API calls
  const debouncedOnChange = debounce((newValue: string) => {
    onChange(newValue);
  }, 150);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    debouncedOnChange(newValue);
    setIsOpen(newValue.length > 0 && showSuggestions);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(searchSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    if (value.length > 0 && showSuggestions && searchSuggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay closing to allow suggestion clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }, 150);
  };

  const clearSearch = () => {
    onChange('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Enhanced suggestions with categories
  const categorizedSuggestions = React.useMemo(() => {
    if (!value.trim()) return [];

    const suggestions = searchSuggestions.slice(0, maxSuggestions);
    const query = value.toLowerCase();

    // Add category-based suggestions
    const categories = ['Sierras', 'Fresadoras', 'Lijadoras', 'Prensas', 'Fresas'];
    const categorySuggestions = categories
      .filter(cat => cat.toLowerCase().includes(query))
      .map(cat => ({ text: cat, type: 'category' as const }));

    // Add brand suggestions
    const brands = ['Makita', 'Bosch', 'Irwin', 'Kreg'];
    const brandSuggestions = brands
      .filter(brand => brand.toLowerCase().includes(query))
      .map(brand => ({ text: brand, type: 'brand' as const }));

    // Combine all suggestions
    const allSuggestions = [
      ...suggestions.map(s => ({ text: s, type: 'product' as const })),
      ...categorySuggestions,
      ...brandSuggestions,
    ].slice(0, maxSuggestions);

    return allSuggestions;
  }, [searchSuggestions, value, maxSuggestions]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'category':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7v14l-2-2m2 2l-2-2" />
          </svg>
        );
      case 'brand':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          defaultValue={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        
        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="Limpiar búsqueda"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && categorizedSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {categorizedSuggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.text}`}
              type="button"
              onClick={() => handleSuggestionClick(suggestion.text)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center space-x-2 ${
                index === highlightedIndex ? 'bg-gray-50' : ''
              }`}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              {getSuggestionIcon(suggestion.type)}
              <span className="flex-1 text-sm text-gray-900">
                {suggestion.text}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {suggestion.type === 'product' ? 'producto' : suggestion.type}
              </span>
            </button>
          ))}
          
          {value.length >= 2 && (
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
              Presiona Enter para buscar "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
