export interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    price_per_day: number; // string in JSON, needs parsing
    is_available: boolean;
    image_url: string;
    description: string;
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
}
