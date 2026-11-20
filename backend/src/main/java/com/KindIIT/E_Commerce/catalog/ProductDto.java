package com.KindIIT.E_Commerce.catalog;

/** Produktdaten, wie sie die API ausliefert. */
public record ProductDto(
        Long id,
        String slug,
        String name,
        String category,
        String shortDescription,
        String description,
        int priceCents,
        int stock,
        String emoji,
        String color) {

    public static ProductDto from(Product p) {
        return new ProductDto(p.getId(), p.getSlug(), p.getName(), p.getCategory(), p.getShortDescription(),
                p.getDescription(), p.getPriceCents(), p.getStock(), p.getEmoji(), p.getColor());
    }
}
