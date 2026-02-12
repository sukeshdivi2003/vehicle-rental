require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const vehicles = [
    {
        make: 'Toyota', model: 'Camry', year: 2024,
        price_per_day: 50.00,
        image_url: '/vehicles/toyota-camry.png',
        description: 'Reliable and comfortable sedan perfect for daily commutes and road trips. Excellent fuel economy with a smooth ride.',
        category: 'Sedan', seats: 5, fuel_type: 'Hybrid', transmission: 'Automatic',
        features: JSON.stringify(['Apple CarPlay', 'Android Auto', 'Lane Departure Alert', 'Adaptive Cruise Control', 'Blind Spot Monitor', 'Keyless Entry'])
    },
    {
        make: 'Tesla', model: 'Model 3', year: 2023,
        price_per_day: 85.00,
        image_url: '/vehicles/tesla-model3.png',
        description: 'All-electric performance sedan with autopilot capability. Zero emissions with thrilling acceleration.',
        category: 'Electric', seats: 5, fuel_type: 'Electric', transmission: 'Single-Speed',
        features: JSON.stringify(['Autopilot', '15" Touchscreen', 'Glass Roof', 'Over-the-Air Updates', 'Supercharger Network', 'Sentry Mode', '0-60 in 5.8s'])
    },
    {
        make: 'Ford', model: 'Mustang GT', year: 2022,
        price_per_day: 120.00,
        image_url: '/vehicles/ford-mustang.png',
        description: 'Iconic American muscle car with a 5.0L V8 engine. Raw power meets modern technology for an exhilarating drive.',
        category: 'Sports', seats: 4, fuel_type: 'Petrol', transmission: 'Manual',
        features: JSON.stringify(['5.0L V8 Engine', '460 HP', 'Launch Control', 'Track Apps', 'Brembo Brakes', 'Active Exhaust', 'Recaro Seats'])
    },
    {
        make: 'BMW', model: 'X5', year: 2023,
        price_per_day: 110.00,
        image_url: '/vehicles/bmw-x5.png',
        description: 'Luxury midsize SUV combining spacious comfort with dynamic driving. Premium interior with cutting-edge tech.',
        category: 'SUV', seats: 7, fuel_type: 'Petrol', transmission: 'Automatic',
        features: JSON.stringify(['Panoramic Sunroof', 'Harman Kardon Sound', 'Gesture Control', 'Wireless Charging', 'Head-Up Display', 'Air Suspension', '3rd Row Seats'])
    },
    {
        make: 'Mercedes-Benz', model: 'C-Class', year: 2024,
        price_per_day: 95.00,
        image_url: '/vehicles/mercedes-c-class.png',
        description: 'Elegant luxury sedan with a refined interior and smooth ride. The benchmark for premium compact sedans.',
        category: 'Luxury', seats: 5, fuel_type: 'Petrol', transmission: 'Automatic',
        features: JSON.stringify(['MBUX Infotainment', 'Burmester Sound', '64-Color Ambient Lighting', 'Digital Cockpit', 'Heated Seats', 'Parktronic', 'Active Brake Assist'])
    },
    {
        make: 'Audi', model: 'Q7', year: 2024,
        price_per_day: 105.00,
        image_url: '/vehicles/audi-q7.png',
        description: 'Spacious luxury SUV with quattro all-wheel drive. Perfect for families who want comfort and capability.',
        category: 'SUV', seats: 7, fuel_type: 'Diesel', transmission: 'Automatic',
        features: JSON.stringify(['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen Sound', 'Matrix LED Headlights', 'Air Suspension', '3rd Row Seats', 'Trailer Assist'])
    },
    {
        make: 'Honda', model: 'Civic', year: 2024,
        price_per_day: 42.00,
        image_url: '/vehicles/honda-civic.png',
        description: 'Sporty and efficient compact sedan with a refined interior. Great value with impressive safety features.',
        category: 'Sedan', seats: 5, fuel_type: 'Petrol', transmission: 'CVT',
        features: JSON.stringify(['Honda Sensing Suite', 'Bose Sound System', 'Wireless CarPlay', 'LED Headlights', 'Collision Mitigation', 'Power Moonroof'])
    },
    {
        make: 'Jeep', model: 'Wrangler Rubicon', year: 2023,
        price_per_day: 95.00,
        image_url: '/vehicles/jeep-wrangler.png',
        description: 'The ultimate off-road SUV built for adventure. Removable top and doors for open-air exploring.',
        category: 'Off-Road', seats: 5, fuel_type: 'Petrol', transmission: 'Manual',
        features: JSON.stringify(['4x4 Rock-Trac System', 'Dana 44 Axles', 'Locking Differentials', 'Removable Top & Doors', 'Skid Plates', 'Off-Road Camera', '33" Mud Tires'])
    }
];

async function seedDb() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        await sql.query('TRUNCATE vehicles, bookings, users RESTART IDENTITY CASCADE');

        for (const v of vehicles) {
            await sql.query(
                `INSERT INTO vehicles (make, model, year, price_per_day, image_url, description, category, seats, fuel_type, transmission, features)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [v.make, v.model, v.year, v.price_per_day, v.image_url, v.description, v.category, v.seats, v.fuel_type, v.transmission, v.features]
            );
        }

        console.log('Database seeded with 8 vehicles');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seedDb();
