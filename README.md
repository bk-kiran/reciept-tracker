# Keepo - AI-Powered Receipt Tracker

Keepo is a modern, intelligent receipt tracking application that helps you scan, analyze, and organize your receipts with AI-powered precision. Built with Next.js, Convex, and Clerk authentication.

![Keepo](https://img.shields.io/badge/Keepo-Receipt%20Tracker-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Convex](https://img.shields.io/badge/Convex-1.31-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## ✨ Features

### Core Functionality
- **Smart Upload**: Drag and drop or select PDF receipts for easy upload
- **AI Processing**: Automatically extracts and categorizes receipt data
- **Smart Search**: Quickly find receipts by name, date, amount, or category
- **AI-Powered Insights**: Analyze spending patterns and expenses

### Key Capabilities
- PDF receipt upload and storage
- Automatic data extraction from receipts
- Secure user authentication with Clerk
- Real-time data synchronization with Convex
- Responsive design with dark mode support
- Receipt status tracking (pending, processed)

## 🚀 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework for production
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend
- **[Convex](https://convex.dev/)** - Backend-as-a-Service (database, real-time sync, serverless functions)
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **[Inngest](https://www.inngest.com/)** - Background job processing

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Convex account ([sign up here](https://www.convex.dev/))
- A Clerk account ([sign up here](https://clerk.com/))

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd reciept-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_JWT_ISSUER_DOMAIN=your_clerk_jwt_issuer_domain
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 4. Set Up Convex

1. Log in to Convex:
```bash
npx convex dev
```

2. Follow the setup wizard to create a new Convex project or link to an existing one.

3. Configure authentication in `convex/auth.config.ts`:
   - Uncomment the Clerk provider configuration
   - Set up the JWT issuer domain from your Clerk dashboard

### 5. Set Up Clerk

1. Create a new application in the [Clerk Dashboard](https://dashboard.clerk.com/)
2. Configure authentication providers as needed
3. Copy your publishable key and secret key to `.env.local`
4. Create a JWT template in Clerk for Convex integration
5. Copy the JWT issuer domain and add it to `.env.local` and Convex environment variables

### 6. Set Up Inngest

1. Install the Inngest CLI (if not already installed):
   ```bash
   npm install -g inngest-cli
   ```

2. Start the Inngest Dev Server in a separate terminal:
   ```bash
   npx inngest-cli@latest dev
   ```
   This will start the local Inngest server at `http://localhost:8288`

3. The Inngest Dev Server will automatically discover your functions from `/api/inngest` route

### 7. Set Up AI Provider API Keys

The receipt scanning agents use OpenAI and Anthropic models. You need API keys from both:

1. **OpenAI API Key:**
   - Sign up at [OpenAI](https://platform.openai.com/) or use your existing account
   - Go to API Keys section and create a new key
   - Add it to `.env.local` as `OPENAI_API_KEY`

2. **Anthropic API Key:**
   - Sign up at [Anthropic](https://console.anthropic.com/) or use your existing account
   - Go to API Keys section and create a new key
   - Add it to `.env.local` as `ANTHROPIC_API_KEY`

### 8. Run the Development Server

```bash
npm run dev
```

This will start:
- Next.js frontend on `http://localhost:3000`
- Convex backend development server

Or run them separately:

```bash
npm run dev:frontend  # Next.js only
npm run dev:backend   # Convex only
```

## 📁 Project Structure

```
reciept-tracker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── receipts/          # Receipts page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home/landing page
├── actions/               # Server actions
│   ├── uploadPDF.ts       # PDF upload handler
│   └── getFileDownloadUrl.ts
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── PDFDropZone.tsx    # File upload component
│   ├── ConvexClientProvider.tsx
│   └── ui/                # Reusable UI components
├── convex/                # Convex backend
│   ├── receipts.ts        # Receipt queries/mutations
│   ├── schema.ts          # Database schema
│   └── auth.config.ts     # Authentication config
├── lib/                   # Utility libraries
│   ├── ConvexClient.ts    # Convex HTTP client
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

## 🎯 Usage

### Uploading Receipts

1. Sign in with your Clerk account
2. Navigate to the receipts page
3. Drag and drop PDF files or click "Select Files"
4. Wait for the upload to complete
5. Your receipts will be automatically processed

### Viewing Receipts

- View all your receipts on the `/receipts` page
- Search and filter receipts by various criteria
- View extracted data including merchant, date, amount, and items

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start Next.js development server only
- `npm run dev:backend` - Start Convex development server only
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🔐 Authentication

Keepo uses Clerk for authentication:
- Secure user management
- JWT-based authentication with Convex
- Protected routes and API endpoints
- User profile management

## 📚 Learn More

### Convex
- [Convex Documentation](https://docs.convex.dev/)
- [Convex Tour](https://docs.convex.dev/get-started)
- [Convex Stack](https://stack.convex.dev/) - Advanced articles

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)

### Clerk
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk with Convex](https://docs.convex.dev/auth/clerk)

---

Built with ❤️ using Convex, Next.js, and Clerk
