import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await ApiService.getCurrentUser();
        if (response.status) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await ApiService.login(credentials);
      
      if (response.status) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true, user: response.user };
      } else {
        toast.error(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await ApiService.register(userData);
      
      if (response.status) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        return { success: true, user: response.user };
      } else {
        toast.error(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Role-based access control helpers
  const hasRole = (role) => {
    return user && user.role === role;
  };

  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  const isAdmin = () => hasRole('admin');
  const isCompany = () => hasRole('company');
  const isApplicant = () => hasRole('applicant');

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCompany,
    isApplicant,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
