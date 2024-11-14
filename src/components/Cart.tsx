import {ShoppingCart} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {useCart} from '../context/CartContext';

export default function Cart() {
  const {items, getTotalPrice} = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <button
      onClick={() => navigate('/checkout')}
      className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg border border-gray-100 
                 transition-all duration-300 hover:shadow-xl p-3 flex items-center gap-2"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6 text-blue-600" />
        {items.length > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-red-500 text-white 
                          text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {items.length}
          </span>
        )}
      </div>
      {items.length > 0 && (
        <span className="font-semibold text-gray-800">
          {formatPrice(getTotalPrice())}
        </span>
      )}
    </button>
  );
}
