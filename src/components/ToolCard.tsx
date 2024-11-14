import {Check, ShoppingCart} from 'lucide-react';
import {useState} from 'react';
import {useCart} from '../context/CartContext';
import {Tool} from '../types';
import MercadoPago from '../utils/MercadoPago';

// WhatsApp SVG icon component
const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5 sm:w-6 sm:h-6 mx-auto transition-transform group-hover:scale-110"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function ToolCard({tool}: {tool: Tool}) {
  const {addToCart, isInCart} = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const condition = tool.condition.includes('Estado Profesional')
    ? 'Usado - Excelente Estado'
    : tool.condition;

  const handleWhatsAppClick = (isPurchase: boolean) => {
    const message = encodeURIComponent(
      `Hola! Me interesa la herramienta:\n` +
        `Código: ${tool.code}\n` +
        `${tool.name}\n` +
        (isPurchase
          ? `Precio: ${formatPrice(tool.price)}\n`
          : 'Consulta: Estoy interesado en más información sobre esta herramienta.')
    );
    window.open(`https://wa.me/+56935397603?text=${message}`, '_blank');
  };

  const handleAddToCart = () => {
    const added = addToCart(tool);
    if (added) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
  };

  const inCart = isInCart(tool.code);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 h-full grid grid-rows-[350px_minmax(0,1fr)_auto]">
      <div className="relative bg-white p-4 flex items-center justify-center">
        <img
          src={tool.image}
          alt={tool.name}
          className="max-w-full max-h-full w-auto h-auto transition-transform duration-300 hover:scale-105 cursor-pointer object-fill"
          loading="lazy"
        />
        {tool.discount && (
          <div className="absolute top-4 right-[-35px] bg-red-600 text-white py-1 px-10 transform rotate-45 font-bold shadow-lg">
            {tool.discount}
          </div>
        )}
      </div>

      <div className="p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <span className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full whitespace-nowrap">
            {condition}
          </span>
          <div className="flex flex-col items-end">
            {tool.originalPrice > tool.price && (
              <div className="text-gray-500 line-through text-sm">
                {formatPrice(tool.originalPrice)}
              </div>
            )}
            <div className="text-xl sm:text-2xl font-bold text-blue-900">
              {formatPrice(tool.price)}
            </div>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {tool.name}
        </h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          {tool.description}
        </p>

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2 text-sm sm:text-base">
            Características:
          </h3>
          <ul className="grid gap-2">
            {tool.features.map((feature, index) => (
              <li
                key={index}
                className="grid grid-cols-[auto_1fr] gap-2 text-sm sm:text-base"
              >
                <Check className="w-4 h-4 text-green-500 mt-1" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-red-600 font-bold mb-3 text-sm sm:text-base">
          {tool.urgency}
        </p>
      </div>

      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={handleAddToCart}
            disabled={showSuccess || inCart}
            title={inCart ? 'Ya está en el carrito' : 'Añadir al carrito'}
            className={`group w-full text-white text-center p-2.5 sm:p-3 rounded-lg
                       transition-all duration-300 hover:shadow-md active:scale-95 
                       ${
                         inCart
                           ? 'bg-gray-400 cursor-not-allowed'
                           : showSuccess
                           ? 'bg-green-500 hover:bg-green-600'
                           : 'bg-blue-600 hover:bg-blue-700'
                       }`}
          >
            {inCart ? (
              <Check className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
            ) : showSuccess ? (
              <Check className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
            ) : (
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mx-auto transition-transform group-hover:scale-110" />
            )}
            <span className="text-xs block mt-1">Agregar al carrito</span>
          </button>
          <button
            onClick={() => handleWhatsAppClick(false)}
            title="Consultar por WhatsApp"
            className="group w-full bg-[#25D366] hover:bg-[#128C7E] text-white
                      p-2.5 sm:p-3 rounded-lg
                      transition-all duration-300 hover:shadow-md active:scale-95 
                      border border-[#128C7E]"
          >
            <WhatsAppIcon />
            <span className="text-xs block mt-1">Consultar por WhatsApp</span>
          </button>
        </div>
      </div>

      {/* New Payment Banner */}
      <div className="bg-blue-100 p-2 sm:p-3 rounded-lg text-center flex items-center justify-center">
        <MercadoPago className="w-16 h-16 mr-2" />
        <p className="text-sm sm:text-base font-semibold text-blue-800">
          ¡Compra segura! 💳 Paga con Mercado Pago: tarjetas de crédito o
          débito.
        </p>
      </div>
    </div>
  );
}
