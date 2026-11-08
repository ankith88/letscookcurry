---
target: src/app/recipe/[id]/recipe-client-page.tsx
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/ankithravindran/Development/Antigravity/letscookcurry/src/app/recipe/[id]/recipe-client-page.tsx"
target_fingerprint: "sha256:c8a85d0a7f201eb9f0abf6ac1c2e528b5b54402424d25759dacc009df69289ae"
target_path: /Users/ankithravindran/Development/Antigravity/letscookcurry/src/app/recipe/[id]/recipe-client-page.tsx
timestamp: 2026-11-08T04-41-42Z
slug: src-app-recipe-id-recipe-client-page-tsx
closed: true
---
⚠️ DEGRADED: single-context (sub-agent A 6323d4d9-ca64-4142-a0bc-d141984407f7 failed with http2: timeout awaiting response headers; B: d79c6e5e-f4d0-4f12-9790-8d982db17c32 completed in isolation)

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | `AddToCartButton` shows no in-cart count or active state on the page; checked ingredients reset silently on refresh. |
| 2 | Match System / Real World | 2 | Missing fundamental cooking metadata (servings/yield, prep time, cook time) that every home cook expects before starting. |
| 3 | User Control and Freedom | 2 | Hardcoded `href="/#all-recipes"` back button ignores where the user came from; no "Clear checked ingredients" reset button. |
| 4 | Consistency and Standards | 2 | Visual and token drift from the homepage's Split Studio system (`emerald-50`/`amber-500` badges, missing `.num`, generic 3-row boxed `<Card>` layout, `"Mon–Thu"` en-dash). |
| 5 | Error Prevention | 3 | Star rating validates before submit and disables button when `rating === 0`, though unauthenticated/duplicate review expectations aren't previewed. |
| 6 | Recognition Rather Than Recall | 2 | When scrolling through 6–10 cooking steps on mobile or desktop, ingredients scroll out of view (no sticky rail) and steps don't inline ingredient quantities. |
| 7 | Flexibility and Efficiency | 2 | No batch "Check all / Reset" for ingredients, no serving-size scaler, and no keyboard arrow support on the custom star rating group. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean typography and whitespace, but wrapping all 5 regions in uniform bordered, shadowed `<Card>` boxes separated by `<Separator />` creates repetitive box-in-box clutter. |
| 9 | Error Recovery | 3 | `RatingForm` displays a destructive `Alert` and preserves user comment text on network failure, though it lacks a one-click retry action. |
| 10 | Help and Documentation | 3 | Helpful microcopy on cards ("Click an ingredient to check it off as you prep"), but lacks reheating/serving guidance for Monday delivery orders. |
| **Total** | | **24/40** | **Acceptable (60%)** |

---

### Design Specificity Verdict

**LLM assessment**: The recipe detail page (`src/app/recipe/[id]/recipe-client-page.tsx`) feels like an earlier, un-redesigned generation of the app that was left behind when the homepage (`src/components/home/home-content.tsx`) was upgraded to the **Split Studio** editorial system (`DESIGN.md`). Whereas the homepage uses deep curry-leaf architectural panels (`bg-leaf text-leaf-ink`), ruled editorial schedules (`border-t-2 border-foreground divide-y`), sticky studio rails (`lg:sticky lg:top-24`), and tabular numerals (`.num`), the recipe detail page falls back to a category-interchangeable shadcn template: three identical `grid-cols-1 lg:grid-cols-12` rows containing five bordered, shadowed `<Card className="border-border/70 shadow-sm">` boxes separated by horizontal `<Separator />` lines. Even shared components diverge: dietary badges on the recipe page hardcode Tailwind `bg-emerald-50 text-emerald-800` and `bg-amber-50 text-amber-900` instead of the brand tokens (`bg-secondary/60` and `bg-accent/15`) used in `RecipeCard`, stars hardcode `text-amber-500` instead of `text-primary`, and prices/ratings omit the `.num` tabular numeral class.

**Deterministic scan**: `impeccable detect --json` scanned 4 `.tsx` files (`src/app/recipe/[id]/recipe-client-page.tsx`, `src/components/recipes/rating-form.tsx`, `src/components/recipes/spice-level.tsx`, `src/components/cart/add-to-cart-button.tsx`) in static regex mode and returned **0 findings** (`[]`, exit code 0). Because static `.tsx` scanning only runs source-level regex rules (and skips DOM-computed rules like `tiny-text`, `low-contrast`, and touch-target sizing), source inspection caught three issues that static regex mode undercounted:
1. Stacked `text-xs` lines with `uppercase tracking-wider` inside the order callout (`recipe-client-page.tsx:92-97`).
2. Undersized 36×36px touch targets on the star rating buttons (`w-7 h-7` with `p-1` in `rating-form.tsx:130`, below the 44×44px minimum).
3. Uniform card-border repetition across all five content blocks (`recipe-client-page.tsx:147, 212, 257, 289, 303`).

