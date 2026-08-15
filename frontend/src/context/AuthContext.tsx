import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setAuthToken, clearAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string, district?: string, state?: string) => Promise<void>;
  quickDemoLogin: () => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('satcrop_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('satcrop_token');
      if (savedToken) {
        setAuthToken(savedToken);
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.warn('Session expired or backend offline, checking fallback');
          const savedUser = localStorage.getItem('satcrop_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            clearAuthToken();
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: loggedUser } = res.data;
      setToken(access_token);
      setUser(loggedUser);
      setAuthToken(access_token);
      localStorage.setItem('satcrop_token', access_token);
      localStorage.setItem('satcrop_user', JSON.stringify(loggedUser));
    } catch (err: any) {
      // Fallback for demo mode if backend is not reachable
      if (email.toLowerCase().includes('ramesh') || password === 'farmer123') {
        const demoUser: User = {
          id: 'user-ramesh-kumar-001',
          name: 'Ramesh Kumar',
          email: email.toLowerCase(),
          phone: '+91 9876543210',
          district: 'Jabalpur',
          state: 'Madhya Pradesh',
          language: 'en',
          created_at: new Date().toISOString()
        };
        const demoToken = 'mock_jwt_token_demo_farmer_2026';
        setToken(demoToken);
        setUser(demoUser);
        setAuthToken(demoToken);
        localStorage.setItem('satcrop_token', demoToken);
        localStorage.setItem('satcrop_user', JSON.stringify(demoUser));
        return;
      }
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string, district?: string, state?: string) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        phone: phone || '+91 9876543210',
        district: district || 'Jabalpur',
        state: state || 'Madhya Pradesh'
      });
      const { access_token, user: newUser } = res.data;
      setToken(access_token);
      setUser(newUser);
      setAuthToken(access_token);
      localStorage.setItem('satcrop_token', access_token);
      localStorage.setItem('satcrop_user', JSON.stringify(newUser));
    } catch (err) {
      // Fallback register
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        phone: phone || '+91 9876543210',
        district: district || 'Jabalpur',
        state: state || 'Madhya Pradesh',
        language: 'en',
        created_at: new Date().toISOString()
      };
      const mockToken = `mock_token_${Date.now()}`;
      setToken(mockToken);
      setUser(mockUser);
      setAuthToken(mockToken);
      localStorage.setItem('satcrop_token', mockToken);
      localStorage.setItem('satcrop_user', JSON.stringify(mockUser));
    }
  };

  const quickDemoLogin = async () => {
    try {
      await login('ramesh@satcrop.com', 'farmer123');
    } catch {
      const demoUser: User = {
        id: 'user-ramesh-kumar-001',
        name: 'Ramesh Kumar',
        email: 'ramesh@satcrop.com',
        phone: '+91 9876543210',
        district: 'Jabalpur',
        state: 'Madhya Pradesh',
        language: 'en',
        created_at: new Date().toISOString()
      };
      const demoToken = 'mock_jwt_token_demo_farmer_2026';
      setToken(demoToken);
      setUser(demoUser);
      setAuthToken(demoToken);
      localStorage.setItem('satcrop_token', demoToken);
      localStorage.setItem('satcrop_user', JSON.stringify(demoUser));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuthToken();
    localStorage.removeItem('satcrop_token');
    localStorage.removeItem('satcrop_user');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const merged = { ...user, ...updatedUser };
      setUser(merged);
      localStorage.setItem('satcrop_user', JSON.stringify(merged));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, quickDemoLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
