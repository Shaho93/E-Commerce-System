package com.KindIIT.E_Commerce.order;

/** Preisregeln des Shops an einer Stelle, damit Backend und Tests dieselben Werte verwenden. */
public final class PricingRules {

    /** Versandkosten in Cent */
    public static final int SHIPPING_CENTS = 490;
    /** Ab diesem Warenwert (in Cent) ist der Versand kostenlos */
    public static final int FREE_SHIPPING_FROM_CENTS = 4900;
    /** Maximale Menge pro Artikel und Bestellung */
    public static final int MAX_QUANTITY_PER_ITEM = 10;

    private PricingRules() {
    }

    public static int shippingFor(int subtotalCents) {
        if (subtotalCents <= 0) {
            return 0;
        }
        return subtotalCents >= FREE_SHIPPING_FROM_CENTS ? 0 : SHIPPING_CENTS;
    }
}
