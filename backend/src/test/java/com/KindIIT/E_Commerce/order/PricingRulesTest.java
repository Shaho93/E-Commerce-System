package com.KindIIT.E_Commerce.order;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class PricingRulesTest {

    @Test
    void leererWarenkorbKostetKeinenVersand() {
        assertEquals(0, PricingRules.shippingFor(0));
    }

    @Test
    void unterDerGrenzeFallenVersandkostenAn() {
        assertEquals(490, PricingRules.shippingFor(4899));
    }

    @Test
    void abDerGrenzeIstDerVersandKostenlos() {
        assertEquals(0, PricingRules.shippingFor(4900));
        assertEquals(0, PricingRules.shippingFor(12000));
    }
}
