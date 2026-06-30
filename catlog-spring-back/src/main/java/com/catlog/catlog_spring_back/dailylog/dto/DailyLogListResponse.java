package com.catlog.catlog_spring_back.dailylog.dto;

import java.util.List;

public record DailyLogListResponse(
        int ok,
        String message,
        List<DailyLogDto> dailyLogs) {
}
