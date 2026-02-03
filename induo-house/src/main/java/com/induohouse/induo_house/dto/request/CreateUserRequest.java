package com.induohouse.induo_house.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateUserRequest {

    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Nieprawidłowy format email")
    @Size(max = 255, message = "Email może mieć maksymalnie 255 znaków")
    private String email;

    @NotBlank(message = "Hasło jest wymagane")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$",
            message = "Hasło musi zawierać: wielką literę, małą literę, cyfrę i znak specjalny"
    )
    @Size(min = 8, max = 100)
    private String password;

    @NotBlank(message = "Imię jest wymagane")
    @Size(max = 100, message = "Imię może mieć maksymalnie 100 znaków")
    private String firstName;

    @NotBlank(message = "Nazwisko jest wymagane")
    @Size(max = 100, message = "Nazwisko może mieć maksymalnie 100 znaków")
    private String lastName;

    @Size(max = 9, message = "Numer telefonu może mieć maksymalnie 9 znaków")
    @Pattern(
            regexp = "^(\\+\\d{1,3})?\\d{9}$",
            message = "Nieprawidłowy numer telefonu (format: +48123456789 lub 123456789)"
    )
    private String phoneNumber;


}
