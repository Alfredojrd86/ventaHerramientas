import React, { useState } from 'react';

interface ImprovedCTAProps {
  primary?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'ghost' | 'gradient';
  urgency?: 'low' | 'medium' | 'high';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  pulse?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const ImprovedCTA: React.FC<ImprovedCTAProps> = ({
  primary = false,
  size = 'md',
  variant = 'solid',
  urgency = 'low',
  loading = false,
  disabled = false,
  icon,
  badge,
  pulse = false,
  onClick,
  children,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };
    return sizes[size];
  };

  const getVariantClasses = () => {
    if (primary) {
      const urgencyColors = {
        low: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        medium: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
        high: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      };

      if (variant === 'gradient') {
        const gradients = {
          low: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
          medium: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
          high: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700',
        };
        return `${gradients[urgency]} text-white shadow-lg`;
      }

      return `${urgencyColors[urgency]} text-white shadow-sm`;
    }

    const variants = {
      solid: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm focus:ring-gray-500',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      gradient: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg',
    };

    return variants[variant];
  };

  const getAnimationClasses = () => {
    let classes = 'transition-all duration-200 ease-in-out';
    
    if (pulse && urgency === 'high') {
      classes += ' animate-pulse';
    }
    
    if (isHovered && !disabled) {
      classes += ' transform scale-105';
    }
    
    if (isPressed && !disabled) {
      classes += ' transform scale-95';
    }

    return classes;
  };

  const getUrgencyEffects = () => {
    if (urgency === 'high' && !disabled) {
      return 'shadow-lg hover:shadow-xl';
    }
    if (urgency === 'medium' && !disabled) {
      return 'shadow-md hover:shadow-lg';
    }
    return 'shadow-sm hover:shadow-md';
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const buttonClasses = [
    'relative inline-flex items-center justify-center',
    'font-semibold rounded-lg',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    getSizeClasses(),
    getVariantClasses(),
    getAnimationClasses(),
    getUrgencyEffects(),
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icon */}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}

      {/* Button text */}
      <span className="relative">
        {children}
        
        {/* Badge */}
        {badge && (
          <span className="absolute -top-2 -right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
            {badge}
          </span>
        )}
      </span>

      {/* Urgency indicator */}
      {urgency === 'high' && !loading && (
        <div className="absolute -top-1 -right-1">
          <div className="flex h-3 w-3">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
          </div>
        </div>
      )}

      {/* Ripple effect on click */}
      {isPressed && !disabled && (
        <span className="absolute inset-0 rounded-lg bg-white opacity-20 animate-ping"></span>
      )}
    </button>
  );
};

// Specialized CTA components
export const AddToCartCTA: React.FC<Omit<ImprovedCTAProps, 'children'> & { inCart?: boolean }> = ({
  inCart = false,
  ...props
}) => (
  <ImprovedCTA
    primary
    variant="gradient"
    urgency="medium"
    disabled={inCart}
    icon={
      inCart ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      )
    }
    {...props}
  >
    {inCart ? 'En Carrito' : 'Agregar al Carrito'}
  </ImprovedCTA>
);

export const BuyNowCTA: React.FC<Omit<ImprovedCTAProps, 'children'>> = (props) => (
  <ImprovedCTA
    primary
    variant="gradient"
    urgency="high"
    pulse
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    }
    {...props}
  >
    ¡Comprar Ahora!
  </ImprovedCTA>
);

export const ContactCTA: React.FC<Omit<ImprovedCTAProps, 'children'>> = (props) => (
  <ImprovedCTA
    variant="outline"
    urgency="low"
    icon={
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    }
    {...props}
  >
    Contactar Vendedor
  </ImprovedCTA>
);

export const WishlistCTA: React.FC<Omit<ImprovedCTAProps, 'children'> & { inWishlist?: boolean }> = ({
  inWishlist = false,
  ...props
}) => (
  <ImprovedCTA
    variant="ghost"
    urgency="low"
    icon={
      <svg className={`w-5 h-5 ${inWishlist ? 'fill-current text-red-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    }
    {...props}
  >
    {inWishlist ? 'En Favoritos' : 'Agregar a Favoritos'}
  </ImprovedCTA>
);

export default ImprovedCTA;
