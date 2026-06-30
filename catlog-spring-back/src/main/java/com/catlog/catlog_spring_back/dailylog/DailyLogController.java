package com.catlog.catlog_spring_back.dailylog;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.catlog.catlog_spring_back.common.OkMessageResponse;
import com.catlog.catlog_spring_back.dailylog.dto.CreateDailyLogRequest;
import com.catlog.catlog_spring_back.dailylog.dto.DailyLogListResponse;
import com.catlog.catlog_spring_back.dailylog.dto.DailyLogResponse;
import com.catlog.catlog_spring_back.dailylog.dto.EveryLogDatesResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dailyLog")
public class DailyLogController {

    private final DailyLogService dailyLogService;

    @PostMapping("/{catId}")
    public ResponseEntity<DailyLogResponse> upsert(
            @PathVariable Long catId,
            @Valid @RequestBody CreateDailyLogRequest req,
            Authentication authentication) {
        return ResponseEntity.status(201).body(dailyLogService.upsert(catId, req, authentication));
    }

    @GetMapping
    public ResponseEntity<DailyLogListResponse> getByDate(
            @RequestParam String logDate,
            Authentication authentication) {
        return ResponseEntity.ok(dailyLogService.getByDate(logDate, authentication));
    }

    @GetMapping("/everyLogDates")
    public ResponseEntity<EveryLogDatesResponse> getEveryLogDates(Authentication authentication) {
        return ResponseEntity.ok(dailyLogService.getEveryLogDates(authentication));
    }

    @DeleteMapping("/{dailyLogId}")
    public ResponseEntity<OkMessageResponse> delete(
            @PathVariable Long dailyLogId,
            Authentication authentication) {
        return ResponseEntity.ok(dailyLogService.delete(dailyLogId, authentication));
    }
}
