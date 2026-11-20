package com.KindIIT.E_Commerce.order;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/** Eine Position der Bestellung. Name und Preis werden zum Bestellzeitpunkt festgeschrieben. */
@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false, length = 120)
    private String productName;

    @Column(name = "unit_price_cents", nullable = false)
    private int unitPriceCents;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "line_total_cents", nullable = false)
    private int lineTotalCents;

    protected OrderItem() {
        // für JPA
    }

    OrderItem(CustomerOrder order, Long productId, String productName, int unitPriceCents, int quantity) {
        this.order = order;
        this.productId = productId;
        this.productName = productName;
        this.unitPriceCents = unitPriceCents;
        this.quantity = quantity;
        this.lineTotalCents = Math.multiplyExact(unitPriceCents, quantity);
    }

    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public int getUnitPriceCents() { return unitPriceCents; }
    public int getQuantity() { return quantity; }
    public int getLineTotalCents() { return lineTotalCents; }
}
