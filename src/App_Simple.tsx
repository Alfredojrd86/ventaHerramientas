import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/Banner';
import Header from './components/Header';
import { CartProvider } from './context/CartContext';
import CheckoutPage from './components/CheckoutPage';

// Solo importar los componentes que vas a usar
import StaticProductGrid from './components/StaticProductGrid';
import EnhancedCart from './components/EnhancedCart';

// Componente Home SIMPLE - Solo reemplaza tu grid actual
function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tu header actual */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Header />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tu banner actual */}
        <Banner />

        {/* REEMPLAZA tu grid actual con esto: */}
        <div className="mt-8">
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
