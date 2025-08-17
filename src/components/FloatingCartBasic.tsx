import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const FloatingCartBasic: React.FC = () => {
  const { items, getTotalPrice, getTotalItems } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = 8000;
  const finalTotal = totalPrice + shippingCost;

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  // No mostrar si no hay productos
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      {/* Barra Simple */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        {/* Info del Carrito */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </p>
            <p className="text-xs opacity-90">
              Total: {formatPrice(finalTotal)}
            </p>
          </div>
        </div>

        {/* Botón Comprar */}
        <button
          onClick={handleCheckout}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default FloatingCartBasic;
