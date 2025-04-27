import axios from 'axios';
import contactLogService from './contactLogService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const messageService = {
  sendMessage: async (contactId, messageData) => {
    try {
      const response = await axios.post(`${API_URL}/api/messages/${contactId}`, messageData);
      
      // We'll handle contact log creation in the components instead
      // This ensures more direct control and error handling
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al enviar el mensaje' };
    }
  },
  
  searchContacts: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/api/contacts/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al buscar contactos' };
    }
  },
  
  sendBulkMessage: async (messageData) => {
    try {
      const response = await axios.post(`${API_URL}/api/messages/bulk`, messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al enviar mensajes masivos' };
    }
  }
};

export default messageService;