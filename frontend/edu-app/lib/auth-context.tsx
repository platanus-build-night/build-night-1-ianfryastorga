"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, userApi, User, LoginCredentials, RegisterCredentials } from "./api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Verificar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await userApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error al inicializar autenticación:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Iniciar sesión
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const user = await authApi.login(credentials);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem("auth_token", "token_example"); // En una implementación real, sería el token JWT
      localStorage.setItem("user", JSON.stringify(user));
      
      setUser(user);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido de nuevo, ${user.name || user.email}`,
        variant: "success",
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast({
        title: "Error al iniciar sesión",
        description: error instanceof Error ? error.message : "Credenciales inválidas",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Registrar usuario
  const register = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      const user = await authApi.register(credentials);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem("auth_token", "token_example"); // En una implementación real, sería el token JWT
      localStorage.setItem("user", JSON.stringify(user));
      
      setUser(user);
      
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente",
        variant: "success",
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al registrar:", error);
      toast({
        title: "Error al registrar",
        description: error instanceof Error ? error.message : "No se pudo crear la cuenta",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
} 