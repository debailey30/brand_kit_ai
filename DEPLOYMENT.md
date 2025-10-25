# Brand Kit AI - Deployment Guide

## Prerequisites
- Node.js 20.x or higher
- PostgreSQL database (Neon recommended)
- OpenAI API key
- Stripe account (for payments)

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Random string (at least 32 characters)
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PRICE_ID_PRO`: Stripe price ID for Pro tier
   - `STRIPE_PRICE_ID_ENTERPRISE`: Stripe price ID for Enterprise tier
   - `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret

## Database Setup

1. Push schema to database:
   ```bash
   npm run db:push
   ```

## Development

```bash
npm install
npm run dev
```

Server runs on http://localhost:5000

## Production Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm run start
```

## GitHub Deployment

1. Push to GitHub
2. Set up environment variables in your hosting platform (Vercel, Railway, Render, etc.)
3. Deploy from GitHub repository

### Environment Variables for Production
Make sure all variables from `.env.example` are set in your hosting platform's environment configuration.
