import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const metricsService = {
  getDashboardMetrics: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/metrics/dashboard`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener las métricas del dashboard' };
    }
  }
};

export default metricsService;