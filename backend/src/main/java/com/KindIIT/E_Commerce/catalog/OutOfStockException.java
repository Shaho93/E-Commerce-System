package com.KindIIT.E_Commerce.catalog;

/** Es ist nicht genug Bestand für die gewünschte Menge vorhanden. */
public class OutOfStockException extends RuntimeException {

    public OutOfStockException(String productName, int available) {
        super(available == 0
                ? "„" + productName + "“ ist leider ausverkauft."
                : "Von „" + productName + "“ sind nur noch " + available + " Stück verfügbar.");
    }
}
