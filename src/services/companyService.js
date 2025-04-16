import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const companyService = {
  getCompanies: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/companies`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener empresas' };
    }
  },

  getCompanyById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener la empresa' };
    }
  },

  createCompany: async (companyData) => {
    try {
      const response = await axios.post(`${API_URL}/api/companies`, companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear la empresa' };
    }
  },

  updateCompany: async (id, companyData) => {
    try {
      const response = await axios.put(`${API_URL}/api/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar la empresa' };
    }
  },

  deleteCompany: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar la empresa' };
    }
  }
};

export default companyService;
