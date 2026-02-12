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

    // Today's date in YYYY-MM-DD format for min attribute
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

        // Client-side date validation
        if (new Date(endDate) < new Date(startDate)) {
            setBookingStatus('error');
            setErrorMessage('Return date must be after pick-up date.');
            return;
        }

        setBookingStatus('loading');

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 1,
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

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted">
                <Link href="/" className="hover:text-foreground transition-colors">Vehicles</Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">{vehicle.make} {vehicle.model}</span>
            </nav>

            <div className="bg-surface rounded-2xl shadow-sm overflow-hidden md:flex border border-border">
                {/* Image */}
                <div className="md:w-1/2 relative min-h-[400px]">
                    <Image
                        src={vehicle.image_url}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                    <div className="absolute bottom-4 left-4">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${vehicle.is_available ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                            {vehicle.is_available ? '● Available' : '● Booked'}
                        </span>
                    </div>
                </div>

                {/* Details & Booking */}
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h1>
                        <p className="mt-3 text-muted leading-relaxed">{vehicle.description}</p>
                        <div className="mt-6 flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold gradient-text">${vehicle.price_per_day}</span>
                            <span className="text-muted text-sm">/day</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                        <h4 className="text-lg font-bold text-foreground mb-4">Book this Vehicle</h4>

                        {bookingStatus === 'success' && (
                            <div className="mb-4 bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl text-sm font-medium">
                                ✅ Booking confirmed! Redirecting to your bookings...
                            </div>
                        )}

                        {bookingStatus === 'error' && (
                            <div className="mb-4 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm font-medium">
                                ❌ {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleBooking} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="start_date" className="block text-xs font-medium text-muted uppercase tracking-wide mb-1">
                                        Pick-up Date
                                    </label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        required
                                        min={today}
                                        className="w-full border border-border rounded-xl shadow-sm py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            // Reset end date if it's before new start date
                                            if (endDate && e.target.value > endDate) {
                                                setEndDate('');
                                            }
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
                                        className="w-full border border-border rounded-xl shadow-sm py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {startDate && endDate && calculateDays() > 0 && (
                                <div className="bg-background rounded-xl p-4 border border-border">
                                    <div className="flex justify-between text-sm text-muted">
                                        <span>${vehicle.price_per_day} × {calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
                                        <span className="font-semibold text-foreground">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={bookingStatus === 'success' || bookingStatus === 'loading'}
                                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
