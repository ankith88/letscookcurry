"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "../ui/button";
import { Minus, Plus, PlusCircle, ShoppingBag } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  recipe: Recipe;
  onLeaf?: boolean;
  className?: string;
}

export function AddToCartButton({ recipe, onLeaf = false, className }: AddToCartButtonProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.id === recipe.id);
  const quantity = cartItem?.quantity || 0;

  if (quantity > 0) {
    return (
      <div
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border p-1",
          onLeaf
            ? "border-leaf-ink/30 bg-leaf-ink/10 text-leaf-ink"
            : "border-primary/40 bg-secondary/60 text-foreground",
          className
        )}
        role="group"
        aria-label={`Quantity for ${recipe.name} in cart`}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => updateQuantity(recipe.id, quantity - 1)}
          aria-label={`Decrease quantity of ${recipe.name}`}
          className={cn(
            "h-9 w-11 rounded-lg",
            onLeaf
              ? "text-leaf-ink hover:bg-leaf-ink/15 hover:text-leaf-ink"
              : "text-foreground hover:bg-background/80"
          )}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </Button>

        <span className="num flex items-center gap-1.5 text-sm font-bold" aria-live="polite">
          <ShoppingBag className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <span>{quantity} in Cart</span>
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => addItem(recipe)}
          aria-label={`Increase quantity of ${recipe.name}`}
          className={cn(
            "h-9 w-11 rounded-lg",
            onLeaf
              ? "text-leaf-ink hover:bg-leaf-ink/15 hover:text-leaf-ink"
              : "text-foreground hover:bg-background/80"
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      className={cn(
        "h-11 w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-none",
        className
      )}
      onClick={() => addItem(recipe)}
    >
      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
      Add to Cart
    </Button>
  );
}
