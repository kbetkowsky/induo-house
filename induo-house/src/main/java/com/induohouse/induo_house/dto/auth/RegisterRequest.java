package com.induohouse.induo_house.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Nieprawidlowy format")
    private String email;

    @NotBlank(message = "Hasło jest wymagane")
    @Size(min = 8, message = "Hasło musi miec co najmniej 8 liter")
    private String password;

    private String firstName;
    private String lastName;
}
