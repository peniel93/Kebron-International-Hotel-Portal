import React, { createContext, useContext, useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kebron_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    const user = await dataService.loginUser(username, password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('kebron_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: "Invalid username or password credentials." };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kebron_user');
  };

  const updateUserProfile = async (updatedData) => {
    if (!currentUser) return;
    const updated = await dataService.updateUser(currentUser.id, updatedData);
    if (updated) {
      const newUser = { ...currentUser, ...updated };
      setCurrentUser(newUser);
      localStorage.setItem('kebron_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      login: async () => ({ success: false }),
      logout: () => {},
      updateUserProfile: async () => {}
    };
  }
  return context;
};
