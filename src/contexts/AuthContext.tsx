import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../config/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'tenant_owner';
  tenantIds?: string[]; // Para tenant_owners
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  canAccessAdmin: () => boolean;
  canManageTenant: (tenantId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios demo para testing
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@demo.com': {
    password: 'admin123',
    user: {
      id: 'admin-1',
      email: 'admin@demo.com',
      name: 'Administrador Principal',
      role: 'super_admin',
      avatar: '👨‍💼'
    }
  },
  'tenant@demo.com': {
    password: 'tenant123',
    user: {
      id: 'tenant-1',
      email: 'tenant@demo.com',
      name: 'Dueño de Tienda',
      role: 'tenant_owner',
      tenantIds: ['carpinteria-demo'],
      avatar: '👩‍💼'
    }
  }
};

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión de Supabase al cargar
  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(transformSupabaseUser(session.user));
      }
      setIsLoading(false);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(transformSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Intentar login con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Si falla, intentar con usuarios demo
        const demoUser = DEMO_USERS[email.toLowerCase()];
        if (demoUser && demoUser.password === password) {
          setUser(demoUser.user);
          setIsLoading(false);
          return true;
        }
        
        console.error('Login error:', error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        setUser(transformSupabaseUser(data.user));
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const canAccessAdmin = (): boolean => {
    if (!user) return false;
    return user.role === 'super_admin' || user.role === 'admin';
  };

  const canManageTenant = (tenantId: string): boolean => {
    if (!user) return false;
    
    // Super admin puede todo
    if (user.role === 'super_admin') return true;
    
    // Admin puede todo
    if (user.role === 'admin') return true;
    
    // Tenant owner solo sus propios tenants
    if (user.role === 'tenant_owner') {
      return user.tenantIds?.includes(tenantId) ?? false;
    }
    
    return false;
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    canAccessAdmin,
    canManageTenant,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Transformar usuario de Supabase a nuestro formato
function transformSupabaseUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email || 'Usuario',
    role: 'super_admin', // Por ahora todos los usuarios registrados son admin
    avatar: '👨‍💼',
  };
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
