package com.KindIIT.E_Commerce.payment;

/**
 * Schnittstelle zum Zahlungsanbieter. Die Shop-Logik kennt nur diese Schnittstelle;
 * eine PayPal-Anbindung (Create/Capture über die REST-API) wird als weitere Implementierung ergänzt.
 */
public interface PaymentProvider {

    PaymentResult charge(String orderNumber, int amountCents, PaymentMethod method);
}
