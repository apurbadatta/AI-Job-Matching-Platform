<div align="center">

# 🎨 JobPilot AI — Client

### Next.js 14 + React + TypeScript Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev

# Client runs on http://localhost:3000
```

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 🔐 Environment Variables

Create a `.env.local` file in the client root:

```env
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

## 📁 Pages & Routes

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, pricing |
| `/jobs` | Job listing with filters and search |
| `/jobs/[id]` | Job detail page |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog article detail |
| `/pricing` | Pricing plans |
| `/about` | About page |
| `/contact` | Contact form |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |
| `/cookies` | Cookie policy |
| `/accessibility` | Accessibility statement |

### Auth Pages
| Route | Description |
|-------|-------------|
| `/login` | Login with email or Google |
| `/register` | Register as candidate or employer |

### Candidate Pages
| Route | Description |
|-------|-------------|
| `/dashboard` | Dashboard with AI recommendations |
| `/profile` | Edit profile, skills, experience |
| `/applications` | Track job applications |
| `/cover-letters` | Cover letter history |

### Employer Pages
| Route | Description |
|-------|-------------|
| `/jobs/manage` | Employer dashboard overview |
| `/jobs/manage/jobs` | Manage job postings |
| `/jobs/manage/applicants` | View all applicants |
| `/jobs/manage/applicants/[jobId]` | Per-job applicants |
| `/jobs/manage/payment` | Subscription & invoices |
| `/jobs/add` | Create new job posting |

### Admin Pages
| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard overview |
| `/admin/analytics` | Charts and analytics |
| `/admin/users` | User management |
| `/admin/jobs` | Job moderation |
| `/admin/payments` | Payment oversight |

## 🧩 Components

### Layout Components
- `Navbar` — Navigation with role-based links, avatar, theme toggle
- `Footer` — Site footer with links

### Shared Components
- `ThemeProvider` — Dark/light mode context
- `AIChatbot` — Floating AI career assistant

### Page Components
- `LandingPage` — Home page with hero, features, pricing
- `JobsList` — Job grid with filters
- `JobCard` — Individual job card
- `EmployerLayout` — Employer dashboard sidebar

## 🎨 Design System

### Colors
- **Primary**: Blue (`#3B82F6`)
- **Secondary**: Purple (`#8B5CF6`)
- **Success**: Green (`#10B981`)
- **Warning**: Yellow (`#F59E0B`)
- **Error**: Red (`#EF4444`)

### Components
- Rounded corners (`rounded-xl`, `rounded-2xl`)
- Subtle borders (`border-gray-200`)
- Card-based layouts
- Responsive grid system

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory to `client/`
4. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL` = your server URL
   - `NEXT_PUBLIC_BETTER_AUTH_URL` = your server URL
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = your Google client ID
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your Stripe key
5. Deploy

### Vercel Configuration

The `vercel.json` file configures:
- Framework: Next.js
- Build command: `npm run build`
- Security headers (XSS protection, CSRF, etc.)
- Environment variable references

## 📁 Structure

```
client/
├── src/
│   ├── app/                    # App Router
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── analytics/
│   │   │   ├── jobs/
│   │   │   ├── payments/
│   │   │   └── users/
│   │   ├── applications/       # Candidate applications
│   │   ├── blog/               # Blog pages
│   │   ├── cover-letters/      # Cover letters
│   │   ├── dashboard/          # Candidate dashboard
│   │   ├── jobs/               # Jobs + Employer dashboard
│   │   │   ├── add/
│   │   │   ├── manage/
│   │   │   │   ├── applicants/
│   │   │   │   ├── jobs/
│   │   │   │   └── payment/
│   │   │   └── [id]/
│   │   ├── login/
│   │   ├── register/
│   │   ├── pricing/
│   │   ├── profile/
│   │   └── layout.tsx
│   ├── components/             # Reusable components
│   │   ├── AIChatbot.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Navbar.tsx
│   │   └── ThemeProvider.tsx
│   └── lib/                    # Utilities
│       ├── api.ts              # Axios API client
│       ├── auth-client.ts      # Better Auth client
│       └── utils.ts
├── public/                     # Static assets
├── next.config.mjs             # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
├── vercel.json                 # Vercel config
└── package.json
```

## 🛠️ Tech Details

### State Management
- **TanStack Query** — Server state (API data, caching, refetching)
- **React State** — UI state (modals, forms, filters)

### Styling
- **Tailwind CSS** — Utility-first CSS framework
- **Dark Mode** — System preference + manual toggle
- **Responsive** — Mobile-first design

### Authentication
- **Better Auth** — Email/password + Google OAuth
- **Session-based** — HTTP-only cookies
- **Role-based** — Candidate, Employer, Admin
