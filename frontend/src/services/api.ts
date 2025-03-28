import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

import { AxiosResponse } from 'axios';
import { Disaster } from '../types/disaster';

export const useApi = () => {
  return {
    get: (url: string) => api.get<Disaster[]>(url),
    analyzeImage: (imageData: string) => api.post('/analyze/image', { imageData }),
    analyzeText: (text: string) => api.post('/analyze/text', { text }),
    getResourceAllocation: (params: {
      disasterType: string;
      population: number;
      severity: number;
    }) => api.post('/allocate/resources', params),
  };
};

export type ApiService = ReturnType<typeof useApi>;

export default api;