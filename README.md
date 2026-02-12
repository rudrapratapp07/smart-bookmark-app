# Smart Bookmark App

A simple, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google Authentication**: Secure sign-up and login via Google OAuth.
- **CRUD Operations**: Add and delete bookmarks.
- **Real-time Updates**: Changes (additions/deletions) reflected instantly across tabs/devices.
- **Privacy**: Bookmarks are protected by Row Level Security (RLS) policies; users can only see their own data.

## Tech Stack

- **Frontend/Framework**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime)

## Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd smart-bookmark-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

4.  **Database Setup**
    Run the SQL script found in `supabase/schema.sql` in your Supabase SQL Editor to create the table and security policies.

5.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Deployment

This app is ready to be deployed on Vercel.

1.  Push your code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel Environment Variables.
4.  Deploy!

## Challenges & Solutions

### 1. Real-time Subscription Security
**Problem**: Ensuring users only receive updates for their own data.
**Solution**: Used PostgreSQL Row Level Security (RLS) policies (`auth.uid() = user_id`) and filtered the realtime subscription on the client side with `filter: user_id=eq.${userId}`.

### 2. Next.js App Router & Supabase Auth
**Problem**: Managing sessions across Server Components, Client Components, and Middleware.
**Solution**: Implemented specialized Supabase client creators for each context (`server.ts`, `client.ts`, `middleware.ts`) using `@supabase/ssr` to handle cookie management securely.

### 3. Optimistic Updates vs Real-time
**Problem**: Avoiding duplicate entries when adding a bookmark (one from local state, one from realtime event).
**Solution**: `BookmarkList` listens to database events. For smoother UX, we could implement optimistic updates, but relying on the fast Real-time subscription ensures the truest state is always displayed globally.
