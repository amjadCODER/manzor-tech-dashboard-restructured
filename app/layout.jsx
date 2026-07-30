import './globals.css';

export const metadata = {
  title: 'MANZOR TECH',
  description: 'MANZOR TECH systems platform',
  icons: {
    icon: '/manzor-tech-icon.png',
    shortcut: '/manzor-tech-icon.png',
    apple: '/manzor-tech-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