**Visual overlays**: No reliable user-visible overlay is available (`no browser automation tool exposed in harness`).

---

### Overall Impression

The page has solid bones—interactive ingredient checkboxes, optimistic review updates, and clear dietary/spice badges—but visually and structurally it breaks the promise of the homepage's "Sydney culinary studio" editorial direction. The biggest opportunity is replacing the five generic boxed `<Card>` containers with an editorial Split Studio layout: a sticky left ingredient & order rail paired with an open, ruled step-by-step kitchen method column that serves both Monday-delivery customers and hands-busy home cooks.

---

### What's Working

1. **Tactile, accessible ingredient prep checklist (`recipe-client-page.tsx:224-252`)**: Each ingredient is a semantic `<button type="button" aria-pressed={isChecked}>` with full-row hit area, clear visual strikethrough (`line-through bg-muted/40`), and custom checkbox indicator—turning a static list into a functional prep tool.
2. **Optimistic review submission with live rating recalculation (`recipe-client-page.tsx:65-76`, `rating-form.tsx:70-83`)**: Submitting a rating immediately prepends the review and recalculates the header's average star score and review count in state without waiting for a full page reload, while hovering stars reveals plain-language labels (`"4 Stars — Very Delicious"`).
3. **Clear dietary, regional, and spice metadata cluster (`recipe-client-page.tsx:164-193`, `spice-level.tsx:26-44`)**: Grouping star rating, Vegetarian/Meat & Poultry, Indian region, and the 4-flame `SpiceLevel` badge right above the `h1` lets visitors qualify a dish in under two seconds.

---

### Priority Issues

1. **[P1] Visual & token drift from the locked `DESIGN.md` Split Studio system**
   - **Why it matters**: Clicking a recipe card on the editorial homepage drops the user into a generic white-cards-on-cream layout with off-palette colors (`emerald-50`, `amber-50`, `amber-500`), missing `.num` tabular numerals on `$price` and ratings, and copy that violates the homepage's Hallmark rules (`"Ordering Closed (Open Mon–Thu)"` with an en-dash and uppercase tracking). It feels like two different sites stitched together.
   - **Fix**: Replace `bg-emerald-50`/`bg-amber-50` and `text-amber-500` in `recipe-client-page.tsx` and `rating-form.tsx` with the brand tokens used in `RecipeCard` (`bg-secondary/60`, `bg-accent/15`, `text-primary fill-primary`). Add `.num` to price (`$Number(recipe.price).toFixed(2)`), rating score, step numbers, and review counts. Restyle the weekly order box (`renderOrderSection`) as a deep curry-leaf studio panel (`bg-leaf text-leaf-ink`) or ruled editorial callout matching `home-content.tsx`, and replace `"Ordering Closed (Open Mon–Thu)"` with `"Ordering Closed (Monday to Thursday)"`.
   - **Suggested command**: `$impeccable polish`

2. **[P1] Boxed 5-card monotony and non-sticky ingredients force constant scrolling while cooking**
   - **Why it matters**: Wrapping the hero image, ingredients, instructions, rating form, and reviews in five separate `<Card>` boxes separated by `<Separator />` lines adds visual noise while failing the core kitchen workflow: as a cook scrolls down through 6–10 instruction steps, the Ingredients card scrolls off-screen, forcing repeated up-and-down scrolling with messy hands.
   - **Fix**: Remove the outer `<Card>` wrappers and `<Separator />` dividers on the Ingredients, Instructions, and Reviews sections in favor of `DESIGN.md`'s editorial hairline rules (`border-t-2 border-foreground divide-y divide-border`). Make the Ingredients column sticky on desktop (`lg:col-span-5 lg:sticky lg:top-24`) alongside the scrolling step-by-step instructions, matching the sticky studio rail pattern on the homepage (`home-content.tsx:362`).
   - **Suggested command**: `$impeccable layout`

3. **[P2] Missing culinary & portion specs (servings, prep/cook time, and delivery portion context)**
   - **Why it matters**: Whether a visitor is ordering a fresh curry for Monday delivery (`$price`) or cooking it at home from the ingredient list, critical decision data is missing: How many people does one order or recipe batch serve? How long does it take to prep and simmer? Without portion size, `$18.00` has no value anchor, and ingredient quantities have no yield context.
   - **Fix**: Add a ruled editorial spec bar below the description (or inside the studio rail) displaying **Servings / Portion Size**, **Prep & Simmer Time** (or reasonable defaults/derived metadata when not set on the recipe document), and **Region / Spice profile**, and add a clear progress counter + "Reset" action to the ingredient checklist header (`"3 of 12 prepped · Reset"`).
   - **Suggested command**: `$impeccable clarify`

