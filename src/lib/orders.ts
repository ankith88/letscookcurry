import type { Order } from '@/lib/types';
import { allRecipes } from './recipes';

export const orderHistory: Order[] = [
  {
    id: 'ORD-001',
    date: '2023-10-19',
    items: [allRecipes[0], allRecipes[2]],
    total: 2,
  },
  {
    id: 'ORD-002',
    date: '2023-10-12',
    items: [allRecipes[3]],
    total: 1,
  },
  {
    id: 'ORD-003',
    date: '2023-10-05',
    items: [allRecipes[1], allRecipes[4], allRecipes[5]],
    total: 3,
  },
];
