package com.catlog.catlog_spring_back.cat.dto;

import java.util.List;

public record CatListResponse(
        int ok,
        String message,
        List<CatResponse> cats) {
}
