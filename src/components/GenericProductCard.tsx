import React from 'react';
import { useTenantConfig } from '../contexts/TenantContext';
import { useCart } from '../context/CartContext';
import { Tool } from '../types';

interface GenericProductCardProps {
  product: Tool;
  className?: string;
}

export default function GenericProductCard({ product, className = '' }: GenericProductCardProps) {
  const { layout, formatPrice, business, isFeatureEnabled } = useTenantConfig();
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = () => {
    const success = addToCart(product);
    if (success) {
      // Opcional: mostrar toast de éxito
      console.log('Producto agregado al carrito');
    }
  };

  const discountPercentage = product.discount ? parseInt(product.discount.replace(/[-%]/g, '')) : 0;
  const isInCartAlready = isInCart(product.code);

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      {/* Imagen del producto */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {layout.showDiscount && discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {product.discount}
            </span>
          )}
          {layout.showStock && product.stock <= 3 && (
            <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
              {product.stock <= 1 ? '¡Último!' : `Solo ${product.stock}`}
            </span>
          )}
        </div>

        {/* Wishlist button si está habilitado */}
        {isFeatureEnabled('enableWishlist') && (
          <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
            <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Contenido del producto */}
      <div className="p-4">
        {/* Código del producto */}
        {layout.showProductCode && (
          <div className="text-xs text-gray-500 mb-2 font-mono">
            {product.code}
          </div>
        )}

        {/* Nombre del producto */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm">
          {product.name}
        </h3>

        {/* Condición */}
        <div className="mb-3">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            product.condition === 'Nuevo' 
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {product.condition}
          </span>
        </div>

        {/* Precios */}
        <div className="mb-3">
          {product.originalPrice && product.originalPrice !== product.price && (
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )}
          <div className="text-lg font-bold text-tenant-primary">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* Descripción corta */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Características principales (máximo 2) */}
        {product.features && product.features.length > 0 && (
          <div className="mb-3">
            <ul className="text-xs text-gray-600 space-y-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Urgencia */}
        {product.urgency && (
          <div className="mb-3 text-xs text-orange-600 font-medium">
            {product.urgency}
          </div>
        )}

        {/* Botón de acción */}
        <button
          onClick={handleAddToCart}
          disabled={isInCartAlready}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
            isInCartAlready
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-tenant-primary hover:bg-tenant-secondary text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isInCartAlready ? '✓ En el Carrito' : (product.ctaText || 'Agregar al Carrito')}
        </button>

        {/* Información de contacto si es necesario */}
        {business.contactInfo.whatsapp && (
          <div className="mt-2 text-center">
            <a
              href={`https://wa.me/${business.contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hola, me interesa el producto ${product.code} - ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:text-green-700 transition-colors"
            >
              📱 Consultar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para vista de lista (alternativa)
export function GenericProductListItem({ product, className = '' }: GenericProductCardProps) {
  const { formatPrice, business, isFeatureEnabled } = useTenantConfig();
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const isInCartAlready = isInCart(product.code);

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow ${className}`}>
      {/* Imagen */}
      <div className="flex-shrink-0 w-24 h-24">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Contenido */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
            {product.name}
          </h3>
          {isFeatureEnabled('enableWishlist') && (
            <button className="p-1 text-gray-400 hover:text-red-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {product.condition}
          </span>
          <span className="text-xs text-gray-500 font-mono">{product.code}</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            {product.originalPrice && product.originalPrice !== product.price && (
              <div className="text-xs text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
            <div className="text-lg font-bold text-tenant-primary">
              {formatPrice(product.price)}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isInCartAlready}
            className={`py-1 px-3 rounded text-xs font-semibold transition-colors ${
              isInCartAlready
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-tenant-primary hover:bg-tenant-secondary text-white'
            }`}
          >
            {isInCartAlready ? '✓ Agregado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
