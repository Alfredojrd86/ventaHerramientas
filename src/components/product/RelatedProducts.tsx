import React from 'react';
import { tools } from '../../data/tools';
import { Tool } from '../../types';

interface RelatedProductsProps {
  currentProductCode: string;
  relatedCodes?: string[];
  maxProducts?: number;
  className?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductCode,
  relatedCodes,
  maxProducts = 4,
  className = '',
}) => {
  // Get related products based on codes or similar products
  const getRelatedProducts = (): Tool[] => {
    if (relatedCodes && relatedCodes.length > 0) {
      return tools
        .filter(tool => relatedCodes.includes(tool.code) && tool.code !== currentProductCode)
        .slice(0, maxProducts);
    }

    // Fallback: get similar products based on name similarity or same category
    const currentProduct = tools.find(tool => tool.code === currentProductCode);
    if (!currentProduct) return [];

    // Simple similarity algorithm based on common words in name
    const currentWords = currentProduct.name.toLowerCase().split(/\s+/);
    
    return tools
      .filter(tool => tool.code !== currentProductCode)
      .map(tool => {
        const toolWords = tool.name.toLowerCase().split(/\s+/);
        const commonWords = currentWords.filter(word => 
          toolWords.some(toolWord => toolWord.includes(word) || word.includes(toolWord))
        );
        return { tool, similarity: commonWords.length };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxProducts)
      .map(item => item.tool);
  };

  const relatedProducts = getRelatedProducts();

  if (relatedProducts.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className={className}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Productos Relacionados
        </h2>
        <p className="text-gray-600">
          Otros productos que podrían interesarte
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const discountPercentage = getDiscountPercentage(product.originalPrice, product.price);
          
          return (
            <div
              key={product.code}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative aspect-w-1 aspect-h-1">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      -{discountPercentage}%
                    </span>
                  </div>
                )}

                {/* Quick View Button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => {
                      // Navigate to product detail
                      window.location.href = `/product/${product.code}`;
                    }}
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {product.condition}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {product.description.replace(/[✨💪🔧📐⚡🎯🔄🎨🛠️📏🔨💫⭐🌪️]/g, '').trim()}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features Preview */}
                <div className="mb-4">
                  <ul className="text-xs text-gray-600 space-y-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-3 h-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // Add to cart logic
                      console.log('Add to cart:', product.code);
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Agregar
                  </button>
                  
                  <button
                    onClick={() => {
                      // Add to wishlist logic
                      console.log('Add to wishlist:', product.code);
                    }}
                    className="bg-gray-100 text-gray-600 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    aria-label="Agregar a favoritos"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            // Navigate to category or search results
            window.location.href = '/';
          }}
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Ver Más Productos
          <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RelatedProducts;
