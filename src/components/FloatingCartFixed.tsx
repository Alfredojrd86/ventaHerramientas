import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import PaymentOptionsModal from './PaymentOptionsModal';
import { useNavigate } from 'react-router-dom';

const FloatingCartFixed: React.FC = () => {
  const { items, getTotalPrice, getTotalItems, removeFromCart, updateQuantity } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = 8000;
  const finalTotal = totalPrice + shippingCost;

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentOptionSelect = (option: 'mercadopago' | 'whatsapp') => {
    setShowPaymentModal(false);
    
    if (option === 'mercadopago') {
      // Solicitar link de MercadoPago por WhatsApp
      handleMercadoPagoRequest();
    } else if (option === 'whatsapp') {
      // Canalizar compra por WhatsApp
      handleWhatsAppOrder();
    }
  };

  const handleMercadoPagoRequest = () => {
    const itemsList = items
      .map((item, index) => 
        `${index + 1}. ${item.name}\n` +
        `   Código: ${item.code}\n` +
        `   Estado: ${item.condition}\n` +
        `   Precio: ${formatPrice(item.price)}\n` +
        `   Cantidad: ${item.quantity}`
      )
      .join('\n\n');

    const message = 
      `¡Hola! 🛒 Solicito link de MercadoPago para mi compra:\n\n${itemsList}\n\n` +
      `💰 Resumen:\n` +
      `Subtotal: ${formatPrice(totalPrice)}\n` +
      `Envío: ${formatPrice(shippingCost)}\n` +
      `Total: ${formatPrice(finalTotal)}\n\n` +
      `💳 Por favor envíame el link de pago de MercadoPago para completar mi compra.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/+56935397603?text=${encodedMessage}`, '_blank');
  };

  const handleWhatsAppOrder = () => {
    const itemsList = items
      .map((item, index) => 
        `${index + 1}. ${item.name}\n` +
        `   Código: ${item.code}\n` +
        `   Estado: ${item.condition}\n` +
        `   Precio: ${formatPrice(item.price)}\n` +
        `   Cantidad: ${item.quantity}`
      )
      .join('\n\n');

    const message = 
      `¡Hola! 🛒 Quiero coordinar mi compra por WhatsApp:\n\n${itemsList}\n\n` +
      `💰 Resumen:\n` +
      `Subtotal: ${formatPrice(totalPrice)}\n` +
      `Envío: ${formatPrice(shippingCost)}\n` +
      `Total: ${formatPrice(finalTotal)}\n\n` +
      `💬 ¿Podemos coordinar el pago y entrega por este medio?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/+56935397603?text=${encodedMessage}`, '_blank');
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

  // No mostrar si no hay productos
  if (totalItems === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop para móviles cuando está expandido */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'h-96' : 'h-16'}
        `}
      >
        {/* Barra Colapsada */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white h-16 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          onClick={handleToggleExpanded}
          title="Clic para ver productos en el carrito"
        >
          {/* Info del Carrito */}
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
                Total: {formatPrice(finalTotal)} • Clic para ver
              </p>
            </div>
          </div>

          {/* Acciones */}
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

        {/* Vista Expandida */}
        {isExpanded && (
          <div className="h-80 flex flex-col bg-white">
            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div key={item.code} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                  {/* Imagen */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">{item.condition}</p>
                    <p className="text-sm font-bold text-blue-600">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Controles */}
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

                  {/* Eliminar */}
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

            {/* Resumen */}
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

        {/* Modal de Opciones de Pago */}
        <PaymentOptionsModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSelectOption={handlePaymentOptionSelect}
          totalAmount={finalTotal}
          itemCount={totalItems}
        />
      </div>
    </>
  );
};

export default FloatingCartFixed;
