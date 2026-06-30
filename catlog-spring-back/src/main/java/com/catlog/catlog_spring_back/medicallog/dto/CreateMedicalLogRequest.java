package com.catlog.catlog_spring_back.medicallog.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateMedicalLogRequest(
        @Valid @NotNull MedicalLogCatRequest cat,
        @NotBlank String healthCheckupDate,
        @NotNull Integer healthCycle,
        @NotBlank String heartWorm,
        @NotNull Integer heartWormCycle) {
}
