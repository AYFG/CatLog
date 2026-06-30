package com.catlog.catlog_spring_back.medicallog.dto;

import jakarta.validation.constraints.NotBlank;

public record MedicalLogCatRequest(
        @NotBlank String catName) {
}
