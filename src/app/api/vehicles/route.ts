import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function GET() {
    try {
        const sql = getSQL();
        const result = await sql`SELECT * FROM vehicles ORDER BY id ASC`;
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const sql = getSQL();
        const { make, model, year, price_per_day, image_url, description } = await request.json();

        if (!make || !model || !year || !price_per_day) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await sql`
      INSERT INTO vehicles (make, model, year, price_per_day, image_url, description)
      VALUES (${make}, ${model}, ${year}, ${price_per_day}, ${image_url}, ${description})
      RETURNING *
    `;
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
    }
}
