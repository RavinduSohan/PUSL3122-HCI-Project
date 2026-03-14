import type { Metadata } from 'next';
import { Inter, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'FurniView — Room Visualiser',
  description: 'Plan your perfect room with 2D and 3D furniture visualisation',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${dmSerif.variable} min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 24px rgba(0,0,0,0.30)',
              border: '1px solid rgba(255,255,255,0.08)',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#1E293B' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#1E293B' } },
          }}
        />
      </body>
    </html>
  );
}

