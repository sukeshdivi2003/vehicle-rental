import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const sql = getSQL();
        const { phone, country_code } = await request.json();

        if (!phone || !country_code) {
            return NextResponse.json({ error: 'Phone and country code are required' }, { status: 400 });
        }

        // Validate 10-digit phone
        if (!/^\d{10}$/.test(phone)) {
            return NextResponse.json({ error: 'Phone must be exactly 10 digits' }, { status: 400 });
        }

        // Generate 4-digit OTP
        const otp = String(Math.floor(1000 + Math.random() * 9000));
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min

        // Upsert user
        const existing = await sql`
            SELECT id FROM users WHERE phone = ${phone} AND country_code = ${country_code}
        `;

        if (existing.length > 0) {
            await sql`
                UPDATE users SET otp = ${otp}, otp_expires_at = ${expiresAt}
                WHERE phone = ${phone} AND country_code = ${country_code}
            `;
        } else {
            await sql`
                INSERT INTO users (phone, country_code, otp, otp_expires_at)
                VALUES (${phone}, ${country_code}, ${otp}, ${expiresAt})
            `;
        }

        // Log OTP to console (simulated SMS)
        console.log(`[OTP] ${country_code} ${phone} → ${otp}`);

        return NextResponse.json({ message: 'OTP sent successfully', otp_hint: otp });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
