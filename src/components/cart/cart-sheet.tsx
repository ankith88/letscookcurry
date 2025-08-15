
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useEffect, useState } from 'react';

export function CartSheet({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { items, removeItem, clearCart } = useCart();
  const [isOrderable, setIsOrderable] = useState(true); // Default to true to avoid flash of disabled content

  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  useEffect(() => {
    // Day check is done on client to avoid hydration mismatch
    // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu
    const today = new Date().getDay();
    setIsOrderable(today >= 1 && today <= 4);
  }, []);


  const handleCheckout = () => {
    alert("Proceeding to checkout!");
    // In a real app, this would redirect to a checkout page.
    clearCart();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
          <SheetDescription>
            Review your weekly recipes. You can place your order from Monday to Thursday.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                        data-ai-hint={item.imageHint}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6 bg-muted/50 rounded-b-lg">
              <div className="flex w-full flex-col gap-4">
                 <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Separator />
                {!isOrderable && (
                  <Alert variant="default" className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                    <AlertCircle className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
                    <AlertTitle className="text-yellow-800 dark:text-yellow-200">Ordering is currently closed</AlertTitle>
                    <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                      You can only place orders from Monday to Thursday.
                    </AlertDescription>
                  </Alert>
                )}
                <Button onClick={handleCheckout} disabled={!isOrderable} className="w-full">
                  Place Order
                </Button>
                <Button variant="outline" onClick={clearCart} className="w-full">
                  Clear Cart
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-6">
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some delicious recipes to get started!</p>
            <Button onClick={() => onOpenChange(false)}>Continue Shopping</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
