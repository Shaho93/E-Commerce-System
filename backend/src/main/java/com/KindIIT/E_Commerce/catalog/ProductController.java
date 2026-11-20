package com.KindIIT.E_Commerce.catalog;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/products")
    public List<ProductDto> list(
            @RequestParam(required = false) String category,
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(defaultValue = "RELEVANCE") ProductService.Sort sort) {
        return service.search(category, query, sort);
    }

    @GetMapping("/products/{slug}")
    public ProductDto get(@PathVariable String slug) {
        return service.bySlug(slug);
    }

    @GetMapping("/categories")
    public List<String> categories() {
        return service.categories();
    }
}
