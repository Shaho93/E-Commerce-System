package com.KindIIT.E_Commerce.order;

public enum OrderStatus {
    /** angelegt, Zahlung noch offen */
    CREATED,
    /** bezahlt bzw. auf Rechnung bestätigt */
    PAID,
    SHIPPED,
    CANCELLED
}
