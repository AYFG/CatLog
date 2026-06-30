package com.catlog.catlog_spring_back.dailylog.dto;

public record DailyLogResponse(
        int ok,
        String message,
        DailyLogDto dailyLog) {
}
