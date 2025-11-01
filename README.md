# Brand Kit AI

A professional brand asset generation platform using AI to create logos, social media graphics, and marketing materials.

## 🚀 Features

- **AI-Powered Generation**: Create professional brand assets using advanced AI models
- **Brand Kit Management**: Organize colors, fonts, and assets in cohesive brand kits
- **Template Marketplace**: Browse and purchase professional templates
- **Subscription Tiers**: Free, Pro, and Enterprise plans with different generation limits
- **User Authentication**: Secure local email/password authentication
- **Payment Integration**: Stripe-powered subscription and template purchases

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** with shadcn/ui components
- **Wouter** for client-side routing
- **TanStack Query** for server state management

### Backend

- **Node.js** with Express and TypeScript
- **SQLite** database with Drizzle ORM
- **Passport.js** for authentication
- **OpenAI API** for image generation
- **Stripe API** for payments

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/debailey30/brand_kit_ai.git
cd brand_kit_ai
```

2.set up environment variables:

```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

4.Initialize the database:

```bash
npm run db:push
```

Start the development server:

```bash
npm run dev
```

## 📋 Environment Variables

Create a `.env` file with the following variables:

```env
# Session Secret (generate a secure random string)
SESSION_SECRET=your-secure-session-secret-here

# OpenAI API Key (required for image generation)
OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration (required for payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PRICE_ID_PRO=your-pro-price-id
STRIPE_PRICE_ID_ENTERPRISE=your-enterprise-price-id
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Port (optional, defaults to 3000)
PORT=3000
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Hosting Recommendations

- **Vercel** - Easy deployment with GitHub integration
- **Railway** - Simple Node.js hosting with database
- **Render** - Full-stack hosting with SQLite persistence
- **DigitalOcean App Platform** - Scalable cloud hosting

## 📄 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run check` - Run TypeScript type checking

## 🔧 Database

The application uses SQLite for data persistence with the following main entities:

- **Users** - User accounts and profiles
- **Subscriptions** - Subscription tiers and billing
- **Brand Kits** - User's brand asset collections
- **Generations** - AI-generated images and history
- **Templates** - Marketplace templates and purchases

## 🎨 Features Overview

### For Users

- Create and manage brand kits
- Generate AI-powered brand assets
- Browse and purchase templates
- Manage subscriptions and billing

### For Creators

- Upload and sell templates
- Earn from template sales
- Manage template variants and customizations

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. Please contact the maintainers for contribution guidelines.

---

Built with ❤️ using modern web technologies
