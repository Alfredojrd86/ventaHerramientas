import React from 'react';
import {useCart} from '../context/CartContext';
import {ArrowLeft, Trash2, X} from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import ConfirmationModal from './ConfirmationModal';
import {useNavigate} from 'react-router-dom';

export default function CheckoutPage() {
  const {items, removeFromCart, getTotalPrice, clearCart} = useCart();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppCheckout = () => {
    const message = encodeURIComponent(
      `¡Hola! 🛒 Quiero confirmar mi compra:\n\n${items
        .map(
          (item, index) =>
            `${index + 1}. ${item.name}\n` +
            `   Código: ${item.code}\n` +
            `   Precio: ${formatPrice(item.price)}\n`
        )
        .join('\n')}` +
        `\nTotal a pagar: ${formatPrice(getTotalPrice())}\n` +
        `\n💳 Solicito link de pago por Mercado Pago`
    );
    window.open(`https://wa.me/+56935397603?text=${message}`, '_blank');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a la tienda
          </button>
          <button
            onClick={clearCart}
            className="flex items-center text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Vaciar carrito
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">
              Carrito de Compras ({items.length})
            </h1>
          </div>

          <div className="divide-y">
            {items.map((item) => (
              <div
                key={item.code}
                className="p-4 flex items-center gap-4 hover:bg-gray-50"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    Código: {item.code}
                  </p>
                  <p className="text-blue-600 font-bold">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.code)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <WhatsAppButton onClick={handleWhatsAppCheckout} />
          </div>
        </div>
      </div>

      <ConfirmationModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
