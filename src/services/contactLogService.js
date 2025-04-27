import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const contactLogService = {
  getContactLogs: async (contactId) => {
    try {
      const response = await axios.get(`${API_URL}/api/contact-logs/contact/${contactId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el historial de contactos' };
    }
  },

  createContactLog: async (logData) => {
    try {
      const response = await axios.post(`${API_URL}/api/contact-logs`, logData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el registro de contacto' };
    }
  },

  // Ensure logs are created when messages are sent
  createMessageLog: async (contactId, messageData, status = 'success') => {
    try {
      const logData = {
        contactId: contactId,
        method: messageData.method,
        templateId: messageData.templateId,
        templateName: messageData.templateName || 'Message',
        messageId: messageData.messageId,
        status: status,
        notes: `Mensaje enviado vía ${messageData.method === 'email' ? 'Email' : 'WhatsApp'}`
      };
      
      const response = await axios.post(`${API_URL}/api/contact-logs`, logData);
      return response.data;
    } catch (error) {
      console.error('Error creating message log:', error);
      // Don't throw error here, just log it - we don't want to fail the main operation
      return { success: false, error: error.message };
    }
  },

  getAllLogs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to parameters
      if (filters.method) {
        params.append('method', filters.method);
      }
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      
      const response = await axios.get(`${API_URL}/api/contact-logs`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al cargar el historial de contactos' };
    }
  }
};

export default contactLogService;