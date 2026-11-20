package com.KindIIT.E_Commerce.order;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, UUID> {

    @EntityGraph(attributePaths = "items")
    Optional<CustomerOrder> findByOrderNumber(String orderNumber);

    @EntityGraph(attributePaths = "items")
    Optional<CustomerOrder> findByIdempotencyKey(String idempotencyKey);
}
