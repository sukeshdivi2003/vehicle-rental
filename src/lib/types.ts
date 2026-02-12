export interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    price_per_day: number;
    is_available: boolean;
    image_url: string;
    description: string;
    category: string;
    seats: number;
    fuel_type: string;
    transmission: string;
    features: string; // JSON string array
}

export interface Booking {
    id: number;
    user_id: number;
    vehicle_id: number;
    start_date: string;
    end_date: string;
    total_price: number;
    status: string;
    created_at: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_year?: number;
}

export interface User {
    id: number;
    phone: string;
    country_code: string;
    name: string | null;
    created_at: string;
}
