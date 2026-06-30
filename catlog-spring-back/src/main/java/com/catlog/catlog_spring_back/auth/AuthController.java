package com.catlog.catlog_spring_back.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.catlog.catlog_spring_back.auth.dto.LoginRequest;
import com.catlog.catlog_spring_back.auth.dto.LoginResponse;
import com.catlog.catlog_spring_back.auth.dto.RefreshRequest;
import com.catlog.catlog_spring_back.auth.dto.RefreshResponse;
import com.catlog.catlog_spring_back.auth.dto.SignupRequest;
import com.catlog.catlog_spring_back.auth.dto.SignupResponse;
import com.catlog.catlog_spring_back.common.OkMessageResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest req) {
        SignupResponse res = authService.signup(req);
        return ResponseEntity.status(201).body(res);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@Valid @RequestBody RefreshRequest req) {
        return ResponseEntity.ok(authService.refresh(req));
    }

    @DeleteMapping("/deleteUser/{userId}")
    public ResponseEntity<OkMessageResponse> deleteUser(
            @PathVariable Long userId,
            Authentication authentication) {
        return ResponseEntity.ok(authService.deleteUser(userId, authentication));
    }
}
