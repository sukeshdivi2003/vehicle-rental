'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const COUNTRY_CODES = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
];

export default function LoginPage() {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpHint, setOtpHint] = useState('');

    const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
    const router = useRouter();

    const handlePhoneChange = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 10);
        setPhone(digits);
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, country_code: countryCode }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setOtpHint(data.otp_hint);
            setStep('otp');
            setTimeout(() => otpRefs[0].current?.focus(), 100);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 4) {
            setError('Please enter the 4-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, country_code: countryCode, otp: enteredOtp }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Store user in localStorage
            localStorage.setItem('driveease_user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('auth-change'));
            router.push('/');
        } catch (err: any) {
            setError(err.message);
            setOtp(['', '', '', '']);
            otpRefs[0].current?.focus();
        } finally {
            setLoading(false);
        }
    };

    const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-extrabold text-foreground">
                        {step === 'phone' ? 'Welcome to DriveEase' : 'Verify OTP'}
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        {step === 'phone'
                            ? 'Enter your mobile number to get started'
                            : `We sent a code to ${selectedCountry?.flag} ${countryCode} ${phone}`}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-surface rounded-2xl border border-border p-8 shadow-lg">
                    {error && (
                        <div className="mb-4 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm font-medium">
                            ❌ {error}
                        </div>
                    )}

                    {step === 'phone' ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                                    Country Code
                                </label>
                                <select
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    className="w-full border border-border rounded-xl py-3 px-4 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                                >
                                    {COUNTRY_CODES.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.flag} {c.country} ({c.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                                    Mobile Number
                                </label>
                                <div className="flex items-center border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                                    <span className="px-4 py-3 text-sm font-semibold text-muted bg-background/50 border-r border-border">
                                        {selectedCountry?.flag} {countryCode}
                                    </span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="Enter 10-digit number"
                                        value={phone}
                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                        className="flex-1 py-3 px-4 text-sm bg-transparent text-foreground focus:outline-none placeholder:text-muted/50"
                                        maxLength={10}
                                        autoFocus
                                    />
                                    {phone.length === 10 && (
                                        <span className="pr-4 text-success">✓</span>
                                    )}
                                </div>
                                <p className="mt-1.5 text-xs text-muted">{phone.length}/10 digits</p>
                            </div>

                            <button
                                type="submit"
                                disabled={phone.length !== 10 || loading}
                                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            {/* OTP Hint (for demo) */}
                            {otpHint && (
                                <div className="bg-accent/10 border border-accent/30 text-accent px-4 py-3 rounded-xl text-sm font-medium text-center">
                                    🔑 Demo OTP: <span className="font-bold tracking-widest">{otpHint}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-3 text-center">
                                    Enter 4-Digit OTP
                                </label>
                                <div className="flex justify-center gap-3">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={otpRefs[i]}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className="w-14 h-14 text-center text-xl font-bold border-2 border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={otp.join('').length !== 4 || loading}
                                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep('phone'); setOtp(['', '', '', '']); setError(''); }}
                                className="w-full py-2 text-sm text-muted hover:text-foreground transition-colors"
                            >
                                ← Change number
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
