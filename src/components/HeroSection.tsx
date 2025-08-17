import { ShoppingCartIcon, CheckCircleIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useTenantConfig } from '../contexts/TenantContext';

export default function HeroSection() {
  const { business, branding, product, payment } = useTenantConfig();
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-tenant-secondary to-slate-800 overflow-hidden font-tenant">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px]"></div>
      </div>
      
      {/* Contenido principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Contenido izquierdo */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-500 text-yellow-900 mb-4">
                🔥 OFERTA ESPECIAL DE LIQUIDACIÓN
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {business.name.split(' ')[0]}{' '}
              <span className="block text-yellow-400">{business.name.split(' ')[1] || 'Profesionales'}</span>
              <span className="block text-tenant-accent">{business.name.split(' ')[2] || 'Premium'}</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              {business.description} - Hasta <span className="text-yellow-400 font-bold text-2xl">30% OFF</span>
            </p>
            
            {/* Marcas destacadas */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mb-8">
              <div className="text-white font-semibold text-lg">Marcas:</div>
              <div className="flex flex-wrap gap-4">
                {product.brands.slice(0, 3).map((brand, index) => (
                  <span key={index} className="bg-white/10 px-3 py-1 rounded-lg text-white font-medium">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={scrollToProducts}
                className="group relative px-8 py-4 bg-tenant-accent hover:bg-yellow-400 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCartIcon className="w-6 h-6" />
                  Ver Ofertas Ahora
                </span>
                <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                onClick={scrollToProducts}
                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold text-lg rounded-lg transition-all duration-300"
              >
                Explorar Catálogo
              </button>
            </div>
            
            {/* Proceso de compra */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                ¿Cómo comprar?
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="bg-yellow-500 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">1</span>
                  <span>Monta tu pedido en el carrito</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-yellow-500 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">2</span>
                  <span>Envíalo por WhatsApp</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-yellow-500 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">3</span>
                  <span>Pago seguro con {payment.methods.includes('mercadopago') ? 'Mercado Pago' : 'métodos seguros'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contenido derecho - Imagen hero */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-xl p-6 transform -rotate-3">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔧</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Calidad Profesional</h3>
                    <p className="text-gray-600 mb-4">Herramientas que duran toda la vida</p>
                    <div className="flex justify-center gap-2">
                      <span className="text-3xl">⭐</span>
                      <span className="text-3xl">⭐</span>
                      <span className="text-3xl">⭐</span>
                      <span className="text-3xl">⭐</span>
                      <span className="text-3xl">⭐</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Elementos flotantes */}
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
              ✅ Stock Disponible
            </div>
            <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
              🚚 Envío Rápido
            </div>
          </div>
        </div>
        
        {/* Indicadores de confianza */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheckIcon className="w-8 h-8 text-green-400" />
              <span className="text-white font-medium">Garantía Extendida</span>
              <span className="text-gray-400 text-sm">Protección total</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TruckIcon className="w-8 h-8 text-blue-400" />
              <span className="text-white font-medium">Envío Seguro</span>
              <span className="text-gray-400 text-sm">A todo el país</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircleIcon className="w-8 h-8 text-yellow-400" />
              <span className="text-white font-medium">Pago Seguro</span>
              <span className="text-gray-400 text-sm">Mercado Pago</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 text-green-400 flex items-center justify-center text-xl">💬</div>
              <span className="text-white font-medium">Soporte WhatsApp</span>
              <span className="text-gray-400 text-sm">Atención personalizada</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicador de scroll */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={scrollToProducts}
          className="text-white/70 hover:text-white transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </div>
  );
}