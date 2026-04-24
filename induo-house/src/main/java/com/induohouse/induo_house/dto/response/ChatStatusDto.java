package com.induohouse.induo_house.dto.response;

public record ChatStatusDto(
        boolean enabled,
        boolean ragEnabled,
        boolean modelConfigured,
        String assistantName,
        String model,
        String message
) {}
