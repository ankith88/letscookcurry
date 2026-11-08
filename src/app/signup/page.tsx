"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CheckCircle2, Flame, Mail, RotateCcw, UtensilsCrossed } from 'lucide-react';
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
    <section data-enter className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Left 5 Columns: Curry-Leaf Botanical Olive Panel */}
          <div className="enter-1 lg:col-span-5 bg-[#38450f] text-[#fcf8ef] p-8 sm:p-10 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#2d380b] border border-[#fcf8ef]/15 px-3 py-1 text-xs font-medium text-[#f7a832]">
                <UtensilsCrossed className="h-3.5 w-3.5 text-[#f7a832]" aria-hidden="true" />
                <span>Let&apos;s Cook Curry</span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl font-medium tracking-tight text-[#fcf8ef] leading-[1.06]">
                From Our Kitchen to Yours
              </h1>
              <p className="text-sm text-[#e2e6d5] leading-relaxed">
                Create your account to order from our weekly curry menu, save your order history, and rate recipes.
              </p>
            </div>

            <div className="border-t border-[#fcf8ef]/15 pt-5 space-y-2 text-xs text-[#d4d9c1]">
              <p className="font-semibold text-[#f7a832] flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-[#f7a832]" aria-hidden="true" />
                Passwordless Setup
              </p>
              <p className="leading-relaxed">
                Just enter your email and click the activation link we send you—no password required.
              </p>
            </div>
          </div>

          {/* Right 7 Columns: Form */}
          <div className="enter-2 lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            {emailSent ? (
              <div className="space-y-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-headline font-medium text-foreground">
                    Check Your Inbox
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    We&apos;ve sent an account activation link to{" "}
                    <span className="font-semibold text-foreground">{email}</span>. Click the link in your email to finish creating your account.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl h-11 bg-background border-border"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                    {isSubmitting ? "Resending..." : "Resend Activation Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl h-11 text-muted-foreground"
                    onClick={() => setEmailSent(false)}
                  >
                    Use a different email address
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-headline font-medium text-foreground">
                    Create an Account
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your email to get started. We&apos;ll send you a secure magic link to sign in—no password required.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                        className="pl-10 h-11 rounded-xl bg-background border-border"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending Link..." : "Send Sign-Up Link"}
                  </Button>
                </form>

                <div className="pt-4 border-t border-border text-sm text-muted-foreground flex items-center justify-between gap-2">
                  <span>Already have an account?</span>
                  <Link
                    href="/login"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
