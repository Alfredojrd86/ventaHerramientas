import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';

interface UseFloatingCartReturn {
  isCartVisible: boolean;
  isCartExpanded: boolean;
  showSuccessAnimation: boolean;
  toggleCartExpanded: () => void;
  showCart: () => void;
  hideCart: () => void;
  triggerSuccessAnimation: () => void;
}

export const useFloatingCart = (): UseFloatingCartReturn => {
  const { getTotalItems } = useCart();
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const totalItems = getTotalItems();

  // Auto-show cart when items are added
  useEffect(() => {
    if (totalItems > 0) {
      setIsCartVisible(true);
    } else {
      setIsCartVisible(false);
      setIsCartExpanded(false);
    }
  }, [totalItems]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide if we have items and are scrolling down fast
      if (totalItems > 0) {
        if (currentScrollY > lastScrollY + 10 && currentScrollY > 200) {
          // Scrolling down fast - hide cart
          setIsCartVisible(false);
          setIsCartExpanded(false);
        } else if (currentScrollY < lastScrollY - 10) {
          // Scrolling up - show cart
          setIsCartVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [lastScrollY, totalItems]);

  const toggleCartExpanded = useCallback(() => {
    setIsCartExpanded(prev => !prev);
    if (!isCartVisible) {
      setIsCartVisible(true);
    }
  }, [isCartVisible]);

  const showCart = useCallback(() => {
    setIsCartVisible(true);
  }, []);

  const hideCart = useCallback(() => {
    setIsCartVisible(false);
    setIsCartExpanded(false);
  }, []);

  const triggerSuccessAnimation = useCallback(() => {
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 2000);
    
    // Show cart briefly when item is added
    setIsCartVisible(true);
    setTimeout(() => {
      if (totalItems === 0) {
        setIsCartVisible(false);
      }
    }, 3000);
  }, [totalItems]);

  return {
    isCartVisible,
    isCartExpanded,
    showSuccessAnimation,
    toggleCartExpanded,
    showCart,
    hideCart,
    triggerSuccessAnimation,
  };
};

// Throttle utility function
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}
