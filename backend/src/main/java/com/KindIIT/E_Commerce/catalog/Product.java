package com.KindIIT.E_Commerce.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

/** Ein Artikel im Katalog. Preise werden immer in Cent gespeichert, um Rundungsfehler zu vermeiden. */
@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 40)
    private String category;

    @Column(name = "short_description", nullable = false, length = 300)
    private String shortDescription;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "price_cents", nullable = false)
    private int priceCents;

    @Column(nullable = false)
    private int stock;

    @Column(length = 16)
    private String emoji;

    @Column(length = 16)
    private String color;

    /** Optimistisches Locking: verhindert, dass zwei gleichzeitige Bestellungen denselben Bestand verkaufen. */
    @Version
    private long version;

    protected Product() {
        // für JPA
    }

    public Product(String slug, String name, String category, String shortDescription, String description,
                   int priceCents, int stock, String emoji, String color) {
        this.slug = slug;
        this.name = name;
        this.category = category;
        this.shortDescription = shortDescription;
        this.description = description;
        this.priceCents = priceCents;
        this.stock = stock;
        this.emoji = emoji;
        this.color = color;
    }

    /** Reduziert den Bestand. Wirft eine Exception, wenn nicht genug vorhanden ist. */
    public void reserve(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Menge muss positiv sein");
        }
        if (quantity > stock) {
            throw new OutOfStockException(name, stock);
        }
        stock -= quantity;
    }

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getShortDescription() { return shortDescription; }
    public String getDescription() { return description; }
    public int getPriceCents() { return priceCents; }
    public int getStock() { return stock; }
    public String getEmoji() { return emoji; }
    public String getColor() { return color; }
}
