"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import type { Recipe } from "@/lib/types";

export function AddToCartButton({ recipe }: { recipe: Recipe }) {
    const { addItem } = useCart();
    return (
        <Button size="lg" className="w-full" onClick={() => addItem(recipe)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add to Cart
        </Button>
    )
}
