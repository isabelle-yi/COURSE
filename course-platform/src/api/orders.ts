import { get, post } from './client';
import type { Order } from '../types';

export const getOrdersByUser = (userId: number) =>
    get<Order[]>(`/orders?userId=${userId}`);

export const createOrder = (order :Omit<Order, 'id'>) =>
    post<Order>('/orders', order);