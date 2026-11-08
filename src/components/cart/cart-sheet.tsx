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
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';
import { useSiteSettings } from '@/context/site-settings-context';

const ORDERS_STORAGE_KEY = 'lets_cook_curry_orders';

export function CartSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();
  const {
    orderingFeatureEnabled,
    orderWindowMode,
    isOrdersOpen,
    loading: settingsLoading,
  } = useSiteSettings();
  const [isClient, setIsClient] = useState(false);
  const [orderPlacedId, setOrderPlacedId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isOrderable = orderingFeatureEnabled && isOrdersOpen && !settingsLoading;

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
      window.localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify([newOrder, ...existingOrders])
      );
    } catch (e) {
      console.error('Could not save order to localStorage:', e);
    }

    clearCart();
    setOrderPlacedId(newOrderId);
    toast({
      title: 'Kitchen Order Confirmed',
      description: `Order ${newOrderId} has been reserved for Monday delivery.`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg bg-background border-l border-border">
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-border bg-secondary/40 text-left">
          <SheetTitle className="font-headline text-2xl font-medium text-foreground">
            Shopping Cart {totalItems > 0 ? `(${totalItems})` : ''}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Review your weekly curries. Orders are open Monday to Thursday for Monday delivery.
          </SheetDescription>
        </SheetHeader>

        {orderPlacedId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-headline font-medium text-foreground">
              Thank You for Your Order!
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Your order{' '}
              <span className="num font-semibold text-foreground">{orderPlacedId}</span> is confirmed for Monday delivery.
            </p>
            <Button
              className="mt-3 rounded-xl px-6 bg-primary text-primary-foreground"
              onClick={() => onOpenChange(false)}
            >
              Back to Menu
            </Button>
          </div>
        ) : items.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-3.5 p-6">
                {items.map((item) => {
                  const qty = item.quantity || 1;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover border border-border"
                          data-ai-hint={item.imageHint}
                        />
                        <div className="min-w-0 space-y-0.5">
                          <p className="font-headline font-medium text-base text-foreground truncate">
                            {item.name}
                          </p>
                          <p className="num text-xs text-muted-foreground">
                            ${Number(item.price).toFixed(2)} per portion
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center rounded-lg border border-border bg-background">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none hover:bg-secondary"
                            aria-label={`Decrease quantity of ${item.name}`}
                            onClick={() => updateQuantity(item.id, qty - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                          <span
                            className="num w-7 text-center text-sm font-semibold"
                            aria-live="polite"
                          >
                            {qty}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none hover:bg-secondary"
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

            <SheetFooter className="p-6 border-t border-border bg-secondary/50">
              <div className="flex w-full flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Subtotal ({totalItems} {totalItems === 1 ? 'portion' : 'portions'})
                  </span>
                  <span className="num font-headline text-2xl font-medium text-foreground">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {isClient && !settingsLoading && !isOrderable && (
                  <Alert
                    variant="default"
                    className="bg-card border-border text-foreground rounded-xl"
                  >
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-semibold text-sm">
                      Kitchen ordering window is closed
                    </AlertTitle>
                    <AlertDescription className="text-xs text-muted-foreground">
                      {orderWindowMode === 'closed'
                        ? 'Orders are temporarily paused by the kitchen. Please check back soon.'
                        : 'Orders can be placed Monday through Thursday for fresh Monday delivery.'}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full sm:w-auto rounded-xl bg-card border-border"
                  >
                    Clear Cart
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={!isOrderable || !isClient}
                    className="w-full flex-1 h-11 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <span className="num">Place Order (${totalPrice.toFixed(2)})</span>
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary border border-border">
              <ShoppingBag className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-headline font-medium text-foreground">
                Your cart is empty
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Add some of this week&apos;s curries to get started!
              </p>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="mt-2 rounded-xl px-6 bg-primary text-primary-foreground"
            >
              Explore Menu
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
