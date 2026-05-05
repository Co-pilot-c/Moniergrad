# Tunakarya CMS Backend API

Backend Express.js CMS dengan Prisma ORM dan Neon PostgreSQL. Headless CMS API - tanpa UI, hanya REST API endpoints.

## Fitur

- ✅ REST API untuk Hero, Struktur, Purna, Program, Settings, Navigation
- ✅ Prisma ORM dengan Neon PostgreSQL
- ✅ CORS enabled untuk integrasi frontend eksternal
- ✅ Deploy-ready untuk Vercel

## Quick Start

```bash
cd /home/raka/MyKoding/Tunakarya/cms
npm install
npx prisma generate
npx prisma db push
npm start
```

Server berjalan di `http://localhost:3000`

## API Endpoints

| Collection | Endpoints |
|------------|-----------|
| **Hero** | `GET /api/hero`, `GET /api/hero/:id`, `POST /api/hero`, `PUT /api/hero/:id`, `DELETE /api/hero/:id` |
| **Struktur** | `GET /api/struktur`, `GET /api/struktur/:id`, `POST /api/struktur`, `PUT /api/struktur/:id`, `DELETE /api/struktur/:id` |
| **Purna** | `GET /api/purna`, `GET /api/purna/:id`, `POST /api/purna`, `PUT /api/purna/:id`, `DELETE /api/purna/:id` |
| **Program** | `GET /api/program`, `GET /api/program/:id`, `POST /api/program`, `PUT /api/program/:id`, `DELETE /api/program/:id` |
| **Settings** | `GET /api/settings`, `PUT /api/settings` |
| **Navigation** | `GET /api/navigation`, `POST /api/navigation`, `PUT /api/navigation/:id`, `DELETE /api/navigation/:id` |
| **Health** | `GET /api/health` |

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
FRONTEND_URL=http://localhost:5173
PORT=3000
```

## Deploy ke Vercel

```bash
vercel --prod
```

Set environment variables di Vercel Dashboard.

## Struktur Project

```
cms/
├── prisma/schema.prisma   # Database models
├── server.js              # Express API server
├── package.json           # Dependencies
├── vercel.json            # Deploy config
└── .env                   # Environment variables
