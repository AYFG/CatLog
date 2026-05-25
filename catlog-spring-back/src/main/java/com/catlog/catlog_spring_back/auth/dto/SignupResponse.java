package com.catlog.catlog_spring_back.auth.dto;

public record SignupResponse(
        int ok,
        String message,
        String userId) {
}
