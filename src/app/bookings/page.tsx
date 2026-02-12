'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/lib/types';
import Link from 'next/link';

interface BookingWithVehicle extends Booking {
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_year?: number;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<BookingWithVehicle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const res = await fetch('/api/bookings');
                const data = await res.json();
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-success/10 text-success border-success/20';
            case 'PENDING':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'CANCELLED':
                return 'bg-danger/10 text-danger border-danger/20';
            default:
                return 'bg-muted/10 text-muted border-muted/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground">My Bookings</h1>
                    <p className="mt-1 text-muted text-sm">Track and manage all your vehicle reservations</p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-sm hover:shadow-md transition-all duration-200"
                >
                    + New Booking
                </Link>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-surface rounded-2xl p-6 border border-border">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1">
                                    <div className="h-5 w-1/3 shimmer rounded" />
                                    <div className="h-4 w-1/2 shimmer rounded" />
                                    <div className="h-4 w-1/4 shimmer rounded" />
                                </div>
                                <div className="h-8 w-24 shimmer rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h3>
                    <p className="text-muted mb-6">Start by browsing our fleet and booking your perfect vehicle.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary to-primary-dark shadow-md hover:shadow-lg transition-all"
                    >
                        Browse Vehicles
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="vehicle-card bg-surface rounded-2xl p-6 border border-border hover:border-primary-light">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Booking #{booking.id}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                                        <div>
                                            <p className="text-xs text-muted uppercase tracking-wide">Vehicle ID</p>
                                            <p className="text-sm font-medium text-foreground">#{booking.vehicle_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted uppercase tracking-wide">Dates</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {new Date(booking.start_date).toLocaleDateString()} → {new Date(booking.end_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted uppercase tracking-wide">Total</p>
                                            <p className="text-sm font-bold gradient-text">${Number(booking.total_price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-muted">
                                    Booked on {new Date(booking.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
