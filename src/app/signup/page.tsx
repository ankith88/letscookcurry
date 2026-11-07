
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CheckCircle2, Mail, RotateCcw } from 'lucide-react';
import { doSendSignInLinkToEmail } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function SignupPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await doSendSignInLinkToEmail(email);
      setEmailSent(true);
      toast({
        title: "Check your email",
        description: "A magic link has been sent to your email address to create your account.",
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
                We&apos;ve sent an account activation link to{" "}
                <span className="font-semibold text-foreground">{email}</span>. Click the link in your email to finish creating your account.
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
                {isSubmitting ? "Resending..." : "Resend Activation Link"}
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
              <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
              <CardDescription>
                Enter your email to get started. We&apos;ll send you a secure magic link to sign in—no password required.
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
                  {isSubmitting ? "Sending Link..." : "Send Sign-Up Link"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Log in
                </Link>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
