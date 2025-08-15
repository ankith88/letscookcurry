"use client";

import { useState, useMemo } from 'react';
import type { Recipe } from '@/lib/types';
import { RecipeGrid } from './recipe-grid';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Map, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FilteredRecipeGridProps {
  recipes: Recipe[];
}

export function FilteredRecipeGrid({ recipes }: FilteredRecipeGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('all');
  const [diet, setDiet] = useState('all');

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const nameMatch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      const regionMatch = region === 'all' || recipe.region === region;
      const dietMatch = diet === 'all' || recipe.diet === diet;
      return nameMatch && regionMatch && dietMatch;
    });
  }, [recipes, searchTerm, region, diet]);

  return (
    <div>
        <Card className="mb-12 bg-muted/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div>
                    <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <Map className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filter by region" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Regions</SelectItem>
                            <SelectItem value="North">North</SelectItem>
                            <SelectItem value="South">South</SelectItem>
                            <SelectItem value="East">East</SelectItem>
                            <SelectItem value="West">West</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select value={diet} onValueChange={setDiet}>
                         <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <Leaf className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filter by diet" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Diets</SelectItem>
                            <SelectItem value="Veg">Veg</SelectItem>
                            <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
      </Card>

      {filteredRecipes.length > 0 ? (
        <RecipeGrid recipes={filteredRecipes} cardType="view" />
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No recipes match your filters.</p>
        </div>
      )}
    </div>
  );
}