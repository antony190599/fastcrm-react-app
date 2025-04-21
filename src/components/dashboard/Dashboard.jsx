import React, { useState, useEffect } from 'react';
import AppHeader from '../common/AppHeader';
import metricsService from '../../services/metricsService';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDashboardMetrics();
    
    // Set up polling every 5 minutes
    const intervalId = setInterval(fetchDashboardMetrics, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const response = await metricsService.getDashboardMetrics();
      
      if (response.success) {
        setMetrics(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError('No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare data for template type chart - convert to array
  const templateTypeData = metrics?.templates?.byType ? 
    Object.entries(metrics.templates.byType).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      percentage: metrics.templates.total > 0 
        ? Math.round((value / metrics.templates.total) * 100) 
        : 0
    })) : [];
    
  // Prepare data for message method chart
  const messageMethodData = metrics?.messages?.byMethod ?
    Object.entries(metrics.messages.byMethod).map(([key, value]) => ({
      name: key === 'email' ? 'Email' : 'WhatsApp',
      value,
      percentage: metrics.messages.total > 0 
        ? Math.round((value / metrics.messages.total) * 100) 
        : 0
    })) : [];
  
  // Colors for the charts
  const chartColors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 
                       'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-orange-500'];
  
  return (
    <div className='mx-auto px-4 py-8'>
      <AppHeader 
        title="Dashboard"
        breadcrumbs={[
          { name: 'Inicio', href: '/' },
          { name: 'Dashboard' }
        ]}
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Contactos</h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-blue-600">
              {metrics?.contacts?.total || 0}
            </p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Empresas</h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-green-600">
              {metrics?.companies?.total || 0}
            </p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Plantillas</h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-yellow-600">
              {metrics?.templates?.total || 0}
            </p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Mensajes Enviados</h3>
          {loading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-purple-600">
              {metrics?.messages?.total || 0}
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Templates by Type Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Plantillas por Tipo</h3>
          {loading ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ) : templateTypeData.length > 0 ? (
            <div className="space-y-4">
              {templateTypeData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${chartColors[index % chartColors.length]} h-2.5 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-20">No hay datos disponibles</p>
          )}
        </div>
        
        {/* Messages by Method Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Mensajes por Método</h3>
          {loading ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ) : messageMethodData.length > 0 ? (
            <div className="space-y-4">
              {messageMethodData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${chartColors[index % chartColors.length]} h-2.5 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-20">No hay datos disponibles</p>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
              <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-gray-500">No hay actividad reciente.</p>
          )}
        </div>
      </div>
      
      <div className="text-right text-xs text-gray-500 mt-4">
        Última actualización: {loading ? 'Cargando...' : new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Dashboard;
