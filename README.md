# Xenofield AI Studio

> AI-powered creative studio for image, video, and audio generation with a node-based workflow engine.

![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

### Demo Credentials

| Username | Password | Role  |
|----------|----------|-------|
| `user`   | `123`    | User  |
| `admin`  | `123`    | Admin |

---

## Available Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start dev server with Turbopack (fast)   |
| `npm run build` | Production build with type checking      |
| `npm run start` | Serve production build                   |
| `npm run lint`  | Run ESLint                               |

---

## Tech Stack

| Layer          | Technology                                     |
|----------------|------------------------------------------------|
| Framework      | Next.js 16.2.2 (App Router)                    |
| UI Library     | React 19.2.4                                   |
| Language       | TypeScript 5 (strict mode)                     |
| Styling        | Tailwind CSS 4 (via PostCSS)                   |
| Icons          | Lucide React                                   |
| State          | React Context + sessionStorage                 |
| Routing        | Next.js App Router (file-based)                |
| Build Tool     | Turbopack (dev) / Next.js bundler (production) |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout — wraps all providers
│   ├── page.tsx            # Root route — redirects to /login or /image
│   ├── login/              # Login page
│   ├── image/              # Image generation studio
│   ├── video/              # Video generation studio
│   ├── audio/              # Audio generation studio (voiceover/SFX/music)
│   ├── workflows/          # Workflow hub + [id] dynamic editor
│   ├── generations/        # Generation history browser
│   ├── characters/         # Character CRUD with @mention
│   ├── my-prompts/         # Saved prompts library
│   ├── post-studio/        # Social media post creator
│   ├── image-editor/       # Image adjustment & metadata stripping
│   ├── motion-control/     # Camera motion control panel
│   ├── billing/            # Billing & crypto payment
│   ├── admin/              # Admin panel (users, keys, settings)
│   ├── nurse-reel/         # Standalone reel idea tool (uses Anthropic API)
│   └── globals.css         # Global styles, animations, design tokens
│
├── components/             # Shared UI components
│   ├── AppShell.tsx        # Main layout wrapper (sidebar + content)
│   ├── Sidebar.tsx         # Navigation sidebar (collapsible + mobile drawer)
│   ├── LoginForm.tsx       # Login form with animated background
│   ├── BottomPromptBar.tsx # Image generation prompt bar
│   ├── VideoPromptBar.tsx  # Video generation prompt bar
│   ├── GenerationGallery.tsx # Image grid with column slider
│   ├── ImageDetailOverlay.tsx # Full-screen image viewer
│   ├── AmbientBackground.tsx  # Animated planet-themed backgrounds
│   ├── ToastProvider.tsx   # Global toast notification system
│   ├── ModelDropdown.tsx   # AI model selector dropdown
│   ├── WorkflowCanvas.tsx  # Node-based workflow editor canvas
│   └── ... (14 more)      # Supporting UI components
│
├── context/                # React Context providers
│   ├── AuthContext.tsx     # Authentication state & route protection
│   ├── CharacterContext.tsx # Character CRUD state
│   └── GenerationContext.tsx # Generation history state
│
├── data/                   # Static data, types, and mock functions
│   ├── characters.ts       # Character type + seed data
│   ├── generations.ts      # Generation type + demo generator
│   ├── models.ts           # Image model definitions (name, cost, options)
│   ├── video-models.ts     # Video model definitions
│   ├── workflows.ts        # Workflow template definitions
│   ├── workflow-projects.ts # Workflow project type
│   ├── history.ts          # Generation history seed data
│   ├── prompts.ts          # Saved prompts seed data
│   └── menu.ts             # Sidebar menu configuration
│
└── public/
    ├── xenofield-icon.png  # App logo/icon
    └── characters/         # Pre-seeded character images
```

---

## All Routes (18 total)

| Route               | Auth Required | Admin Only | Description                          |
|---------------------|:---:|:---:|--------------------------------------|
| `/login`            | ✗   | ✗   | Login page                           |
| `/`                 | ✓   | ✗   | Redirects to `/image`                |
| `/image`            | ✓   | ✗   | Image generation + gallery           |
| `/video`            | ✓   | ✗   | Video generation (create + motion)   |
| `/audio`            | ✓   | ✗   | Audio generation (voice/SFX/music)   |
| `/workflows`        | ✓   | ✗   | Workflow templates + project list    |
| `/workflows/[id]`   | ✓   | ✗   | Node-based workflow canvas editor    |
| `/generations`      | ✓   | ✗   | Generation history browser           |
| `/characters`       | ✓   | ✗   | Character create/delete/list         |
| `/my-prompts`       | ✓   | ✗   | Saved prompts with search & tags     |
| `/post-studio`      | ✓   | ✗   | Social media post generator          |
| `/image-editor`     | ✓   | ✗   | Image adjustments + metadata strip   |
| `/motion-control`   | ✓   | ✗   | Camera motion presets + generation   |
| `/billing`          | ✓   | ✗   | Credits, packages, transactions      |
| `/admin`            | ✓   | ✓   | Admin dashboard (5 tabs)             |
| `/nurse-reel`       | ✗   | ✗   | Standalone reel idea generator       |

---

## State Management

The app uses 3 React Context providers, all wrapped in `layout.tsx`:

### AuthContext (`src/context/AuthContext.tsx`)

Manages login/logout and route protection.

```typescript
interface User {
  username: string;
  email: string;
  balance: number;
  isAdmin: boolean;
}

// Methods exposed:
login(username: string, password: string): { success: boolean; error?: string }
logout(): void

// Storage: sessionStorage key "xenofield_auth"
```

**🔧 Backend TODO:** Replace the `CREDENTIALS` array (line 22) with an API call:
```typescript
// CURRENT (mock):
const cred = CREDENTIALS.find(c => c.username === username && c.password === password);

// REPLACE WITH:
const res = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});
const data = await res.json();
```

---

### GenerationContext (`src/context/GenerationContext.tsx`)

Stores all generated images/videos for the current session.

```typescript
interface Generation {
  id: string;
  prompt: string;
  model: string;
  quality: string;
  aspectRatio: string;
  images: GeneratedImage[];
  createdAt: string;
  type: 'image' | 'video';
}

