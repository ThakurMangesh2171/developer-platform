'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data (Workspaces for now, in future we'd fetch /me profile)
  useEffect(() => {
    const fetchInitialData = async () => {
      // Check if we have a token
      const token = localStorage.getItem('devplatform_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch workspaces
        const wsResponse = await apiFetch(API_ENDPOINTS.WORKSPACE.BASE);
        if (wsResponse.success && wsResponse.data) {
          setWorkspaces(wsResponse.data);
          
          // Set first workspace as active by default if none selected
          if (wsResponse.data.length > 0) {
            setActiveWorkspace(wsResponse.data[0]);
          }
        }
        
        // Mock user profile for now (since we don't have a GET /me endpoint yet)
        setUser({
          firstName: 'Developer',
          lastName: 'User',
          email: 'dev@example.com'
        });
      } catch (error) {
        console.error("Failed to load app data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const value = {
    user,
    setUser,
    workspaces,
    setWorkspaces,
    activeWorkspace,
    setActiveWorkspace,
    isLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
