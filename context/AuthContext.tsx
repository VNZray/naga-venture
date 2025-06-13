import { users } from '@/Controller/User';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// Define the type for the user
interface User {
  id: string;
  email: string;
  display_name: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider implementation
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if there's a stored user in localStorage or AsyncStorage
    const checkStoredUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking stored user:', error);
      }
      setLoading(false);
    };

    checkStoredUser();
  }, []);

  const login = async (email: string, password: string) => {
    const matchedUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!matchedUser) {
      throw new Error('Invalid email or password');
    }

    // Create a user object that matches our User interface
    const user: User = {
      id: matchedUser.id.toString(),
      email: matchedUser.email,
      display_name: matchedUser.name,
    };

    // Store the user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
