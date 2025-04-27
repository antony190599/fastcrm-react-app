import React, { useState, useEffect } from 'react';
import contactLogService from '../../services/contactLogService';

const ContactLogHistory = ({ contactId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContactLogs();
  }, [contactId]);

  const fetchContactLogs = async () => {
    try {
      setLoading(true);
      const response = await contactLogService.getContactLogs(contactId);
      
      if (response.success) {
        setLogs(response.data || []);
        setError(null);
      } else {
        setLogs([]);
        setError('No se pudieron cargar las interacciones');
      }
    } catch (err) {
      setLogs([]);
      setError(err.message || 'Error al cargar las interacciones');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'success':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Exitoso</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">No exitoso</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'call':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'email':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'meeting':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin inline-block rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        No hay interacciones registradas para este contacto.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getMethodIcon(log.method)}
              <span className="font-medium">
                {log.method === 'email' && 'Email'}
                {log.method === 'call' && 'Llamada'}
                {log.method === 'whatsapp' && 'WhatsApp'}
                {log.method === 'meeting' && 'Reunión'}
                {log.method === 'other' && 'Otro'}
                {!['email', 'call', 'whatsapp', 'meeting', 'other'].includes(log.method) && log.method}
              </span>
              {log.templateName && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                  {log.templateName}
                </span>
              )}
              <div className="ml-2">
                {getStatusBadge(log.status)}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <div className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">
            {log.notes}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactLogHistory;