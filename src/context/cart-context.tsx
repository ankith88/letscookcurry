"use client";

import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { Recipe, CartItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const CART_STORAGE_KEY = 'lets_cook_curry_cart';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Recipe) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((item) => ({
              ...item,
              quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
            }))
          );
        }
      }
    } catch (e) {
      console.error('Failed to read cart from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items, isHydrated]);

  const addItem = useCallback((item: Recipe) => {
    let wasIncremented = false;
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        wasIncremented = true;
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });

    toast({
      title: wasIncremented ? "Updated quantity in cart" : "Added to cart!",
      description: wasIncremented
        ? `Added another serving of ${item.name} to your cart.`
        : `You've added ${item.name} to your cart.`,
    });
  }, [toast]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
