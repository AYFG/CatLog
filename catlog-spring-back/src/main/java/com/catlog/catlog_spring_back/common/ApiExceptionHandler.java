package com.catlog.catlog_spring_back.common;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException e) {
        HttpStatus status = HttpStatus.valueOf(e.status());
        return ResponseEntity.status(status)
                .body(new ErrorResponse(0, e.getMessage(), e.data(), e.name(), e.name()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        List<Map<String, String>> data = e.getBindingResult().getFieldErrors().stream()
                .map(this::toValidationItem)
                .toList();
        return ResponseEntity.status(422)
                .body(new ErrorResponse(0, "입력값 검증에 실패했습니다.", data, null, null));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity() {
        return ResponseEntity.status(409)
                .body(new ErrorResponse(0, "이미 사용 중인 값입니다.", null, null, null));
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleJwt() {
        return ResponseEntity.status(401)
                .body(new ErrorResponse(0, "토큰이 만료되었거나 올바르지 않습니다.", null, "TokenExpiredError",
                        "TokenExpiredError"));
    }

    private Map<String, String> toValidationItem(FieldError error) {
        return Map.of(
                "path", error.getField(),
                "msg", error.getDefaultMessage() == null ? "올바르지 않은 값입니다." : error.getDefaultMessage());
    }
}
