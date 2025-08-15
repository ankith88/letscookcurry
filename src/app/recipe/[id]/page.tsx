import RecipeClientPage from "./recipe-client-page";

export default function RecipePage({ params }: { params: { id: string } }) {
  // We pass the id from the server component to the client component
  // to avoid hydration issues and direct param access in client components.
  return <RecipeClientPage recipeId={params.id} />;
}
