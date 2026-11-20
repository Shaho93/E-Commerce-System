-- Grundschema des Shops: Produkte, Bestellungen, Bestellpositionen

CREATE TABLE product (
    id                BIGSERIAL PRIMARY KEY,
    slug              VARCHAR(80)  NOT NULL UNIQUE,
    name              VARCHAR(120) NOT NULL,
    category          VARCHAR(40)  NOT NULL,
    short_description VARCHAR(300) NOT NULL,
    description       TEXT         NOT NULL,
    price_cents       INTEGER      NOT NULL CHECK (price_cents >= 0),
    stock             INTEGER      NOT NULL CHECK (stock >= 0),
    emoji             VARCHAR(16),
    color             VARCHAR(16),
    version           BIGINT       NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_category ON product (category);

CREATE TABLE customer_order (
    id                UUID PRIMARY KEY,
    order_number      VARCHAR(20)  NOT NULL UNIQUE,
    status            VARCHAR(20)  NOT NULL,
    customer_name     VARCHAR(120) NOT NULL,
    customer_email    VARCHAR(200) NOT NULL,
    street            VARCHAR(200) NOT NULL,
    zip               VARCHAR(10)  NOT NULL,
    city              VARCHAR(100) NOT NULL,
    subtotal_cents    INTEGER      NOT NULL,
    shipping_cents    INTEGER      NOT NULL,
    total_cents       INTEGER      NOT NULL,
    payment_method    VARCHAR(20)  NOT NULL,
    payment_reference VARCHAR(80),
    idempotency_key   VARCHAR(80)  UNIQUE,
    created_at        TIMESTAMPTZ  NOT NULL
);

CREATE TABLE order_item (
    id               BIGSERIAL PRIMARY KEY,
    order_id         UUID         NOT NULL REFERENCES customer_order (id) ON DELETE CASCADE,
    product_id       BIGINT       NOT NULL REFERENCES product (id),
    product_name     VARCHAR(120) NOT NULL,
    unit_price_cents INTEGER      NOT NULL,
    quantity         INTEGER      NOT NULL CHECK (quantity > 0),
    line_total_cents INTEGER      NOT NULL
);

CREATE INDEX idx_order_item_order ON order_item (order_id);
