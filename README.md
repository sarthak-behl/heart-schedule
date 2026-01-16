# HeartSchedule

An emotional, user-centric web app that helps you schedule heartfelt messages for important occasions and automatically sends them at the perfect moment.

## Features

- Choose from various occasions (birthday, anniversary, apology, gratitude, etc.)
- Write personal messages or AI-generate them
- Schedule date and time for automatic sending
- Email sent in your name at the scheduled time

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase), Prisma ORM
- **Authentication**: NextAuth.js
- **Email**: Resend
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (recommended: Supabase free tier)
- OpenAI API key
- Resend API key

### Installation

1. Install dependencies
```bash
npm install
```

2. Set up environment variables

Edit `.env.local` and fill in your actual values:

```bash
# Database - Get this from Supabase
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email Service
RESEND_API_KEY="re_your_api_key"

# AI Service
OPENAI_API_KEY="sk_your_openai_key"

# Cron Protection
CRON_SECRET="your-random-secret"

# Application
FROM_EMAIL="hello@heartschedule.app"
FROM_NAME="HeartSchedule"
```

3. Set up the database

```bash
# Once you have a live DATABASE_URL, run migrations
npx prisma migrate dev --name init

# Or push schema to database
npx prisma db push
```

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
HeartSchedule/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Auth pages (login, signup)
│   ├── (dashboard)/    # Protected dashboard pages
│   ├── api/            # API routes
│   └── page.tsx        # Landing page
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature components
├── lib/                # Utilities and configurations
│   ├── prisma.ts       # Prisma client
│   └── ...             # Other utilities
├── prisma/             # Database schema and migrations
└── types/              # TypeScript types
```

## Development Status

Currently in active development. See implementation plan in `.claude/plans/` for detailed roadmap.

### Completed
- [x] Project setup with Next.js, TypeScript, Tailwind CSS
- [x] shadcn/ui component library integration
- [x] Prisma ORM with PostgreSQL schema
- [x] Database models for User and Message

### In Progress
- [ ] Authentication (NextAuth.js)
- [ ] Landing page
- [ ] Message creation flow
- [ ] AI message generation
- [ ] Email sending integration
- [ ] Scheduling system
- [ ] Dashboard

## License

MIT
