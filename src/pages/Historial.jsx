import React, { useState, useEffect } from 'react';
import AppHeader from '../components/common/AppHeader';

const Historial = () => {
  // ...existing code...

  return (
    <div className="mx-auto px-4 py-8">
      <AppHeader 
        title="Historial de Interacciones"
        breadcrumbs={[
          { name: 'Inicio', href: '/' },
          { name: 'Historial de Interacciones' }
        ]}
      />
      
      {/* Remove any duplicate h1/h2/heading elements with "Historial de Interacciones" text */}
      
      <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        {/* ...existing code... */}
      </div>

      {/* ...existing code... */}
    </div>
  );
};

export default Historial;