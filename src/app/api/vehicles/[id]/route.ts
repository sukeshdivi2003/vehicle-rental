import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sql = getSQL();
        const { id } = await params;
        const vehicleId = parseInt(id);
        const result = await sql`SELECT * FROM vehicles WHERE id = ${vehicleId}`;

        if (result.length === 0) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 });
    }
}
