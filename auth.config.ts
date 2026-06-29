import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const nextUrl = request.nextUrl;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        return isLoggedIn; // only allow if logged in
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl.href));
      }
      return true;
    },
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Replace with your real user lookup
        if (
          credentials?.email === 'test@test.com' &&
          credentials?.password === '123456'
        ) {
          return { id: '1', name: 'Test User', email: 'test@test.com' };
        }
        return null; // Invalid login
      },
    }),
  ],
  secret: process.env.AUTH_SECRET, // must be set in .env
} satisfies NextAuthConfig;
