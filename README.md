# LIQUID
Your XRPL gateway


## Cloning the repos

This repo contains a git submodule
- the first time when we clone the repos, we have to run this command : `git submodule update --init --remote --recursive`
- to pull the changes : `git pull --recurse-submodules origin master`


## Getting Started

1. Add an .env file with all needed parameters
2. Install dependencies `npm install`
3. Generate Prisma Client to ensure TypeScript functions and types for our SQL queries are created : `npx prisma generate --sql`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database

To generate migration file execute : `prisma migrate dev --name init`
## Deployment

### Vercel
Vercel doesn't support private git submodules, we use this workaround : https://github.com/vercel-contrib/vercel-workaround 