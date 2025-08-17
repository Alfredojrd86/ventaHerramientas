import React from 'react';

interface StockIndicatorProps {
  stock: number;
  lowStockThreshold?: number;
  showExactCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'bar' | 'text' | 'full';
  className?: string;
}

const StockIndicator: React.FC<StockIndicatorProps> = ({
  stock,
  lowStockThreshold = 5,
  showExactCount = true,
  size = 'md',
  variant = 'badge',
  className = '',
}) => {
  const getStockLevel = () => {
    if (stock === 0) return 'out';
    if (stock <= lowStockThreshold) return 'low';
    if (stock <= lowStockThreshold * 2) return 'medium';
    return 'high';
  };

  const stockLevel = getStockLevel();

  const getStockColor = () => {
    const colors = {
      out: 'text-red-600 bg-red-100 border-red-200',
      low: 'text-orange-600 bg-orange-100 border-orange-200',
      medium: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      high: 'text-green-600 bg-green-100 border-green-200',
    };
    return colors[stockLevel];
  };

  const getStockMessage = () => {
    if (stock === 0) return 'Agotado';
    if (stock === 1) return showExactCount ? '1 disponible' : 'Última unidad';
    if (stock <= lowStockThreshold) {
      return showExactCount ? `${stock} disponibles` : 'Pocas unidades';
    }
    if (stock <= 20) {
      return showExactCount ? `${stock} disponibles` : 'Stock limitado';
    }
    return 'En stock';
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-2.5 py-1.5',
      lg: 'text-base px-3 py-2',
    };
    return sizes[size];
  };

  const getStockIcon = () => {
    switch (stockLevel) {
      case 'out':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const renderBadgeVariant = () => (
    <span className={`inline-flex items-center space-x-1 rounded-full font-medium border ${getStockColor()} ${getSizeClasses()} ${className}`}>
      {getStockIcon()}
      <span>{getStockMessage()}</span>
    </span>
  );

  const renderBarVariant = () => {
    const maxDisplay = 20;
    const percentage = Math.min((stock / maxDisplay) * 100, 100);
    
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-gray-700">Stock disponible</span>
          <span className={`font-semibold ${stockLevel === 'out' ? 'text-red-600' : stockLevel === 'low' ? 'text-orange-600' : 'text-gray-700'}`}>
            {getStockMessage()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              stockLevel === 'out' ? 'bg-red-500' :
              stockLevel === 'low' ? 'bg-orange-500' :
              stockLevel === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {stock > 0 && stock <= lowStockThreshold && (
          <p className="text-xs text-orange-600 font-medium">
            ¡Date prisa! Solo quedan {stock} unidades
          </p>
        )}
      </div>
    );
  };

  const renderTextVariant = () => (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <div className={`w-2 h-2 rounded-full ${
        stockLevel === 'out' ? 'bg-red-500' :
        stockLevel === 'low' ? 'bg-orange-500 animate-pulse' :
        stockLevel === 'medium' ? 'bg-yellow-500' :
        'bg-green-500'
      }`} />
      <span className={`font-medium ${
        stockLevel === 'out' ? 'text-red-600' :
        stockLevel === 'low' ? 'text-orange-600' :
        stockLevel === 'medium' ? 'text-yellow-600' :
        'text-green-600'
      }`}>
        {getStockMessage()}
      </span>
    </div>
  );

  const renderFullVariant = () => (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Estado del Stock
        </h3>
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStockColor()}`}>
          {getStockIcon()}
          <span>{stock === 0 ? 'Agotado' : 'Disponible'}</span>
        </span>
      </div>

      {stock > 0 ? (
        <>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Unidades disponibles:</span>
              <span className="font-semibold text-gray-900">{stock}</span>
            </div>
            
            {stock <= lowStockThreshold && (
              <div className="flex items-center space-x-2 p-2 bg-orange-50 border border-orange-200 rounded">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-orange-700 font-medium">
                  Stock bajo - ¡Compra pronto!
                </span>
              </div>
            )}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                stockLevel === 'low' ? 'bg-orange-500' :
                stockLevel === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Agotado</span>
            <span>Stock completo</span>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <svg className="mx-auto h-8 w-8 text-red-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium text-red-600 mb-1">
            Producto agotado
          </p>
          <p className="text-xs text-gray-500">
            Serás notificado cuando esté disponible
          </p>
          <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline">
            Notificarme cuando esté disponible
          </button>
        </div>
      )}
    </div>
  );

  switch (variant) {
    case 'bar':
      return renderBarVariant();
    case 'text':
      return renderTextVariant();
    case 'full':
      return renderFullVariant();
    default:
      return renderBadgeVariant();
  }
};

export default StockIndicator;
