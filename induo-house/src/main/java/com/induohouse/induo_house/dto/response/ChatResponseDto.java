package com.induohouse.induo_house.dto.response;

import lombok.Builder;
import java.util.UUID;

@Builder
public record ChatResponseDto(UUID sessionId, String answer) {}