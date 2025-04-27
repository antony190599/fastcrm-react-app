import React from 'react';
import AppHeader from '../components/common/AppHeader';
import InteractionHistory from '../components/history/InteractionHistory';

const HistoryPage = () => {
  return (
    <div className="mx-auto px-4 py-8">
      <AppHeader 
        title="Historial de Interacciones"
        breadcrumbs={[
          { name: 'Inicio', href: '/' },
          { name: 'Historial de Interacciones' }
        ]}
      />
      
      <InteractionHistory />
    </div>
  );
};

export default HistoryPage;
