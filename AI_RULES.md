# AI_RULES.md — PalExpress Car Rental Palawan

## Tech Stack (5-10 bullet points)

- **React 18** with TypeScript — component-based UI library
- **Vite** — fast build tool and dev server
- **Tailwind CSS** — utility-first CSS framework with custom CSS variables
- **shadcn/ui** (Radix UI) — prebuilt, accessible UI components (buttons, dialogs, toasts, etc.)
- **React Router v6** — client-side routing
- **React Query** — server state management and caching
- **Sonner** — toast notification system
- **Lucide React** — icon library
- **Recharts** — charting for analytics
- **date-fns** — date manipulation and formatting

## Library Usage Rules

### State & Data
- **Use `useState` / `useReducer`** for local component state.
- **Use React Query (`@tanstack/react-query`)** only for server state, caching, or async data fetching. Do NOT use it for local UI state.
- **Persist to `localStorage`** for user data (bookings, favorites, custom vehicles). Wrap all localStorage access in `useEffect` to sync state.
- **Use `sessionStorage`** for temporary session data (admin auth). Clear on tab close.

### UI Components
- **Always use shadcn/ui components** (`@/components/ui/*`) for buttons, dialogs, inputs, badges, toasts, etc. Never build these from scratch.
- **Import from `@/components/ui/`** — never from `@radix-ui/react-*` directly. shadcn/ui wraps Radix with styling.
- **Use the `Button` component** for all clickable elements. Apply `gradient-ocean` class for primary actions, `variant="outline"` for secondary.
- **Use `Dialog` (shadcn/ui)** for all modals. Never use native `window.confirm` or `window.alert`.
- **Use `Sonner` (`toast.success()`, `toast.error()`)** for all notifications. Never use `alert()`.

### Styling
- **Use Tailwind CSS classes** exclusively. Do NOT write custom CSS in component files.
- **Use CSS custom properties** (CSS variables) from `:root` for colors (e.g., `bg-primary`, `text-foreground`, `border-border`).
- **Use utility classes** like `glass-card`, `gradient-ocean`, `shadow-glow`, `hover-lift` defined in `index.css`.
- **Use responsive classes** (`sm:`, `md:`, `lg:`) for mobile-first design.
- **Use `cn()` utility** (`@/lib/utils`) to conditionally merge Tailwind classes.

### Routing & Navigation
- **Use React Router** (`react-router-dom`) with `BrowserRouter`, `Routes`, `Route`.
- **Keep all routes in `src/App.tsx`** — do NOT create separate route files.
- **Use `NavLink`** (from `@/components/NavLink.tsx`) for navigation links with active states.
- **For smooth scrolling**, use `element.scrollIntoView({ behavior: "smooth" })` — not anchor links.

### Forms & Validation
- **Use `react-hook-form`** for form state management.
- **Use `zod` with `@hookform/resolvers`** for validation schemas.
- **Use shadcn/ui `Input`, `Textarea`, `Label`** for form fields.
- **Always include proper `htmlFor` and `id`** labels for accessibility.

### Icons
- **Use Lucide React icons** exclusively. Import from `lucide-react`.
- **Icon size**: Use consistent sizes (`w-4 h-4` for small, `w-5 h-5` for medium, `w-6 h-6` for large).

### Data & Types
- **Define TypeScript interfaces** in `src/data/vehicles.ts` for `Vehicle`, `Booking`, etc.
- **Use named exports** for types and data.
- **Keep vehicle data** (images, specs) in `src/data/vehicles.ts` and assets in `src/assets/`.
- **Use `crypto.randomUUID()`** for generating IDs (browser-native, no library needed).

### Hooks & Custom Logic
- **Create custom hooks** in `src/hooks/` for reusable logic (e.g., `useBookings`, `useFavorites`, `useTheme`, `useScrollAnimation`).
- **Name hooks with `use` prefix** (e.g., `useAdmin`, `useMobile`).
- **Keep hooks focused** — one responsibility per hook.

### Animations
- **Use CSS animations** defined in `index.css` (`animate-slide-up`, `animate-fade-in`, `animate-scale-in`).
- **Use `useScrollAnimation` hook** for scroll-triggered animations (IntersectionObserver).
- **Use Tailwind `transition` classes** for hover effects (`transition-all duration-300`).

### Theme
- **Use `useTheme` hook** (`@/hooks/useTheme`) to toggle dark/light mode.
- **Store theme preference** in `localStorage` under key `"theme"`.
- **Apply `dark` class** to `document.documentElement` for dark mode.

### Performance
- **Use `loading="lazy"`** on `<img>` tags below the fold.
- **Use `useMemo`** for expensive calculations (filtering, aggregating bookings).
- **Use `useCallback`** only when passing functions to child components that re-render often.

### File Structure
- **Components**: `src/components/` — one component per file, PascalCase naming.
- **Pages**: `src/pages/` — route pages (Index, NotFound).
- **Hooks**: `src/hooks/` — custom hooks.
- **Contexts**: `src/contexts/` — React contexts (AdminContext).
- **Data**: `src/data/` — static data (vehicles).
- **Assets**: `src/assets/` — images, icons.
- **UI Library**: `src/components/ui/` — shadcn/ui components (do NOT edit these unless absolutely necessary).

### Error Handling
- **Use `try/catch`** only around localStorage operations (can throw on quota exceeded).
- **Let errors bubble** — do NOT silently catch errors in components.
- **Use toast notifications** (`toast.error()`) to inform users of errors.

### Accessibility
- **Use semantic HTML** (`<nav>`, `<section>`, `<footer>`).
- **Add `aria-label`** to icon-only buttons.
- **Ensure keyboard navigation** works (shadcn/ui components handle this).
- **Use proper label associations** (`htmlFor` / `id`) for form inputs.

### Admin & Security
- **Admin code** is hardcoded as `"ADMIN_08"` in `AdminContext.tsx` — do NOT change without updating documentation.
- **Admin state** stored in `sessionStorage` (cleared on tab close).
- **All admin actions** (approve/reject, manage vehicles) require `isAdmin` check.

### Testing
- **Use Vitest** for unit tests in `src/**/*.{test,spec}.{ts,tsx}`.
- **Use `@testing-library/react`** for component testing.
- **Mock localStorage** in test setup (`src/test/setup.ts`).

### Git & Commits
- **Write clear commit messages** (conventional commits recommended: `feat:`, `fix:`, `refactor:`).
- **Do NOT commit secrets** — use environment variables if needed (not currently used).

---

**Last updated**: 2026 — PalExpress Car Rental Palawan codebase