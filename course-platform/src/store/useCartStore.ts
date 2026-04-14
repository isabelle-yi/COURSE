import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course } from '../types';

interface CartItem {
    courseId: number;
    title: string;
    instructorName: string;
    price: number;
    coverImage?:string;
    quantity: number;
    selected: boolean;
}
interface CartState {
    items: CartItem[];
    addToCart: (course: Course) => boolean;
    removeFromCart: (courseId: number) => void;
    updateQuantity: (courseId: number, quantity: number) => void;
    toggleSelect: (courseId: number) => void;
    toggleSelectAll: (selected: boolean) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getSelectedTotalPrice: () => number;
    getSelectedCount: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(    
        (set, get) => ({
            items: [],

                addToCart: (course) => {
                const { items } =get();
                const exists = items.some(item => item.courseId === course.id);
                if (exists){
                    return false;
                } else {
                    set({
                        items: [...items, {
                            courseId: course.id,
                            title: course.title,
                            instructorName: course.instructorName,
                            price: course.price,
                            coverImage: course.coverImage,
                            quantity: 1,
                            selected: true,
                        }]
                    });
                    return true;
                }
            },

            removeFromCart: (courseId: number) => {
                set({
                    items: get().items.filter(item => item.courseId !== courseId)
                });
            },

            updateQuantity: (courseId, quantity) => {
                if (quantity < 1) return;
                set({
                    items: get().items.map(item =>
                        item.courseId === courseId ? {...item, quantity} : item
                    )
                });
            },

            toggleSelect: (courseId) => {
                set({
                    items: get().items.map(item =>
                        item.courseId === courseId ? { ...item, selected: !item.selected } : item
                    )
                });
            },

            toggleSelectAll: (selected) => {
                set({
                    items: get().items.map(item => ({ ...item, selected }))
                });
            },

            clearCart: () => {
                set({ items: []});
            },

            getTotalPrice: () => {
                const items = get().items;
                if (!items || !Array.isArray(items)) return 0;
                const total = items.reduce((sum, item) => {
                const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
                const qty = typeof item.quantity === 'number' ? item.quantity : 0;
                 return sum + price * qty;
             }, 0);
                return isNaN(total) ? 0 : total;
            },

            getSelectedTotalPrice: () => {
                const items = get().items;
                if (!items || !Array.isArray(items)) return 0;
                const total = items
                .filter(item => item.selected)
                .reduce((sum, item) => {
                const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
                const qty = typeof item.quantity === 'number' ? item.quantity : 0;
                return sum + price * qty;
            }, 0);
                return isNaN(total) ? 0 : total;
            },

            getSelectedCount: () => {
                return get().items.filter(item => item.selected).length;
            },

            getItemCount: () => {
                const items = get().items;
                if(!items || !Array.isArray(items) ||items.length ===0){
                    return 0;
                }
                const total = items.reduce((count,item) => {
                    const qty = typeof item.quantity === 'number'? item.quantity : 0;
                    return count + qty;
                },0);
                return isNaN(total) ? 0: total;
            },
        }),
        {
            name: 'cart-storage'
        }
    )
)