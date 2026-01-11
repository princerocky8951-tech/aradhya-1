
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../api/axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
  updateProfile: (email: string, password?: string) => Promise<void>;
  requestPasswordUpdateOtp: () => Promise<void>;
  verifyPasswordUpdate: (otp: string, newPassword: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tempEmail, setTempEmail] = useState<string>('');

  useEffect(() => {
    // Check localStorage instead of sessionStorage for persistent sessions
    const savedUser = localStorage.getItem('aradhya_user');
    const token = localStorage.getItem('accessToken');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to restore session");
        localStorage.removeItem('aradhya_user');
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await api.post('/auth/login', { email, password });
      setTempEmail(email);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Identity verification failed');
    }
  };

  const resendOtp = async () => {
    if (!tempEmail) throw new Error('Session timed out. Please login again.');
    try {
      await api.post('/auth/resend-otp', { email: tempEmail });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Resend protocol failed');
    }
  };

  const verifyOtp = async (otp: string) => {
    if (!tempEmail) throw new Error('Identity link broken. Restart login.');
    try {
      const res = await api.post('/auth/verify-otp', { email: tempEmail, otp });
      const { user: userData, accessToken } = res.data;
      
      setUser(userData);
      // Persist to localStorage for session durability
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('aradhya_user', JSON.stringify(userData));
      setTempEmail('');
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'The code provided is invalid.');
    }
  };

  const requestPasswordUpdateOtp = async () => {
    try {
      await api.post('/auth/request-password-update-otp');
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Security request failed');
    }
  };

  const verifyPasswordUpdate = async (otp: string, newPassword: string) => {
    try {
      await api.post('/auth/verify-password-update', { otp, newPassword });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Password update protocol failed');
    }
  };

  const updateProfile = async (email: string, password?: string) => {
    try {
      const updatedUser = { ...user!, email };
      setUser(updatedUser);
      localStorage.setItem('aradhya_user', JSON.stringify(updatedUser));
    } catch (err: any) {
      throw new Error('Update protocol rejected.');
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { email, name, password });
      const { user: userData, accessToken } = res.data;
      
      setUser(userData);
      // Persist to localStorage for session durability
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('aradhya_user', JSON.stringify(userData));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration rejected.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('aradhya_user');
    window.location.href = '#/';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      verifyOtp,
      resendOtp,
      logout, 
      register,
      updateProfile,
      requestPasswordUpdateOtp,
      verifyPasswordUpdate,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