4. **[P2] Weak cart feedback and undersized touch targets on mobile**
   - **Why it matters**: Clicking `AddToCartButton` (`src/components/cart/add-to-cart-button.tsx`) fires a corner toast, but the button itself never reflects that the item is already in the cart or lets the user adjust quantity (`1 in cart · + / −`). Meanwhile, the star rating buttons in `rating-form.tsx:130` are `36×36px` (`w-7 h-7` + `p-1`) and lack arrow-key roving focus, making one-handed mobile tapping error-prone.
   - **Fix**: Upgrade `AddToCartButton` to read `items` from `useCart()` and show in-cart status or inline quantity controls when `quantity > 0` (matching `DESIGN.md`'s `h-11 rounded-xl` control spec). Increase star buttons in `RatingForm` to `h-11 w-11` (`44×44px`) touch targets, add arrow-key support (`ArrowLeft`/`ArrowRight`), and persist checked ingredients in `sessionStorage` keyed by `recipe.id`.
   - **Suggested command**: `$impeccable harden`

---

### Persona Red Flags

- **Casey (Distracted Mobile User / Home Cook at the Stove)**:
  - Checked ingredients (`checkedIngredients` in `recipe-client-page.tsx:40`) are stored only in ephemeral React `useState`. When Casey's phone locks or refreshes mid-cook while simmering onions, all checked-off prep progress is wiped.
  - On mobile, the Ingredients list and Step-by-Step Instructions are stacked vertically with no sticky summary or tab toggle, forcing Casey to scroll past 12 ingredients every time to check step 4, then scroll back up to check the garam masala measurement.
  - Star rating tap targets (`rating-form.tsx:130`) are 36×36px (`p-1` + `28px` icon), below the 44×44pt thumb target threshold.

- **Sam (Accessibility-Dependent User)**:
  - The star rating selector (`rating-form.tsx:116-143`) uses `role="group"` with five separate `<button aria-pressed={rating === star}>` elements instead of a `radiogroup` or arrow-key roving tabindex, and when `rating === 4`, stars 1–3 are visually filled (`activeRating >= star`) while their `aria-pressed` attribute is `false`.
  - Review avatars (`recipe-client-page.tsx:320-324`) render `{rating.rating}★` inside `<AvatarFallback>` without `aria-hidden="true"`, causing screen readers to announce the rating twice in a row (once on the avatar `"5★"`, and immediately again on line 328 `"Rated 5 out of 5 stars"`).

- **Jordan (Confused First-Timer)**:
  - When `orderingFeatureEnabled && recipe.isWeekly` is true, the page simultaneously presents an e-commerce price box (`"Featured on This Week's Menu — $18.00 — Add to Cart"`) and a full DIY home-cooking checklist (`"Click an ingredient to check it off as you prep"`) with no bridging explanation of whether ordering sends a ready-to-heat curry or a raw meal kit, or what portion size `$18.00` buys.
  - Clicking `"Back to Recipes"` (`href="/#all-recipes"`) jumps Jordan to the bottom archive grid of the homepage even if they clicked into the dish from the top `"This Week's Curries"` menu or the hero featured dish card.

---

### Minor Observations

- **Double card padding on the hero image (`recipe-client-page.tsx:147-159`)**: Wrapping `<Image>` inside `<Card><CardContent className="p-0">` is unnecessary DOM nesting when a single `<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">` matches the homepage's culinary proof panel (`home-content.tsx:153`).
- **Button radius & height mismatch (`add-to-cart-button.tsx:11`)**: `AddToCartButton` uses `<Button size="lg" className="w-full">` (`rounded-md`, `h-11`) without `rounded-xl font-semibold`, whereas `DESIGN.md` and `RecipeCard` lock primary controls to `rounded-xl h-11 font-semibold`.
- **Unformatted review timestamps (`recipe-client-page.tsx:315-354`)**: `Rating` objects include `createdAt` (`src/lib/types.ts:36`), but individual reviews in `"What Others Are Saying"` never display when a review was left, making the list feel static.
- **React array index keys on dynamic lists (`recipe-client-page.tsx:317`)**: Reviews use `key={index}` when new reviews are prepended (`[newRating, ...prev]`), which shifts keys across all existing review nodes on submission.

---

### Questions to Consider

- **Ready-to-heat order vs. home recipe**: When a dish is on "This Week's Menu," should the page frame the recipe as *"How we slow-cook this batch in our Sydney studio (or cook it yourself at home)"* so first-time buyers immediately understand they're ordering a freshly prepared curry, not raw ingredients?
- **Editorial kitchen sheet vs. boxed cards**: What if the Ingredients and Step-by-Step Instructions shed their `<Card>` borders entirely and behaved like an open, ruled cookbook spread with a sticky left ingredient rail?
- **In-kitchen mode**: What would make this page indispensable at 6:30 PM next to a hot stove—persistent ingredient checkboxes, a wake-lock / cook-mode toggle, or inline ingredient amounts highlighted inside each step?
