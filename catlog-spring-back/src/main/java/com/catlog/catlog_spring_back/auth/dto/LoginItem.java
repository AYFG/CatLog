package com.catlog.catlog_spring_back.auth.dto;

public record LoginItem(
        String message,
        String accessToken,
        String refreshToken,
        String userId,
        String email,
        String name) {
}
