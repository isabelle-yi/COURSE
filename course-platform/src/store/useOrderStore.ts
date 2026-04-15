import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
    courseId: number;
    title: string;
    price: number;
    coverImage?: string;
}

export interface Order {
    id: number;
    orderNo: string;
    items: OrderItem[];
    totalPrice: number;
    status: 'pending' | 'paid' | 'cancelled';
    createdAt: string;
    expireAt?: string;
}
export interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    createOrder: (items: OrderItem[], totalPrice: number) => Order;
    cancelOrder: (orderId: number) => void;
    clearCurrentOrder: () => void;
}


export const useOrderStore = create<OrderState>()(
    persist(
        (set,get) => ({
            orders: [],
            currentOrder: null,

            createOrder: (items, totalPrice) => {
                const newOrder: Order = {
                    id: Date.now(),
                    orderNo: `ORD${Date.now()}${Math.floor(Math.random()*1000)}`,
                    items,
                    totalPrice,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    expireAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),                
                };

                set({
                    orders: [newOrder,...get().orders],
                    currentOrder: newOrder,
                });

                return newOrder;
            },

            cancelOrder: (orderId) => {
                set({
                    orders: get().orders.map(order =>
                        order.id ===orderId ? {...order, status: 'cancelled'} :order
                    ),
                    currentOrder: get().currentOrder ?.id === orderId ? null : get().currentOrder,
                });
            },

            clearCurrentOrder: () => {
                set({ currentOrder: null });
            },
        }),
        {
            name: 'order-storage',
        }
    )
);