package com.induohouse.induo_house.security;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtServiceTest {

    @Test
    void validateConfiguration_ShouldAcceptPlainTextSecretWithAtLeast32Bytes() {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "plain-text-secret-with-at-least-32-chars");

        assertDoesNotThrow(jwtService::validateConfiguration);
    }

    @Test
    void validateConfiguration_ShouldRejectTooShortSecret() {
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "short-secret");

        assertThrows(IllegalStateException.class, jwtService::validateConfiguration);
    }
}
