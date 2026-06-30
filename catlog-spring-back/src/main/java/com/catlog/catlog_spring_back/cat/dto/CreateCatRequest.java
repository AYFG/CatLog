package com.catlog.catlog_spring_back.cat.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCatRequest(
        @NotBlank String name,
        @NotBlank String birthDate,
        String catType,
        String owner) {
}
