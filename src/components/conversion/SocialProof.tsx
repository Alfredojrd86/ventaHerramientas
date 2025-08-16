import React, { useState, useEffect } from 'react';
import { SocialProofData, RecentPurchase } from '../../types/product';

interface SocialProofProps {
  productCode: string;
  customData?: Partial<SocialProofData>;
  showRecentPurchases?: boolean;
  showViewingCount?: boolean;
  showPopularityRank?: boolean;
  className?: string;
}

const SocialProof: React.FC<SocialProofProps> = ({
  productCode,
  customData = {},
  showRecentPurchases = true,
  showViewingCount = true,
  showPopularityRank = true,
  className = '',
}) => {
  const [currentPurchaseIndex, setCurrentPurchaseIndex] = useState(0);

  // Mock social proof data (in a real app, this would come from API)
  const generateSocialProofData = (): SocialProofData => {
    const names = [
      'Carlos M.', 'María S.', 'José L.', 'Ana R.', 'Pedro G.',
      'Laura T.', 'Miguel A.', 'Carmen V.', 'Roberto F.', 'Isabel C.'
    ];

    const locations = [
      'Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta',
      'Temuco', 'Rancagua', 'Talca', 'Arica', 'Iquique'
    ];

    const products = [
      'Sierra Circular Makita', 'Taladro Bosch', 'Lijadora Black & Decker',
      'Fresadora DeWalt', 'Amoladora Makita', 'Caladora Bosch'
    ];

    const recentPurchases: RecentPurchase[] = Array.from({ length: 8 }, (_, i) => ({
      customerName: names[Math.floor(Math.random() * names.length)],
      productName: i === 0 ? 'este producto' : products[Math.floor(Math.random() * products.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      timeAgo: i === 0 ? 'hace 5 minutos' : 
               i === 1 ? 'hace 12 minutos' :
               i === 2 ? 'hace 1 hora' :
               `hace ${Math.floor(Math.random() * 24) + 1} horas`,
    }));

    return {
      recentPurchases,
      viewingCount: Math.floor(Math.random() * 15) + 8, // 8-22 people viewing
      popularityRank: Math.floor(Math.random() * 3) + 1, // Top 1-3
      categoryRank: Math.floor(Math.random() * 5) + 1, // Top 1-5 in category
      ...customData,
    };
  };

  const [socialData] = useState<SocialProofData>(generateSocialProofData());

  // Rotate through recent purchases
  useEffect(() => {
    if (!showRecentPurchases || socialData.recentPurchases.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPurchaseIndex(prev => 
        (prev + 1) % socialData.recentPurchases.length
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [showRecentPurchases, socialData.recentPurchases.length]);

  const currentPurchase = socialData.recentPurchases[currentPurchaseIndex];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Recent Purchases */}
      {showRecentPurchases && currentPurchase && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm text-green-800">
              <span className="font-medium">{currentPurchase.customerName}</span>
              {currentPurchase.location && (
                <span className="text-green-600"> de {currentPurchase.location}</span>
              )}
              <span> compró {currentPurchase.productName} {currentPurchase.timeAgo}</span>
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Viewing Count */}
      {showViewingCount && socialData.viewingCount > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>
            <span className="font-medium text-blue-600">{socialData.viewingCount}</span>
            <span> persona{socialData.viewingCount !== 1 ? 's' : ''} viendo este producto ahora</span>
          </span>
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(socialData.viewingCount, 5) }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Popularity Rank */}
      {showPopularityRank && socialData.popularityRank && socialData.popularityRank <= 3 && (
        <div className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-yellow-800">
            #{socialData.popularityRank} Más Vendido
            {socialData.categoryRank && (
              <span className="text-yellow-600"> en su categoría</span>
            )}
          </span>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Más de 1000 vendidos</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>98% satisfacción</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>4.8★ promedio</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <span>Recomendado 95%</span>
        </div>
      </div>

      {/* Customer testimonial preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">
                {currentPurchase?.customerName?.charAt(0) || 'C'}
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-3 h-3 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500">Cliente verificado</span>
            </div>
            
            <p className="text-xs text-gray-700 italic">
              "Excelente calidad y entrega rápida. Muy recomendado para profesionales."
            </p>
            
            <p className="text-xs text-gray-500 mt-1">
              - {currentPurchase?.customerName || 'Cliente verificado'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
