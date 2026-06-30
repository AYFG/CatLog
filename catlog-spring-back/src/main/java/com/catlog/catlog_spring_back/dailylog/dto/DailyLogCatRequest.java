package com.catlog.catlog_spring_back.dailylog.dto;

import jakarta.validation.constraints.NotBlank;

public record DailyLogCatRequest(
        @NotBlank String catName) {
}
