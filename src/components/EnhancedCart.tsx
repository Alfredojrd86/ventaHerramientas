import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface EnhancedCartProps {
  className?: string;
}

const EnhancedCart: React.FC<EnhancedCartProps> = ({ className = '' }) => {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = getTotalPrice();
  // No hay envío gratis - el cliente paga envío o retira en persona
  const shippingCost = 8000; // Costo fijo de envío
  const finalTotal = totalPrice + shippingCost;

  // Calcular ahorros totales
  const totalSavings = items.reduce((total, item) => {
    return total + (item.originalPrice - item.price);
  }, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    // Simular proceso de checkout
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí integrarías con MercadoPago o tu sistema de pago
      alert('¡Gracias por tu compra! Te contactaremos pronto para coordinar la entrega.');
      clearCart();
    } catch (error) {
      alert('Hubo un error. Por favor intenta nuevamente.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center ${className}`}>
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
        <p className="text-gray-600">Agrega algunos productos para comenzar tu compra</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Carrito de Compras ({items.length})
          </h2>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Vaciar carrito
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="px-6 py-4">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.code} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600">{item.condition}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Cant: 1</span>
                <button
                  onClick={() => removeFromCart(item.code)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Eliminar del carrito"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({items.length} productos)</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>

          {/* Savings */}
          {totalSavings > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Ahorros totales</span>
              <span className="font-medium text-green-600">-{formatPrice(totalSavings)}</span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Envío a domicilio</span>
            <span className="font-medium">{formatPrice(shippingCost)}</span>
          </div>

          {/* Pickup option */}
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            💡 <strong>Retiro gratis</strong> - Puedes retirar en persona sin costo adicional
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200">
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCheckingOut ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          ) : (
            'Finalizar Compra'
          )}
        </button>

        {/* Trust signals */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Compra Segura
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Herramientas Verificadas
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-purple-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Entrega Rápida
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>¿Tienes dudas? <span className="text-blue-600 cursor-pointer hover:underline">Contáctanos por WhatsApp</span></p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCart;