interface GeneratedImage {
  id: string;
  gradient: string;   // Currently CSS gradient — replace with image URL
  width: number;
  height: number;
}

// Methods:
addGeneration(gen: Generation): void
clearGenerations(): void

// Storage: sessionStorage key "xenofield_generations"
```

**🔧 Backend TODO:** Replace `gradient` field with actual image URLs from your storage. Replace `sessionStorage` with database persistence.

---

### CharacterContext (`src/context/CharacterContext.tsx`)

CRUD operations for persistent characters used via `@mention` in prompts.

```typescript
interface Character {
  id: string;
  name: string;
  avatar: string;       // CSS gradient or image URL
  photo?: string;       // Reference photo URL
  description: string;
  tags: string[];
  createdFrom: 'prompt' | 'photo';
  createdAt: string;
}

// Methods:
addCharacter(char: Omit<Character, 'id' | 'createdAt'>): void
removeCharacter(id: string): void
getCharacterByName(name: string): Character | undefined
```

**🔧 Backend TODO:** Wire to REST API for create/delete/list. Store character photos in cloud storage.

---

## Backend Integration Guide

### 1. Authentication

**File:** `src/context/AuthContext.tsx`

The current mock checks a hardcoded array. Replace with your auth provider:

| Option          | Suggestion                                    |
|-----------------|-----------------------------------------------|
| NextAuth.js     | Add `next-auth` package, create API routes    |
| Custom JWT      | Create `/api/auth/login` + middleware         |
| Clerk / Auth0   | Replace `AuthProvider` with SDK provider      |

The `isAdmin` flag on the `User` object controls:
- Visibility of "Admin" link in sidebar
- Access guard on `/admin` page

---

### 2. Image Generation

**File:** `src/app/image/page.tsx`

Find the `handleGenerate` function — it currently calls:
```typescript
const gen = generateDemoImages(prompt, count, model, quality, aspect, 'image');
addGeneration(gen);
```

**Replace with:**
```typescript
const res = await fetch('/api/generate/image', {
  method: 'POST',
  body: JSON.stringify({ prompt, count, model, quality, aspectRatio })
});
const gen = await res.json();
addGeneration(gen);
```

The `GeneratedImage.gradient` field should be replaced with an actual `url` field pointing to your CDN/storage.

---

### 3. Video Generation

**File:** `src/app/video/page.tsx`

Two generation handlers to replace:

| Handler                 | Line | Description                        |
|-------------------------|------|------------------------------------|
| `handleGenerate()`      | ~420 | Text-to-video / image-to-video    |
| `handleMotionGenerate()`| ~460 | Motion control generation          |

Both currently use `setTimeout(() => {...}, 3000)` as a mock.

---

### 4. Audio Generation

**File:** `src/app/audio/page.tsx`

Three modes in one page via tabs:

| Tab       | Expected API Endpoint      | Parameters                      |
|-----------|----------------------------|---------------------------------|
| Voiceover | `/api/generate/voiceover`  | text, voice, model              |
| SFX       | `/api/generate/sfx`        | prompt, duration                |
| Music     | `/api/generate/music`      | prompt, genre, duration, model  |

---

### 5. File Uploads

Multiple pages accept file uploads (drag & drop, click, paste). They all use:
```typescript
const url = URL.createObjectURL(file);
```

**Replace with cloud upload:**
```typescript
const formData = new FormData();
formData.append('file', file);
const res = await fetch('/api/upload', { method: 'POST', body: formData });
const { url } = await res.json();
```

Pages with uploads:
- `video/page.tsx` — Reference frames (first/last frame)
- `characters/page.tsx` — Character reference photos
- `post-studio/page.tsx` — Source photos
- `image-editor/page.tsx` — Images to edit
- `motion-control/page.tsx` — Motion video + character image

---

### 6. Billing & Payments

**File:** `src/app/billing/page.tsx`

| Mock                     | Replace With                                |
|--------------------------|---------------------------------------------|
| Hardcoded packages array | Fetch from `/api/billing/packages`          |
| `handlePay()` setTimeout | Payment gateway (Stripe, Coinbase Commerce) |
| Hardcoded transactions   | Fetch from `/api/billing/transactions`      |
| Static credit balance    | Fetch from `/api/user/balance`              |

---

### 7. Admin Panel

**File:** `src/app/admin/page.tsx`

The admin panel has 5 tabs, all using local `useState`:

| Tab         | Data Source          | Backend API Needed                  |
|-------------|----------------------|-------------------------------------|
| Overview    | Computed from context | `/api/admin/stats`                 |
| Users       | `initialUsers` array | `/api/admin/users` (CRUD)          |
| Generations | `GenerationContext`  | `/api/admin/generations` (list)     |
| API Keys    | `useState` array     | `/api/admin/keys` (CRUD)           |
| Settings    | `useState` object    | `/api/admin/settings` (read/write) |

---

### 8. Workflow Projects

**File:** `src/app/workflows/page.tsx`

Currently persists to `localStorage` key `xenofield_workflow_projects`.

Replace `loadProjects()` and `saveProjects()` functions with API calls:
```typescript
// Load
const res = await fetch('/api/workflows');
const projects = await res.json();

