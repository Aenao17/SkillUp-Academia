package com.stucanii.backend.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType
) {}