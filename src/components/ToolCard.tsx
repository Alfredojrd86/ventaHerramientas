import {Check, ShoppingCart} from 'lucide-react';
import {useState} from 'react';
import {useCart} from '../context/CartContext';
import {Tool} from '../types';
import React from 'react';
import ImageModal from './ImageModal';

// WhatsApp SVG icon component
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function ToolCard({tool}: {tool: Tool}) {
  const {addToCart, isInCart} = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col border border-gray-200">
      {/* Imagen y Descuento */}
      <div
        className="relative w-full h-48 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={tool.image}
          alt={tool.name}
          className="w-full h-full object-cover rounded-t-xl"
          loading="lazy"
        />
        {tool.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
            {tool.discount}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <span className="text-sm font-medium text-gray-900">
            {tool.condition}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Encabezado */}
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Precio */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(tool.price)}
          </span>
          {tool.originalPrice > tool.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(tool.originalPrice)}
            </span>
          )}
        </div>

        {/* Características principales (max 2) */}
        <div className="mb-4 flex-1">
          {tool.features.slice(0, 2).map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={showSuccess || inCart}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-white text-sm font-medium
                     transition-all duration-300 ${
                       inCart
                         ? 'bg-gray-400'
                         : showSuccess
                         ? 'bg-green-500'
                         : 'bg-blue-600 hover:bg-blue-700'
                     }`}
          >
            {inCart ? (
              <Check className="w-4 h-4" />
            ) : showSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            <span>{inCart ? 'En carrito' : 'Agregar'}</span>
          </button>

          <button
            onClick={() => handleWhatsAppClick(false)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
                     bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-medium
                     transition-all duration-300"
          >
            <WhatsAppIcon />
            <span>Consultar</span>
          </button>
        </div>
      </div>

      {/* Modal para la imagen */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={tool.image}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
