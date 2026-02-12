'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/lib/types';
import Link from 'next/link';

export default function Home() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVehicles() {
            try {
                const res = await fetch('/api/vehicles');
                const data = await res.json();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchVehicles();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent py-20 sm:py-28">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)',
                        backgroundSize: '50px 50px'
                    }} />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                        Drive Your Dream
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                        Premium vehicles available for rent. Browse our fleet, pick your dates, and hit the road with confidence.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <a href="#fleet" className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl text-primary bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200">
                            Browse Fleet
                        </a>
                        <Link href="/bookings" className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-200">
                            My Bookings
                        </Link>
                    </div>
                </div>
            </section>

            {/* Fleet Section */}
            <section id="fleet" className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground">Our Fleet</h2>
                    <p className="mt-2 text-muted text-sm">Choose from our selection of premium vehicles</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                                <div className="h-52 shimmer" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 w-2/3 shimmer rounded" />
                                    <div className="h-4 w-full shimmer rounded" />
                                    <div className="h-4 w-1/2 shimmer rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.map((vehicle) => (
                            <Link
                                key={vehicle.id}
                                href={`/vehicles/${vehicle.id}`}
                                className="vehicle-card block bg-surface rounded-2xl shadow-sm overflow-hidden border border-border hover:border-primary-light"
                            >
                                <div className="h-52 w-full relative overflow-hidden">
                                    <img
                                        src={vehicle.image_url}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${vehicle.is_available ? 'bg-success/90 text-white' : 'bg-danger/90 text-white'}`}>
                                            {vehicle.is_available ? '● Available' : '● Booked'}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3 glass rounded-lg px-3 py-1.5">
                                        <span className="text-sm font-bold text-foreground">${vehicle.price_per_day}</span>
                                        <span className="text-xs text-muted">/day</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </h3>
                                    <p className="mt-1.5 text-sm text-muted line-clamp-2">{vehicle.description}</p>
                                    <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                        View Details
                                        <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Features */}
            <section className="bg-surface border-t border-border py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-foreground">Instant Booking</h3>
                            <p className="mt-2 text-sm text-muted">Book in seconds with real-time availability checks</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-foreground">Transaction Safety</h3>
                            <p className="mt-2 text-sm text-muted">PostgreSQL-backed transactional integrity for every booking</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-foreground">Transparent Pricing</h3>
                            <p className="mt-2 text-sm text-muted">Clear per-day rates with no hidden fees</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
