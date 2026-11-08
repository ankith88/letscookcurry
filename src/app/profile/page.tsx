
"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { History, LogOut, Pencil, PlusCircle, ShieldCheck, ShoppingBag, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order, CartItem } from "@/lib/types";
import { getAuth, onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteSettings } from "@/context/site-settings-context";

const auth = getAuth(app);
const ORDERS_STORAGE_KEY = 'lets_cook_curry_orders';

export default function ProfilePage() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const { orderingFeatureEnabled, isAdmin, canBootstrapAdmin } = useSiteSettings();
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayNameInput(currentUser.displayName || "");
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    try {
      const savedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrderHistory(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load order history:", e);
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    try {
      await updateProfile(user, { displayName: displayNameInput.trim() });
      setUser({ ...user, displayName: displayNameInput.trim() } as User);
      setIsEditOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your display name has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleReorder = (orderItems: CartItem[]) => {
    orderItems.forEach((item) => {
      const qty = item.quantity || 1;
      for (let i = 0; i < qty; i++) {
        addItem(item);
      }
    });
    toast({
      title: "Items Added!",
      description: "Items from your previous order have been added to your cart.",
    });
  };

  const handleSignOut = async () => {
    await auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
          {orderingFeatureEnabled && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <History className="h-6 w-6 text-primary" aria-hidden="true" />
                  <CardTitle className="text-2xl font-headline">Order History</CardTitle>
                </div>
                <CardDescription>Review your past orders and quickly reorder your favorites.</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = (user.displayName || user.email || "U")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8 max-w-4xl mx-auto">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border border-border">
                  <AvatarFallback className="bg-primary/15 text-primary font-headline text-lg font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-2xl font-headline">
                      {user.displayName || "Valued Curry Lover"}
                    </CardTitle>
                    {isAdmin && (
                      <Badge className="gap-1 text-xs font-semibold">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleSaveProfile}>
                      <DialogHeader>
                        <DialogTitle className="font-headline text-xl">Edit Profile</DialogTitle>
                        <DialogDescription>
                          Update how your name appears on your account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={displayNameInput}
                          onChange={(e) => setDisplayNameInput(e.target.value)}
                          placeholder="e.g. Tanvi & Ankith"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsEditOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSavingProfile}>
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button variant="destructive" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {(isAdmin || canBootstrapAdmin) && (
          <Card className="border-primary/40 bg-primary/5 shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                  <div>
                    <CardTitle className="text-xl font-headline">Admin Studio</CardTitle>
                    <CardDescription>
                      Manage ordering mode, open/close weekly orders, and add or edit recipes in Firestore.
                    </CardDescription>
                  </div>
                </div>
                <Button asChild size="sm" className="font-semibold">
                  <Link href="/admin">Open Admin Studio</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}

        {orderingFeatureEnabled && (
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <History className="h-6 w-6 text-primary" aria-hidden="true" />
                <CardTitle className="text-2xl font-headline">Order History</CardTitle>
              </div>
              <CardDescription>
                Review your past weekly orders and reorder your favorites with one click.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {orderHistory.length > 0 ? (
                orderHistory.map((order) => (
                  <div key={order.id} className="rounded-xl border border-border/70 bg-background/60 p-5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline font-bold text-lg">{order.id}</h3>
                          <span className="text-sm font-semibold text-primary">
                            ${Number(order.total).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Ordered on{" "}
                          {new Date(order.date).toLocaleDateString('en-AU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="font-semibold"
                        onClick={() => handleReorder(order.items)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                        Reorder All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/60"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-md object-cover"
                              data-ai-hint={item.imageHint}
                            />
                            <div>
                              <p className="font-medium text-sm sm:text-base">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity || 1} &times; ${Number(item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/recipe/${item.id}`}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border py-12 px-4 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline text-lg font-bold">No past orders yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Once you place an order from our weekly menu, it will appear here for easy reordering.
                    </p>
                  </div>
                  <Button asChild className="mt-2">
                    <Link href="/#recipes">
                      <UtensilsCrossed className="mr-2 h-4 w-4" aria-hidden="true" />
                      Explore This Week&apos;s Curries
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
