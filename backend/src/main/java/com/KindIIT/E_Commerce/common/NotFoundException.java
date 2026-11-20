package com.KindIIT.E_Commerce.common;

/** Die angefragte Ressource existiert nicht (HTTP 404). */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
