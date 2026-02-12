import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const sql = getSQL();
        const { user_id, vehicle_id, start_date, end_date, total_price } = await request.json();

        if (!user_id || !vehicle_id || !start_date || !end_date || !total_price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check for conflicting bookings
        const conflicts = await sql`
      SELECT id FROM bookings
      WHERE vehicle_id = ${vehicle_id}
      AND status != 'CANCELLED'
      AND (
        (start_date <= ${start_date} AND end_date >= ${start_date}) OR
        (start_date <= ${end_date} AND end_date >= ${end_date}) OR
        (start_date >= ${start_date} AND end_date <= ${end_date})
      )
    `;

        if (conflicts.length > 0) {
            return NextResponse.json({ error: 'Vehicle is not available for these dates' }, { status: 409 });
        }

        // Insert the booking
        const result = await sql`
      INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_price, status)
      VALUES (${user_id}, ${vehicle_id}, ${start_date}, ${end_date}, ${total_price}, 'CONFIRMED')
      RETURNING *
    `;

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const sql = getSQL();
        const result = await sql`
      SELECT b.*, v.make AS vehicle_make, v.model AS vehicle_model, v.year AS vehicle_year
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.created_at DESC
    `;
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
