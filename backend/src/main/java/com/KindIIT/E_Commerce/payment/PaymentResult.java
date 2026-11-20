package com.KindIIT.E_Commerce.payment;

/** Ergebnis einer Zahlung: Erfolg und Referenz des Zahlungsanbieters. */
public record PaymentResult(boolean successful, String reference) {
}
