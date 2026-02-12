const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const vehicles = [
    {
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
        price_per_day: 50.00,
        image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&w=800&q=80',
        description: 'Reliable and comfortable sedan.'
    },
    {
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        price_per_day: 85.00,
        image_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
        description: 'Electric performance and style.'
    },
    {
        make: 'Ford',
        model: 'Mustang',
        year: 2022,
        price_per_day: 95.00,
        image_url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
        description: 'Classic american muscle car.'
    },
    {
        make: 'BMW',
        model: 'X5',
        year: 2023,
        price_per_day: 120.00,
        image_url: 'https://images.unsplash.com/photo-1556189250-72ba9545225a?auto=format&fit=crop&w=800&q=80',
        description: 'Luxury SUV for comfortable travel.'
    }
];

const users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password_hash: 'hashed_secret'
    }
];

async function seedDb() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        // Clear existing data
        await sql.query('TRUNCATE vehicles, users, bookings RESTART IDENTITY CASCADE');

        // Insert Users
        for (const user of users) {
            await sql.query(
                'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
                [user.name, user.email, user.password_hash]
            );
        }

        // Insert Vehicles
        for (const vehicle of vehicles) {
            await sql.query(
                'INSERT INTO vehicles (make, model, year, price_per_day, image_url, description) VALUES ($1, $2, $3, $4, $5, $6)',
                [vehicle.make, vehicle.model, vehicle.year, vehicle.price_per_day, vehicle.image_url, vehicle.description]
            );
        }

        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seedDb();
