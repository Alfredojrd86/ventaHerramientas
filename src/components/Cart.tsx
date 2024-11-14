import React, {useState} from 'react';
import {ShoppingCart, Trash2, X} from 'lucide-react';
import {useCart} from '../context/CartContext';
import WhatsAppButton from './WhatsAppButton';
import ConfirmationModal from './ConfirmationModal';

export default function Cart() {
  const {items, removeFromCart, getTotalPrice, clearCart} = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      `Hola! Me interesan las siguientes herramientas:\n\n${items
        .map(
          (item) =>
            `${item.name}\nCantidad: ${item.quantity}\nPrecio: ${formatPrice(
              item.price
            )}\n`
        )
        .join('\n')}Total: ${formatPrice(getTotalPrice())}`
    );
    window.open(`https://wa.me/+56935397603?text=${message}`, '_blank');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center gap-2 text-gray-500">
          <ShoppingCart className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl max-w-sm w-full transition-all duration-300">
        <div className="p-3 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-semibold">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => clearCart()}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50"
            title="Vaciar carrito"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto p-3">
          {items.map((item) => (
            <div
              key={item.code}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors border-b"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600">
                  {formatPrice(item.price)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.code)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50"
                title="Eliminar del carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 bg-gray-50 rounded-b-lg border-t">
          <div className="flex justify-between items-center font-bold text-base mb-3">
            <span>Total:</span>
            <span className="text-blue-600">
              {formatPrice(getTotalPrice())}
            </span>
          </div>
          <WhatsAppButton onClick={handleWhatsAppCheckout} />
        </div>
      </div>

      <ConfirmationModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
}
