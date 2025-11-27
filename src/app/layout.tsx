import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { MobileContainer } from '@/components/mobile-container';

export const metadata: Metadata = {
  title: 'SwiftBite',
  description: 'Fast, Fresh, Fuel for Your Day.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-gray-200">
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
