package com.induohouse.induo_house.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String email) {
        super("Nie znaleziono uzytkownika: " + email);
    }

    public UserNotFoundException(Long id) {
        super("Nie znaleziono uzytkownika o id: " + id);
    }
}
