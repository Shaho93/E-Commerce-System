package com.KindIIT.E_Commerce.order;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.KindIIT.E_Commerce.payment.PaymentMethod;

/** Bestellung als Gast. Preise schickt der Client bewusst nicht mit, sie kommen aus der Datenbank. */
public record CreateOrderRequest(
        @NotBlank(message = "Bitte Namen angeben") @Size(max = 120) String customerName,
        @NotBlank(message = "Bitte E-Mail angeben") @Email(message = "Bitte gültige E-Mail angeben") @Size(max = 200) String customerEmail,
        @NotBlank(message = "Bitte Straße und Hausnummer angeben") @Size(max = 200) String street,
        @NotBlank(message = "Bitte PLZ angeben") @Pattern(regexp = "\\d{5}", message = "PLZ muss 5 Ziffern haben") String zip,
        @NotBlank(message = "Bitte Ort angeben") @Size(max = 100) String city,
        @NotNull(message = "Bitte Zahlungsart wählen") PaymentMethod paymentMethod,
        @NotEmpty(message = "Der Warenkorb ist leer") @Size(max = 50) List<@Valid Item> items) {

    public record Item(
            @NotNull Long productId,
            @Min(value = 1, message = "Menge mindestens 1")
            @Max(value = PricingRules.MAX_QUANTITY_PER_ITEM, message = "Höchstens 10 Stück pro Artikel") int quantity) {
    }
}
