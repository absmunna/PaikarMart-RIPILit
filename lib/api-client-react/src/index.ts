import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosInstance } from 'axios';
import type {
  LoginInput,
  SignupInput,
  CreateProductInput,
  UpdateProductInput,
  AddToCartInput,
  CreateOrderInput,
} from '@workspace/api-zod';

// ============================================
// API CLIENT SETUP
// ============================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

let client: AxiosInstance;

function getClient(): AxiosInstance {
  if (!client) {
    client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  return client;
}

// ============================================
// AUTH HOOKS
// ============================================

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await getClient().post('/auth/login', data);
      const { token } = response.data.data;
      localStorage.setItem('auth_token', token);
      return response.data.data;
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupInput) => {
      const response = await getClient().post('/auth/signup', data);
      const { token } = response.data.data;
      localStorage.setItem('auth_token', token);
      return response.data.data;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return () => {
    localStorage.removeItem('auth_token');
    queryClient.clear();
  };
};

export const useMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await getClient().get('/auth/me');
      return response.data.data;
    },
    retry: false,
  });
};

// ============================================
// PRODUCT HOOKS
// ============================================

export const useProducts = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await getClient().get('/products', { params });
      return response.data.data;
    },
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await getClient().get(`/products/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const response = await getClient().post('/products', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductInput }) => {
      const response = await getClient().put(`/products/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products', id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await getClient().delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// ============================================
// CART HOOKS
// ============================================

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await getClient().get('/cart');
      return response.data.data;
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddToCartInput) => {
      const response = await getClient().post('/cart/items', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await getClient().put(`/cart/items/${id}`, { quantity });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await getClient().delete(`/cart/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ============================================
// ORDER HOOKS
// ============================================

export const useOrders = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const response = await getClient().get('/orders', { params });
      return response.data.data;
    },
  });
};

export const useOrder = (id: string | undefined) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const response = await getClient().get(`/orders/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const response = await getClient().post('/orders', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// ============================================
// SELLER HOOKS
// ============================================

export const useSellers = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['sellers', params],
    queryFn: async () => {
      const response = await getClient().get('/sellers', { params });
      return response.data.data;
    },
  });
};

export const useSeller = (id: string | undefined) => {
  return useQuery({
    queryKey: ['sellers', id],
    queryFn: async () => {
      const response = await getClient().get(`/sellers/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useMyShop = () => {
  return useQuery({
    queryKey: ['sellers', 'me'],
    queryFn: async () => {
      const response = await getClient().get('/sellers/me');
      return response.data.data;
    },
  });
};

// ============================================
// UTILITY HOOKS
// ============================================

export const useApiClient = () => getClient();

export const useQueryClient_ = useQueryClient;
