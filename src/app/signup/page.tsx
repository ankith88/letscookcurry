
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail } from 'lucide-react';
import { doSendSignInLinkToEmail } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await doSendSignInLinkToEmail(email);
      toast({
        title: "Check your email",
        description: "A sign-in link has been sent to your email address to create your account.",
      });
      // Redirect to a confirmation page or the login page to await link click
      // router.push('/login'); 
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


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Enter your email to get started. We'll send you a secure link to sign in.</CardDescription>
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
              {isSubmitting ? 'Sending...' : 'Send Sign-Up Link'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-primary">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
