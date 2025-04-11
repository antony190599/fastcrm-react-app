// filepath: d:\dev1\fastcrm-react-app\src\services\templateService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/templates';

const templateService = {
  getTemplates: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.type) {
        params.append('type', filters.type);
      }

      if (filters.q) {
        params.append('q', filters.q);
      }

      const response = await axios.get(API_URL, { params }); // Elimina `/templates`
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener plantillas' };
    }
  },

  getTemplateById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`); // Elimina `/templates`
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener la plantilla' };
    }
  },

  createTemplate: async (templateData) => {
    try {
      const response = await axios.post(API_URL, templateData); // Elimina `/templates`
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear la plantilla' };
    }
  },

  updateTemplate: async (id, templateData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, templateData); // Elimina `/templates`
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar la plantilla' };
    }
  },

  deleteTemplate: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`); // Elimina `/templates`
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar la plantilla' };
    }
  },
};

export default templateService;