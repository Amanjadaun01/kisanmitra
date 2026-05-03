import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('km_user') || 'null'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('km_token')));

  useEffect(() => {
    const token = localStorage.getItem('km_token');
    if (!token) return setLoading(false);
    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('km_user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('km_token');
        localStorage.removeItem('km_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const auth = async (path, payload) => {
    const { data } = await api.post(`/auth/${path}`, payload);
    localStorage.setItem('km_token', data.token);
    localStorage.setItem('km_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('km_token');
    localStorage.removeItem('km_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login: (p) => auth('login', p), register: (p) => auth('register', p), logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
