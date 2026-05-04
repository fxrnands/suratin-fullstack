# Suratin (Frontend)

Web app for **SURATIN** — an AI-assisted **formal letter generator** for people in Indonesia: job applications, resignations, leave notices, formal requests, and complaint letters. Users fill a short form, get structured Indonesian formal copy, and can **download a PDF**.

## Stack

- **Next.js** 16 (App Router) · **React** 19 · **TypeScript**
- **Tailwind CSS** 4 · **Radix UI** · **shadcn-style** components
- **Supabase** (public URL + key for client; Postgres for server via **Drizzle ORM**)
- **Google Gemini** (`@google/genai`) for letter generation (server-side)
- **pdf-lib** + **sharp** for PDF / image pipeline
- **Vercel Analytics** (production only)

## Prerequisites

- **Node.js** 22+ (LTS recommended)
- **pnpm** (`corepack enable` or install globally)
- A **Supabase** project with Postgres
- A **Gemini API** key

## Getting started

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local — required: DATABASE_URL, JWT_*, GEMINI_API_KEY, Supabase public vars
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server (after `build`) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm test` | Vitest (watch) |
| `pnpm test:ci` | Vitest once + coverage |
| `pnpm db:generate` | Drizzle migrations (generate) |
| `pnpm db:push` | Push schema to DB (dev) |
| `pnpm db:studio` | Drizzle Studio |

## Environment variables

Copy **`.env.example`** to **`.env.local`** and fill values. Server-only secrets must never use the `NEXT_PUBLIC_` prefix.

### Required for core features

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Supabase Postgres (pooler URI recommended; `?sslmode=require`) |
| `JWT_ACCESS_SECRET` | HS256 secret (min length enforced in app) |
| `JWT_ACCESS_EXPIRES` | Access token TTL (e.g. `15m`) |
| `GEMINI_API_KEY` | Letter generation |
| `GEMINI_MODEL` / `GEMINI_MODEL_FALLBACKS` | Model selection (see `.env.example`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable / anon key |

### Optional (SEO & branding)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL (default `https://suratin.id` if unset). Use your real deploy URL in production. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console HTML tag verification |
| `NEXT_PUBLIC_SURATIN_INSTAGRAM_URL` | Organization `sameAs` in homepage JSON-LD |
| `NEXT_PUBLIC_SURATIN_TIKTOK_URL` | Same |
| `NEXT_PUBLIC_SURATIN_X_URL` | Same |

## Database

Schema is managed with **Drizzle**. After configuring `DATABASE_URL`, follow the comments in `.env.example` (e.g. apply SQL migrations under `drizzle/` or use `pnpm db:push` for development).

## SEO (built-in)

- Central copy in **`lib/seo-config.ts`**; page metadata via **`lib/seo/build-metadata.ts`**
- **`app/sitemap.ts`** · **`app/robots.ts`** · dynamic OG images **`app/og/route.tsx`**
- Example content routes under **`/contoh/**`**; letter builder hubs under **`/buat-surat/**`**

After deploy: set `NEXT_PUBLIC_SITE_URL`, verify in Google Search Console, submit `https://<your-domain>/sitemap.xml`.

## Repository layout (high level)

```
app/           # Routes, layouts, API route handlers
components/    # UI + feature components (letter builder, landing, SEO)
lib/           # DB, auth, Gemini, PDF, SEO config, marketing content
drizzle/       # SQL migrations (as used by your workflow)
public/        # Static assets, manifest
```

## License

Private / all rights reserved unless you add an explicit license file.
