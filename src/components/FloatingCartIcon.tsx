import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import PaymentOptionsModal from './PaymentOptionsModal';

const FloatingCartIcon: React.FC = () => {
  const { items, getTotalPrice, getTotalItems, removeFromCart, updateQuantity } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = 8000;
  const finalTotal = totalPrice + shippingCost;

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  // Manejar comportamiento del modal según los productos
  useEffect(() => {
    // Solo cerrar el modal si el carrito está completamente vacío
    // Mantener abierto mientras se eliminan productos uno por uno
    if (totalItems === 0) {
      setIsExpanded(false);
    }
    // No hacer nada si hay productos (mantener estado actual)
  }, [totalItems]);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentOptionSelect = (option: 'mercadopago' | 'whatsapp') => {
    setShowPaymentModal(false);
    
    if (option === 'mercadopago') {
      handleMercadoPagoRequest();
    } else if (option === 'whatsapp') {
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
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Icono Flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Botón Principal */}
        <div
          className="w-14 h-14 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 group"
          onClick={handleToggleExpanded}
          title="Ver carrito"
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
          </svg>
          
          {/* Badge */}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
              {totalItems}
            </span>
          )}

          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {totalItems} productos • {formatPrice(finalTotal)}
          </div>
        </div>


      </div>

      {/* Panel Expandido */}
      {isExpanded && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border max-h-[70vh] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Tu Carrito</h3>
              <button onClick={() => setIsExpanded(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm opacity-90">
              {totalItems} productos • {formatPrice(finalTotal)}
            </p>
          </div>

          {/* Lista de Productos */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map((item) => (
              <div key={item.code} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">{item.condition}</p>
                  <p className="text-sm font-bold text-blue-600">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.code, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.code, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.code)}
                  className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="border-t p-4 bg-gray-50 rounded-b-2xl">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      )}

      {/* Modal de Opciones */}
      <PaymentOptionsModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectOption={handlePaymentOptionSelect}
        totalAmount={finalTotal}
        itemCount={totalItems}
      />
    </>
  );
};

export default FloatingCartIcon;
