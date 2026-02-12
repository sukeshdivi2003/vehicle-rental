'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const checkAuth = () => {
            const stored = localStorage.getItem('driveease_user');
            setUser(stored ? JSON.parse(stored) : null);
        };

        // Load saved theme
        const savedTheme = localStorage.getItem('driveease_theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        checkAuth();
        window.addEventListener('auth-change', checkAuth);
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('auth-change', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('driveease_theme', next);
    };

    return (
        <nav className="sticky top-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h8M8 17v-4m8 4v-4m-8 0h8m-8 0V9a4 4 0 018 0v4" />
                        </svg>
                    </div>
                    <span className="text-lg font-bold gradient-text">DriveEase</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
                        Vehicles
                    </Link>
                    <Link href="/bookings" className="text-sm text-muted hover:text-foreground transition-colors">
                        My Bookings
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        data-active={theme === 'light'}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        <div className="toggle-knob">
                            {theme === 'dark' ? (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {user ? (
                        <Link
                            href="/account"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/20 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {user.phone.slice(-4)}
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/20 transition-all"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
