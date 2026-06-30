package com.catlog.catlog_spring_back.dailylog.dto;

import java.util.List;

public record EveryLogDatesResponse(
        int ok,
        String message,
        List<String> everyLogDates) {
}
