// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/login', credentials);
      setUser(response.data);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const logout = () => setUser(null);

  return { user, login, logout };
};

export default useAuth;
