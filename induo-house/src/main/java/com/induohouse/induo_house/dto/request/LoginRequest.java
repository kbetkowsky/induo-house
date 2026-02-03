package com.induohouse.induo_house.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email jest wymagany")
    @Email
    private String email;

    @NotBlank(message = "Hasło jest wymagane")
    private String password;
}
