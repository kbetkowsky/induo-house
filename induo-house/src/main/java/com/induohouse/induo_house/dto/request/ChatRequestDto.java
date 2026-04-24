package com.induohouse.induo_house.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ChatRequestDto(
        UUID sessionId,
        @NotBlank(message = "Wiadomość nie może być pusta")
        @Size(max = 4000, message = "Wiadomość jest zbyt długa")
        String message
) {}
