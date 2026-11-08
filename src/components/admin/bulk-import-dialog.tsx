"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { bulkCreateRecipes, type RecipeInput } from '@/lib/recipes';
import { FileSpreadsheet, Loader2, Upload } from 'lucide-react';

const SAMPLE_JSON_TEMPLATE: RecipeInput[] = [
  {
    name: 'Malabar Coconut Prawn Curry',
    description: 'Coastal Kerala prawn curry simmered in roasted coconut, curry leaves, and kokum.',
    longDescription:
      'An aromatic coastal delicacy from Kerala where tiger prawns are gently poached in a silky coconut-coriander gravy tempered with mustard seeds, fenugreek, and fresh curry leaves.',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/lets-cook-curry-xrwg7.firebasestorage.app/o/main_image-v2-2048%20(1).jpg?alt=media&token=c8e72a75-16ec-4f4e-91d0-aa0c8835e9f7',
    imageHint: 'prawn curry',
    rating: 5,
    reviews: 0,
    price: 22.0,
    region: 'South',
    diet: 'Non-Veg',
    spice: 'medium',
    isWeekly: true,
    ingredients: [
      '500g peeled tiger prawns',
      '400ml thick coconut milk',
      '2 sprigs fresh curry leaves',
      '1 tsp black mustard seeds',
      '2 tbsp coconut oil',
    ],
    instructions: [
      'Marinate prawns with turmeric and sea salt for 15 minutes.',
      'Temper mustard seeds, shallots, and curry leaves in warm coconut oil.',
      'Simmer coconut milk with ground spices, then poach prawns for 4–5 minutes until tender.',
    ],
  },
];

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseRecipesFromText(rawText: string): RecipeInput[] {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const parsed = JSON.parse(trimmed);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    return arr.map((item: any) => ({
      name: String(item.name || '').trim(),
      description: String(item.description || '').trim(),
      longDescription: String(item.longDescription || item.description || '').trim(),
      imageUrl: String(item.imageUrl || '').trim(),
      imageHint: String(item.imageHint || item.name || 'indian curry').trim(),
      rating: Number(item.rating) || 5,
      reviews: Number(item.reviews) || 0,
      price: Number(item.price) || 18.5,
      region: (['North', 'South', 'East', 'West'].includes(item.region)
        ? item.region
        : 'North') as RecipeInput['region'],
      diet: (item.diet === 'Non-Veg' ? 'Non-Veg' : 'Veg') as RecipeInput['diet'],
      spice: (['mild', 'medium', 'hot', 'very-hot'].includes(item.spice)
        ? item.spice
        : 'medium') as RecipeInput['spice'],
      isWeekly: Boolean(item.isWeekly),
      ingredients: Array.isArray(item.ingredients)
        ? item.ingredients.map(String)
        : String(item.ingredients || '')
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean),
      instructions: Array.isArray(item.instructions)
        ? item.instructions.map(String)
        : String(item.instructions || '')
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean),
    })).filter((r) => r.name && r.description);
  }

  // CSV format: name,description,longDescription,price,region,diet,spice,isWeekly,imageUrl,ingredients (pipe-separated),instructions (pipe-separated)
  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const recipes: RecipeInput[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });

    if (!row.name) continue;
    recipes.push({
      name: row.name,
      description: row.description || row.name,
      longDescription: row.longdescription || row.description || row.name,
      imageUrl: row.imageurl || '',
      imageHint: row.imagehint || row.name.toLowerCase(),
      rating: 5,
      reviews: 0,
      price: Number(row.price) || 18.5,
      region: (['North', 'South', 'East', 'West'].includes(row.region)
        ? row.region
        : 'North') as RecipeInput['region'],
      diet: (row.diet === 'Non-Veg' ? 'Non-Veg' : 'Veg') as RecipeInput['diet'],
      spice: (['mild', 'medium', 'hot', 'very-hot'].includes(row.spice)
        ? row.spice
        : 'medium') as RecipeInput['spice'],
      isWeekly: row.isweekly?.toLowerCase() === 'true',
      ingredients: (row.ingredients || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean),
      instructions: (row.instructions || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean),
    });
  }

  return recipes;
}

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
}

export function BulkImportDialog({
  open,
  onOpenChange,
  onImported,
}: BulkImportDialogProps) {
  const { toast } = useToast();
  const [rawInput, setRawInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRawInput(text);
    e.target.value = '';
  };

  const handleImport = async () => {
    try {
      const parsed = parseRecipesFromText(rawInput);
      if (parsed.length === 0) {
        toast({
          title: 'No Valid Recipes Found',
          description: 'Check your JSON or CSV format or click "Load Sample JSON" to see an example.',
          variant: 'destructive',
        });
        return;
      }

      setIsImporting(true);
      const count = await bulkCreateRecipes(parsed);
      toast({
        title: 'Bulk Import Complete!',
        description: `Successfully imported ${count} ${count === 1 ? 'recipe' : 'recipes'} into Firestore.`,
      });
      setRawInput('');
      onImported();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Import Failed',
        description: error.message || 'Could not parse or save recipes.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Bulk Import Recipes (JSON or CSV)
          </DialogTitle>
          <DialogDescription>
            Upload a <code>.json</code> or <code>.csv</code> file, or paste an array of recipes below to add multiple dishes to Firestore at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRawInput(JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2))}
              >
                Load Sample JSON
              </Button>
              <Badge variant="secondary" className="text-xs">
                Supports JSON Array or CSV
              </Badge>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary hover:underline">
              <Upload className="h-3.5 w-3.5" />
              Choose .json or .csv file
              <input
                type="file"
                accept=".json,.csv,text/csv,application/json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-import-textarea">Recipe Data (JSON or CSV)</Label>
            <Textarea
              id="bulk-import-textarea"
              rows={12}
              className="font-mono text-xs"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder='Paste JSON array here, e.g. [{"name": "Dal Makhani", "description": "...", "price": 17.5, ...}]'
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={isImporting || !rawInput.trim()}
            className="font-semibold"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing to Firestore...
              </>
            ) : (
              'Import Recipes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

