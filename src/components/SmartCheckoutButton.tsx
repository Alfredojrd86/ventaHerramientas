import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface SmartCheckoutButtonProps {
  readonly className?: string;
  readonly variant?: 'primary' | 'secondary';
}

export default function SmartCheckoutButton({ className = '', variant = 'primary' }: SmartCheckoutButtonProps) {
  const { items, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Detectar si es móvil
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const generateWhatsAppMessage = () => {
    const baseMessage = `¡Hola! 🛒 Quiero confirmar mi compra:\n\n${items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}\n` +
          `   Código: ${item.code}\n` +
          `   Precio: ${formatPrice(item.price)}\n`
      )
      .join('\n')}` +
      `\nTotal: ${formatPrice(getTotalPrice())}\n\n`;

    return baseMessage;
  };

  const handleWhatsAppDirect = () => {
    setIsProcessing(true);
    const message = generateWhatsAppMessage() + 
      `💳 Solicito link de pago por Mercado Pago\n` +
      `📱 Enviado desde móvil`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/+56935397603?text=${encodedMessage}`, '_blank');
    
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
    }, 2000);
  };

  const handleWebCheckout = () => {
    setIsProcessing(true);
    const message = generateWhatsAppMessage() + 
      `💻 Prefiero continuar en la web para el pago\n` +
      `🔗 Por favor envíame el link de checkout`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/+56935397603?text=${encodedMessage}`, '_blank');
    
    // Simular redirección a checkout web (implementar más tarde)
    setTimeout(() => {
      setIsProcessing(false);
      // Aquí iríamos a la página de checkout web
      window.location.href = '/checkout';
    }, 3000);
  };

  const handleSmartCheckout = () => {
    if (isMobile) {
      handleWhatsAppDirect();
    } else {
      setShowOptions(true);
    }
  };

  if (items.length === 0) {
    return null;
  }

  const baseClasses = variant === 'primary' 
    ? "bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-bold" 
    : "bg-blue-600 hover:bg-blue-700 text-white font-semibold";

  if (showOptions) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="text-center text-sm text-gray-600 mb-3">
          Elige cómo prefieres continuar:
        </div>
        
        <button
          onClick={handleWhatsAppDirect}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          <DevicePhoneMobileIcon className="w-5 h-5" />
          WhatsApp Directo
          <span className="text-xs bg-green-500 px-2 py-1 rounded-full">Rápido</span>
        </button>

        <button
          onClick={handleWebCheckout}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          <ComputerDesktopIcon className="w-5 h-5" />
          Checkout Web
          <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">Completo</span>
        </button>

        <button
          onClick={() => setShowOptions(false)}
          className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSmartCheckout}
      disabled={isProcessing}
      className={`w-full px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${baseClasses} ${className}`}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          Procesando...
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <ShoppingCartIcon className="w-5 h-5" />
          {isMobile ? 'Comprar por WhatsApp' : 'Finalizar Compra'}
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {formatPrice(getTotalPrice())}
          </span>
        </div>
      )}
    </button>
  );
}
