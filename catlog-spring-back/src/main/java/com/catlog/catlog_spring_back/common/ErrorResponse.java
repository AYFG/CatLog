package com.catlog.catlog_spring_back.common;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        int ok,
        String message,
        Object data,
        String name,
        String errorName) {
}
