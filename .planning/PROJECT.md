# Let's Cook Curry — Admin Ordering Controls & Recipe Management

## Core Value
Enable the site admins (Tanvi & Ankith) to dynamically control whether Let's Cook Curry operates as a full weekly curry ordering studio or a pure recipe-showcase website, manually or automatically open/close weekly orders, and effortlessly add/edit recipes in Firestore via a form, Genkit AI autofill, or bulk import.

## Context & Existing Architecture
- **Framework**: Next.js 15 App Router (`src/app/`), React 18, TypeScript, Tailwind CSS + shadcn/ui.
- **Backend / Database**: Firebase Web SDK (`src/lib/firebase.ts`) with Cloud Firestore (`recipes` collection, `recipes/{id}/ratings` subcollection), Firebase Authentication (passwordless email link in `src/lib/auth.ts`), and Firebase Storage.
- **AI Stack**: Genkit (`src/ai/genkit.ts`) configured with `@genkit-ai/googleai` (`googleai/gemini-2.0-flash`).

## Key Decisions
1. **Admin Authorization**: Email allowlist via Firebase Auth (`NEXT_PUBLIC_ADMIN_EMAILS` env var + configurable `adminEmails` list in Firestore `settings/site` document, with default fallback for project owners).
2. **Two-Tier Ordering Control**:
   - **Ordering Process Active/Inactive (`orderingFeatureEnabled: boolean`)**:
     - When **Inactive (`false`)**: The site transforms into a recipe-only discovery website. All ordering sections, schedules, prices, cart buttons, header cart icon/drawer, footer schedule card, and profile order history are hidden.
     - When **Active (`true`)**: All weekly ordering sections, schedules, prices, and shopping cart features are shown.
   - **Orders Open/Closed Mode (`orderWindowMode: 'auto' | 'open' | 'closed'`)**:
     - When `orderingFeatureEnabled` is `true`, controls whether customers can currently add to cart and checkout:
       - `'open'`: Orders are manually turned ON regardless of the day of the week.
       - `'closed'`: Orders are manually turned OFF regardless of the day of the week (shows "Ordering Closed" state).
       - `'auto'`: Follows the Monday–Thursday (`day >= 1 && day <= 4`) schedule automatically.
3. **Recipe Creation & Management (`/admin`)**:
   - **Single Recipe Form**: Full CRUD form for `Recipe` documents in Firestore (`recipes` collection), including Firebase Storage image upload or direct image URL, dynamic ingredients/instructions lists, region/diet/spice selectors, price, and quick `isWeekly` toggle.
   - **Genkit AI Recipe Autofill**: Server action / API endpoint powered by Genkit (`src/ai/flows/generate-recipe.ts`) that takes a dish name or rough notes and generates structured `description`, `longDescription`, `region`, `diet`, `spice`, `price`, `ingredients[]`, and `instructions[]`.
   - **Bulk JSON / CSV Import**: Upload or paste JSON/CSV array of recipes to validate and batch-write directly to the Firestore `recipes` collection.

