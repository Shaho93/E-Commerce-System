package com.KindIIT.E_Commerce.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.KindIIT.E_Commerce.catalog.OutOfStockException;
import com.KindIIT.E_Commerce.catalog.Product;
import com.KindIIT.E_Commerce.catalog.ProductRepository;
import com.KindIIT.E_Commerce.payment.PaymentMethod;

/**
 * Läuft gegen eine echte PostgreSQL-Datenbank (lokal per docker compose, in der CI als Service).
 * Jeder Test wird am Ende zurückgerollt, die Beispieldaten bleiben unverändert.
 */
@SpringBootTest
@Transactional
class OrderServiceIntegrationTest {

    @Autowired
    private OrderService orders;

    @Autowired
    private ProductRepository products;

    private Product product(String slug) {
        return products.findBySlug(slug).orElseThrow();
    }

    private CreateOrderRequest request(List<CreateOrderRequest.Item> items) {
        return new CreateOrderRequest("Max Muster", "max@example.com", "Musterweg 1", "70173", "Stuttgart",
                PaymentMethod.PAYPAL, items);
    }

    @Test
    void bestellungBerechnetSummenUndReduziertBestand() {
        Product espresso = product("espresso-classico");
        int stockBefore = espresso.getStock();

        OrderDto order = orders.create(request(List.of(new CreateOrderRequest.Item(espresso.getId(), 2))), null);

        assertEquals(OrderStatus.PAID, order.status());
        assertEquals(2 * espresso.getPriceCents(), order.subtotalCents());
        assertEquals(PricingRules.SHIPPING_CENTS, order.shippingCents());
        assertEquals(order.subtotalCents() + order.shippingCents(), order.totalCents());
        assertEquals(stockBefore - 2, product("espresso-classico").getStock());
    }

    @Test
    void gleicheArtikelWerdenZusammengefasst() {
        Product tee = product("earl-grey-bio");

        OrderDto order = orders.create(request(List.of(
                new CreateOrderRequest.Item(tee.getId(), 1),
                new CreateOrderRequest.Item(tee.getId(), 2))), null);

        assertEquals(1, order.items().size());
        assertEquals(3, order.items().get(0).quantity());
    }

    @Test
    void gleicherIdempotenzSchluesselLegtKeineZweiteBestellungAn() {
        Product tee = product("sencha-japan");
        CreateOrderRequest req = request(List.of(new CreateOrderRequest.Item(tee.getId(), 1)));

        OrderDto first = orders.create(req, "test-key-123");
        OrderDto second = orders.create(req, "test-key-123");

        assertEquals(first.orderNumber(), second.orderNumber());
    }

    @Test
    void mehrAlsDerBestandWirdAbgelehnt() {
        Product muehle = product("handmuehle-pro");
        int tooMany = muehle.getStock() + 1;

        assertThrows(OutOfStockException.class, () ->
                orders.create(request(List.of(new CreateOrderRequest.Item(muehle.getId(), tooMany))), null));
    }
}
