CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    discount INTEGER DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    image_emoji VARCHAR(10),
    delivery_type VARCHAR(50) DEFAULT 'Мгновенно',
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_codes (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    code VARCHAR(500) NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP,
    order_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    telegram_user_id BIGINT,
    user_email VARCHAR(255),
    total_price INTEGER NOT NULL,
    payment_id VARCHAR(255) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'pending',
    items JSONB NOT NULL,
    codes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

INSERT INTO products (name, price, discount, category, image_emoji) VALUES
('Steam Gift Card 1000₽', 1050, 5, 'Игры', '🎮'),
('Xbox Game Pass Ultimate 3 месяца', 899, 0, 'Подписки', '🎯'),
('PlayStation Plus 12 месяцев', 4499, 10, 'Подписки', '🎮'),
('Spotify Premium 1 месяц', 299, 0, 'Подписки', '🎵'),
('Netflix Premium 1 месяц', 699, 15, 'Подписки', '📺'),
('Microsoft Office 365 Personal', 2299, 20, 'Софт', '💼');