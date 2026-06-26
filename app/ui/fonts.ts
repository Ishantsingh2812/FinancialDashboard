import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'], // Inter supports multiple weights
});

export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: '400', // Lusitana only has 400 and 700
});

