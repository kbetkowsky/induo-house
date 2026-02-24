package com.induohouse.induo_house.exception;

public class PropertyNotFoundException extends RuntimeException {
    public PropertyNotFoundException(Long id) {
        super("Nie znaleziono ogloszenia o id: " + id);
    }
}
