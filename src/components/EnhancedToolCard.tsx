import React, { useState } from 'react';
import { Tool } from '../types';
import { useCart } from '../context/CartContext';

interface EnhancedToolCardProps {
  tool: Tool;
  onQuickView?: (tool: Tool) => void;
  showUrgency?: boolean;
  showSocialProof?: boolean;
  className?: string;
}

const EnhancedToolCard: React.FC<EnhancedToolCardProps> = ({
  tool,
  onQuickView,
  showUrgency = true,
  showSocialProof = true,
  className = '',
}) => {
  const { addToCart, isInCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Datos estáticos simulados
  const mockViewers = Math.floor(Math.random() * 12) + 3; // 3-14 personas
  const recentPurchaser = ['Carlos M.', 'María S.', 'José L.', 'Ana R.'][Math.floor(Math.random() * 4)];
  const timeAgo = ['hace 5 min', 'hace 15 min', 'hace 1 hora'][Math.floor(Math.random() * 3)];

  const discountPercentage = Math.round(((tool.originalPrice - tool.price) / tool.originalPrice) * 100);
  const inCart = isInCart(tool.code);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addToCart(tool);
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getBrandFromName = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('makita')) return 'Makita';
    if (lowerName.includes('bosch')) return 'Bosch';
    if (lowerName.includes('irwin')) return 'Irwin';
    if (lowerName.includes('kreg')) return 'Kreg';
    if (lowerName.includes('milescraft')) return 'Milescraft';
    return 'Profesional';
  };

  const getStockLevel = () => {
    const stock = tool.stock || 1; // Usar stock real del tool
    if (stock <= 1) return { level: 'critical', color: 'text-red-600 bg-red-50', message: `¡Última unidad!` };
    if (stock <= 2) return { level: 'low', color: 'text-orange-600 bg-orange-50', message: `${stock} disponibles` };
    return { level: 'good', color: 'text-green-600 bg-green-50', message: `${stock} disponibles` };
  };

  const stockInfo = getStockLevel();

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={tool.image}
          alt={tool.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-700 shadow-lg">
            {getBrandFromName(tool.name)}
          </span>
        </div>

        {/* Stock Indicator */}
        {showUrgency && (
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stockInfo.color} shadow-lg border`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${stockInfo.level === 'critical' ? 'bg-red-500 animate-pulse' : stockInfo.level === 'low' ? 'bg-orange-500' : 'bg-green-500'}`} />
              {stockInfo.message}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            {onQuickView && (
              <button
                onClick={() => onQuickView(tool)}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                title="Vista rápida"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}
            <button
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              title="Agregar a favoritos"
            >
              <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Social Proof */}
        {showSocialProof && (
          <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {recentPurchaser} compró {timeAgo}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-1"></div>
              {mockViewers} viendo
            </span>
          </div>
        )}

        {/* Condition Badge */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {tool.condition}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
          {tool.name}
        </h3>

        {/* Description */}
        <p className={`text-sm text-gray-600 mb-3 ${showFullDescription ? '' : 'line-clamp-2'}`}>
          {tool.description.replace(/[✨💪🔧📐⚡🎯🔄🎨🛠️📏🔨💫⭐🌪️🔥]/g, '').trim()}
        </p>
        
        {tool.description.length > 100 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-xs text-blue-600 hover:text-blue-700 mb-3"
          >
            {showFullDescription ? 'Ver menos' : 'Ver más'}
          </button>
        )}

        {/* Features Preview */}
        <div className="mb-4">
          <ul className="text-xs text-gray-600 space-y-1">
            {tool.features.slice(0, 2).map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-3 h-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${tool.price.toLocaleString('es-CL')}
            </span>
            {tool.originalPrice > tool.price && (
              <span className="text-sm text-gray-500 line-through">
                ${tool.originalPrice.toLocaleString('es-CL')}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Precio incluye IVA</p>
        </div>

        {/* Urgency Message */}
        {tool.urgency && showUrgency && (
          <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-800 font-medium flex items-center">
              <svg className="w-3 h-3 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {tool.urgency.replace(/[🔥⚡🎯💫]/g, '').trim()}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={inCart || isAddingToCart}
          className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            inCart 
              ? 'bg-green-100 text-green-800 border border-green-200 cursor-default'
              : isAddingToCart
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transform hover:scale-105'
          }`}
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Agregando...
            </div>
          ) : inCart ? (
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              En Carrito
            </div>
          ) : (
            tool.ctaText || '¡Agregar al Carrito!'
          )}
        </button>
      </div>
    </div>
  );
};

export default EnhancedToolCard;
