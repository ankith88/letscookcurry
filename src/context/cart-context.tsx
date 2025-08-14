"use client";

import React, { createContext, useState, useCallback } from 'react';
import type { Recipe } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  items: Recipe[];
  addItem: (item: Recipe) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Recipe[]>([]);
  const { toast } = useToast();

  const addItem = useCallback((item: Recipe) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        toast({
            title: "Already in cart",
            description: `${item.name} is already in your cart.`,
            variant: "default",
          })
        return prevItems;
      }
      toast({
        title: "Added to cart!",
        description: `You've added ${item.name} to your cart.`,
      })
      return [...prevItems, item];
    });
  }, [toast]);

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);
  
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
