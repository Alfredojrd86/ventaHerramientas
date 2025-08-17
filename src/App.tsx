import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import { CartProvider } from './context/CartContext';
import CheckoutPage from './components/CheckoutPage';
import EnhancedCheckoutPage from './components/EnhancedCheckoutPage';

// Solo importar los componentes que vas a usar
import StaticProductGrid from './components/StaticProductGrid';
import FloatingCartIcon from './components/FloatingCartIcon';

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

// App con flujo híbrido mejorado
function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<EnhancedCheckoutPage />} />
          <Route path="/checkout-simple" element={<CheckoutPage />} />
        </Routes>
        
        {/* Icono Flotante del Carrito */}
        <FloatingCartIcon />
      </CartProvider>
    </Router>
  );
}

export default App;
