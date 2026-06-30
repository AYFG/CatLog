package com.catlog.catlog_spring_back.medicallog.dto;

public record MedicalLogResponse(
        int ok,
        String message,
        MedicalLogDto medicalLog) {
}
