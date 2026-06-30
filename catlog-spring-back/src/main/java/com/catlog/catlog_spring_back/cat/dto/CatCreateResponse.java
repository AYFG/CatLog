package com.catlog.catlog_spring_back.cat.dto;

public record CatCreateResponse(
        int ok,
        String message,
        CatResponse cat) {
}
