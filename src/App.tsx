import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import { CartProvider } from './context/CartContext';
import CheckoutPage from './components/CheckoutPage';

// Solo importar los componentes que vas a usar
import StaticProductGrid from './components/StaticProductGrid';
import EnhancedCart from './components/EnhancedCart';

// Componente Home con nueva sección Hero
function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nueva sección Hero que reemplaza header y banner */}
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        {/* Grid de productos con ID para el scroll suave */}
        <div id="products-section" className="mt-8">
          <StaticProductGrid />
        </div>
      </div>
    </div>
  );
}

// App SIMPLE - Cambio mínimo
function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        
        {/* REEMPLAZA <Cart /> con <EnhancedCart /> */}
        <EnhancedCart />
      </CartProvider>
    </Router>
  );
}

export default App;
