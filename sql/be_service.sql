-- Create the database
CREATE DATABASE delivery_service;

-- Use the created database
USE delivery_service;

-- Create the user table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address VARCHAR(255)
);

-- Create the food table for food delivery service
CREATE TABLE food (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    restaurant_id INT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

-- Create the restaurants table for food delivery service
CREATE TABLE restaurants (
    restaurant_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    cuisine_type VARCHAR(50)
);

-- Create the orders table for food delivery service
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    food_id INT,
    quantity INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('placed', 'processing', 'completed', 'cancelled') DEFAULT 'placed',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (food_id) REFERENCES food(food_id)
);

-- Create the drivers table for Uber-like service
CREATE TABLE drivers (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    vehicle_type VARCHAR(50),
    vehicle_registration VARCHAR(20),
    rating DECIMAL(3, 2)
);

-- Create the trips table for Uber-like service
CREATE TABLE trips (
    trip_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    driver_id INT,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    trip_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('requested', 'accepted', 'completed', 'cancelled') DEFAULT 'requested',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
);
