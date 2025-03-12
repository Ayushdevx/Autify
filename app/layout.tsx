import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Sidebar } from '@/components/sidebar';
import { Player } from '@/components/player';

export const metadata: Metadata = {
  title: 'AUtify - AI-Powered Music Streaming',
  description: 'The most modern AI-powered music streaming platform',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-screen bg-background">
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-64 flex-shrink-0">
                <Sidebar />
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto pb-24">
                {children}
              </div>
            </div>

            {/* Player */}
            <Player />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}