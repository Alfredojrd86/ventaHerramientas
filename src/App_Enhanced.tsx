import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Banner from './components/Banner';
import Header from './components/Header';
import { tools } from './data/tools';
import { CartProvider, useCart } from './context/CartContext';
import CheckoutPage from './components/CheckoutPage';

// Importar los nuevos componentes estáticos
import StaticProductGrid from './components/StaticProductGrid';
import EnhancedCart from './components/EnhancedCart';
import EnhancedToolCard from './components/EnhancedToolCard';

// Componente Home MEJORADO con opciones
function Home() {
  const [viewMode, setViewMode] = useState<'original' | 'enhanced-cards' | 'full-enhanced'>('enhanced-cards');
  const { items } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mejorado con selector de vista */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div>
              <Header />
            </div>
            
            {/* Selector de modo de vista (solo para pruebas) */}
            <div className="flex items-center space-x-4">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="original">Vista Original</option>
                <option value="enhanced-cards">Tarjetas Mejoradas</option>
                <option value="full-enhanced">Sistema Completo</option>
              </select>
              
              {/* Indicador de carrito */}
              {items.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  <span>{items.length} productos en carrito</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Banner />

        {/* Renderizado condicional según el modo */}
        {viewMode === 'original' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Vista Original</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {tools.map((tool) => (
                <div key={tool.id} className="h-[500px]">
                  {/* Tu ToolCard original */}
                  <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
                    <img src={tool.image} alt={tool.name} className="w-full h-48 object-cover rounded mb-4" />
                    <h3 className="font-semibold mb-2 line-clamp-2">{tool.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1">{tool.condition}</p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold">${tool.price.toLocaleString()}</span>
                        {tool.originalPrice > tool.price && (
                          <span className="text-sm text-gray-500 line-through">${tool.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        {tool.ctaText || 'Agregar al Carrito'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'enhanced-cards' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Tarjetas Mejoradas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <EnhancedToolCard
                  key={tool.id}
                  tool={tool}
                  showUrgency={true}
                  showSocialProof={true}
                  onQuickView={(tool) => alert(`Vista rápida: ${tool.name}`)}
                />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'full-enhanced' && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Sistema Completo con Filtros</h2>
            <StaticProductGrid />
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal App MEJORADO
function App() {
  const [useEnhancedCart, setUseEnhancedCart] = useState(true);

  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>

          {/* Selector de carrito (puedes remover esto después) */}
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setUseEnhancedCart(!useEnhancedCart)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm shadow-lg hover:bg-gray-700"
            >
              {useEnhancedCart ? 'Carrito Mejorado' : 'Carrito Original'}
            </button>
          </div>

          {/* Carrito condicional */}
          {useEnhancedCart ? <EnhancedCart /> : <Cart />}
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
