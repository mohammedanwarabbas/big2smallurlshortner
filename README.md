# B2S – Big 2 Small URL Shortener

Minimal instructions for review. Repo: https://github.com/mohammedanwarabbas/big2smallurlshortner

## Tech
- Next.js App Router (TypeScript)
- NextAuth (Google OAuth)
- MongoDB (clicks + links)
- MUI + Tailwind (UI)

## Features
- Google sign-in (only authenticated users manage links)
- Create short links (custom slug optional) with unique check
- Redirect `/go/[slug]` with analytics (user-agent, IP, time)
- Dashboard: list/create/edit/delete, click counts
- Daily rate limit (100/day per user)
- Analytics page with details and mobile-friendly view

## Quick Start (Local)
1) Clone and enter project
```bash
git clone https://github.com/mohammedanwarabbas/big2smallurlshortner.git
cd big2smallurlshortner
```
2) Install deps (peer dependency warnings related to React 19 and Material-UI might come)
```bash
npm install --legacy-peer-deps
```
3) Create `.env.local` (example values):
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-strong-random-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=mongodb://localhost:27017/b2s
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
4) Build
```bash
npm run build
```

5) Start
```bash
npm run start
```
Open http://localhost:3000




## Seeding n number of links(optional)
- Configure in `scripts/seedLinks.ts` (or with env):
```bash
SEED_USER_ID=<existing_user_id>
SEED_COUNT=20
```
- Ensure MONGODB_URI is set in `.env.local`, then run:
```bash
npm run seed
# If env not loading, run: DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/seedLinks.ts
```


## Repo
https://github.com/mohammedanwarabbas/big2smallurlshortner
