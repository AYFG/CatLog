package com.catlog.catlog_spring_back.common;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    public Long id(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new ApiException(401, "인증에 실패했습니다.");
        }

        Object userId = jwt.getClaims().get("userId");
        if (userId == null) {
            throw new ApiException(401, "인증에 실패했습니다.");
        }

        try {
            return Long.parseLong(userId.toString());
        } catch (NumberFormatException e) {
            throw new ApiException(401, "인증에 실패했습니다.");
        }
    }
}
