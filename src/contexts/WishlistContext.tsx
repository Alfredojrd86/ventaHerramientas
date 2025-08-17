import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { Tool } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface WishlistItem extends Tool {
  addedAt: string; // ISO date string
  notes?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (tool: Tool, notes?: string) => boolean;
  removeFromWishlist: (toolId: string) => void;
  updateWishlistItem: (toolId: string, updates: Partial<Pick<WishlistItem, 'notes'>>) => void;
  clearWishlist: () => void;
  isInWishlist: (toolId: string) => boolean;
  getWishlistItem: (toolId: string) => WishlistItem | undefined;
  moveToCart?: (toolId: string) => void; // Optional integration with cart
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  readonly children: ReactNode;
  readonly storageKey?: string;
  readonly maxItems?: number;
  readonly onMoveToCart?: (tool: Tool) => void;
}

export function WishlistProvider({ 
  children, 
  storageKey = 'venta-carpinteria-wishlist',
  maxItems = 50,
  onMoveToCart
}: WishlistProviderProps) {
  const [items, setItems] = useLocalStorage<WishlistItem[]>(storageKey, []);

  // Check if item is in wishlist
  const isInWishlist = useCallback((toolId: string): boolean => {
    return items.some(item => item.code === toolId);
  }, [items]);

  // Get wishlist item
  const getWishlistItem = useCallback((toolId: string): WishlistItem | undefined => {
    return items.find(item => item.code === toolId);
  }, [items]);

  // Add item to wishlist
  const addToWishlist = useCallback((tool: Tool, notes?: string): boolean => {
    // Check if already in wishlist
    if (isInWishlist(tool.code)) {
      return false;
    }

    // Check max items limit
    if (items.length >= maxItems) {
      console.warn(`Wishlist is full. Maximum ${maxItems} items allowed.`);
      return false;
    }

    const wishlistItem: WishlistItem = {
      ...tool,
      addedAt: new Date().toISOString(),
      notes,
    };

    setItems(currentItems => [wishlistItem, ...currentItems]);
    return true;
  }, [items, isInWishlist, maxItems, setItems]);

  // Remove item from wishlist
  const removeFromWishlist = useCallback((toolId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.code !== toolId)
    );
  }, [setItems]);

  // Update wishlist item
  const updateWishlistItem = useCallback((
    toolId: string, 
    updates: Partial<Pick<WishlistItem, 'notes'>>
  ) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.code === toolId 
          ? { ...item, ...updates }
          : item
      )
    );
  }, [setItems]);

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    setItems([]);
  }, [setItems]);

  // Move item to cart (optional integration)
  const moveToCart = useCallback((toolId: string) => {
    const wishlistItem = getWishlistItem(toolId);
    if (!wishlistItem) return;

    // Remove from wishlist
    removeFromWishlist(toolId);
    
    // Add to cart if callback provided
    if (onMoveToCart) {
      onMoveToCart(wishlistItem);
    }
  }, [getWishlistItem, removeFromWishlist, onMoveToCart]);

  // Wishlist count
  const wishlistCount = items.length;

  // Context value
  const contextValue: WishlistContextType = React.useMemo(() => ({
    items,
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    clearWishlist,
    isInWishlist,
    getWishlistItem,
    moveToCart: onMoveToCart ? moveToCart : undefined,
    wishlistCount,
  }), [items, addToWishlist, removeFromWishlist, updateWishlistItem, clearWishlist, isInWishlist, getWishlistItem, moveToCart, wishlistCount]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

// Custom hooks for common wishlist operations
export function useWishlistToggle(tool: Tool) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(tool.code);
  
  const toggle = useCallback((notes?: string) => {
    if (inWishlist) {
      removeFromWishlist(tool.code);
      return false;
    } else {
      return addToWishlist(tool, notes);
    }
  }, [inWishlist, addToWishlist, removeFromWishlist, tool, notes]);

  return { inWishlist, toggle };
}

// Hook for wishlist statistics
export function useWishlistStats() {
  const { items } = useWishlist();
  
  return React.useMemo(() => {
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    const totalOriginalValue = items.reduce((sum, item) => sum + item.originalPrice, 0);
    const totalSavings = totalOriginalValue - totalValue;
    const averageDiscount = totalOriginalValue > 0 
      ? ((totalSavings / totalOriginalValue) * 100) 
      : 0;

    // Group by categories (simplified)
    const categories = items.reduce((acc, item) => {
      const category = getCategoryFromTool(item);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by brands
    const brands = items.reduce((acc, item) => {
      const brand = getBrandFromTool(item);
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalItems: items.length,
      totalValue,
      totalOriginalValue,
      totalSavings,
      averageDiscount,
      categories,
      brands,
      oldestItem: items.length > 0 
        ? items.reduce((oldest, item) => 
            new Date(item.addedAt) < new Date(oldest.addedAt) ? item : oldest
          )
        : null,
      newestItem: items.length > 0 
        ? items.reduce((newest, item) => 
            new Date(item.addedAt) > new Date(newest.addedAt) ? item : newest
          )
        : null,
    };
  }, [items]);
}

// Helper functions
function getCategoryFromTool(tool: Tool): string {
  const name = tool.name.toLowerCase();
  if (name.includes('sierra')) return 'Sierras';
  if (name.includes('fresadora')) return 'Fresadoras';
  if (name.includes('lijadora')) return 'Lijadoras';
  if (name.includes('prensa')) return 'Prensas';
  if (name.includes('disco')) return 'Discos';
  if (name.includes('fresa')) return 'Fresas';
  return 'Otros';
}

function getBrandFromTool(tool: Tool): string {
  const name = tool.name.toLowerCase();
  if (name.includes('makita')) return 'Makita';
  if (name.includes('bosch')) return 'Bosch';
  if (name.includes('irwin')) return 'Irwin';
  if (name.includes('kreg')) return 'Kreg';
  if (name.includes('milescraft')) return 'Milescraft';
  return 'Otros';
}

// HOC for easier integration
export function withWishlist<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WishlistComponent(props: P) {
    return (
      <WishlistProvider>
        <Component {...props} />
      </WishlistProvider>
    );
  };
}
