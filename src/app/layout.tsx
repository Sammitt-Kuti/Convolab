import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ConvoLab — Personalised Communication Practice Platform',
  description:
    'AI-powered simulator to practice nuanced interpersonal scenarios: interpreting ambiguous messages, setting firm boundaries, avoiding overexplaining, and speaking up in groups.',
  keywords: [
    'communication practice',
    'interview preparation',
    'social cues',
    'workplace communication',
    'setting boundaries',
    'concise speaking'
  ],
  authors: [{ name: 'ConvoLab Research Team' }],
  robots: 'index, follow'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#06080e'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
