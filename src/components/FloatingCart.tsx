import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

interface FloatingCartProps {
  onToggleCart?: () => void;
  onCheckout?: () => void;
  className?: string;
}

const FloatingCart: React.FC<FloatingCartProps> = ({
  onToggleCart,
  onCheckout,
  className = '',
}) => {
  const { items, getTotalPrice, getTotalItems, removeFromCart, updateQuantity } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = 8000;
  const finalTotal = totalPrice + shippingCost;

  // Auto-hide/show based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide cart
        setIsVisible(false);
      } else {
        // Scrolling up - show cart
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Show cart when items are added
  useEffect(() => {
    if (totalItems > 0) {
      setIsVisible(true);
    }
  }, [totalItems]);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (onToggleCart) {
      onToggleCart();
    }
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      // Fallback: redirect to checkout page
      window.location.href = '/checkout';
    }
  };

  const handleRemoveItem = (code: string) => {
    removeFromCart(code);
  };

  const handleUpdateQuantity = (code: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(code);
    } else {
      updateQuantity(code, newQuantity);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop for expanded state */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Floating Cart */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
          ${isExpanded ? 'h-96' : 'h-16'}
          ${className}
        `}
      >
        {/* Collapsed State - Always Visible Bar */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white"
          onClick={handleToggleExpanded}
        >
          {/* Left Side - Cart Info */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
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

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCheckout();
              }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Comprar
            </button>
            <svg
              className={`w-5 h-5 transform transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded State - Cart Details */}
        {isExpanded && (
          <div className="h-80 flex flex-col bg-white">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div key={item.code} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">{item.condition}</p>
                    <p className="text-sm font-bold text-blue-600">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.code, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.code, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.code)}
                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} productos)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío a domicilio</span>
                  <span className="font-medium">{formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600 text-lg">{formatPrice(finalTotal)}</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                💡 <strong>Retiro gratis</strong> - Puedes retirar en persona sin costo adicional
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spacer for content when cart is visible */}
      {isVisible && !isExpanded && (
        <div className="h-16" />
      )}
    </>
  );
};

export default FloatingCart;
