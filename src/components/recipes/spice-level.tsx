"use client";

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types';

interface SpiceLevelProps {
  spice: Recipe['spice'];
}

const spiceConfig = {
  mild: { level: 1, label: 'Mild', color: 'text-primary fill-primary/65' },
  medium: { level: 2, label: 'Medium', color: 'text-primary fill-primary' },
  hot: { level: 3, label: 'Hot', color: 'text-destructive fill-destructive/85' },
  'very-hot': { level: 4, label: 'Very Hot', color: 'text-destructive fill-destructive' },
};

export function SpiceLevel({ spice }: SpiceLevelProps) {
  if (!spice) return null;

  const config = spiceConfig[spice];
  const totalIcons = 4;

  return (
    <Badge
      variant="outline"
      className="gap-1.5 capitalize text-xs bg-background border-border"
      aria-label={`Spice level: ${config.label}`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: totalIcons }).map((_, index) => (
          <Flame
            key={index}
            className={cn(
              'w-3 h-3',
              index < config.level ? config.color : 'text-muted-foreground/30'
            )}
          />
        ))}
      </div>
      <span>{config.label}</span>
    </Badge>
  );
}
