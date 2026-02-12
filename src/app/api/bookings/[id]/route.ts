import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sql = getSQL();
        const { id } = await params;
        const bookingId = parseInt(id);

        const result = await sql`
      UPDATE bookings
      SET status = 'CANCELLED'
      WHERE id = ${bookingId} AND status != 'CANCELLED'
      RETURNING *
    `;

        if (result.length === 0) {
            return NextResponse.json({ error: 'Booking not found or already cancelled' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
    }
}
