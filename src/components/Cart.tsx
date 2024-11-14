import React from 'react';
import {useCart} from '../context/CartContext';
import {X, ShoppingCart, Trash2} from 'lucide-react';

// WhatsApp SVG icon component
const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5 transition-transform group-hover:scale-110"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Cart() {
  const {items, removeFromCart, getTotalPrice, clearCart} = useCart();

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
              <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
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
          <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
        </div>
        <button
          onClick={handleWhatsAppCheckout}
          title="Finalizar compra por WhatsApp"
          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white 
                   p-2.5 rounded-lg
                   transition-all duration-300 hover:shadow-md active:scale-95
                   flex items-center justify-center gap-2 group"
        >
          <WhatsAppIcon />
        </button>
      </div>
    </div>
  );
}
