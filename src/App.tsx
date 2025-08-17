import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import { CartProvider } from './context/CartContext';
import { TenantProvider } from './contexts/TenantContext';
import CheckoutPage from './components/CheckoutPage';
import EnhancedCheckoutPage from './components/EnhancedCheckoutPage';

// Solo importar los componentes que vas a usar
import GenericProductGrid from './components/GenericProductGrid';
import FloatingCartIcon from './components/FloatingCartIcon';
import AdminDashboard from './components/admin/AdminDashboard';

// Componente Home con nueva sección Hero
function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nueva sección Hero que reemplaza header y banner */}
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        {/* Enlace discreto al admin (solo para demo) */}
        <div className="mb-4 text-center">
          <a 
            href="/admin" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            🏢 Dashboard de Administración
          </a>
        </div>
        
        {/* Grid de productos con ID para el scroll suave */}
        <div id="products-section" className="mt-8">
          <GenericProductGrid />
        </div>
      </div>
    </div>
  );
}

// App con flujo híbrido mejorado + Multi-tenant
function App() {
  return (
    <TenantProvider tenantSlug="carpinteria">
      <Router>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<EnhancedCheckoutPage />} />
            <Route path="/checkout-simple" element={<CheckoutPage />} />
          </Routes>
          
          {/* Icono Flotante del Carrito */}
          <FloatingCartIcon />
        </CartProvider>
      </Router>
    </TenantProvider>
  );
}

export default App;
