// src/lib/auth.ts
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getMe, login, register } from './api';
import { AuthResponse, User } from './types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getMe();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        toast.error('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login function
  const signIn = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast.success('Logged in successfully');
        router.push('/posts');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    }
  };

  // Register function
  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await register({ name, email, password });
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        toast.success('Registered successfully');
        router.push('/login');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    }
  };

  // Logout function
  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return { user, loading, signIn, signUp, signOut };
};