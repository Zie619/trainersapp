// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth, signOut } from 'firebase/auth';
import { authInstance } from './components/firebase';


const AuthContext = createContext();
const auth = getAuth();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [displayName, setNick] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Load token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);}
    const storedUserNick = localStorage.getItem('displayName');
      if (storedUserNick) {
        setNick(storedUserNick);
      // You might want to validate the token here
      // and set the user accordingly
    }
    setLoading(false); // Set loading to false after attempting to load token
  }, []);

  // Initialize user on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = (username, authToken , displayName) => {
    setUser(username);
    setNick(displayName);
    setToken(authToken);
    // Store the token in localStorage
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('displayName', displayName);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setNick(null);
    // Remove the token from localStorage
    signOut(auth).then(() => {
      // Successfully signed out, now delete the cookie
      document.cookie = `idToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      document.cookie = `displayName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }).catch((error) => {
      // Handle sign-out errors if needed
      console.error('Error signing out:', error);
  });
    document.cookie = `idToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    localStorage.removeItem('authToken');
    document.cookie = `displayName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    localStorage.removeItem('displayName');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading ,displayName}}>
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
