# Prisma Database Setup

## Development Setup

1. **Install PostgreSQL locally** or use Docker:

   ```bash
   docker run --name linknest-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```

2. **Create the database**:

   ```bash
   createdb linknest
   ```

   Or connect to PostgreSQL and run:

   ```sql
   CREATE DATABASE linknest;
   ```

3. **Run migrations**:

   ```bash
   npm run prisma:migrate
   ```

4. **Seed the database** (optional):

   ```bash
   npm run prisma:seed
   ```

5. **Open Prisma Studio** to browse data:
   ```bash
   npm run prisma:studio
   ```

## Environment Variables

### Local Development (.env)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/linknest?schema=public"
```

### Production (Vercel + Neon)

```env
DATABASE_URL="postgresql://user:password@host.neon.tech/linknest?sslmode=require"
```

## Common Commands

- Generate Prisma Client: `npm run prisma:generate`
- Create migration: `npx prisma migrate dev --name <migration-name>`
- Apply migrations: `npm run prisma:migrate`
- Reset database: `npx prisma migrate reset`
- Format schema: `npx prisma format`

## Database Indexes

The schema includes indexes for:

- `userId, createdAt` on Bookmarks for efficient user queries
- Unique constraint on `userId, url` to prevent duplicate bookmarks

## Troubleshooting

### Can't connect to database

- Ensure PostgreSQL is running: `pg_ctl status` or `brew services list`
- Check DATABASE_URL in .env file
- Verify database exists: `psql -l`

### Migration issues

- Run `npx prisma migrate reset` to start fresh (WARNING: deletes all data)
- Check for pending migrations: `npx prisma migrate status`
