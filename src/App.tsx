import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import { CartProvider } from './context/CartContext';
import { TenantProvider } from './contexts/TenantContext';
import { AuthProvider } from './contexts/AuthContext';
import CheckoutPage from './components/CheckoutPage';
import EnhancedCheckoutPage from './components/EnhancedCheckoutPage';

// Solo importar los componentes que vas a usar
import ProductGrid from './components/ProductGrid';
import FloatingCartIcon from './components/FloatingCartIcon';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DebugInfo from './components/DebugInfo';
import DiagnosticPanel from './components/DiagnosticPanel';


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
            href="/login" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            🔐 Acceso Administrativo
          </a>
        </div>
        
        {/* Grid de productos principal */}
        <div id="products-section" className="mt-8">
          <ProductGrid />
        </div>
      </div>
      
      {/* Panel de diagnóstico mejorado */}
      <DiagnosticPanel />
    </div>
  );
}

// App con flujo híbrido mejorado + Multi-tenant + Auth
function App() {
  return (
    <AuthProvider>
      <TenantProvider tenantSlug="carpinteria">
        <Router>
          <CartProvider>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/checkout" element={<EnhancedCheckoutPage />} />
              <Route path="/checkout-simple" element={<CheckoutPage />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            
            {/* Icono Flotante del Carrito */}
            <FloatingCartIcon />
          </CartProvider>
        </Router>
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;
