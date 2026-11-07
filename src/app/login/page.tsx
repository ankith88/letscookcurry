
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CheckCircle2, Loader2, Mail, RotateCcw } from 'lucide-react';
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
  const [emailSent, setEmailSent] = useState(false);

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
      setEmailSent(true);
      toast({
        title: "Check your email",
        description: "A magic sign-in link has been sent to your email address.",
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
        <Card className="w-full max-w-md mx-auto border-border/70 shadow-md">
          <CardHeader className="text-center space-y-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" aria-hidden="true" />
            <CardTitle className="text-2xl font-headline">Verifying...</CardTitle>
            <CardDescription>Please wait while we verify your sign-in session.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
      <Card className="w-full max-w-md mx-auto border-border/70 shadow-md">
        {emailSent ? (
          <>
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl font-headline">Check Your Inbox</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                We&apos;ve sent a magic sign-in link to{" "}
                <span className="font-semibold text-foreground">{email}</span>. Click the link in your email to sign in instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                {isSubmitting ? "Resending..." : "Resend Magic Link"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setEmailSent(false)}
              >
                Use a different email address
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
              <CardDescription>
                Enter your email to receive a passwordless magic sign-in link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? "Sending Link..." : "Send Sign-In Link"}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                No account yet? It will be created automatically.{" "}
                <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Learn more
                </Link>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
