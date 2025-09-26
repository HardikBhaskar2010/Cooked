import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth} from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {User, firebaseService} from '../services/firebaseService';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  mockLogin: () => Promise<void>;  // Mock login for testing
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setFirebaseUser(firebaseUser);
          
          // Try to get user data from our API
          try {
            const userData = await firebaseService.getUser(firebaseUser.uid);
            setUser(userData);
          } catch (error) {
            // If user doesn't exist in our API, create them
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              avatar_url: firebaseUser.photoURL || undefined,
            };
            
            try {
              const createdUser = await firebaseService.createUser(newUser);
              setUser(createdUser);
            } catch (createError) {
              console.error('Error creating user:', createError);
              setUser(newUser); // Use local user data if API fails
            }
          }
          
          // Store auth token
          const token = await firebaseUser.getIdToken();
          await AsyncStorage.setItem('auth_token', token);
        } else {
          setFirebaseUser(null);
          setUser(null);
          await AsyncStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user in our API
      const newUser: User = {
        id: result.user.uid,
        name,
        email,
      };
      
      await firebaseService.createUser(newUser);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('auth_token');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  };

  const mockLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Create a mock user for testing
      const mockUser: User = {
        id: 'mock-user-123',
        name: 'Test User',
        email: 'test@atalidea.com',
        avatar_url: 'https://via.placeholder.com/100/4A90E2/FFFFFF?text=TU',
      };
      
      // Set mock user data
      setUser(mockUser);
      
      // Store mock token
      await AsyncStorage.setItem('auth_token', 'mock-token-for-testing');
      await AsyncStorage.setItem('mock_user', JSON.stringify(mockUser));
      
      console.log('✅ Mock login successful!');
    } catch (error: any) {
      console.error('Mock login error:', error);
      throw new Error('Failed to mock login');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    logout,
    mockLogin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};