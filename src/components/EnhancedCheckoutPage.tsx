import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

export default function EnhancedCheckoutPage() {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: ''
  });
  const [deliveryOption, setDeliveryOption] = useState('delivery'); // 'delivery' | 'pickup'
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Review, 2: Info, 3: Payment

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const shippingCost = deliveryOption === 'delivery' ? 8000 : 0;
  const total = subtotal + shippingCost;

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleMercadoPagoPayment = async () => {
    setIsProcessing(true);
    
    // Simular integración con MercadoPago
    try {
      // En producción, aquí harías la llamada real a MercadoPago
      const paymentData = {
        items: items.map(item => ({
          title: item.name,
          unit_price: item.price,
          quantity: 1,
          currency_id: 'CLP'
        })),
        payer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: { number: customerInfo.phone }
        },
        shipments: {
          cost: shippingCost,
          mode: deliveryOption === 'delivery' ? 'custom' : 'not_specified'
        },
        back_urls: {
          success: `${window.location.origin}/payment-success`,
          failure: `${window.location.origin}/payment-failure`,
          pending: `${window.location.origin}/payment-pending`
        },
        auto_return: 'approved'
      };

      console.log('Payment data to send to MercadoPago:', paymentData);

      // Simular respuesta de MercadoPago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // En producción, redirigirías a la URL de MercadoPago
      // Por ahora, mostrar mensaje y limpiar carrito
      alert('¡Redirigiendo a MercadoPago para completar el pago!');
      clearCart();
      navigate('/');
      
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Hubo un error procesando el pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppFallback = () => {
    const itemsList = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name}\n` +
          `   Código: ${item.code}\n` +
          `   Precio: ${formatPrice(item.price)}\n`
      )
      .join('\n');

    const customerData = `📋 Mis datos:\n` +
      `Nombre: ${customerInfo.name}\n` +
      `Email: ${customerInfo.email}\n` +
      `Teléfono: ${customerInfo.phone}\n` +
      `${deliveryOption === 'delivery' ? `Dirección: ${customerInfo.address}, ${customerInfo.city}` : 'Retiro en tienda'}`;

    const message = `¡Hola! 🛒 Quiero completar mi compra:\n\n${itemsList}\n` +
      `Subtotal: ${formatPrice(subtotal)}\n` +
      `Envío: ${formatPrice(shippingCost)}\n` +
      `Total: ${formatPrice(total)}\n\n` +
      `${customerData}\n\n` +
      `💳 Por favor envíame el link de pago de MercadoPago`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/+56935397603?text=${encodedMessage}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 mb-6 hover:text-gray-800"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver a la tienda
          </button>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No hay productos en el carrito</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Ir a comprar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Volver a la tienda
            </button>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className="w-6 h-6 rounded-full bg-current text-white text-xs flex items-center justify-center mr-2">1</span>
                Revisar
              </div>
              <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className="w-6 h-6 rounded-full bg-current text-white text-xs flex items-center justify-center mr-2">2</span>
                Datos
              </div>
              <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className="w-6 h-6 rounded-full bg-current text-white text-xs flex items-center justify-center mr-2">3</span>
                Pago
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            
            {/* Step 1: Revisar productos */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Revisar tu pedido</h2>
                </div>
                
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.code} className="p-6 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-1">Código: {item.code}</p>
                        <p className="text-blue-600 font-bold">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.code)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Continuar con los datos
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Información del cliente */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Tus datos</h2>
                </div>

                <form onSubmit={handleCustomerInfoSubmit} className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Opción de entrega */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Método de entrega
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="delivery"
                          checked={deliveryOption === 'delivery'}
                          onChange={(e) => setDeliveryOption(e.target.value)}
                          className="mr-3"
                        />
                        <TruckIcon className="w-5 h-5 mr-2 text-gray-600" />
                        Envío a domicilio (+{formatPrice(8000)})
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="pickup"
                          checked={deliveryOption === 'pickup'}
                          onChange={(e) => setDeliveryOption(e.target.value)}
                          className="mr-3"
                        />
                        <CheckCircleIcon className="w-5 h-5 mr-2 text-gray-600" />
                        Retiro en tienda (Gratis)
                      </label>
                    </div>
                  </div>

                  {deliveryOption === 'delivery' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Continuar al pago
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Pago */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Método de pago</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <CreditCardIcon className="w-6 h-6 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">MercadoPago</span>
                      </div>
                      <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                        Recomendado
                      </div>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Pago seguro con tarjeta de crédito, débito o transferencia
                    </p>
                    <button
                      onClick={handleMercadoPagoPayment}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isProcessing ? 'Procesando...' : 'Pagar con MercadoPago'}
                    </button>
                  </div>

                  <div className="text-center text-gray-500">
                    <span className="text-sm">o</span>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 text-green-600 mr-2">💬</div>
                      <span className="font-semibold text-green-800">WhatsApp</span>
                    </div>
                    <p className="text-sm text-green-700 mb-4">
                      Coordina tu pago directamente con nosotros
                    </p>
                    <button
                      onClick={handleWhatsAppFallback}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                    >
                      Continuar por WhatsApp
                    </button>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-4">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Resumen del pedido</h3>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({items.length} productos)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">
                    {shippingCost > 0 ? formatPrice(shippingCost) : 'Gratis'}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Indicadores de confianza */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <ShieldCheckIcon className="w-4 h-4 mr-2 text-green-500" />
                    Pago 100% seguro
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TruckIcon className="w-4 h-4 mr-2 text-blue-500" />
                    Envío a todo Chile
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-yellow-500" />
                    Garantía extendida
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
