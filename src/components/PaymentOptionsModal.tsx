import React from 'react';
import MercadoPago from '../utils/MercadoPago';

interface PaymentOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 'mercadopago' | 'whatsapp') => void;
  totalAmount: number;
  itemCount: number;
}

const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({
  isOpen,
  onClose,
  onSelectOption,
  totalAmount,
  itemCount,
}) => {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CL')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">¿Cómo quieres comprar?</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Resumen */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </span>
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Opciones de Pago */}
        <div className="p-6 space-y-4">
          {/* MercadoPago */}
          <button
            onClick={() => onSelectOption('mercadopago')}
            className="w-full p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <MercadoPago className="w-8 h-8" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                  Solicitar Link de MercadoPago
                </h3>
                <p className="text-sm text-gray-600">
                  Te enviamos el link de pago por WhatsApp
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Recomendado
                  </span>
                  <span className="text-xs text-green-600 ml-2">
                    ✓ Pago seguro
                  </span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => onSelectOption('whatsapp')}
            className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.106"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                  Canalizar Compra por WhatsApp
                </h3>
                <p className="text-sm text-gray-600">
                  Coordina tu compra directamente con nosotros
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-green-600">
                    ✓ Atención personalizada
                  </span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Pago 100% seguro
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Soporte 24/7
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsModal;
