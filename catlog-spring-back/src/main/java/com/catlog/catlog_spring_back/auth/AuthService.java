package com.catlog.catlog_spring_back.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.catlog.catlog_spring_back.auth.dto.LoginItem;
import com.catlog.catlog_spring_back.auth.dto.LoginRequest;
import com.catlog.catlog_spring_back.auth.dto.LoginResponse;
import com.catlog.catlog_spring_back.auth.dto.RefreshRequest;
import com.catlog.catlog_spring_back.auth.dto.RefreshResponse;
import com.catlog.catlog_spring_back.auth.dto.SignupRequest;
import com.catlog.catlog_spring_back.auth.dto.SignupResponse;
import com.catlog.catlog_spring_back.common.ApiException;
import com.catlog.catlog_spring_back.common.CurrentUser;
import com.catlog.catlog_spring_back.common.OkMessageResponse;
import com.catlog.catlog_spring_back.user.User;
import com.catlog.catlog_spring_back.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final CurrentUser currentUser;

    @Transactional
    public SignupResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ApiException(409, "이미 사용 중인 이메일입니다.");
        }

        User user = new User(
                req.name(),
                req.email(),
                passwordEncoder.encode(req.password()));

        User saved = userRepository.save(user);

        return new SignupResponse(1, "유저 생성 성공", saved.getId().toString());
    }

    @Transactional
    public LoginResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ApiException(401, "해당 이메일을 가진 사용자를 찾지 못했습니다.", "email"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new ApiException(401, "비밀번호가 맞지 않습니다.", "password");
        }

        String accessToken = jwtTokenService.issueAccessToken(user);
        String refreshToken = jwtTokenService.issueRefreshToken(user);
        user.updateRefreshToken(refreshToken);

        return new LoginResponse(1, new LoginItem(
                "유저 로그인 성공",
                accessToken,
                refreshToken,
                user.getId().toString(),
                user.getEmail(),
                user.getName()));
    }

    @Transactional(readOnly = true)
    public RefreshResponse refresh(RefreshRequest req) {
        User user = userRepository.findByRefreshToken(req.refreshToken())
                .orElseThrow(() -> new ApiException(401, "refresh token이 만료되었습니다. 다시 로그인해주세요.",
                        "RefreshTokenExpired"));

        try {
            jwtTokenService.verifyRefreshToken(req.refreshToken());
        } catch (JwtException e) {
            throw new ApiException(401, "refresh token이 만료되었습니다. 다시 로그인해주세요.", "RefreshTokenExpired");
        }

        String accessToken = jwtTokenService.issueAccessToken(user);
        return new RefreshResponse(1, "access token이 재발급되었습니다.", accessToken);
    }

    @Transactional
    public OkMessageResponse deleteUser(Long userId, Authentication authentication) {
        Long authenticatedUserId = currentUser.id(authentication);
        if (!authenticatedUserId.equals(userId)) {
            throw new ApiException(403, "삭제 권한이 없습니다.");
        }

        if (!userRepository.existsById(userId)) {
            throw new ApiException(404, "사용자를 찾을 수 없습니다.");
        }

        userRepository.deleteById(userId);
        return new OkMessageResponse(1, "사용자와 관련된 모든 데이터가 성공적으로 삭제되었습니다.");
    }
}
