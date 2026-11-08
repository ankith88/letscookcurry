# Roadmap — Admin Ordering & Recipe Studio

## Milestone 1: Admin Control Center & Dynamic Ordering Mode

### Phase 1: Admin Ordering Controls & Recipe Management Studio
- **Status**: Complete
- **Goal**: Give admins complete control over activating/inactivating the ordering process across the entire site, turning orders on/off (manual or auto Mon–Thu), and adding/editing recipes in Firestore via form, Genkit AI autofill, and bulk JSON/CSV import.
- **Plans**:
  - [x] `01-01-PLAN.md` — Wave 1 (Tracer + Storefront): Firestore site settings (`settings/site`), Admin email allowlist helper, `SiteSettingsContext`, and conditional rendering across Home, Header, Footer, Recipe Card, Recipe Detail, Cart Sheet, and Profile pages.
  - [x] `01-02-PLAN.md` — Wave 2 (Admin Studio & Recipe Ingestion): `/admin` dashboard with Ordering Control Panel, Recipe Manager table (quick `isWeekly` toggle, edit, delete), Add/Edit Recipe dialog with Firebase Storage upload, Genkit AI Recipe Autofill flow (`src/ai/flows/generate-recipe.ts`), and Bulk JSON/CSV Recipe Importer.
