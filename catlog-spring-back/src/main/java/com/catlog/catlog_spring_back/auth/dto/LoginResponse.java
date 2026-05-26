package com.catlog.catlog_spring_back.auth.dto;

public record LoginResponse(
                int ok,
                LoginItem item) {
}
