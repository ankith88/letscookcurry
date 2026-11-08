"use client";

import { useState, useMemo } from 'react';
import type { Recipe } from '@/lib/types';
import { RecipeGrid } from './recipe-grid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Map, Leaf, Flame, RotateCcw, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilteredRecipeGridProps {
  recipes: Recipe[];
}

const REGION_OPTIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'North', label: 'North India' },
  { value: 'South', label: 'South India' },
  { value: 'East', label: 'East India' },
  { value: 'West', label: 'West India' },
];

const DIET_OPTIONS = [
  { value: 'all', label: 'All Diets' },
  { value: 'Veg', label: 'Vegetarian' },
  { value: 'Non-Veg', label: 'Meat & Poultry' },
];

export function FilteredRecipeGrid({ recipes }: FilteredRecipeGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('all');
  const [diet, setDiet] = useState('all');
  const [spice, setSpice] = useState('all');

  const hasActiveFilters =
    searchTerm.trim() !== '' || region !== 'all' || diet !== 'all' || spice !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setRegion('all');
    setDiet('all');
    setSpice('all');
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const nameMatch =
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const regionMatch = region === 'all' || recipe.region === region;
      const dietMatch = diet === 'all' || recipe.diet === diet;
      const spiceMatch = spice === 'all' || recipe.spice === spice;
      return nameMatch && regionMatch && dietMatch && spiceMatch;
    });
  }, [recipes, searchTerm, region, diet, spice]);

  return (
    <div>
      <div className="mb-10 rounded-2xl border border-border/80 bg-secondary/35 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick region filter">
            {REGION_OPTIONS.map((opt) => {
              const active = region === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRegion(opt.value)}
                  aria-pressed={active}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-background/80 text-foreground/80 hover:bg-background hover:text-foreground border border-border/70'
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick dietary filter">
            {DIET_OPTIONS.map((opt) => {
              const active = diet === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDiet(opt.value)}
                  aria-pressed={active}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors',
                    active
                      ? 'bg-leaf text-leaf-ink shadow-sm'
                      : 'bg-background/80 text-foreground/80 hover:bg-background hover:text-foreground border border-border/70'
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label="Search recipes by name or description"
              placeholder="Search curries by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background rounded-xl"
            />
          </div>
          <div>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger aria-label="Filter by region" className="bg-background rounded-xl">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <SelectValue placeholder="Filter by region" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="North">North India</SelectItem>
                <SelectItem value="South">South India</SelectItem>
                <SelectItem value="East">East India</SelectItem>
                <SelectItem value="West">West India</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={diet} onValueChange={setDiet}>
              <SelectTrigger aria-label="Filter by dietary preference" className="bg-background rounded-xl">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <SelectValue placeholder="Filter by diet" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Diets</SelectItem>
                <SelectItem value="Veg">Vegetarian</SelectItem>
                <SelectItem value="Non-Veg">Meat &amp; Poultry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={spice} onValueChange={setSpice}>
              <SelectTrigger aria-label="Filter by spice level" className="bg-background rounded-xl">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <SelectValue placeholder="Filter by spice level" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Spice Levels</SelectItem>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="very-hot">Very Hot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/50 text-sm text-muted-foreground">
          <p aria-live="polite" className="num">
            Showing <span className="font-semibold text-foreground">{filteredRecipes.length}</span> of{' '}
            <span className="font-semibold text-foreground">{recipes.length}</span> recipes
          </p>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-3 text-xs font-semibold text-primary hover:text-primary"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <RecipeGrid recipes={filteredRecipes} cardType="view" />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 text-center py-16 px-4">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UtensilsCrossed className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="font-headline text-xl font-bold text-foreground">
            No matching recipes found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            We couldn&apos;t find any curries matching your current search or filter selection.
          </p>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="mt-5 rounded-xl"
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
