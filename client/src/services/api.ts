import axios from 'axios';
import type { ItemUpdateIn, ItemsGetOut, ItemWithRevision } from '../types';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
});

export const ItemsAPI = {
  getItems: async (
    params?: Record<string, string | number | boolean>,
    signal?: AbortSignal,
  ): Promise<ItemsGetOut> => {
    const response = await api.get<ItemsGetOut>('/items', { params, signal });
    return response.data;
  },

  getItemById: async (id: string, signal?: AbortSignal): Promise<ItemWithRevision> => {
    const response = await api.get<ItemWithRevision>(`/items/${id}`, { signal });
    if (response.data && response.data.category) {
      return response.data;
    }
    throw new Error('Item not found');
  },

  updateItem: async (id: string, data: ItemUpdateIn): Promise<void> => {
    await api.put(`/items/${id}`, data);
  },
};
