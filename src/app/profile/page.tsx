"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowRight,
  History,
  LogOut,
  Pencil,
  PlusCircle,
  ShieldCheck,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
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
      <div className="container mx-auto px-4 py-12 sm:px-6">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
          {orderingFeatureEnabled && (
            <div className="rounded-2xl border border-border bg-card p-8 space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
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
    <div className="container mx-auto px-4 py-12 sm:px-6">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border border-border">
                <AvatarFallback className="bg-primary text-primary-foreground font-headline text-xl font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-headline font-medium text-foreground">
                    {user.displayName || "Valued Curry Lover"}
                  </h1>
                  {isAdmin && (
                    <Badge className="gap-1 text-xs font-semibold bg-primary text-primary-foreground">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-10 bg-background hover:bg-primary hover:text-primary-foreground"
                  >
                    <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border rounded-2xl">
                  <form onSubmit={handleSaveProfile}>
                    <DialogHeader>
                      <DialogTitle className="font-headline text-xl font-medium">
                        Edit Profile
                      </DialogTitle>
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
                        className="rounded-xl bg-background"
                      />
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl"
                        onClick={() => setIsEditOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-xl bg-primary text-primary-foreground"
                        disabled={isSavingProfile}
                      >
                        {isSavingProfile ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl h-10"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Studio Banner */}
        {(isAdmin || canBootstrapAdmin) && (
          <div className="rounded-2xl bg-[#38450f] text-[#fcf8ef] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2d380b] text-[#f7a832] border border-[#fcf8ef]/15">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-headline font-medium text-[#fcf8ef]">
                  Admin Studio
                </h2>
                <p className="text-sm text-[#e2e6d5] leading-relaxed">
                  Manage ordering mode, open/close weekly orders, and add or edit recipes in Firestore.
                </p>
              </div>
            </div>
            <Button
              asChild
              className="rounded-xl h-11 px-6 font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
            >
              <Link href="/admin">
                <span>Open Admin Studio</span>
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        )}

        {/* Order History */}
        {orderingFeatureEnabled && (
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <History className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="text-2xl font-headline font-medium text-foreground">
                    Order History
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Review your past weekly orders and reorder your favorites with one click.
                </p>
              </div>
              <span className="num rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground border border-border">
                {orderHistory.length} {orderHistory.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            {orderHistory.length > 0 ? (
              <div className="space-y-6">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-border bg-background p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-border">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="num font-headline font-medium text-lg text-foreground">
                            {order.id}
                          </h3>
                          <span className="num rounded-md bg-accent px-2.5 py-0.5 text-sm font-bold text-accent-foreground">
                            ${Number(order.total).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Ordered on{" "}
                          {new Date(order.date).toLocaleDateString('en-AU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleReorder(order.items)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                        Reorder All
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-card rounded-xl border border-border"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 shrink-0 rounded-lg object-cover border border-border"
                              data-ai-hint={item.imageHint}
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {item.name}
                              </p>
                              <p className="num text-xs text-muted-foreground">
                                Qty: {item.quantity || 1} &times; ${Number(item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <Button asChild variant="ghost" size="sm" className="rounded-lg shrink-0">
                            <Link href={`/recipe/${item.id}`}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background py-12 px-4 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary border border-border">
                  <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-headline text-lg font-medium text-foreground">
                    No past orders yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Once you place an order from our weekly menu, it will appear here for easy reordering.
                  </p>
                </div>
                <Button asChild className="mt-2 rounded-xl bg-primary text-primary-foreground">
                  <Link href="/#recipes">
                    <UtensilsCrossed className="mr-2 h-4 w-4" aria-hidden="true" />
                    Explore This Week&apos;s Curries
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
