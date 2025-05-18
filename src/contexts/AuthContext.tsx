
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '../types';
import { localStorageService } from '../services/localStorageService';
import { toast } from "sonner";

interface AuthContextProps {
  authState: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false });

  useEffect(() => {
    // Initialiser les données de l'application
    localStorageService.initializeAppData();
    
    // Récupérer l'état d'authentification du LocalStorage
    const storedAuthState = localStorageService.getAuth();
    if (storedAuthState && storedAuthState.isAuthenticated) {
      setAuthState(storedAuthState);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = localStorageService.getUsers();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        const newAuthState: AuthState = {
          user,
          isAuthenticated: true,
        };
        setAuthState(newAuthState);
        localStorageService.setAuth(newAuthState);
        toast.success(`Bienvenue, ${user.username}!`);
        return true;
      } else {
        toast.error("Nom d'utilisateur ou mot de passe incorrect.");
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast.error("Une erreur est survenue lors de la connexion.");
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = localStorageService.getUsers();
      const userExists = users.some((u) => u.username === username);

      if (userExists) {
        toast.error("Ce nom d'utilisateur est déjà pris.");
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        username,
        password,
        role: 'user',
      };

      localStorageService.addUser(newUser);
      const newAuthState: AuthState = {
        user: newUser,
        isAuthenticated: true,
      };
      setAuthState(newAuthState);
      localStorageService.setAuth(newAuthState);
      toast.success("Compte créé avec succès!");
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error("Une erreur est survenue lors de l'inscription.");
      return false;
    }
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorageService.setAuth({ user: null, isAuthenticated: false });
    toast.info("Vous avez été déconnecté.");
  };

  const isAdmin = (): boolean => {
    return authState.isAuthenticated && authState.user?.role === 'admin';
  };

  const isUser = (): boolean => {
    return authState.isAuthenticated && !!authState.user;
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
