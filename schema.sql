CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(15) NOT NULL,
  country_code VARCHAR(5) NOT NULL DEFAULT '+91',
  name VARCHAR(255),
  otp VARCHAR(4),
  otp_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(country_code, phone)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  description TEXT,
  category VARCHAR(50),
  seats INTEGER DEFAULT 5,
  fuel_type VARCHAR(30),
  transmission VARCHAR(30),
  features TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  vehicle_id INTEGER REFERENCES vehicles(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
