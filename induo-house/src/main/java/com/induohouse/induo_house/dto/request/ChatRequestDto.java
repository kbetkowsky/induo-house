package com.induohouse.induo_house.dto.request;

import java.util.UUID;

public record ChatRequestDto(UUID sessionId, String message) {}
