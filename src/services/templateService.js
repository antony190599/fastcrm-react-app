
// src/services/templateService.js
import axios from 'axios';

// En Vite, las variables de entorno se acceden con import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/templates';

const templateService = {
  // Obtener todas las plantillas con filtros opcionales
  getTemplates: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.type) {
        params.append('type', filters.type);
      }
      
      if (filters.q) {
        params.append('q', filters.q);
      }
      
      const response = await axios.get(`${API_URL}/templates`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener plantillas' };
    }
  },
  
  // Obtener una plantilla por ID
  getTemplateById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/templates/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener la plantilla' };
    }
  },
  
  // Crear una nueva plantilla
  createTemplate: async (templateData) => {
    try {
      const response = await axios.post(`${API_URL}/templates`, templateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear la plantilla' };
    }
  },
  
  // Actualizar una plantilla existente
  updateTemplate: async (id, templateData) => {
    try {
      const response = await axios.put(`${API_URL}/templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar la plantilla' };
    }
  },
  
  // Eliminar una plantilla
  deleteTemplate: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/templates/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar la plantilla' };
    }
  }
};

export default templateService;