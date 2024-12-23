// src/services/api.js
import axios from 'axios';

const API_URL = process.env.VITE_MONGO_URI;
const API_BASE_URL = 'http://localhost:5000/api/reports';
export const getSalesByMonth = (year) => {
  return axios.get(`${API_BASE_URL}/sales-by-month/${year}`);
};

export const getSalesByYear = () => {
  return axios.get(`${API_BASE_URL}/sales-by-year`);
};

export const getTopSellingProducts = (limit = 5) => {
  return axios.get(`${API_BASE_URL}/top-selling-products/${limit}`);
};

export const getSalesByCategory = () => {
  return axios.get(`${API_BASE_URL}/sales-by-category`);
};

export const getCustomSalesTrends = (startDate, endDate) => {
  return axios.get(`${API_BASE_URL}/custom-sales-trends`, {
    params: { startDate, endDate },
  });
};
export const signup = async (userData) => {
  return await axios.post(`${API_URL}/signup`, userData);
};

export const login = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};
