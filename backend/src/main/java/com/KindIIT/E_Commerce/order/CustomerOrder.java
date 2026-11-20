package com.KindIIT.E_Commerce.order;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import com.KindIIT.E_Commerce.payment.PaymentMethod;

/** Eine Bestellung (als Gast). Summen werden ausschließlich serverseitig berechnet. */
@Entity
@Table(name = "customer_order")
public class CustomerOrder {

    @Id
    private UUID id;

    @Column(name = "order_number", nullable = false, unique = true, length = 20)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(name = "customer_name", nullable = false, length = 120)
    private String customerName;

    @Column(name = "customer_email", nullable = false, length = 200)
    private String customerEmail;

    @Column(nullable = false, length = 200)
    private String street;

    @Column(nullable = false, length = 10)
    private String zip;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "subtotal_cents", nullable = false)
    private int subtotalCents;

    @Column(name = "shipping_cents", nullable = false)
    private int shippingCents;

    @Column(name = "total_cents", nullable = false)
    private int totalCents;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_reference", length = 80)
    private String paymentReference;

    @Column(name = "idempotency_key", unique = true, length = 80)
    private String idempotencyKey;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    private List<OrderItem> items = new ArrayList<>();

    protected CustomerOrder() {
        // für JPA
    }

    public CustomerOrder(String orderNumber, String customerName, String customerEmail, String street, String zip,
                         String city, PaymentMethod paymentMethod, String idempotencyKey) {
        this.id = UUID.randomUUID();
        this.orderNumber = orderNumber;
        this.status = OrderStatus.CREATED;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.street = street;
        this.zip = zip;
        this.city = city;
        this.paymentMethod = paymentMethod;
        this.idempotencyKey = idempotencyKey;
        this.createdAt = Instant.now();
    }

    void addItem(Long productId, String productName, int unitPriceCents, int quantity) {
        items.add(new OrderItem(this, productId, productName, unitPriceCents, quantity));
        subtotalCents = items.stream().mapToInt(OrderItem::getLineTotalCents).sum();
        shippingCents = PricingRules.shippingFor(subtotalCents);
        totalCents = subtotalCents + shippingCents;
    }

    void markPaid(String paymentReference) {
        if (status != OrderStatus.CREATED) {
            throw new IllegalStateException("Bestellung ist nicht mehr offen");
        }
        this.paymentReference = paymentReference;
        this.status = OrderStatus.PAID;
    }

    public UUID getId() { return id; }
    public String getOrderNumber() { return orderNumber; }
    public OrderStatus getStatus() { return status; }
    public String getCustomerName() { return customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public String getStreet() { return street; }
    public String getZip() { return zip; }
    public String getCity() { return city; }
    public int getSubtotalCents() { return subtotalCents; }
    public int getShippingCents() { return shippingCents; }
    public int getTotalCents() { return totalCents; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public String getPaymentReference() { return paymentReference; }
    public Instant getCreatedAt() { return createdAt; }
    public List<OrderItem> getItems() { return Collections.unmodifiableList(items); }
}
