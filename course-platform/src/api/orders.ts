import type { Order } from '../types';

const BASE_URL = 'http://localhost:3000';

export const getOrdersByUser = async (userId: number): Promise<Order[]> => {
  const res = await fetch(`${BASE_URL}/orders?userId=${userId}`);
  if (!res.ok) throw new Error('获取订单失败');
  return res.json();
};

export const createOrder = async (order: Omit<Order, 'id'>) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('创建订单失败');
  return res.json();
};

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await fetch('http://localhost:3000/orders');
  if (!res.ok) throw new Error('获取订单失败');
  return res.json();
};