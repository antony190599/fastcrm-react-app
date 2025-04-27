import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import contactLogService from '../../services/contactLogService';
import { CalendarIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const InteractionHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    method: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only pass non-empty filters
      const activeFilters = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) activeFilters[key] = value;
      });
      
      const response = await contactLogService.getAllLogs(activeFilters);
      
      if (response.success) {
        setLogs(response.data || []);
      } else {
        setError(response.message || 'Error al cargar el historial');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar el historial de contactos');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      method: '',
      status: '',
      startDate: '',
      endDate: ''
    });
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'email':
        return <EnvelopeIcon className="h-5 w-5 text-blue-600" />;
      case 'whatsapp':
        return <PhoneIcon className="h-5 w-5 text-green-600" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'success': 'bg-green-100 text-green-800',
      'exitoso': 'bg-green-100 text-green-800',
      'error': 'bg-red-100 text-red-800',
      'fallido': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'pendiente': 'bg-yellow-100 text-yellow-800'
    };

    const displayText = {
      'success': 'Exitoso',
      'exitoso': 'Exitoso',
      'error': 'Fallido',
      'fallido': 'Fallido',
      'pending': 'Pendiente',
      'pendiente': 'Pendiente'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {displayText[status] || status}
      </span>
    );
  };
  
  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
            <select
              name="method"
              value={filters.method}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="call">Llamada</option>
              <option value="meeting">Reunión</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="success">Exitoso</option>
              <option value="error">Fallido</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : logs.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getMethodIcon(log.method)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {log.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.contact && (
                        <Link to={`/contacts/${log.contact.id}`} className="text-sm text-blue-600 hover:underline">
                          {log.contact.firstName} {log.contact.lastName}
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      {log.contact?.company && (
                        <Link to={`/companies/${log.contact.company.id}`} className="text-sm text-gray-600 hover:underline">
                          {log.contact.company.name}
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {log.templateName || 'Personalizado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 text-center rounded-lg shadow">
          <p className="text-gray-500">No se encontraron registros de interacciones con los filtros actuales.</p>
        </div>
      )}
    </div>
  );
};

export default InteractionHistory;
