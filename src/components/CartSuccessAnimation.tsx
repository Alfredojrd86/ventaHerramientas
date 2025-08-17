import React, { useEffect, useState } from 'react';

interface CartSuccessAnimationProps {
  show: boolean;
  productName?: string;
  onComplete?: () => void;
  className?: string;
}

const CartSuccessAnimation: React.FC<CartSuccessAnimationProps> = ({
  show,
  productName,
  onComplete,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'stay' | 'exit'>('enter');

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimationPhase('enter');
      
      // Stay phase
      const stayTimer = setTimeout(() => {
        setAnimationPhase('stay');
      }, 300);
      
      // Exit phase
      const exitTimer = setTimeout(() => {
        setAnimationPhase('exit');
      }, 2000);
      
      // Complete
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 2500);
      
      return () => {
        clearTimeout(stayTimer);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [show, onComplete]);

  if (!isVisible) {
    return null;
  }

  const getAnimationClasses = () => {
    switch (animationPhase) {
      case 'enter':
        return 'animate-bounce scale-0 opacity-0';
      case 'stay':
        return 'scale-100 opacity-100';
      case 'exit':
        return 'scale-95 opacity-0 translate-y-4';
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
        transition-all duration-300 ease-out
        ${getAnimationClasses()}
        ${className}
      `}
    >
      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-sm mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-green-600 animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¡Agregado al carrito!
          </h3>
          {productName && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {productName}
            </p>
          )}
          
          {/* Cart Icon with Items */}
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            <span className="text-sm font-medium">Ver carrito abajo</span>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute w-2 h-2 bg-blue-400 rounded-full
              animate-ping opacity-75
            `}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 200}ms`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CartSuccessAnimation;
