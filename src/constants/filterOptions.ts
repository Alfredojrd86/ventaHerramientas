import { FilterCategory, SortOption } from '../types/filters';

export const FILTER_CATEGORIES: FilterCategory[] = [
  {
    key: 'category',
    label: 'Categoría',
    type: 'multiselect',
    options: [
      { value: 'sierras', label: 'Sierras', count: 0 },
      { value: 'fresadoras', label: 'Fresadoras', count: 0 },
      { value: 'lijadoras', label: 'Lijadoras', count: 0 },
      { value: 'prensas', label: 'Prensas', count: 0 },
      { value: 'accesorios', label: 'Accesorios', count: 0 },
      { value: 'fresas', label: 'Fresas', count: 0 },
      { value: 'discos', label: 'Discos', count: 0 },
      { value: 'guias', label: 'Guías y Rieles', count: 0 },
    ]
  },
  {
    key: 'brand',
    label: 'Marca',
    type: 'multiselect',
    options: [
      { value: 'makita', label: 'Makita', count: 0 },
      { value: 'bosch', label: 'Bosch', count: 0 },
      { value: 'irwin', label: 'Irwin', count: 0 },
      { value: 'kreg', label: 'Kreg', count: 0 },
      { value: 'milescraft', label: 'Milescraft', count: 0 },
    ]
  },
  {
    key: 'condition',
    label: 'Estado',
    type: 'multiselect',
    options: [
      { value: 'usado-bueno', label: 'Usado - Buen Estado', count: 0 },
      { value: 'nuevo', label: 'Nuevo', count: 0 },
    ]
  },
  {
    key: 'priceRange',
    label: 'Rango de Precio',
    type: 'range',
    min: 0,
    max: 1000000,
  },
  {
    key: 'discount',
    label: 'Con Descuento',
    type: 'checkbox',
  },
  {
    key: 'inStock',
    label: 'En Stock',
    type: 'checkbox',
  }
];

export const SORT_OPTIONS: SortOption[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'name-desc', label: 'Nombre: Z-A' },
  { value: 'discount-desc', label: 'Mayor Descuento' },
  { value: 'condition-best', label: 'Mejor Estado' },
];

export const DEFAULT_FILTERS = {
  category: [],
  brand: [],
  condition: [],
  priceRange: undefined,
  discount: false,
  inStock: true,
  searchQuery: '',
};

export const ITEMS_PER_PAGE = 12;

export const DEBOUNCE_DELAY = 300; // milliseconds for search input debouncing
