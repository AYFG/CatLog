package com.catlog.catlog_spring_back.auth.dto;

public record RefreshResponse(
        int ok,
        String message,
        String accessToken) {
}
