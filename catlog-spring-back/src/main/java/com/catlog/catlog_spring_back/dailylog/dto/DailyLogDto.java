package com.catlog.catlog_spring_back.dailylog.dto;

import com.catlog.catlog_spring_back.common.CatRefDto;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record DailyLogDto(
        @JsonProperty("_id") String id,
        CatRefDto cat,
        Boolean defecation,
        Boolean vitamin,
        Double weight,
        Object etc,
        String logDate) {
}
