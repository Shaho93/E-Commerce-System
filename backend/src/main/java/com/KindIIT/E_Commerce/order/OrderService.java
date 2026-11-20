package com.KindIIT.E_Commerce.order;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.KindIIT.E_Commerce.catalog.Product;
import com.KindIIT.E_Commerce.catalog.ProductRepository;
import com.KindIIT.E_Commerce.common.NotFoundException;
import com.KindIIT.E_Commerce.payment.PaymentProvider;
import com.KindIIT.E_Commerce.payment.PaymentResult;

@Service
public class OrderService {

    private final CustomerOrderRepository orders;
    private final ProductRepository products;
    private final PaymentProvider payments;
    private final OrderNumberGenerator orderNumbers;

    public OrderService(CustomerOrderRepository orders, ProductRepository products, PaymentProvider payments,
                        OrderNumberGenerator orderNumbers) {
        this.orders = orders;
        this.products = products;
        this.payments = payments;
        this.orderNumbers = orderNumbers;
    }

    /**
     * Legt eine Bestellung an: prüft und reserviert den Bestand, berechnet die Summen und löst die Zahlung aus.
     * Alles in einer Transaktion: schlägt ein Schritt fehl, bleibt der Bestand unverändert.
     *
     * @param idempotencyKey optionaler Schlüssel vom Client. Wird dieselbe Bestellung erneut gesendet
     *                       (z. B. Doppelklick oder Netzwerkfehler), liefert der Server die vorhandene
     *                       Bestellung zurück statt eine zweite anzulegen.
     */
    @Transactional
    public OrderDto create(CreateOrderRequest request, String idempotencyKey) {
        String key = normalizeKey(idempotencyKey);
        if (key != null) {
            Optional<CustomerOrder> existing = orders.findByIdempotencyKey(key);
            if (existing.isPresent()) {
                return OrderDto.from(existing.get());
            }
        }

        // gleiche Artikel zusammenfassen, Reihenfolge beibehalten
        Map<Long, Integer> quantities = new LinkedHashMap<>();
        for (CreateOrderRequest.Item item : request.items()) {
            quantities.merge(item.productId(), item.quantity(), Integer::sum);
        }
        quantities.forEach((productId, quantity) -> {
            if (quantity > PricingRules.MAX_QUANTITY_PER_ITEM) {
                throw new IllegalArgumentException(
                        "Höchstens " + PricingRules.MAX_QUANTITY_PER_ITEM + " Stück pro Artikel.");
            }
        });

        Map<Long, Product> byId = products.findAllById(quantities.keySet()).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        CustomerOrder order = new CustomerOrder(orderNumbers.next(), request.customerName().trim(),
                request.customerEmail().trim(), request.street().trim(), request.zip().trim(),
                request.city().trim(), request.paymentMethod(), key);

        quantities.forEach((productId, quantity) -> {
            Product product = byId.get(productId);
            if (product == null) {
                throw new NotFoundException("Produkt mit ID " + productId + " wurde nicht gefunden.");
            }
            product.reserve(quantity);
            order.addItem(product.getId(), product.getName(), product.getPriceCents(), quantity);
        });

        PaymentResult payment = payments.charge(order.getOrderNumber(), order.getTotalCents(),
                order.getPaymentMethod());
        if (!payment.successful()) {
            throw new IllegalArgumentException("Die Zahlung wurde abgelehnt.");
        }
        order.markPaid(payment.reference());

        return OrderDto.from(orders.save(order));
    }

    @Transactional(readOnly = true)
    public OrderDto byNumber(String orderNumber) {
        return orders.findByOrderNumber(orderNumber)
                .map(OrderDto::from)
                .orElseThrow(() -> new NotFoundException("Bestellung " + orderNumber + " wurde nicht gefunden."));
    }

    private static String normalizeKey(String key) {
        if (key == null || key.isBlank()) {
            return null;
        }
        String trimmed = key.trim();
        if (trimmed.length() > 80) {
            throw new IllegalArgumentException("Idempotency-Key ist zu lang (max. 80 Zeichen).");
        }
        return trimmed;
    }
}
