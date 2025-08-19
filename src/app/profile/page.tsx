
"use client"

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { History, LogOut, PlusCircle, User, UserCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const auth = getAuth(app);

export default function ProfilePage() {
    const { addItem } = useCart();
    const { toast } = useToast();
    const router = useRouter();
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // If no user is signed in, redirect to login page.
                router.push('/login');
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [router]);

    // In a real app, this would fetch from a database.
    // We'll keep it client-side for now.
    useEffect(() => {
        // Simulating a fetch
        setOrderHistory([]);
    }, []);

    const handleReorder = (orderItems: any[]) => {
        orderItems.forEach(item => addItem(item));
        toast({
            title: "Items Added!",
            description: "Items from your previous order have been added to your cart.",
        })
    }

    const handleSignOut = async () => {
        await auth.signOut();
        toast({
            title: "Signed Out",
            description: "You have been successfully signed out.",
        });
        router.push('/');
    }

    if (loading) {
        return (
             <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-12">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-10 w-28" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <History className="h-6 w-6 text-primary"/>
                                <CardTitle className="text-2xl font-headline">Order History</CardTitle>
                            </div>
                             <CardDescription>Review your past orders and quickly reorder your favorites.</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <p className="text-muted-foreground">You have no past orders.</p>
                         </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
    
    if (!user) {
        // This is a fallback, but the onAuthStateChanged should have already redirected.
        return null; 
    }

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-12">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <UserCircle className="h-12 w-12 text-muted-foreground"/>
                            <div>
                                <CardTitle className="text-2xl font-headline">{user.displayName || "Valued Customer"}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Button variant="outline">Edit Profile</Button>
                        <Button variant="destructive" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4"/>
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <History className="h-6 w-6 text-primary"/>
                            <CardTitle className="text-2xl font-headline">Order History</CardTitle>
                        </div>
                        <CardDescription>Review your past orders and quickly reorder your favorites.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {orderHistory.length > 0 ? orderHistory.map((order) => (
                            <div key={order.id}>
                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{order.id}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="secondary" 
                                        className="mt-4 md:mt-0"
                                        onClick={() => handleReorder(order.items)}
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Reorder All
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                                            <div className="flex items-center gap-4">
                                                <Image 
                                                    src={item.imageUrl} 
                                                    alt={item.name} 
                                                    width={48} 
                                                    height={48} 
                                                    className="rounded-md object-cover"
                                                    data-ai-hint={item.imageHint}
                                                />
                                                <p>{item.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="mt-8"/>
                            </div>
                        )) : (
                            <p className="text-muted-foreground">You have no past orders.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
