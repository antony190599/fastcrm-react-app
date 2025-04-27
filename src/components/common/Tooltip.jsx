import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'right', 
  delay = 300,
  className = '',
  offset = 10 // Nuevo parámetro para controlar la distancia del tooltip
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const targetRef = useRef(null);
  const timerRef = useRef(null);

  const calculatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;
    
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    
    let top, left;

    switch (position) {
      case 'top':
        top = targetRect.top + scrollTop - tooltipRect.height - offset;
        left = targetRect.left + scrollLeft + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = targetRect.bottom + scrollTop + offset;
        left = targetRect.left + scrollLeft + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = targetRect.top + scrollTop + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.left + scrollLeft - tooltipRect.width - offset;
        break;
      case 'right':
        top = targetRect.top + scrollTop + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + scrollLeft + offset;
        break;
      default:
        top = targetRect.top + scrollTop + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + scrollLeft + offset;
    }

    // Screen boundary checks
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Prevent tooltip from going off the right edge
    if (left + tooltipRect.width > viewportWidth - 10) {
      // Si no cabe a la derecha, intentamos ponerlo a la izquierda
      if (position === 'right') {
        left = targetRect.left + scrollLeft - tooltipRect.width - offset;
      } else {
        left = viewportWidth - tooltipRect.width - 10;
      }
    }

    // Prevent tooltip from going off the left edge
    if (left < 10) {
      // Si no cabe a la izquierda, intentamos ponerlo a la derecha
      if (position === 'left') {
        left = targetRect.right + scrollLeft + offset;
      } else {
        left = 10;
      }
    }

    // Si el tooltip se saldría por arriba, lo mostramos abajo
    if (top < scrollTop + 10 && (position === 'top' || position === 'left' || position === 'right')) {
      top = targetRect.bottom + scrollTop + offset;
    }

    // Si el tooltip se saldría por abajo, lo mostramos arriba
    if (top + tooltipRect.height > scrollTop + viewportHeight - 10) {
      top = targetRect.top + scrollTop - tooltipRect.height - offset;
    }

    setTooltipPosition({ top, left });
  };

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      // Use a setTimeout to ensure the tooltip is rendered before calculating its position
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsVisible(true);
    // Use a setTimeout to ensure the tooltip is rendered before calculating its position
    setTimeout(calculatePosition, 0);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition);
    }
    
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [isVisible]);

  // Clean up timeout if component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="inline-block relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ref={targetRef}
    >
      {children}
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded shadow-md max-w-xs whitespace-normal transition-opacity duration-200 ease-in-out ${className}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
          role="tooltip"
        >
          <div className="relative">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;