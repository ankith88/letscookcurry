import { getAllRecipes, getWeeklyRecipes } from '@/lib/recipes';
import { getSiteSettings } from '@/lib/settings';
import { HomeContent } from '@/components/home/home-content';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [weeklyRecipes, allRecipes, initialSettings] = await Promise.all([
    getWeeklyRecipes(),
    getAllRecipes(),
    getSiteSettings(),
  ]);

  return (
    <HomeContent
      weeklyRecipes={weeklyRecipes}
      allRecipes={allRecipes}
      initialSettings={initialSettings}
    />
  );
}
