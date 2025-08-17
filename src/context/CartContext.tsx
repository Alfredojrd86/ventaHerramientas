import React, {createContext, useContext, useState, ReactNode} from 'react';
import {Tool} from '../types';

interface CartItem extends Tool {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (tool: Tool) => boolean;
  removeFromCart: (toolId: string) => void;
  updateQuantity: (toolId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (toolId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({children}: {children: ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([]);

  const isInCart = (toolId: string) => {
    return items.some((item) => item.code === toolId);
  };

  const addToCart = (tool: Tool): boolean => {
    if (isInCart(tool.code)) {
      return false;
    }
    setItems((currentItems) => [...currentItems, {...tool, quantity: 1}]);
    return true;
  };

  const removeFromCart = (toolId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.code !== toolId)
    );
  };

  const updateQuantity = (toolId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(toolId);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.code === toolId ? {...item, quantity} : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
