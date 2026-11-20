package com.KindIIT.E_Commerce.payment;

import java.util.UUID;

import org.springframework.stereotype.Component;

/** Simuliert eine erfolgreiche Zahlung. Wird verwendet, solange keine echten Zugangsdaten hinterlegt sind. */
@Component
public class SimulatedPaymentProvider implements PaymentProvider {

    @Override
    public PaymentResult charge(String orderNumber, int amountCents, PaymentMethod method) {
        if (amountCents <= 0) {
            throw new IllegalArgumentException("Betrag muss größer als 0 sein");
        }
        String prefix = method == PaymentMethod.PAYPAL ? "SIM-PAYPAL-" : "SIM-INVOICE-";
        return new PaymentResult(true, prefix + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    }
}
