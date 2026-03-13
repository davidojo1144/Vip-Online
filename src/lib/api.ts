import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://example.com/api';
let token: string | null = null;

export const setAuthToken = async (nextToken: string | null) => {
  token = nextToken;
  if (nextToken) {
    await SecureStore.setItemAsync('auth_token', nextToken);
  } else {
    await SecureStore.deleteItemAsync('auth_token');
  }
};

export const loadAuthToken = async () => {
  token = (await SecureStore.getItemAsync('auth_token')) ?? null;
  return token;
};

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  if (!token) {
    await loadAuthToken();
  }
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      await setAuthToken(null);
    }
    return Promise.reject(error);
  }
);
