# Hinder2

A modern dating app MVP built with Next.js 15, TypeScript, and Supabase.

## Features

- User authentication (signup/login)
- Profile creation and editing
- Photo uploads
- Swipe-based discovery
- Matching system
- Real-time messaging
- Block/report functionality
- Admin panel

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase Auth & Database
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query
- **Validation**: Zod
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd hinder2
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Go to Settings > API to get your URL and keys
3. Go to Settings > Database to get your connection string
4. Enable Row Level Security (RLS) on all tables (or disable for development)
5. Set up Storage bucket for profile photos

### 4. Database Setup

Generate and push the schema:

```bash
npm run db:generate
npm run db:push
```

### 5. Seed the Database

```bash
npm run db:seed
```

This creates demo users, profiles, and some sample interactions.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── (public)/          # Public pages (landing, login, signup)
├── (protected)/       # Protected pages (discover, matches, etc.)
├── admin/            # Admin pages
├── api/              # API routes
└── globals.css       # Global styles

components/
├── ui/               # Reusable UI components (shadcn)
├── auth/             # Auth-related components
├── profile/          # Profile components
├── discovery/        # Discovery/swipe components
├── matches/          # Match-related components
├── chat/             # Chat/messaging components
└── shared/           # Shared components

lib/
├── auth/             # Authentication utilities
├── db/               # Database connection and queries
├── services/         # Business logic services
├── validation/       # Zod schemas
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Database Schema

The app uses the following main tables:

- `users` - User accounts
- `profiles` - User profiles
- `profile_photos` - User photos
- `interests` - Available interests
- `profile_interests` - User-interest relationships
- `swipes` - Swipe actions
- `matches` - Mutual matches
- `conversations` - Chat conversations
- `messages` - Chat messages
- `reports` - User reports
- `blocks` - User blocks

## API Routes

- `GET/POST /api/profile` - Profile management
- `GET /api/discovery` - Get discovery candidates
- `POST /api/swipes` - Process swipes
- `GET /api/matches` - Get user matches
- `GET /api/messages` - Get conversations
- `GET/POST /api/messages/[id]` - Conversation messages
- `GET /api/auth/me` - Current user info

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Supabase

Ensure your Supabase project is set up with:
- Database schema deployed
- Storage bucket for photos
- Authentication configured
- Realtime enabled for messaging

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with demo data

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (configure as needed)
- Modular architecture with clear separation of concerns

## Contributing

1. Follow the existing code structure
2. Use TypeScript types everywhere
3. Keep business logic in services
4. Validate all inputs with Zod
5. Test your changes

## License

MIT