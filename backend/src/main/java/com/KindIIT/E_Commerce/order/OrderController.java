package com.KindIIT.E_Commerce.order;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto create(@Valid @RequestBody CreateOrderRequest request,
                           @RequestHeader(name = "Idempotency-Key", required = false) String idempotencyKey) {
        return service.create(request, idempotencyKey);
    }

    /** Bestellnummern sind zufällig und schwer zu erraten; ein Kundenkonto mit Login folgt später. */
    @GetMapping("/{orderNumber}")
    public OrderDto get(@PathVariable String orderNumber) {
        return service.byNumber(orderNumber);
    }
}
