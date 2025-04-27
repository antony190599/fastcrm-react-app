import React, { useState, useEffect } from 'react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const InstructionBanner = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if the user has already dismissed the banner
    const hasSeenBanner = localStorage.getItem('contactSelectionBannerDismissed');
    
    if (!hasSeenBanner) {
      // Add a small delay for the animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    
    // Use a timeout to match the fade-out animation before calling the parent's onDismiss
    setTimeout(() => {
      // Store the user's preference
      localStorage.setItem('contactSelectionBannerDismissed', 'true');
      if (onDismiss) onDismiss();
    }, 300);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={`transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <div className="text-sm text-blue-800">
              <p>
                <span className="font-medium">Envío de mensajes masivos:</span> Seleccione los contactos marcando las casillas a la izquierda y luego haga clic en "Enviar mensaje masivo" para enviar un mensaje a todos los contactos seleccionados.
              </p>
              <p className="mt-1">
                Puede seleccionar contactos en diferentes páginas y mantener su selección mientras navega.
              </p>
            </div>
            <button
              type="button"
              className="ml-3 flex-shrink-0 inline-flex text-blue-600 hover:text-blue-800 focus:outline-none"
              onClick={handleDismiss}
              aria-label="Cerrar instrucciones"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionBanner;