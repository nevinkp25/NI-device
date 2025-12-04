import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { MobileContainer } from '@/components/mobile-container';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'SwiftBite',
  description: 'Fast, Fresh, Fuel for Your Day.',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("font-sans antialiased bg-gray-100", inter.variable)}>
        <CartProvider>
          <MobileContainer>
            {children}
          </MobileContainer>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
