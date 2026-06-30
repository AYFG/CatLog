package com.catlog.catlog_spring_back.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank @Size(min = 2, max = 8, message = "닉네임은 2자 이상 8자 이하로 입력해주세요.") String name,
        @Email(message = "올바른 이메일을 입력해주세요.") @NotBlank String email,
        @NotBlank @Size(min = 6, message = "비밀번호는 6자 이상이어야 합니다.") String password) {
}
