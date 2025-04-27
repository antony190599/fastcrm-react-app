import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const contactLogService = {
  getContactLogs: async (contactId, options = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add pagination parameters if provided
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      
      // Add filter parameters if provided
      if (options.method) params.append('method', options.method);
      if (options.status) params.append('status', options.status);
      if (options.startDate) params.append('startDate', options.startDate);
      if (options.endDate) params.append('endDate', options.endDate);
      
      // If contactId is provided, get logs for that contact
      let endpoint = `${API_URL}/api/contact-logs`;
      if (contactId) {
        endpoint = `${API_URL}/api/contact-logs/contact/${contactId}`;
      }
      
      const response = await axios.get(endpoint, { params });
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

  // Create logs when messages are sent
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

  getLogById: async (logId) => {
    try {
      const response = await axios.get(`${API_URL}/api/contact-logs/${logId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el registro de contacto' };
    }
  },

  getAllLogs: async (options = {}) => {
    // Redirect to the main getContactLogs method with null contactId
    return contactLogService.getContactLogs(null, options);
  }
};

export default contactLogService;