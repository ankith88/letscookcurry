"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  createRecipe,
  updateRecipe,
  uploadRecipeImage,
  type RecipeInput,
} from '@/lib/recipes';
import type { Recipe } from '@/lib/types';
import {
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';

const DEFAULT_FALLBACK_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/main_image-v2-2048%20(1).jpg?alt=media&token=c8e72a75-16ec-4f4e-91d0-aa0c8835e9f7';

interface RecipeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecipe: Recipe | null;
  onSaved: (savedRecipe: Recipe, isNew: boolean) => void;
}

export function RecipeFormDialog({
  open,
  onOpenChange,
  editingRecipe,
  onSaved,
}: RecipeFormDialogProps) {
  const { toast } = useToast();

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(DEFAULT_FALLBACK_IMAGE);
  const [imageHint, setImageHint] = useState('');
  const [price, setPrice] = useState('18.50');
  const [region, setRegion] = useState<Recipe['region']>('North');
  const [diet, setDiet] = useState<Recipe['diet']>('Veg');
  const [spice, setSpice] = useState<Recipe['spice']>('medium');
  const [isWeekly, setIsWeekly] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);

  useEffect(() => {
    if (editingRecipe) {
      setName(editingRecipe.name || '');
      setDescription(editingRecipe.description || '');
      setLongDescription(editingRecipe.longDescription || editingRecipe.description || '');
      setImageUrl(editingRecipe.imageUrl || DEFAULT_FALLBACK_IMAGE);
      setImageHint(editingRecipe.imageHint || '');
      setPrice(String(editingRecipe.price ?? 18.5));
      setRegion(editingRecipe.region || 'North');
      setDiet(editingRecipe.diet || 'Veg');
      setSpice(editingRecipe.spice || 'medium');
      setIsWeekly(Boolean(editingRecipe.isWeekly));
      setIsFeatured(Boolean(editingRecipe.isFeatured));
      setIngredients(
        editingRecipe.ingredients?.length ? [...editingRecipe.ingredients] : ['']
      );
      setInstructions(
        editingRecipe.instructions?.length ? [...editingRecipe.instructions] : ['']
      );
      setAiPrompt('');
    } else {
      setName('');
      setDescription('');
      setLongDescription('');
      setImageUrl(DEFAULT_FALLBACK_IMAGE);
      setImageHint('');
      setPrice('18.50');
      setRegion('North');
      setDiet('Veg');
      setSpice('medium');
      setIsWeekly(false);
      setIsFeatured(false);
      setIngredients(['']);
      setInstructions(['']);
      setAiPrompt('');
    }
  }, [editingRecipe, open]);

  const handleAiAutofill = async () => {
    const queryText = aiPrompt.trim() || name.trim();
    if (!queryText) {
      toast({
        title: 'Enter a dish name or notes first',
        description: 'Type e.g. "Malabar Prawn Curry" or rough kitchen notes to autofill with AI.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/admin/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate recipe draft.');
      }

      const draft = data.draft;
      setName(draft.name || queryText);
      setDescription(draft.description || '');
      setLongDescription(draft.longDescription || draft.description || '');
      setImageHint(draft.imageHint || '');
      setPrice(String(draft.price ?? 18.5));
      setRegion(draft.region || 'North');
      setDiet(draft.diet || 'Veg');
      setSpice(draft.spice || 'medium');
      setIngredients(draft.ingredients?.length ? draft.ingredients : ['']);
      setInstructions(draft.instructions?.length ? draft.instructions : ['']);

      toast({
        title: 'Recipe Draft Generated!',
        description: `Filled in ingredients, steps, and details for "${draft.name}". Review and click Save.`,
      });
    } catch (error: any) {
      toast({
        title: 'AI Autofill Error',
        description: error.message || 'Could not autofill recipe.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const downloadUrl = await uploadRecipeImage(file);
      setImageUrl(downloadUrl);
      toast({
        title: 'Photo Uploaded',
        description: 'Recipe image uploaded to Firebase Storage.',
      });
    } catch (error: any) {
      console.error('Image upload failed:', error);
      toast({
        title: 'Image Upload Failed',
        description:
          error.message || 'Could not upload image. You can also paste an image URL directly.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const updateListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    // Support pasting multiple lines at once
    if (value.includes('\n')) {
      const lines = value
        .split('\n')
        .map((l) => l.replace(/^\d+[\.\)]\s*|^[-•]\s*/, '').trim())
        .filter(Boolean);
      if (lines.length > 1) {
        const next = [...list];
        next.splice(index, 1, ...lines);
        setList(next);
        return;
      }
    }
    const next = [...list];
    next[index] = value;
    setList(next);
  };

  const addListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList([...list, '']);
  };

  const removeListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    if (list.length <= 1) {
      setList(['']);
      return;
    }
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    const cleanInstructions = instructions.map((s) => s.trim()).filter(Boolean);

    if (!name.trim() || !description.trim()) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please provide at least a dish name and short description.',
        variant: 'destructive',
      });
      return;
    }

    if (cleanIngredients.length === 0 || cleanInstructions.length === 0) {
      toast({
        title: 'Ingredients & Instructions Required',
        description: 'Please include at least one ingredient and one cooking step.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: RecipeInput = {
        name: name.trim(),
        description: description.trim(),
        longDescription: (longDescription || description).trim(),
        imageUrl: imageUrl.trim() || DEFAULT_FALLBACK_IMAGE,
        imageHint: (imageHint || name.toLowerCase()).trim(),
        rating: editingRecipe?.rating ?? 5,
        reviews: editingRecipe?.reviews ?? 0,
        ingredients: cleanIngredients,
        instructions: cleanInstructions,
        price: Number(price) || 18.5,
        region,
        diet,
        spice,
        isWeekly,
        isFeatured,
      };

      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, payload);
        const updated: Recipe = { ...payload, id: editingRecipe.id };
        toast({
          title: 'Recipe Updated',
          description: `"${updated.name}" has been saved to Firestore.`,
        });
        onSaved(updated, false);
      } else {
        const created = await createRecipe(payload);
        toast({
          title: 'Recipe Added to Website!',
          description: `"${created.name}" is now live in the database.`,
        });
        onSaved(created, true);
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      toast({
        title: 'Failed to Save Recipe',
        description: error.message || 'Check your Firestore permissions and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/70">
          <DialogTitle className="font-headline text-2xl">
            {editingRecipe ? `Edit Recipe: ${editingRecipe.name}` : 'Add New Recipe to Database'}
          </DialogTitle>
          <DialogDescription>
            Fill out the fields below or use AI Autofill to generate a complete recipe draft in seconds.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] px-6 py-5">
          <form id="recipe-admin-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Genkit AI Autofill Banner */}
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>AI Recipe Autofill (Powered by Gemini &amp; Genkit)</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Chettinad Pepper Chicken, or paste rough ingredient notes..."
                  className="bg-background"
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isGeneratingAi}
                  onClick={handleAiAutofill}
                  className="shrink-0 font-semibold"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Core Identity & Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 space-y-2">
                <Label htmlFor="recipe-name">Dish Name *</Label>
                <Input
                  id="recipe-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Classic Butter Chicken (Murgh Makhani)"
                />
              </div>
              <div className="sm:col-span-4 space-y-2">
                <Label htmlFor="recipe-price">Price (AUD $) *</Label>
                <Input
                  id="recipe-price"
                  type="number"
                  step="0.50"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Region, Diet, Spice & Weekly Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  value={region}
                  onValueChange={(v) => setRegion(v as Recipe['region'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North">North India</SelectItem>
                    <SelectItem value="South">South India</SelectItem>
                    <SelectItem value="West">West India</SelectItem>
                    <SelectItem value="East">East India</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dietary Type</Label>
                <Select
                  value={diet}
                  onValueChange={(v) => setDiet(v as Recipe['diet'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Veg">Vegetarian (Veg)</SelectItem>
                    <SelectItem value="Non-Veg">Meat &amp; Poultry (Non-Veg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Spice Level</Label>
                <Select
                  value={spice}
                  onValueChange={(v) => setSpice(v as Recipe['spice'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="very-hot">Very Hot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5 bg-secondary/30">
                <div className="space-y-0.5">
                  <Label htmlFor="recipe-weekly" className="text-xs font-bold cursor-pointer">
                    Weekly Menu
                  </Label>
                  <p className="text-[11px] text-muted-foreground">Feature this week</p>
                </div>
                <Switch
                  id="recipe-weekly"
                  checked={isWeekly}
                  onCheckedChange={setIsWeekly}
                />
              </div>
            </div>

            {/* Hero Featured Recipe Spotlight Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary/5 px-4 py-3">
              <div className="space-y-0.5">
                <Label htmlFor="recipe-featured" className="text-sm font-bold text-foreground cursor-pointer">
                  Set as Homepage Featured Recipe
                </Label>
                <p className="text-xs text-muted-foreground">
                  Highlight this dish in the Featured Recipe spotlight card in the homepage hero section.
                </p>
              </div>
              <Switch
                id="recipe-featured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
              />
            </div>

            {/* Short & Long Descriptions */}
            <div className="space-y-2">
              <Label htmlFor="recipe-desc">Short Card Summary *</Label>
              <Input
                id="recipe-desc"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="1–2 sentence summary shown on recipe cards"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipe-long-desc">Detailed Story &amp; Tasting Notes</Label>
              <Textarea
                id="recipe-long-desc"
                rows={3}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Full description displayed at the top of the recipe detail page..."
              />
            </div>

            {/* Image URL + Firebase Storage Upload */}
            <div className="space-y-3 rounded-xl border border-border/70 p-4 bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Label htmlFor="recipe-image-url">Dish Photo (Upload or Paste URL)</Label>
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary hover:underline">
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Uploading to Firebase Storage...
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      Upload Image File
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingImage}
                    onChange={handleImageFileChange}
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <Input
                    id="recipe-image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://firebasestorage.googleapis.com/..."
                  />
                </div>
                <div className="sm:col-span-4">
                  <Input
                    value={imageHint}
                    onChange={(e) => setImageHint(e.target.value)}
                    placeholder="Image hint (e.g. paneer tikka)"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Ingredients List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-headline font-bold">Ingredients *</Label>
                  <p className="text-xs text-muted-foreground">
                    Tip: You can paste multiple lines at once into any box to auto-split them.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem(ingredients, setIngredients)}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Ingredient
                </Button>
              </div>
              <div className="space-y-2">
                {ingredients.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground w-6 text-right">
                      {idx + 1}.
                    </span>
                    <Input
                      value={item}
                      onChange={(e) =>
                        updateListItem(ingredients, setIngredients, idx, e.target.value)
                      }
                      placeholder="e.g. 500g boneless chicken thighs, cut into bite-sized pieces"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ingredient ${idx + 1}`}
                      onClick={() => removeListItem(ingredients, setIngredients, idx)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-headline font-bold">
                    Step-by-Step Instructions *
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Each row becomes a numbered step on the recipe page.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem(instructions, setInstructions)}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Step
                </Button>
              </div>
              <div className="space-y-2.5">
                {instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="mt-2.5 text-xs font-bold text-primary w-6 text-right">
                      {idx + 1}.
                    </span>
                    <Textarea
                      rows={2}
                      value={step}
                      onChange={(e) =>
                        updateListItem(instructions, setInstructions, idx, e.target.value)
                      }
                      placeholder={`Step ${idx + 1}: Heat ghee in a heavy-bottomed pot over medium heat...`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-1"
                      aria-label={`Remove step ${idx + 1}`}
                      onClick={() => removeListItem(instructions, setInstructions, idx)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border/70 bg-muted/30">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="recipe-admin-form"
            disabled={isSaving || isUploadingImage}
            className="font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving to Firestore...
              </>
            ) : editingRecipe ? (
              'Save Changes'
            ) : (
              'Add Recipe to Website'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

