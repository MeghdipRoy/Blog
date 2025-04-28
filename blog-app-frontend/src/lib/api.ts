// src/lib/api.ts
import axios, { AxiosInstance } from 'axios';
import { AuthResponse, Post, ApiResponse, User } from './types';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API calls
export const register = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getMe = async (): Promise<ApiResponse<User>> => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Post API calls
export const getPosts = async (): Promise<ApiResponse<Post[]>> => {
  const response = await api.get('/posts');
  return response.data;
};

export const getPost = async (id: number): Promise<ApiResponse<Post>> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (data: {
  title: string;
  content: string;
}): Promise<ApiResponse<Post>> => {
  const response = await api.post('/posts', data);
  return response.data;
};

export const updatePost = async (
  id: number,
  data: { title: string; content: string }
): Promise<ApiResponse<Post>> => {
  const response = await api.put(`/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

export default api;