// Save
await fetch(`/api/workflows/${project.id}`, {
  method: 'PUT',
  body: JSON.stringify(project)
});
```

---

### 9. Nurse Reel Tool (Standalone)

**File:** `src/app/nurse-reel/page.tsx`

⚠️ **Security Issue:** This page makes a direct client-side call to the Anthropic API using `process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY`. This exposes the key in the browser.

**Fix:** Create a server-side proxy route:
```typescript
// src/app/api/reel-generate/route.ts
export async function POST(req: Request) {
  const { idea } = await req.json();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY },  // server-only
    // ...
  });
  return Response.json(await res.json());
}
```

---

## Suggested API Endpoints

Here's a complete list of API routes the backend should implement:

```
POST   /api/auth/login              # Login
POST   /api/auth/logout             # Logout
GET    /api/auth/me                 # Current user

POST   /api/generate/image          # Generate images
POST   /api/generate/video          # Generate video
POST   /api/generate/motion         # Generate motion video
POST   /api/generate/voiceover      # Generate voiceover
POST   /api/generate/sfx            # Generate sound effects
POST   /api/generate/music          # Generate music

POST   /api/upload                  # Upload file to storage

GET    /api/generations             # List generations
DELETE /api/generations/:id         # Delete generation

GET    /api/characters              # List characters
POST   /api/characters              # Create character
DELETE /api/characters/:id          # Delete character

