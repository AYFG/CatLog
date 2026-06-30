package com.catlog.catlog_spring_back.medicallog.dto;

import com.catlog.catlog_spring_back.common.CatRefDto;
import com.fasterxml.jackson.annotation.JsonProperty;

public record MedicalLogDto(
        @JsonProperty("_id") String id,
        CatRefDto cat,
        String healthCheckupDate,
        String healthCycle,
        String heartWorm,
        String heartWormCycle) {
}
