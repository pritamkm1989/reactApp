import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from './services/api';
import { CartContext } from './CartContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { loadFromBackend, syncToBackend, clearCart } = useContext(CartContext);

  useEffect(() => {
    const session = api.getSession();
    if (session) {
      setUser({ id: session.userId, name: session.name, email: session.email, mobile: session.mobile, role: session.role });
      loadFromBackend(session.userId);
    }
    setLoading(false);
  }, [loadFromBackend]);

  const login = useCallback(async (email, password) => {
    const result = await api.login(email, password);
    setUser(result.user);
    if (result.user?.id) loadFromBackend(result.user.id);
    return result;
  }, [loadFromBackend]);

  const register = useCallback(async (data) => {
    const result = await api.register(data);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    if (user?.id) syncToBackend(user.id);
    api.logout();
    setUser(null);
    clearCart();
  }, [user, syncToBackend, clearCart]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
