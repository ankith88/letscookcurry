"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Ban,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/context/site-settings-context';
import {
  deleteRecipe,
  getAllRecipes,
  toggleRecipeWeekly,
} from '@/lib/recipes';
import { getConfiguredAdminEmails } from '@/lib/admin';
import type { OrderWindowMode, Recipe } from '@/lib/types';
import { RecipeFormDialog } from '@/components/admin/recipe-form-dialog';
import { BulkImportDialog } from '@/components/admin/bulk-import-dialog';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const { toast } = useToast();
  const {
    settings,
    orderingFeatureEnabled,
    orderWindowMode,
    isOrdersOpen,
    loading: settingsLoading,
    authLoading,
    currentUser,
    isAdmin,
    canBootstrapAdmin,
    saveSettings,
  } = useSiteSettings();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'weekly'>('all');

  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const loadRecipes = useCallback(async () => {
    setRecipesLoading(true);
    try {
      const list = await getAllRecipes();
      setRecipes(list);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setRecipesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin || canBootstrapAdmin) {
      loadRecipes();
    }
  }, [isAdmin, canBootstrapAdmin, loadRecipes]);

  const handleToggleOrderingProcess = async (enabled: boolean) => {
    setIsSavingSettings(true);
    try {
      await saveSettings({ orderingFeatureEnabled: enabled });
      toast({
        title: enabled
          ? 'Ordering Process Activated'
          : 'Ordering Process Inactivated (Recipe-Only Mode)',
        description: enabled
          ? 'All weekly ordering sections, schedules, and shopping cart features are now visible on the website.'
          : 'All ordering sections, schedules, prices, and cart buttons are now hidden. The website is in Recipe Showcase mode.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Update Setting',
        description: error.message || 'Could not update ordering process status.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleChangeOrderWindowMode = async (mode: OrderWindowMode) => {
    setIsSavingSettings(true);
    try {
      await saveSettings({ orderWindowMode: mode });
      const labels: Record<OrderWindowMode, string> = {
        open: 'Orders Turned ON (Manually Open)',
        closed: 'Orders Turned OFF (Manually Closed)',
        auto: 'Orders Set to Automatic Schedule (Mon–Thu)',
      };
      toast({
        title: labels[mode],
        description: 'Storefront ordering buttons and cart checkout have been updated immediately.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Update Order Window',
        description: error.message || 'Could not update order window mode.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleClaimAdmin = async () => {
    if (!currentUser?.email) return;
    setIsSavingSettings(true);
    try {
      const normalized = currentUser.email.trim().toLowerCase();
      await saveSettings({
        adminEmails: Array.from(new Set([...(settings.adminEmails || []), normalized])),
      });
      toast({
        title: 'Admin Access Activated',
        description: `${normalized} has been added to the Admin allowlist.`,
      });
    } catch (error: any) {
      toast({
        title: 'Could Not Claim Admin Access',
        description: error.message || 'Check Firestore rules and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;

    setIsSavingSettings(true);
    try {
      const updatedList = Array.from(new Set([...(settings.adminEmails || []), email]));
      await saveSettings({ adminEmails: updatedList });
      setNewAdminEmail('');
      toast({
        title: 'Admin Email Added',
        description: `${email} now has access to Admin Studio.`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Add Admin',
        description: error.message || 'Could not update admin allowlist.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleRemoveAdminEmail = async (emailToRemove: string) => {
    const remaining = (settings.adminEmails || []).filter(
      (e) => e.toLowerCase() !== emailToRemove.toLowerCase()
    );
    setIsSavingSettings(true);
    try {
      await saveSettings({ adminEmails: remaining });
      toast({
        title: 'Admin Email Removed',
        description: `${emailToRemove} was removed from the Firestore admin list.`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Remove Email',
        description: error.message || 'Could not update admin allowlist.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleToggleWeekly = async (recipe: Recipe, checked: boolean) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === recipe.id ? { ...r, isWeekly: checked } : r))
    );
    try {
      await toggleRecipeWeekly(recipe.id, checked);
      toast({
        title: checked ? 'Added to Weekly Menu' : 'Removed from Weekly Menu',
        description: `"${recipe.name}" ${
          checked ? 'is now featured in This Week’s Curries.' : 'was removed from This Week’s Curries.'
        }`,
      });
    } catch (error: any) {
      setRecipes((prev) =>
        prev.map((r) => (r.id === recipe.id ? { ...r, isWeekly: !checked } : r))
      );
      toast({
        title: 'Update Failed',
        description: error.message || 'Could not update weekly status.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!recipeToDelete) return;
    const target = recipeToDelete;
    setRecipeToDelete(null);

    try {
      await deleteRecipe(target.id);
      setRecipes((prev) => prev.filter((r) => r.id !== target.id));
      toast({
        title: 'Recipe Deleted',
        description: `"${target.name}" has been removed from Firestore.`,
      });
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Could not delete recipe.',
        variant: 'destructive',
      });
    }
  };

  const handleRecipeSaved = (savedRecipe: Recipe, isNew: boolean) => {
    if (isNew) {
      setRecipes((prev) => [savedRecipe, ...prev]);
    } else {
      setRecipes((prev) =>
        prev.map((r) => (r.id === savedRecipe.id ? savedRecipe : r))
      );
    }
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (filterMode === 'weekly' && !r.isWeekly) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q)
      );
    });
  }, [recipes, filterMode, searchQuery]);

  const weeklyCount = useMemo(
    () => recipes.filter((r) => r.isWeekly).length,
    [recipes]
  );

  const configuredAdmins = getConfiguredAdminEmails(settings);

  if (authLoading || settingsLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="font-medium">Loading Admin Studio...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="border-border/80 shadow-md">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="font-headline text-2xl">Admin Sign-In Required</CardTitle>
            <CardDescription>
              Sign in with your authorized admin email address to manage ordering and recipes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/login">Sign In to Continue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin && !canBootstrapAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <Card className="border-border/80 shadow-md">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="font-headline text-2xl">Admin Access Restricted</CardTitle>
            <CardDescription>
              You are signed in as <strong>{currentUser.email}</strong>, which is not on the admin allowlist.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/profile">Switch Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10 max-w-6xl">
      {/* Top Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>Let&apos;s Cook Curry — Admin Control Center</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">
            Storefront, Ordering &amp; Recipe Studio
          </h1>
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground">{currentUser.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Status Pill */}
          <div className="rounded-xl border border-border bg-card px-4 py-2.5 flex items-center gap-2.5 shadow-sm">
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                !orderingFeatureEnabled
                  ? 'bg-sky-500'
                  : isOrdersOpen
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              )}
            />
            <div className="text-xs">
              <p className="text-muted-foreground">Live Website Mode</p>
              <p className="font-bold text-foreground">
                {!orderingFeatureEnabled
                  ? 'Recipe Showcase Only (Ordering Hidden)'
                  : isOrdersOpen
                  ? `Orders Open (${orderWindowMode === 'open' ? 'Manual ON' : 'Auto Mon–Thu'})`
                  : `Orders Closed (${orderWindowMode === 'closed' ? 'Manual OFF' : 'Auto Fri–Sun'})`}
              </p>
            </div>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <Eye className="mr-2 h-4 w-4" />
              View Live Website
            </Link>
          </Button>
        </div>
      </div>

      {/* First-Time Admin Bootstrap Banner */}
      {canBootstrapAdmin && !isAdmin && (
        <Card className="border-primary bg-primary/5 shadow-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-headline text-lg font-bold text-foreground">
                Lock In Your Admin Email Allowlist
              </h2>
              <p className="text-sm text-muted-foreground">
                No admin emails are saved in Firestore yet. Click below to register{' '}
                <strong>{currentUser.email}</strong> as the primary admin.
              </p>
            </div>
            <Button onClick={handleClaimAdmin} disabled={isSavingSettings} className="shrink-0 font-semibold">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Register {currentUser.email} as Admin
            </Button>
          </CardContent>
        </Card>
      )}

      {/* SECTION 1: Storefront & Ordering Controls */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle className="font-headline text-2xl">
              1. Ordering Process &amp; Order Window Controls
            </CardTitle>
          </div>
          <CardDescription>
            Control whether the website shows ordering features or acts purely as a recipe showcase, and turn weekly order acceptance on or off at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle: Activate / Inactivate Ordering Process */}
          <div className="rounded-2xl border-2 border-border p-5 sm:p-6 bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <Badge variant={orderingFeatureEnabled ? 'default' : 'secondary'}>
                  {orderingFeatureEnabled ? 'ORDERING PROCESS ACTIVE' : 'ORDERING PROCESS INACTIVE'}
                </Badge>
              </div>
              <h3 className="font-headline text-xl font-bold text-foreground">
                {orderingFeatureEnabled
                  ? 'Ordering Process is Active (Full Storefront Mode)'
                  : 'Ordering Process is Inactive (Recipe-Only Website Mode)'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {orderingFeatureEnabled
                  ? 'Visitors can see the 3-step delivery schedule, the 6-day kitchen board, "This Week’s Curries", dish prices, the shopping cart, and their order history.'
                  : 'All sections and text mentioning ordering, delivery schedules, prices, cart buttons, and order history are completely hidden. The website is currently a pure recipe discovery site.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center bg-background px-4 py-3 rounded-xl border border-border">
              <Label htmlFor="master-ordering-switch" className="font-semibold text-sm cursor-pointer">
                {orderingFeatureEnabled ? 'Ordering Active' : 'Ordering Inactive'}
              </Label>
              <Switch
                id="master-ordering-switch"
                checked={orderingFeatureEnabled}
                disabled={isSavingSettings}
                onCheckedChange={handleToggleOrderingProcess}
              />
            </div>
          </div>

          {/* Sub-Control: Turn Orders On / Off / Auto Schedule */}
          <div
            className={cn(
              'space-y-4 transition-opacity',
              !orderingFeatureEnabled && 'opacity-50 pointer-events-none'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-headline text-lg font-bold text-foreground">
                  Turn Orders On or Off
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  When the ordering process is active, choose whether customers can add dishes to their cart and place orders right now.
                </p>
              </div>
              {!orderingFeatureEnabled && (
                <Badge variant="outline">Enable Ordering Process above to configure</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option A: Manual Turn Orders ON */}
              <button
                type="button"
                disabled={!orderingFeatureEnabled || isSavingSettings}
                onClick={() => handleChangeOrderWindowMode('open')}
                className={cn(
                  'text-left rounded-xl border-2 p-4 transition-all flex flex-col justify-between gap-3',
                  orderWindowMode === 'open'
                    ? 'border-emerald-600 bg-emerald-500/10 shadow-sm'
                    : 'border-border bg-card hover:border-primary/50'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Turn Orders ON
                  </span>
                  {orderWindowMode === 'open' && (
                    <Badge className="bg-emerald-600 text-white">Selected</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Manually open ordering immediately, even if today is Friday, Saturday, or Sunday.
                </p>
              </button>

              {/* Option B: Manual Turn Orders OFF */}
              <button
                type="button"
                disabled={!orderingFeatureEnabled || isSavingSettings}
                onClick={() => handleChangeOrderWindowMode('closed')}
                className={cn(
                  'text-left rounded-xl border-2 p-4 transition-all flex flex-col justify-between gap-3',
                  orderWindowMode === 'closed'
                    ? 'border-amber-600 bg-amber-500/10 shadow-sm'
                    : 'border-border bg-card hover:border-primary/50'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 dark:text-amber-400">
                    <Ban className="h-4 w-4" />
                    Turn Orders OFF
                  </span>
                  {orderWindowMode === 'closed' && (
                    <Badge className="bg-amber-600 text-white">Selected</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pause order placement immediately while keeping weekly curries and schedules visible on the page.
                </p>
              </button>

              {/* Option C: Automatic Mon-Thu Schedule */}
              <button
                type="button"
                disabled={!orderingFeatureEnabled || isSavingSettings}
                onClick={() => handleChangeOrderWindowMode('auto')}
                className={cn(
                  'text-left rounded-xl border-2 p-4 transition-all flex flex-col justify-between gap-3',
                  orderWindowMode === 'auto'
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border bg-card hover:border-primary/50'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    <CalendarClock className="h-4 w-4" />
                    Auto Schedule (Mon–Thu)
                  </span>
                  {orderWindowMode === 'auto' && <Badge>Selected</Badge>}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Automatically opens ordering Monday through Thursday and closes Friday through Sunday.
                </p>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Recipe Database Manager */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="font-headline text-2xl">
                  2. Recipe Database Manager ({recipes.length} Total)
                </CardTitle>
              </div>
              <CardDescription>
                Add new recipes to Firestore via form, AI autofill, or bulk import. Toggle <strong>Weekly Menu</strong> on any recipe to feature it in &ldquo;This Week&apos;s Curries&rdquo;.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBulkDialogOpen(true)}
                className="font-semibold"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Bulk Import (JSON/CSV)
              </Button>
              <Button
                onClick={() => {
                  setEditingRecipe(null);
                  setIsRecipeDialogOpen(true);
                }}
                className="font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Recipe
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search & Weekly Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes by name, region, or description..."
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={filterMode === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterMode('all')}
              >
                All Recipes ({recipes.length})
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filterMode === 'weekly' ? 'default' : 'outline'}
                onClick={() => setFilterMode('weekly')}
              >
                Weekly Menu ({weeklyCount})
              </Button>
            </div>
          </div>

          {/* Recipes List */}
          {recipesLoading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Loading recipes from Firestore...</span>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 px-4 text-center space-y-3">
              <p className="font-headline text-lg font-bold">No matching recipes found</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Click <strong>Add New Recipe</strong> to create a dish with AI Autofill, or use <strong>Bulk Import</strong> to upload multiple recipes at once.
              </p>
              <Button
                onClick={() => {
                  setEditingRecipe(null);
                  setIsRecipeDialogOpen(true);
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Create First Recipe
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 bg-card hover:bg-muted/25 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-lg object-cover shrink-0 border border-border"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/recipe/${recipe.id}`}
                          className="font-headline text-lg font-bold hover:text-primary transition-colors truncate"
                        >
                          {recipe.name}
                        </Link>
                        <span className="num text-sm font-bold text-primary">
                          ${Number(recipe.price || 0).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {recipe.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <Badge variant="outline" className="text-[11px]">
                          {recipe.region}
                        </Badge>
                        <Badge variant="outline" className="text-[11px]">
                          {recipe.diet}
                        </Badge>
                        <Badge variant="secondary" className="text-[11px]">
                          Spice: {recipe.spice}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          • {recipe.ingredients?.length || 0} ingredients •{' '}
                          {recipe.instructions?.length || 0} steps
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center gap-2 bg-secondary/40 px-3 py-1.5 rounded-lg border border-border/70">
                      <Label
                        htmlFor={`weekly-switch-${recipe.id}`}
                        className="text-xs font-semibold cursor-pointer"
                      >
                        Weekly Menu
                      </Label>
                      <Switch
                        id={`weekly-switch-${recipe.id}`}
                        checked={Boolean(recipe.isWeekly)}
                        onCheckedChange={(checked) => handleToggleWeekly(recipe, checked)}
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingRecipe(recipe);
                          setIsRecipeDialogOpen(true);
                        }}
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Delete ${recipe.name}`}
                        onClick={() => setRecipeToDelete(recipe)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 3: Admin Email Allowlist Management */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle className="font-headline text-2xl">
              3. Authorized Admin Emails
            </CardTitle>
          </div>
          <CardDescription>
            Users signed in via Firebase Auth with any of the email addresses below can access <code>/admin</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddAdminEmail} className="flex flex-col sm:flex-row gap-2 max-w-lg">
            <Input
              type="email"
              required
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="Add admin email (e.g. tanvi@example.com)"
            />
            <Button type="submit" disabled={isSavingSettings} className="shrink-0 font-semibold">
              Add Admin Email
            </Button>
          </form>

          <Separator />

          <div className="flex flex-wrap gap-2">
            {configuredAdmins.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No admin emails saved yet. Add your email above to restrict <code>/admin</code> solely to allowlisted accounts.
              </p>
            ) : (
              configuredAdmins.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="px-3 py-1.5 text-xs font-medium flex items-center gap-2"
                >
                  <span>{email}</span>
                  {(settings.adminEmails || []).includes(email) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAdminEmail(email)}
                      aria-label={`Remove ${email}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Recipe Dialog */}
      <RecipeFormDialog
        open={isRecipeDialogOpen}
        onOpenChange={setIsRecipeDialogOpen}
        editingRecipe={editingRecipe}
        onSaved={handleRecipeSaved}
      />

      {/* Bulk Import Dialog */}
      <BulkImportDialog
        open={isBulkDialogOpen}
        onOpenChange={setIsBulkDialogOpen}
        onImported={loadRecipes}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(recipeToDelete)}
        onOpenChange={(open) => !open && setRecipeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-xl">
              Delete &ldquo;{recipeToDelete?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this recipe from Firestore and the website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Recipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

