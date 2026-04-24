package com.induohouse.induo_house.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChatSessionSummaryDto(
        UUID id,
        String title,
        LocalDateTime createdAt
) {}
