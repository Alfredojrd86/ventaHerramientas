import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Banner from './components/Banner';
import Header from './components/Header';
import ToolCard from './components/ToolCard';
import {tools} from './data/tools';
import {CartProvider} from './context/CartContext';
import Cart from './components/Cart';
import CheckoutPage from './components/CheckoutPage';

// Componente Home
function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <Banner />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className="h-[500px]">
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente principal App
function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <Cart />
      </CartProvider>
    </Router>
  );
}

export default App;
