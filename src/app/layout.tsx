import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DriveEase — Vehicle Rental Booking",
  description: "Book premium vehicles for any occasion. Fast, reliable, and affordable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navbar */}
        <nav className="glass sticky top-0 z-50 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.5L21 11M3 11h18M3 11v6a1 1 0 001 1h1a2 2 0 004 0h6a2 2 0 004 0h1a1 1 0 001-1v-6" />
                  </svg>
                </div>
                <span className="text-xl font-bold gradient-text">DriveEase</span>
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                  Vehicles
                </Link>
                <Link href="/bookings" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                  My Bookings
                </Link>
                <Link
                  href="/"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.5L21 11M3 11h18M3 11v6a1 1 0 001 1h1a2 2 0 004 0h6a2 2 0 004 0h1a1 1 0 001-1v-6" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-foreground">DriveEase</span>
              </div>
              <p className="text-xs text-muted">
                © {new Date().getFullYear()} DriveEase. Vehicle Rental Booking System. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
