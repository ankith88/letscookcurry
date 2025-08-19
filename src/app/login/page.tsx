
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail } from 'lucide-react';
import { doSendSignInLinkToEmail, handleSignInWithEmailLink } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyLink = async () => {
      try {
        const user = await handleSignInWithEmailLink();
        if (user) {
          toast({
            title: "Signed In!",
            description: "You have been successfully signed in.",
          });
          router.push('/profile');
        } else {
          setIsVerifying(false);
        }
      } catch (error: any) {
        console.error("Sign In Error:", error);
        toast({
          title: "Sign In Failed",
          description: error.message || "Could not complete sign-in. Please try sending a new link.",
          variant: "destructive",
        });
        setIsVerifying(false);
      }
    };
    verifyLink();
  }, [router, toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await doSendSignInLinkToEmail(email);
      toast({
        title: "Check your email",
        description: "A sign-in link has been sent to your email address.",
      });
    } catch (error: any) {
      console.error("Authentication Error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Verifying...</CardTitle>
                    <CardDescription>Please wait while we verify your sign-in link.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome!</CardTitle>
          <CardDescription>Enter your email to receive a magic sign-in link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Sign-In Link'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            No account yet? It will be created automatically.{" "}
            <Link href="/signup" className="underline hover:text-primary">
              Learn more
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
