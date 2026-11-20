package com.KindIIT.E_Commerce.order;

import java.time.Instant;
import java.util.List;

/** Bestellung, wie sie die API ausliefert (ohne interne Felder wie den Idempotenz-Schlüssel). */
public record OrderDto(
        String orderNumber,
        OrderStatus status,
        String customerName,
        String customerEmail,
        String street,
        String zip,
        String city,
        String paymentMethod,
        String paymentReference,
        int subtotalCents,
        int shippingCents,
        int totalCents,
        Instant createdAt,
        List<Line> items) {

    public record Line(Long productId, String productName, int unitPriceCents, int quantity, int lineTotalCents) {
    }

    public static OrderDto from(CustomerOrder o) {
        return new OrderDto(o.getOrderNumber(), o.getStatus(), o.getCustomerName(), o.getCustomerEmail(),
                o.getStreet(), o.getZip(), o.getCity(), o.getPaymentMethod().name(), o.getPaymentReference(),
                o.getSubtotalCents(), o.getShippingCents(), o.getTotalCents(), o.getCreatedAt(),
                o.getItems().stream()
                        .map(i -> new Line(i.getProductId(), i.getProductName(), i.getUnitPriceCents(),
                                i.getQuantity(), i.getLineTotalCents()))
                        .toList());
    }
}
