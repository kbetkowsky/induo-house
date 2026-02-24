package com.induohouse.induo_house.exception;

public class PropertyAccessDeniedException extends RuntimeException {
    public PropertyAccessDeniedException() {
        super("Nie masz uprawnien do tej operacji");
    }
}
