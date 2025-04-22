import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const contactService = {
  getContacts: async (options = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (options.orderBy) {
        params.append('orderBy', options.orderBy);
      }
      
      // Add pagination parameters
      if (options.page) {
        params.append('page', options.page);
      }
      
      if (options.limit) {
        params.append('limit', options.limit);
      }
      
      // Add search parameter
      if (options.search) {
        params.append('search', options.search);
      }
      
      const response = await axios.get(`${API_URL}/api/contacts`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener contactos' };
    }
  },

  getContactById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el contacto' };
    }
  },

  createContact: async (contactData) => {
    try {
      const response = await axios.post(`${API_URL}/api/contacts`, contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el contacto' };
    }
  },

  updateContact: async (id, contactData) => {
    try {
      const response = await axios.put(`${API_URL}/api/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el contacto' };
    }
  },

  deleteContact: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el contacto' };
    }
  }
};

export default contactService;
