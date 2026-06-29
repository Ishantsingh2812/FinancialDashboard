import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const nextAuth = NextAuth(authConfig);

export const GET = nextAuth.handlers.GET;
export const POST = nextAuth.handlers.POST;
