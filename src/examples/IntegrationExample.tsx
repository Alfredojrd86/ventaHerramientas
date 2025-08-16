import React, { useState } from 'react';
import StaticProductGrid from '../components/StaticProductGrid';
import EnhancedCart from '../components/EnhancedCart';
import { useCart } from '../context/CartContext';

// Ejemplo de cómo integrar los nuevos componentes en tu aplicación existente

const IntegrationExample: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const { items } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con carrito flotante */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">VentaCarpinteria</h1>
            </div>
            
            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${showCart ? 'mr-96' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Herramientas Profesionales de Calidad
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Encuentra las mejores herramientas usadas y nuevas para tus proyectos de carpintería. 
                Calidad garantizada y precios increíbles.
              </p>
            </div>

            {/* Product Grid with Filters */}
            <StaticProductGrid />
          </div>
        </main>

        {/* Sliding Cart Sidebar */}
        <div className={`fixed top-16 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-30 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full overflow-y-auto">
            <EnhancedCart />
          </div>
        </div>
      </div>

      {/* Cart Overlay for mobile */}
      {showCart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setShowCart(false)}
        />
      )}
    </div>
  );
};

export default IntegrationExample;
