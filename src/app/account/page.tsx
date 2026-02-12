'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Booking } from '@/lib/types';
import Link from 'next/link';

interface BookingWithVehicle extends Booking {
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_year?: number;
}

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<BookingWithVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem('driveease_user');
        if (!stored) {
            router.push('/login');
            return;
        }
        const parsed = JSON.parse(stored);
        setUser(parsed);

        // Fetch user bookings
        fetch('/api/bookings')
            .then(res => res.json())
            .then(data => {
                const userBookings = data.filter((b: BookingWithVehicle) => b.user_id === parsed.id);
                setBookings(userBookings);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('driveease_user');
        window.dispatchEvent(new Event('auth-change'));
        router.push('/');
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-primary/15 text-primary border-primary/20';
            case 'CANCELLED': return 'bg-danger/10 text-danger border-danger/20';
            default: return 'bg-accent/10 text-accent border-accent/20';
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Profile Card */}
            <div className="bg-surface rounded-2xl border border-border p-8 mb-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold text-foreground">My Account</h1>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-muted">
                                📱 {user.country_code} {user.phone}
                            </p>
                            <p className="text-xs text-muted">
                                Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 text-sm font-medium text-danger border border-danger/20 hover:bg-danger/10 rounded-xl transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Booking History */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Booking History</h2>
                <span className="text-sm text-muted">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-surface rounded-2xl p-6 border border-border">
                            <div className="h-5 w-1/3 shimmer rounded mb-3" />
                            <div className="h-4 w-1/2 shimmer rounded" />
                        </div>
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-surface rounded-2xl border border-border p-12 text-center">
                    <p className="text-muted mb-4">No bookings yet</p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary to-primary-dark shadow-sm hover:shadow-md transition-all"
                    >
                        Browse Vehicles
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-surface rounded-2xl p-5 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-foreground">
                                    {booking.vehicle_make && booking.vehicle_model
                                        ? `${booking.vehicle_year || ''} ${booking.vehicle_make} ${booking.vehicle_model}`.trim()
                                        : `Vehicle #${booking.vehicle_id}`}
                                </h3>
                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusStyles(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted">
                                <span>{new Date(booking.start_date).toLocaleDateString()} → {new Date(booking.end_date).toLocaleDateString()}</span>
                                <span className="font-semibold text-foreground">${Number(booking.total_price).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
