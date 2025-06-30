# LinkNest

A friction‑free, cross‑device home for personal and shareable bookmarks that feels as quick as opening a new browser tab.

## Overview

LinkNest is a modern bookmark management application designed to make saving, organizing, and sharing links effortless. Built with performance and user experience in mind, it provides a seamless way to manage your digital collection across all your devices.

## Tech Stack

- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers & Server Actions
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Auth**: NextAuth.js (Auth.js)
- **Deployment**: Vercel
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS with custom design system

## Features

- 🚀 Lightning-fast link saving with automatic metadata extraction
- 📂 Organize links into collections with drag-and-drop
- 🏷️ Tag-based organization and filtering
- 🔍 Full-text search across all your bookmarks
- 🔗 Public sharing of collections with custom URLs
- 📱 Responsive design for all devices
- 🔒 Secure authentication with OAuth providers
- 📊 Analytics to track your most visited links

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm
- PostgreSQL database (local or hosted)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/linknest.git
cd linknest
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
# Add OAuth provider credentials
```

5. Run database migrations:
```bash
pnpm prisma migrate dev
```

6. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
linknest/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── features/         # Feature-specific components
├── lib/                   # Utility functions and configurations
│   ├── db/               # Database client and queries
│   └── utils/            # Helper functions
├── hooks/                 # Custom React hooks
├── services/             # Business logic and external services
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Development

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript compiler check
- `pnpm test` - Run tests
- `pnpm prisma studio` - Open Prisma Studio

### Code Quality

We use the following tools to maintain code quality:
- TypeScript with strict mode for type safety
- ESLint with custom rules for code consistency
- Prettier for code formatting
- Husky for pre-commit hooks
- GitHub Actions for CI/CD

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Neon](https://neon.tech/)
- Deployed on [Vercel](https://vercel.com/)