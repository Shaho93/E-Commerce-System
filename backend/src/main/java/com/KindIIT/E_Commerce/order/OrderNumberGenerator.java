package com.KindIIT.E_Commerce.order;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

/** Erzeugt gut lesbare Bestellnummern wie KI-261120-7QX4. */
@Component
public class OrderNumberGenerator {

    // ohne leicht verwechselbare Zeichen (0/O, 1/I)
    private static final char[] ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ".toCharArray();
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyMMdd");

    private final SecureRandom random = new SecureRandom();

    public String next() {
        StringBuilder suffix = new StringBuilder(4);
        for (int i = 0; i < 4; i++) {
            suffix.append(ALPHABET[random.nextInt(ALPHABET.length)]);
        }
        return "KI-" + LocalDate.now().format(DATE) + "-" + suffix;
    }
}
