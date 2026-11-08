# Phase 1 Research: Admin Ordering Controls & Recipe Management

## 1. Current Ordering Touchpoints Across Codebase
To ensure that inactivating the ordering process (`orderingFeatureEnabled: false`) hides **all** references to ordering and turns the website into a pure recipe-browsing experience, every touchpoint was audited:

| File | Current Ordering Content | Behavior when `orderingFeatureEnabled === false` | Behavior when `orderingFeatureEnabled === true` |
| --- | --- | --- | --- |
| `src/app/page.tsx` | Hero top bar ("Orders open Monday to Thursday, delivered fresh Monday"), subheadline ("delivered fresh every Monday"), CTA ("Explore This Week's Recipes"), "Weekly rotation" stat, Section 2 ("One kitchen schedule, three deliberate steps" + 6-Day Weekly Kitchen Board), Section 3 ("This Week's Curries" with `cardType="cart"`). | Hero shows recipe-discovery copy ("Authentic Indian home recipes from across 4 regions"), CTA links to `#all-recipes`, Section 2 (Schedule & 6-Day Board) and Section 3 ("This Week's Curries" ordering section) are completely hidden. Only Hero + Full Recipe Archive (`#all-recipes`) render. | Full diptych hero with ordering copy, Section 2 schedule, Section 3 weekly curries, and Section 4 full menu. |
| `src/components/layout/header.tsx` | Shopping Cart icon button with badge + `<CartSheet />`. Also nav links (`Home`, `About Us`, `Profile`). | Shopping Cart button and `<CartSheet />` are hidden. If signed-in user is an Admin, an `Admin` badge/link (`/admin`) is shown in the header navigation. | Shopping Cart button and `<CartSheet />` are visible; Admin link shown for admins. |
| `src/components/layout/footer.tsx` | Tagline mentions "recipe kits... Fresh weekly menus delivered", Quick Links say "Home & Weekly Menu" and "My Profile & Order History", Column 3 shows "Weekly Ordering Schedule" card. | Tagline focuses on authentic recipes, Quick Links show "Home" and "My Profile", and Column 3 shows "Regional Culinary Heritage" (or hides the Weekly Ordering Schedule card). | Full Weekly Ordering Schedule card and ordering link labels shown. |
| `src/components/recipes/recipe-card.tsx` | Shows `${price}` badge when `recipe.isWeekly && orderableState === 'orderable'`, and renders `<CartButton />` when `cardType === 'cart'`. Hardcodes `today >= 1 && today <= 4`. | Never shows price pill or CartButton; always renders "View Recipe" button. | Uses global `isOrdersOpen` state (derived from `orderWindowMode`: `'open'`, `'closed'`, or `'auto'` Mon–Thu) to show `${price}` and enable/disable "Add to Cart". |
| `src/app/recipe/[id]/recipe-client-page.tsx` | `renderOrderSection()` shows "Featured on This Week's Menu", `${price}`, and `<AddToCartButton />` or "Ordering Closed". Rating card description mentions "Tried cooking or ordering...". | `renderOrderSection()` returns `null`. Rating description says "Tried cooking {recipe.name}?". | `renderOrderSection()` renders when `recipe.isWeekly`, governed by global `isOrdersOpen` state. |
| `src/components/cart/cart-sheet.tsx` | Hardcodes `today >= 1 && today <= 4` for `isOrderable`. | Unreachable/hidden when ordering is inactive; checkout button also checks `orderingFeatureEnabled && isOrdersOpen`. | Uses global `isOrdersOpen` state from site settings; displays clear status message when closed. |
| `src/app/profile/page.tsx` | Shows "Order History" card with past orders and "Reorder All" buttons. | Hides the "Order History" card when `orderingFeatureEnabled === false`. Shows a quick "Go to Admin Studio" card if the signed-in user is an admin. | Shows full "Order History" card. |

## 2. Firestore Data Model for Site Settings (`settings/site`)
Stored at document path `settings/site` in Firestore:
```ts
export type OrderWindowMode = 'auto' | 'open' | 'closed';

export type SiteSettings = {
  orderingFeatureEnabled: boolean; // true = ordering active & sections visible; false = recipe-only website
  orderWindowMode: OrderWindowMode; // 'auto' (Mon-Thu), 'open' (force ON), 'closed' (force OFF)
  adminEmails: string[]; // Dynamic allowlist in addition to NEXT_PUBLIC_ADMIN_EMAILS
  updatedAt?: string;
  updatedBy?: string;
};
```
Default fallback (if `settings/site` does not exist yet in Firestore):
- `orderingFeatureEnabled: true`
- `orderWindowMode: 'auto'`
- `adminEmails: []`

## 3. How Recipes Are Stored & Added in Firestore (`recipes` collection)
Every recipe on the website is a document in the top-level `recipes` Firestore collection (`src/lib/recipes.ts`) matching `Recipe` (`src/lib/types.ts`):
- `name` (`string`): Title of the curry/dish
- `description` (`string`): Short 1–2 sentence summary for cards
- `longDescription` (`string`): Detailed story/description on the recipe page
- `imageUrl` (`string`): URL to dish image (Firebase Storage download URL or external URL)
- `imageHint` (`string`): 2-word AI/alt hint (e.g., `"butter chicken"`)
- `price` (`number`): Price in AUD (e.g., `18.50`)
- `region` (`"North" | "South" | "East" | "West"`)
- `diet` (`"Veg" | "Non-Veg"`)
- `spice` (`"mild" | "medium" | "hot" | "very-hot"`)
- `isWeekly` (`boolean`): Whether the recipe appears in "This Week's Curries"
- `ingredients` (`string[]`): Ordered list of ingredients with measurements
- `instructions` (`string[]`): Step-by-step cooking instructions
- `rating` (`number`, default `5.0`) & `reviews` (`number`, default `0`)

## 4. Genkit Integration (`src/ai/`)
- `src/ai/genkit.ts` exports `ai` configured with `googleAI()` and `googleai/gemini-2.0-flash`.
- We can define a structured output Genkit flow `generateRecipeDraftFlow` in `src/ai/flows/generate-recipe.ts` using `ai.defineFlow` and `z.object(...)` schema so admins can type a dish name (e.g. `"Chettinad Pepper Chicken"`) or paste rough kitchen notes and have all recipe fields populated in one click.

