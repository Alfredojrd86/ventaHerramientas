import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import { CartProvider } from './context/CartContext';
import StaticProductGrid from './components/StaticProductGrid';

// Componente Home simplificado para debug
function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        {/* Grid de productos */}
        <div id="products-section" className="mt-8">
          <StaticProductGrid />
        </div>
      </div>
    </div>
  );
}

// App simplificado para debug
function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
