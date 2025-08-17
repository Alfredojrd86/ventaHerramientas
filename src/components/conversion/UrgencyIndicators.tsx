import React, { useState, useEffect } from 'react';
import { UrgencyIndicator } from '../../types/product';

interface UrgencyIndicatorsProps {
  stock?: number;
  lowStockThreshold?: number;
  urgencyText?: string;
  timeLimit?: string; // ISO date string
  demandLevel?: 'low' | 'medium' | 'high';
  priceChange?: {
    oldPrice: number;
    newPrice: number;
    validUntil: string;
  };
  className?: string;
}

const UrgencyIndicators: React.FC<UrgencyIndicatorsProps> = ({
  stock,
  lowStockThreshold = 3,
  urgencyText,
  timeLimit,
  demandLevel,
  priceChange,
  className = '',
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Calculate time remaining for time-based urgency
  useEffect(() => {
    if (!timeLimit) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(timeLimit).getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${seconds}s`);
        }
      } else {
        setTimeRemaining('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timeLimit]);

  const generateUrgencyIndicators = (): UrgencyIndicator[] => {
    const indicators: UrgencyIndicator[] = [];

    // Stock-based urgency
    if (stock !== undefined) {
      if (stock === 0) {
        indicators.push({
          type: 'stock',
          message: 'Producto agotado',
          level: 'high',
        });
      } else if (stock <= lowStockThreshold) {
        indicators.push({
          type: 'stock',
          message: `¡Solo quedan ${stock} unidades!`,
          level: stock === 1 ? 'high' : 'medium',
        });
      } else if (stock <= 10) {
        indicators.push({
          type: 'stock',
          message: `Stock limitado - ${stock} disponibles`,
          level: 'low',
        });
      }
    }

    // Time-based urgency
    if (timeLimit && timeRemaining) {
      indicators.push({
        type: 'time',
        message: `Oferta termina en ${timeRemaining}`,
        level: timeRemaining.includes('h') ? 'medium' : 'high',
        expiresAt: timeLimit,
      });
    }

    // Demand-based urgency
    if (demandLevel) {
      const demandMessages = {
        low: 'Varios clientes han visto este producto',
        medium: 'Producto muy solicitado esta semana',
        high: '🔥 ¡Producto en alta demanda!',
      };
      
      indicators.push({
        type: 'demand',
        message: demandMessages[demandLevel],
        level: demandLevel,
      });
    }

    // Price change urgency
    if (priceChange) {
      const savings = priceChange.oldPrice - priceChange.newPrice;
      const percentage = Math.round((savings / priceChange.oldPrice) * 100);
      
      indicators.push({
        type: 'price',
        message: `¡Precio rebajado! Ahorra $${savings.toLocaleString('es-CL')} (${percentage}%)`,
        level: 'high',
        expiresAt: priceChange.validUntil,
      });
    }

    // Custom urgency text
    if (urgencyText) {
      indicators.push({
        type: 'demand',
        message: urgencyText,
        level: 'medium',
      });
    }

    return indicators;
  };

  const indicators = generateUrgencyIndicators();

  if (indicators.length === 0) {
    return null;
  }

  const getIndicatorStyle = (level: UrgencyIndicator['level']) => {
    const styles = {
      low: 'bg-blue-50 border-blue-200 text-blue-800',
      medium: 'bg-orange-50 border-orange-200 text-orange-800',
      high: 'bg-red-50 border-red-200 text-red-800',
    };
    return styles[level];
  };

  const getIndicatorIcon = (type: UrgencyIndicator['type'], level: UrgencyIndicator['level']) => {
    const iconClass = level === 'high' ? 'animate-pulse' : '';
    
    switch (type) {
      case 'stock':
        return (
          <svg className={`w-4 h-4 ${iconClass}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 3v6a2 2 0 002 2h8a2 2 0 002-2V7H4zm2 2a1 1 0 011-1h2a1 1 0 110 2H7a1 1 0 01-1-1zm5 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'time':
        return (
          <svg className={`w-4 h-4 ${iconClass}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'demand':
        return (
          <svg className={`w-4 h-4 ${iconClass}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'price':
        return (
          <svg className={`w-4 h-4 ${iconClass}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 14a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className={`w-4 h-4 ${iconClass}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {indicators.map((indicator, index) => (
        <div
          key={index}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getIndicatorStyle(indicator.level)} ${
            indicator.level === 'high' ? 'shadow-sm' : ''
          }`}
        >
          {getIndicatorIcon(indicator.type, indicator.level)}
          <span className="text-sm font-medium flex-1">
            {indicator.message}
          </span>
          
          {indicator.type === 'time' && indicator.level === 'high' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
              <span className="text-xs font-bold">¡PRISA!</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UrgencyIndicators;
