# GokaFood PWA — Next.js

> **Tastes That Move You** — A mobile-first Progressive Web App for food ordering.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Data fetching | React Query v5 + Axios |
| State | Zustand (persist) |
| Forms | React Hook Form + Zod |
| PWA | next-pwa (Workbox) |
| Auth tokens | js-cookie (httpOnly-style) |
| Fonts | Poppins + Roboto (Google Fonts) |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Edit .env.local — set your API URL
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/v1

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, signup) — no bottom nav
│   │   ├── layout.tsx    # Auth layout with hero image
│   │   ├── login/
│   │   └── signup/
│   ├── (app)/            # Main app pages — with bottom nav
│   │   ├── layout.tsx    # App layout with BottomNav
│   │   ├── discover/     # Home / food feed
│   │   ├── wishlist/
│   │   ├── cart/
│   │   ├── profile/
│   │   └── product/[id]/
│   ├── onboarding/       # Welcome / splash screen
│   ├── layout.tsx        # Root layout (fonts, providers)
│   ├── globals.css
│   └── page.tsx          # Redirects to /discover
│
├── components/
│   ├── food/             # FoodCard, FeaturedCarousel, CategoryChips, skeletons
│   ├── layout/           # BottomNav
│   ├── cart/
│   ├── auth/
│   └── ui/               # SplashScreen, shared UI primitives
│
├── lib/
│   ├── api/
│   │   ├── endpoints.ts  # All API endpoint constants + QUERY_KEYS
│   │   ├── client.ts     # Axios instance + token interceptors + refresh logic
│   │   ├── services.ts   # All API service functions
│   │   └── query-client.ts  # React Query client factory + provider
│   ├── hooks/
│   │   └── use-api.ts    # All React Query hooks (useLogin, useFoods, useCart, etc.)
│   └── utils/
│       └── index.ts      # cn(), formatNaira(), debounce(), getErrorMessage(), etc.
│
├── store/
│   ├── auth-store.ts     # Zustand auth store (persisted)
│   └── cart-store.ts     # Zustand cart store (optimistic, persisted)
│
├── types/
│   └── index.ts          # All TypeScript types
│
└── middleware.ts          # Route protection + security headers
```

---

## PWA Install

The app can be installed on:

- **Android**: Chrome → "Add to Home Screen" banner or 3-dot menu
- **iOS Safari**: Share button → "Add to Home Screen"

PWA features:
- Offline support via Workbox service worker
- App manifest with icons
- Standalone display mode (no browser chrome)
- Splash screen
- `theme-color` matching brand orange

---

## Security

- **Middleware**: JWT token checked on every protected route, 401 → redirect to `/login`
- **Token storage**: Access token (1 day) + refresh token (30 days) in `js-cookie` with `secure` + `sameSite: strict`
- **Auto token refresh**: Axios interceptor queues concurrent requests during refresh
- **Security headers**: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `CSP`, `Referrer-Policy` on every response
- **Input validation**: Zod schemas on all forms

---

## API Integration

Point `NEXT_PUBLIC_API_BASE_URL` at your backend and every hook will work.

```typescript
// Example usage
import { useFoods, useAddToCart } from '@/lib/hooks/use-api';

const { data, isLoading } = useFoods('rice');
const { mutateAsync: addToCart } = useAddToCart();
```

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production (generates SW)
npm run start        # Start production server
npm run type-check   # TypeScript check
npm run lint         # ESLint
```
