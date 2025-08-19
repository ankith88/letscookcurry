
"use client";

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types';

interface SpiceLevelProps {
  spice: Recipe['spice'];
}

const spiceConfig = {
  mild: { level: 1, label: 'Mild', color: 'text-yellow-500 fill-yellow-500' },
  medium: { level: 2, label: 'Medium', color: 'text-orange-500 fill-orange-500' },
  hot: { level: 3, label: 'Hot', color: 'text-red-500 fill-red-500' },
  'very-hot': { level: 4, label: 'Very Hot', color: 'text-red-700 fill-red-700' },
};

export function SpiceLevel({ spice }: SpiceLevelProps) {
  if (!spice) return null;

  const config = spiceConfig[spice];
  const totalIcons = 4;

  return (
    <Badge variant="outline" className="gap-1.5 capitalize">
        <div className="flex items-center gap-0.5">
            {Array.from({ length: totalIcons }).map((_, index) => (
                <Flame
                key={index}
                className={cn(
                    'w-3.5 h-3.5',
                    index < config.level ? config.color : 'text-gray-300'
                )}
                />
            ))}
        </div>
      {config.label}
    </Badge>
  );
}
