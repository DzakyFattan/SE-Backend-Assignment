--
-- PostgreSQL database dump
--

-- Dumped from database version 15.0
-- Dumped by pg_dump version 15.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: be_service
--

CREATE TYPE public.order_status AS ENUM (
    'placed',
    'processing',
    'completed',
    'cancelled'
);


ALTER TYPE public.order_status OWNER TO be_service;

--
-- Name: trips_status; Type: TYPE; Schema: public; Owner: be_service
--

CREATE TYPE public.trips_status AS ENUM (
    'requested',
    'accepted',
    'completed',
    'cancelled'
);


ALTER TYPE public.trips_status OWNER TO be_service;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: driver; Type: TABLE; Schema: public; Owner: be_service
--

CREATE TABLE public.driver (
    driver_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone_number character varying(20),
    vehicle_type character varying(50),
    vehicle_registration character varying(20),
    rating numeric(3,2)
);


ALTER TABLE public.driver OWNER TO be_service;

--
-- Name: drivers_driver_id_seq; Type: SEQUENCE; Schema: public; Owner: be_service
--

CREATE SEQUENCE public.drivers_driver_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.drivers_driver_id_seq OWNER TO be_service;

--
-- Name: drivers_driver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: be_service
--

ALTER SEQUENCE public.drivers_driver_id_seq OWNED BY public.driver.driver_id;


--
-- Name: food; Type: TABLE; Schema: public; Owner: be_service
--

CREATE TABLE public.food (
    food_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    restaurant_id integer
);


ALTER TABLE public.food OWNER TO be_service;

--
-- Name: food_food_id_seq; Type: SEQUENCE; Schema: public; Owner: be_service
--

CREATE SEQUENCE public.food_food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.food_food_id_seq OWNER TO be_service;

--
-- Name: food_food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: be_service
--

ALTER SEQUENCE public.food_food_id_seq OWNED BY public.food.food_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: be_service
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer,
    food_id integer,
    quantity integer,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    current_status public.order_status DEFAULT 'placed'::public.order_status
);


ALTER TABLE public.orders OWNER TO be_service;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: be_service
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_order_id_seq OWNER TO be_service;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: be_service
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: restaurant; Type: TABLE; Schema: public; Owner: be_service
--

CREATE TABLE public.restaurant (
    restaurant_id integer NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(255) NOT NULL,
    phone_number character varying(20),
    cuisine_type character varying(50)
);


ALTER TABLE public.restaurant OWNER TO be_service;

--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: be_service
--

CREATE SEQUENCE public.restaurants_restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurants_restaurant_id_seq OWNER TO be_service;

--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: be_service
--

ALTER SEQUENCE public.restaurants_restaurant_id_seq OWNED BY public.restaurant.restaurant_id;


--
-- Name: trips; Type: TABLE; Schema: public; Owner: be_service
--

CREATE TABLE public.trips (
    trip_id integer NOT NULL,
    user_id integer,
    driver_id integer,
    start_location character varying(255) NOT NULL,
    end_location character varying(255) NOT NULL,
    fare numeric(10,2) NOT NULL,
    trip_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    current_status public.trips_status DEFAULT 'requested'::public.trips_status
);


ALTER TABLE public.trips OWNER TO be_service;

--
-- Name: trips_trip_id_seq; Type: SEQUENCE; Schema: public; Owner: be_service
--

CREATE SEQUENCE public.trips_trip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trips_trip_id_seq OWNER TO be_service;

--
-- Name: trips_trip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: be_service
--

ALTER SEQUENCE public.trips_trip_id_seq OWNED BY public.trips.trip_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: be_service
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    phone_number character varying(20),
    address character varying(255)
);


ALTER TABLE public.users OWNER TO be_service;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: be_service
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO be_service;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: be_service
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: driver driver_id; Type: DEFAULT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.driver ALTER COLUMN driver_id SET DEFAULT nextval('public.drivers_driver_id_seq'::regclass);


--
-- Name: food food_id; Type: DEFAULT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.food ALTER COLUMN food_id SET DEFAULT nextval('public.food_food_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: restaurant restaurant_id; Type: DEFAULT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.restaurant ALTER COLUMN restaurant_id SET DEFAULT nextval('public.restaurants_restaurant_id_seq'::regclass);


--
-- Name: trips trip_id; Type: DEFAULT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.trips ALTER COLUMN trip_id SET DEFAULT nextval('public.trips_trip_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: driver; Type: TABLE DATA; Schema: public; Owner: be_service
--

COPY public.driver (driver_id, name, email, phone_number, vehicle_type, vehicle_registration, rating) FROM stdin;
1	Budi A	budia@gmail.com	081234567899	Motorcycle	D2434CBA	5.00
\.


--
-- Data for Name: food; Type: TABLE DATA; Schema: public; Owner: be_service
--

COPY public.food (food_id, name, description, price, restaurant_id) FROM stdin;
1	Nasi Ayam Geprek A	Nasi dengan Ayam Geprek Gurih	14000.00	1
2	Mie Goreng Ayam Geprek A	Mie Goreng dengan Ayam Geprek Gurih	12000.00	1
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: be_service
--

COPY public.orders (order_id, user_id, food_id, quantity, order_date, current_status) FROM stdin;
1	2	1	2	2024-02-09 17:46:40.914346	placed
\.


--
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: be_service
--

COPY public.restaurant (restaurant_id, name, address, phone_number, cuisine_type) FROM stdin;
1	Ayam Geprek A	Jl. Jakarta	081987654321	Indonesian
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: be_service
--

COPY public.trips (trip_id, user_id, driver_id, start_location, end_location, fare, trip_date, current_status) FROM stdin;
2	2	1	Jl. Surabaya	Jl. Semarang	17000.00	2024-02-09 17:43:44.236993	requested
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: be_service
--

COPY public.users (user_id, username, email, password, phone_number, address) FROM stdin;
2	test_username	test_user@gmail.com	$2b$10$CeUBq43am2Kc/NmwcYx/TuVMfjUs76Z4DdZ/.2BWkPWMmCjjxv/sO	081122334455	Jl. Cisitu
\.


--
-- Name: drivers_driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: be_service
--

SELECT pg_catalog.setval('public.drivers_driver_id_seq', 1, true);


--
-- Name: food_food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: be_service
--

SELECT pg_catalog.setval('public.food_food_id_seq', 2, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: be_service
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 1, true);


--
-- Name: restaurants_restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: be_service
--

SELECT pg_catalog.setval('public.restaurants_restaurant_id_seq', 1, true);


--
-- Name: trips_trip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: be_service
--

SELECT pg_catalog.setval('public.trips_trip_id_seq', 2, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: be_service
--

SELECT pg_catalog.setval('public.users_user_id_seq', 2, true);


--
-- Name: driver drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.driver
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (driver_id);


--
-- Name: food food_pkey; Type: CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (food_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: restaurant restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (restaurant_id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: food food_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id);


--
-- Name: orders orders_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food(food_id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: trips trips_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.driver(driver_id);


--
-- Name: trips trips_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: be_service
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

