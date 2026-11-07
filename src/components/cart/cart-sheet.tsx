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
import { AlertCircle, CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';

const ORDERS_STORAGE_KEY = 'lets_cook_curry_orders';

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isOrderable, setIsOrderable] = useState(false);
  const [orderPlacedId, setOrderPlacedId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Day check is done on client to avoid hydration mismatch
    // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu
    const today = new Date().getDay();
    setIsOrderable(today >= 1 && today <= 4);
  }, []);

  useEffect(() => {
    if (!open) {
      setOrderPlacedId(null);
    }
  }, [open]);

  const handleCheckout = () => {
    const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toISOString(),
      items: [...items],
      total: totalPrice,
    };

    try {
      const existingRaw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
      const existingOrders: Order[] = existingRaw ? JSON.parse(existingRaw) : [];
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([newOrder, ...existingOrders]));
    } catch (e) {
      console.error('Could not save order to localStorage:', e);
    }

    clearCart();
    setOrderPlacedId(newOrderId);
    toast({
      title: "Order Confirmed!",
      description: `Order ${newOrderId} has been placed for Monday delivery.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="font-headline text-2xl">
            Shopping Cart {totalItems > 0 ? `(${totalItems})` : ''}
          </SheetTitle>
          <SheetDescription>
            Review your weekly curries. Orders are open Monday to Thursday for fresh Monday delivery.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        {orderPlacedId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-headline font-bold">Thank You for Your Order!</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your order <span className="font-semibold text-foreground">{orderPlacedId}</span> is confirmed and will be freshly prepared for delivery next Monday.
            </p>
            <Button className="mt-2" onClick={() => onOpenChange(false)}>
              Back to Menu
            </Button>
          </div>
        ) : items.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-6">
                {items.map((item) => {
                  const qty = item.quantity || 1;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          data-ai-hint={item.imageHint}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${Number(item.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center rounded-lg border bg-background">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            aria-label={`Decrease quantity of ${item.name}`}
                            onClick={() => updateQuantity(item.id, qty - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                          <span
                            className="w-7 text-center text-sm font-semibold tabular-nums"
                            aria-live="polite"
                          >
                            {qty}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            aria-label={`Increase quantity of ${item.name}`}
                            onClick={() => updateQuantity(item.id, qty + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          aria-label={`Remove ${item.name} from cart`}
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-6 bg-muted/40">
              <div className="flex w-full flex-col gap-4">
                <div className="flex justify-between items-baseline text-lg font-bold">
                  <span>Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span className="text-xl text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                {isClient && !isOrderable && (
                  <Alert
                    variant="default"
                    className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800"
                  >
                    <AlertCircle className="h-4 w-4 !text-amber-700 dark:!text-amber-400" />
                    <AlertTitle className="text-amber-900 dark:text-amber-200">
                      Ordering is currently closed
                    </AlertTitle>
                    <AlertDescription className="text-amber-800 dark:text-amber-300">
                      Orders can be placed Monday through Thursday for fresh delivery on the following Monday.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full sm:w-auto"
                  >
                    Clear Cart
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={!isOrderable || !isClient}
                    className="w-full flex-1"
                  >
                    Place Order (${totalPrice.toFixed(2)})
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-headline font-semibold">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Add some of this week&apos;s freshly prepared curries to get started!
              </p>
            </div>
            <Button onClick={() => onOpenChange(false)} className="mt-2">
              Explore Menu
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
