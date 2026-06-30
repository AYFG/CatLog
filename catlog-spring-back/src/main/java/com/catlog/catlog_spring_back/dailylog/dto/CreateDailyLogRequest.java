package com.catlog.catlog_spring_back.dailylog.dto;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateDailyLogRequest(
        @Valid @NotNull DailyLogCatRequest cat,
        @NotNull Boolean defecation,
        @NotNull Boolean vitamin,
        @NotNull Double weight,
        JsonNode etc,
        @NotBlank String logDate) {
}