GET    /api/prompts                 # List saved prompts
POST   /api/prompts                 # Save prompt
DELETE /api/prompts/:id             # Delete prompt

GET    /api/workflows               # List workflow projects
POST   /api/workflows               # Create project
PUT    /api/workflows/:id           # Update project
DELETE /api/workflows/:id           # Delete project

GET    /api/billing/packages        # List credit packages
POST   /api/billing/checkout        # Initiate payment
GET    /api/billing/transactions    # Transaction history
GET    /api/user/balance            # Credit balance

GET    /api/admin/stats             # Dashboard stats
GET    /api/admin/users             # List users
PUT    /api/admin/users/:id         # Update user (role, status)
GET    /api/admin/keys              # List API keys
POST   /api/admin/keys              # Add key
DELETE /api/admin/keys/:id          # Delete key
GET    /api/admin/settings          # Get settings
PUT    /api/admin/settings          # Update settings

POST   /api/reel-generate           # Proxy for Anthropic API
```

---

## Environment Variables

Create a `.env.local` file (not committed to git):

```env
# Authentication (choose your provider)
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/xenofield

# File Storage (S3, Cloudflare R2, etc.)
STORAGE_BUCKET=xenofield-uploads
STORAGE_ACCESS_KEY=your-access-key
STORAGE_SECRET_KEY=your-secret-key
STORAGE_ENDPOINT=https://your-endpoint.com

# AI APIs
OPENAI_API_KEY=sk-...
STABILITY_API_KEY=sk-stab-...
REPLICATE_API_TOKEN=r8_...
ANTHROPIC_API_KEY=sk-ant-...     # Server-side only (no NEXT_PUBLIC_ prefix)

# Payments
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
# OR
COINBASE_COMMERCE_API_KEY=...

# Rate Limiting
RATE_LIMIT_PER_10S=20
```

---

## Design System

All design tokens are defined in `src/app/globals.css` as CSS custom properties:

```css
--bg-primary: #0a0a0c;
--bg-secondary: #111113;
--bg-tertiary: #1a1a1e;
--surface: #1e1e22;
--border: #2a2a2e;
--text-primary: #f0f0f2;
--text-secondary: #a0a0a8;
--text-tertiary: #5a5a64;
--accent: #a855f7;          /* Purple — primary brand color */
--accent-hover: #9333ea;
--danger: #ef4444;
--success: #22c55e;
```

The UI uses a dark-mode-only design with glassmorphism effects. Do not add a light mode — the entire component library is designed for dark themes.

---

## Performance Notes

- **`AmbientBackground` component** renders animated planetary backgrounds using CSS transforms. It can be CPU-intensive on low-end mobile devices. Consider adding a user toggle or `prefers-reduced-motion` media query.
- **`WorkflowCanvas` component** handles drag-and-drop node editing. For large workflows (50+ nodes), consider virtualizing the canvas.
- All pages use `'use client'` directives — this is intentional since every page is highly interactive.

---

## License

Private — © Xenofield AI Studio
