package com.KindIIT.E_Commerce.catalog;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.KindIIT.E_Commerce.common.NotFoundException;

@Service
@Transactional(readOnly = true)
public class ProductService {

    public enum Sort { RELEVANCE, PRICE_ASC, PRICE_DESC, NAME }

    private final ProductRepository products;

    public ProductService(ProductRepository products) {
        this.products = products;
    }

    /**
     * Liefert den Katalog, optional gefiltert nach Kategorie und Suchbegriff.
     * Der Katalog ist klein, daher wird im Speicher gefiltert; bei großen Katalogen
     * würde man das in eine Datenbankabfrage bzw. Volltextsuche verlagern.
     */
    public List<ProductDto> search(String category, String query, Sort sort) {
        String q = query == null ? "" : query.trim().toLowerCase(Locale.GERMAN);
        Comparator<Product> order = switch (sort == null ? Sort.RELEVANCE : sort) {
            case PRICE_ASC -> Comparator.comparingInt(Product::getPriceCents);
            case PRICE_DESC -> Comparator.comparingInt(Product::getPriceCents).reversed();
            case NAME -> Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER);
            case RELEVANCE -> Comparator.comparing(Product::getId);
        };
        return products.findAllByOrderByIdAsc().stream()
                .filter(p -> category == null || category.isBlank() || p.getCategory().equalsIgnoreCase(category))
                .filter(p -> q.isEmpty()
                        || p.getName().toLowerCase(Locale.GERMAN).contains(q)
                        || p.getShortDescription().toLowerCase(Locale.GERMAN).contains(q))
                .sorted(order)
                .map(ProductDto::from)
                .toList();
    }

    public ProductDto bySlug(String slug) {
        return products.findBySlug(slug)
                .map(ProductDto::from)
                .orElseThrow(() -> new NotFoundException("Produkt „" + slug + "“ wurde nicht gefunden."));
    }

    public List<String> categories() {
        return products.findAllByOrderByIdAsc().stream().map(Product::getCategory).distinct().toList();
    }
}
