import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user data for development
interface MockUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  password: string;
}

const MOCK_USERS: MockUser[] = [
  {
    _id: '1',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    company: 'Demo Company',
    // In a real app, we would never store passwords in plain text
    // This is just for the mock data
    password: 'password123',
  }
];

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In development, check for a stored user in localStorage
        const storedUser = localStorage.getItem('expertAssistUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // For development, we'll simulate authentication with mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        throw new Error('Invalid credentials');
      }
      
      // Remove the password before storing the user
      const { password: _, ...userWithoutPassword } = mockUser;
      
      // Store the user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('expertAssistUser', JSON.stringify(userWithoutPassword));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // For development, we'll simulate registration with mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === userData.email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create a new mock user
      const newUser = {
        _id: `${MOCK_USERS.length + 1}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        ...(userData.company ? { company: userData.company } : {}),
        password: userData.password,
      };
      
      // Add to mock users (this won't persist after reload in this mock implementation)
      MOCK_USERS.push(newUser);
      
      // Remove the password before storing the user
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store the user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('expertAssistUser', JSON.stringify(userWithoutPassword));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('expertAssistUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 