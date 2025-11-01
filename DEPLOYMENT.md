# Brand Kit AI - Deployment Guide

## Prerequisites
- Node.js 20.x or higher
- PostgreSQL database (Neon recommended)
- OpenAI API key
- Stripe account (for payments)

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Random string (at least 32 characters)
- `OPENAI_API_KEY`: Your OpenAI API key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PRICE_ID_PRO`: Stripe price ID for Pro tier
- `STRIPE_PRICE_ID_ENTERPRISE`: Stripe price ID for Enterprise tier
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `PORT`: (optional, defaults to 5000)
- `NODE_ENV`: Set to `production` for production deployments

## Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables in `.env`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Push schema to database:
   ```bash
   npm run db:push
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

Server runs on http://localhost:5000

## Docker Deployment

### Using Docker Compose (Recommended for local testing)

1. Create a `.env` file with your environment variables

2. Start all services:
   ```bash
   docker-compose up -d
   ```

3. Stop services:
   ```bash
   docker-compose down
   ```

### Using Docker only

1. Build the image:
   ```bash
   docker build -t brand-kit-ai .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 \
     -e DATABASE_URL="your-database-url" \
     -e SESSION_SECRET="your-session-secret" \
     -e OPENAI_API_KEY="your-openai-key" \
     -e STRIPE_SECRET_KEY="your-stripe-key" \
     -e STRIPE_PRICE_ID_PRO="your-pro-price-id" \
     -e STRIPE_PRICE_ID_ENTERPRISE="your-enterprise-price-id" \
     -e STRIPE_WEBHOOK_SECRET="your-webhook-secret" \
     brand-kit-ai
   ```

## Platform-Specific Deployments

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard

4. Configure a PostgreSQL database (Neon, Supabase, or Vercel Postgres)

**Note**: Vercel has limitations for full-stack apps. Consider using Vercel for frontend only and a separate backend service.

### Railway

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and initialize:
   ```bash
   railway login
   railway init
   ```

3. Add a PostgreSQL database:
   ```bash
   railway add
   # Select PostgreSQL
   ```

4. Set environment variables:
   ```bash
   railway variables set SESSION_SECRET="your-secret"
   railway variables set OPENAI_API_KEY="your-key"
   # Set other variables...
   ```

5. Deploy:
   ```bash
   railway up
   ```

Configuration is in `railway.toml`.

### Render

1. Create a new Web Service in Render dashboard

2. Connect your GitHub repository

3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. Add a PostgreSQL database in Render

5. Set environment variables in the Render dashboard

6. Deploy

Configuration is in `render.yaml`.

### Fly.io

1. Install Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Login:
   ```bash
   fly auth login
   ```

3. Launch the app:
   ```bash
   fly launch
   ```

4. Create a PostgreSQL database:
   ```bash
   fly postgres create
   fly postgres attach <postgres-app-name>
   ```

5. Set environment variables:
   ```bash
   fly secrets set SESSION_SECRET="your-secret"
   fly secrets set OPENAI_API_KEY="your-key"
   # Set other variables...
   ```

6. Deploy:
   ```bash
   fly deploy
   ```

Configuration is in `fly.toml`.

### DigitalOcean App Platform

1. Create a new app in DigitalOcean dashboard

2. Connect your GitHub repository

3. Configure:
   - **Type**: Web Service
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`

4. Add a PostgreSQL database component

5. Set environment variables in the app settings

6. Deploy

### Heroku

1. Install Heroku CLI:
   ```bash
   npm install -g heroku
   ```

2. Login:
   ```bash
   heroku login
   ```

3. Create app:
   ```bash
   heroku create your-app-name
   ```

4. Add PostgreSQL:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. Set environment variables:
   ```bash
   heroku config:set SESSION_SECRET="your-secret"
   heroku config:set OPENAI_API_KEY="your-key"
   # Set other variables...
   ```

6. Deploy:
   ```bash
   git push heroku main
   ```

## Production Checklist

Before deploying to production, ensure:

- [ ] All environment variables are set
- [ ] Database is configured and accessible
- [ ] `NODE_ENV` is set to `production`
- [ ] SSL/TLS is enabled
- [ ] Database migrations are run (`npm run db:push`)
- [ ] Stripe webhooks are configured
- [ ] OpenAI API key is valid and has sufficient credits
- [ ] Health check endpoint (`/health`) is accessible
- [ ] Static files are served correctly
- [ ] CORS settings are configured if needed

## Monitoring

The application includes a health check endpoint at `/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2025-11-01T19:00:00.000Z"
}
```

Use this endpoint for:
- Load balancer health checks
- Uptime monitoring
- Container orchestration health probes

## Troubleshooting

### Build fails
- Ensure Node.js 20.x or higher is installed
- Run `npm ci` to clean install dependencies
- Check that all required environment variables are set

### Application won't start
- Verify `DATABASE_URL` is correct and database is accessible
- Check that port 5000 (or `PORT` env var) is available
- Review logs for specific error messages

### Database connection errors
- Verify PostgreSQL is running and accessible
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure firewall allows connections from your application

### Stripe webhooks not working
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Check that your deployment URL is configured in Stripe dashboard
- Ensure webhook endpoint is accessible publicly

## Security Notes

- Never commit `.env` files to version control
- Use strong, random values for `SESSION_SECRET` (minimum 32 characters)
- Rotate API keys regularly
- Enable SSL/TLS in production
- Use environment-specific Stripe keys (test vs. production)
- Keep dependencies updated (`npm audit` and `npm update`)

