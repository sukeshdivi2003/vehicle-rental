import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const sql = getSQL();
        const { phone, country_code, otp } = await request.json();

        if (!phone || !country_code || !otp) {
            return NextResponse.json({ error: 'Phone, country code, and OTP are required' }, { status: 400 });
        }

        const users = await sql`
            SELECT id, phone, country_code, name, otp, otp_expires_at, created_at
            FROM users
            WHERE phone = ${phone} AND country_code = ${country_code}
        `;

        if (users.length === 0) {
            return NextResponse.json({ error: 'User not found. Please request OTP first.' }, { status: 404 });
        }

        const user = users[0];

        if (user.otp !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
        }

        if (new Date(user.otp_expires_at) < new Date()) {
            return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 401 });
        }

        // Clear OTP after successful verification
        await sql`
            UPDATE users SET otp = NULL, otp_expires_at = NULL
            WHERE id = ${user.id}
        `;

        return NextResponse.json({
            user: {
                id: user.id,
                phone: user.phone,
                country_code: user.country_code,
                name: user.name,
                created_at: user.created_at,
            }
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }
}
