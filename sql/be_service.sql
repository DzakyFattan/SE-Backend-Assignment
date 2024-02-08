CREATE DATABASE be_service;
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address VARCHAR(255)
);
CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    cuisine_type VARCHAR(50)
);
CREATE TABLE food (
    food_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    restaurant_id INT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);
CREATE TYPE order_status as ENUM('placed', 'processing', 'completed', 'cancelled');
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT,
    food_id INT,
    quantity INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_status order_status DEFAULT 'placed',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (food_id) REFERENCES food(food_id)
);
CREATE TABLE drivers (
    driver_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    vehicle_type VARCHAR(50),
    vehicle_registration VARCHAR(20),
    rating DECIMAL(3, 2)
);
CREATE TYPE trips_status as ENUM(
    'requested',
    'accepted',
    'completed',
    'cancelled'
);
CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    user_id INT,
    driver_id INT,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    trip_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_status trips_status DEFAULT 'requested',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
);