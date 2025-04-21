import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const messageService = {
  sendMessage: async (contactId, messageData) => {
    try {
      const response = await axios.post(`${API_URL}/api/messages/${contactId}`, messageData);
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
