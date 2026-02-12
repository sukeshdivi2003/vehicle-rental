'use client';

import { useState, useEffect, use } from 'react';
import { Vehicle } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function VehicleDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        async function fetchVehicle() {
            try {
                const res = await fetch(`/api/vehicles/${id}`);
                if (!res.ok) throw new Error('Failed to fetch vehicle');
                const data = await res.json();
                setVehicle(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchVehicle();
    }, [id]);

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) return 0;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const totalPrice = vehicle ? calculateDays() * Number(vehicle.price_per_day) : 0;

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicle || !startDate || !endDate) return;

        if (new Date(endDate) < new Date(startDate)) {
            setBookingStatus('error');
            setErrorMessage('Return date must be after pick-up date.');
            return;
        }

        // Check if user is logged in
        const storedUser = localStorage.getItem('driveease_user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        const user = JSON.parse(storedUser);

        setBookingStatus('loading');

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    vehicle_id: vehicle.id,
                    start_date: startDate,
                    end_date: endDate,
                    total_price: totalPrice
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to book');
            }

            setBookingStatus('success');
            setTimeout(() => router.push('/bookings'), 2000);
        } catch (error: any) {
            setBookingStatus('error');
            setErrorMessage(error.message);
        }
    };

    const getFeatures = (): string[] => {
        if (!vehicle?.features) return [];
        try {
            return typeof vehicle.features === 'string' ? JSON.parse(vehicle.features) : vehicle.features;
        } catch { return []; }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-surface rounded-2xl shadow-sm overflow-hidden md:flex border border-border">
                    <div className="md:w-1/2 h-96 shimmer" />
                    <div className="md:w-1/2 p-8 space-y-4">
                        <div className="h-8 w-2/3 shimmer rounded" />
                        <div className="h-4 w-full shimmer rounded" />
                        <div className="h-4 w-1/2 shimmer rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-foreground mb-2">Vehicle Not Found</h2>
                <p className="text-muted mb-6">The vehicle you&apos;re looking for doesn&apos;t exist.</p>
                <Link href="/" className="text-primary font-medium hover:underline">← Back to fleet</Link>
            </div>
        );
    }

    const features = getFeatures();

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted">
                <Link href="/" className="hover:text-foreground transition-colors">Vehicles</Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">{vehicle.make} {vehicle.model}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: image + specs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image */}
                    <div className="bg-surface rounded-2xl border border-border overflow-hidden relative">
                        <Image
                            src={vehicle.image_url}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            width={800}
                            height={500}
                            className="w-full h-auto object-cover"
                            priority
                        />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${vehicle.is_available ? 'bg-primary text-white' : 'bg-danger text-white'}`}>
                                {vehicle.is_available ? '● Available' : '● Booked'}
                            </span>
                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-accent/90 text-white">
                                {vehicle.category}
                            </span>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h1>
                        <p className="mt-3 text-muted leading-relaxed">{vehicle.description}</p>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-surface rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl mb-1">🪑</div>
                            <p className="text-xs text-muted uppercase tracking-wide">Seats</p>
                            <p className="text-lg font-bold text-foreground">{vehicle.seats}</p>
                        </div>
                        <div className="bg-surface rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl mb-1">⛽</div>
                            <p className="text-xs text-muted uppercase tracking-wide">Fuel</p>
                            <p className="text-lg font-bold text-foreground">{vehicle.fuel_type}</p>
                        </div>
                        <div className="bg-surface rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl mb-1">⚙️</div>
                            <p className="text-xs text-muted uppercase tracking-wide">Transmission</p>
                            <p className="text-lg font-bold text-foreground">{vehicle.transmission}</p>
                        </div>
                        <div className="bg-surface rounded-xl border border-border p-4 text-center">
                            <div className="text-2xl mb-1">💰</div>
                            <p className="text-xs text-muted uppercase tracking-wide">Per Day</p>
                            <p className="text-lg font-bold gradient-text">${vehicle.price_per_day}</p>
                        </div>
                    </div>

                    {/* Features */}
                    {features.length > 0 && (
                        <div className="bg-surface rounded-2xl border border-border p-6">
                            <h3 className="text-lg font-bold text-foreground mb-4">Features & Highlights</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <span className="text-sm text-foreground/80">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Booking Card */}
                <div>
                    <div className="sticky top-24 bg-surface rounded-2xl border border-border p-6">
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-extrabold gradient-text">${vehicle.price_per_day}</span>
                            <span className="text-muted text-sm">/day</span>
                        </div>

                        {bookingStatus === 'success' && (
                            <div className="mb-4 bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded-xl text-sm font-medium">
                                ✅ Booking confirmed! Redirecting...
                            </div>
                        )}

                        {bookingStatus === 'error' && (
                            <div className="mb-4 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm font-medium">
                                ❌ {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleBooking} className="space-y-4">
                            <div>
                                <label htmlFor="start_date" className="block text-xs font-medium text-muted uppercase tracking-wide mb-1">
                                    Pick-up Date
                                </label>
                                <input
                                    type="date"
                                    id="start_date"
                                    required
                                    min={today}
                                    className="w-full border border-border rounded-xl shadow-sm py-2.5 px-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        if (endDate && e.target.value > endDate) setEndDate('');
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="end_date" className="block text-xs font-medium text-muted uppercase tracking-wide mb-1">
                                    Return Date
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    required
                                    min={startDate || today}
                                    className="w-full border border-border rounded-xl shadow-sm py-2.5 px-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            {startDate && endDate && calculateDays() > 0 && (
                                <div className="bg-background rounded-xl p-4 border border-border">
                                    <div className="flex justify-between text-sm text-muted mb-2">
                                        <span>${vehicle.price_per_day} × {calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
                                        <span className="font-semibold text-foreground">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-border pt-2 flex justify-between">
                                        <span className="text-sm font-bold text-foreground">Total</span>
                                        <span className="text-lg font-extrabold gradient-text">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={bookingStatus === 'success' || bookingStatus === 'loading'}
                                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {bookingStatus === 'loading' ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
